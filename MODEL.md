# MODEL.md

## Overview

The Breathe ESG prototype is designed to track emissions activity data for multiple tenants, ingest activity records from different business systems, normalize those records into a common internal format, and allow a reviewer to approve, reject, or lock normalized activities.

The model is intentionally simple enough for the assignment scope, but structured so that it can grow into a production-grade ESG data platform.

The main design goals are:

* Support multi-tenancy.
* Track which source system produced each row.
* Normalize source records into common ESG activity records.
* Classify activities into Scope 1, Scope 2, or Scope 3.
* Store normalized quantities and units.
* Support review status changes.
* Keep an audit trail for reviewer actions.

---

## Current Data Model

The implemented backend uses the following main entities:

```text
Tenant
Facility
SourceSystem
IngestionBatch
RawRecord
NormalizedActivity
AuditLog
```

Local development uses SQLite. The deployed version is designed to work with Render deployment configuration and can be backed by PostgreSQL for persistence in a real environment.

---

## Entity Details

### 1. Tenant

A tenant represents an organization using the platform.

Example:

```text
ABC Manufacturing Ltd
Industry: Automotive
```

Purpose:

* Separates data between companies.
* Acts as the top-level owner for facilities, source systems, uploads, and normalized activities.
* Allows the same platform to support multiple customers in the future.

Important fields:

```text
id
name
industry
```

---

### 2. Facility

A facility represents a physical business location such as a plant, office, warehouse, or operating site.

Example:

```text
Bengaluru Plant (BLR01)
Pune Plant (PUN01)
```

Purpose:

* Links emissions activities to a specific operating location.
* Allows dashboard breakdown by facility.
* Supports geographic grouping using fields such as country and region.

Important fields:

```text
id
tenant
name
code
country
region
```

Multi-tenancy is handled by linking each facility to a tenant.

---

### 3. SourceSystem

A source system represents the business system or data source from which ESG activity data was received.

Examples:

```text
SAP Procurement Export
Utility Portal Export
Travel Platform Export
```

Purpose:

* Tracks where each uploaded activity came from.
* Supports source-of-truth tracking.
* Allows different ingestion rules in the future for SAP, utility, and travel data.
* Helps identify which system produced a row during review or audit.

Important fields:

```text
id
tenant
name
source_type
ingestion_method
config
is_active
```

The current prototype supports CSV upload as the ingestion method.

---

### 4. IngestionBatch

An ingestion batch represents one uploaded CSV file.

Example:

```text
sap_fuel_procurement.csv
```

Purpose:

* Groups all raw records created from a single upload.
* Tracks upload status and processing result.
* Stores basic upload statistics such as total, successful, and failed rows.

Important fields:

```text
id
tenant
source_system
file_name
status
records_total
records_success
records_failed
created_at
```

This gives batch-level traceability. If a reviewer sees a normalized activity, the activity can be traced back to the upload batch that created it.

---

### 5. RawRecord

A raw record stores the original row-level data from the uploaded CSV before normalization.

Purpose:

* Preserves the incoming source data.
* Keeps the original payload available for debugging and traceability.
* Allows normalization to be repeated or improved later if needed.

Important fields:

```text
id
tenant
source_system
ingestion_batch
row_number
raw_payload
parse_status
error_message
created_at
```

The `raw_payload` stores the source row data in a flexible JSON-like format. This is useful because SAP, utility, and travel files may have different column structures.

---

### 6. NormalizedActivity

A normalized activity is the central ESG activity record used by the dashboard and review workflow.

Purpose:

* Converts raw source records into a consistent internal format.
* Stores standardized quantity, unit, activity type, facility, scope category, CO2e, and review status.
* Feeds dashboard analytics.
* Supports approval, rejection, and locking.

Important fields:

```text
id
tenant
raw_record
ingestion_batch
source_system
facility
activity_type
scope_category
activity_date
period_start
period_end
quantity_original
unit_original
quantity_normalized
unit_normalized
co2e
status
flags
created_at
updated_at
```

Example normalized activity:

```text
Activity Type: Fuel Combustion
Scope Category: SCOPE_1
Facility: Bengaluru Plant
Quantity: 100 L
CO2e: 268.000
Status: PENDING
```

---

## Scope 1 / Scope 2 / Scope 3 Categorization

The prototype classifies records into ESG scope categories based on activity type and source data.

### Scope 1

Scope 1 represents direct emissions from owned or controlled operations.

Implemented example:

```text
Fuel Combustion
Diesel Fuel usage
Liters consumed
```

In the sample data, diesel fuel records are classified as:

```text
SCOPE_1
```

### Scope 2

Scope 2 represents indirect emissions from purchased electricity or energy.

The model supports Scope 2 through the `scope_category` field, although the current sample flow focuses mainly on fuel combustion and procurement records.

Example future Scope 2 activity:

```text
Electricity Consumption
kWh consumed
SCOPE_2
```

### Scope 3

Scope 3 represents indirect value-chain emissions.

Implemented example:

```text
Procurement
Purchased materials
Spend or quantity-based activity
```

Procurement records are classified as:

```text
SCOPE_3
```

---

## Unit Normalization

The model separates original source values from normalized values.

This is important because source systems may provide inconsistent formats.

Example:

```text
Original quantity: 100
Original unit: litres / Liter / L
Normalized quantity: 100.000
Normalized unit: L
```

Implemented normalization examples:

```text
Fuel quantity -> L
Procurement quantity -> KG / L / EA depending on source row
```

Why this matters:

* Dashboards should not depend on raw source units.
* Reviewers need a consistent view of quantities.
* Future CO2e calculation logic can use normalized units.

The current prototype performs basic normalization suitable for the sample files. A production system would need a more complete unit conversion table, validation rules, and emissions factor management.

---

## CO2e Calculation

The prototype calculates CO2e for supported fuel combustion records.

Example:

```text
Diesel Fuel
100 L
CO2e = 268.000
```

Procurement records are currently normalized and reviewed but may not always receive CO2e values in the prototype.

This is intentional because procurement-based Scope 3 emissions require more assumptions, such as:

* material-specific emissions factors
* spend-based factors
* supplier-specific data
* currency normalization
* region-specific factor sets

The model still supports storing CO2e when available.

---

## Source-of-Truth Tracking

The model tracks source-of-truth at multiple levels.

Stored traceability includes:

```text
tenant
source_system
ingestion_batch
raw_record
created_at
updated_at
review status
```

This allows a normalized activity to be traced back to:

1. The tenant that owns it.
2. The facility it belongs to.
3. The source system that produced it.
4. The CSV upload batch it came from.
5. The raw row used to create it.

Current prototype limitation:

The system does not implement full row-level version history for manual edits. It supports review status changes and audit logs, but a production system should store immutable before/after snapshots for every edit.

---

## Review Status Model

Normalized activities move through a simple review workflow.

Supported statuses:

```text
PENDING
APPROVED
REJECTED
LOCKED
```

Flow:

```text
Uploaded CSV
   ↓
RawRecord
   ↓
NormalizedActivity
   ↓
PENDING
   ↓
APPROVED / REJECTED / LOCKED
```

Meaning:

* `PENDING`: Activity is waiting for reviewer action.
* `APPROVED`: Activity is accepted for reporting.
* `REJECTED`: Activity is not accepted.
* `LOCKED`: Activity is frozen and should not be changed.

The frontend exposes these actions through the Activity Review page.

---

## Audit Trail

The prototype stores audit logs for reviewer actions.

Implemented events include:

```text
ROW_APPROVED
ROW_REJECTED
ROW_LOCKED
```

Purpose:

* Records important review actions.
* Gives visibility into status changes.
* Supports basic accountability.

Current prototype limitation:

The audit trail is intentionally lightweight. It records key workflow actions, but does not yet provide a full immutable event-sourcing model or detailed before/after field-level changes.

In a production implementation, audit logs should include:

```text
actor
timestamp
entity type
entity id
old value
new value
reason/comment
request metadata
```

---

## Multi-Tenancy Approach

The current model uses logical multi-tenancy.

Most business entities are linked to a tenant:

```text
Tenant -> Facilities
Tenant -> Source Systems
Tenant -> Ingestion Batches
Tenant -> Raw Records
Tenant -> Normalized Activities
```

Why this approach was chosen:

* Simple to implement for the prototype.
* Easy to query and filter.
* Suitable for demonstrating tenant separation.
* Can later be hardened with tenant-aware permissions and database-level constraints.

Production considerations:

* Enforce tenant filtering in every API.
* Add user-to-tenant access control.
* Consider row-level security for PostgreSQL.
* Ensure no cross-tenant data leakage in dashboards and exports.

---

## Why This Model Was Chosen

The model separates the ingestion pipeline into stages:

```text
SourceSystem
   ↓
IngestionBatch
   ↓
RawRecord
   ↓
NormalizedActivity
   ↓
Review / Dashboard
```

This separation was chosen because real ESG data is messy.

Benefits:

1. Raw data is preserved.
2. Normalized data stays clean.
3. Uploads can be traced.
4. Dashboard queries remain simple.
5. Review workflow is separated from ingestion.
6. The model can support more source types later.

---

## Current Limitations

The prototype intentionally keeps some areas simple:

1. No full emissions factor library.
2. No advanced unit conversion engine.
3. No full user-role-based approval workflow.
4. No immutable edit history.
5. No tenant-specific frontend login.
6. No background worker for large file processing.
7. No permanent file storage for uploaded CSV files.
8. No full production-grade PostgreSQL migration documentation in the prototype docs.

These are acceptable tradeoffs for the assignment scope because the focus is on demonstrating architecture, data modeling, ingestion, normalization, review, and dashboard APIs.

---

## Production Improvements

For a production ESG platform, I would extend the model with:

1. EmissionFactor table

```text
factor_name
activity_type
scope_category
region
unit
factor_value
valid_from
valid_to
source_reference
```

2. UnitConversion table

```text
from_unit
to_unit
conversion_factor
category
```

3. RecordVersion table

```text
normalized_activity
version_number
old_payload
new_payload
changed_by
changed_at
change_reason
```

4. UserTenantAccess table

```text
user
tenant
role
```

5. ApprovalComment table

```text
activity
reviewer
comment
created_at
```

These additions would make the system more suitable for real customer use, audit requirements, and ESG reporting.
