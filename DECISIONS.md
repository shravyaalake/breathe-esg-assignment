# DECISIONS.md

## Overview

This document captures the key architectural, data modeling, and implementation decisions made while building the Multi-Tenant ESG Emissions Data Ingestion & Tracking Platform.

The primary objective was to create a system capable of ingesting emissions-related data from multiple enterprise systems, normalizing it into a common ESG model, and providing traceability and auditability while remaining simple enough for rapid development and demonstration.

---

# 1. Multi-Tenant Architecture

## Decision

Use a shared database with tenant-scoped records instead of separate databases per tenant.

## Rationale

The platform is designed to support multiple organizations while maintaining a simple deployment model.

Each major business entity contains a tenant reference, allowing logical separation of data.

### Benefits

* Simplified deployment
* Lower operational overhead
* Easier local development
* Reduced infrastructure complexity
* Supports future tenant growth

### Tradeoff

Additional application-level filtering is required to ensure tenant isolation.

---

# 2. CSV-Based Ingestion

## Decision

Support CSV uploads as the primary ingestion mechanism.

## Rationale

Enterprise sustainability data is commonly exported from ERP systems, utility providers, and travel platforms in spreadsheet or CSV formats.

Using CSV ingestion enables:

* Fast implementation
* Easy testing
* Representative enterprise workflows
* Reduced integration complexity

### Benefits

* User-friendly
* Simple implementation
* Easy to demonstrate
* Compatible with multiple source systems

### Tradeoff

Does not provide real-time synchronization with upstream systems.

---

# 3. Source-System Abstraction

## Decision

Model source systems as first-class entities.

Examples:

```text
SAP Procurement Export
Utility Portal Export
Travel Platform Export
```

## Rationale

Different systems produce different formats and business contexts.

By explicitly modeling source systems, the platform can:

* Track provenance
* Apply source-specific transformations
* Support future integrations

### Benefits

* Better auditability
* Clear ownership of records
* Extensible architecture

---

# 4. ESG Scope-Based Classification

## Decision

Classify emissions into Scope 1, Scope 2, and Scope 3 during ingestion.

## Rationale

Scope classification is central to ESG reporting and aligns with common sustainability reporting frameworks.

### Mapping

#### Scope 1

```text
Direct operational emissions
```

#### Scope 2

```text
Purchased electricity
```

#### Scope 3

```text
Procurement
Business Travel
Other value-chain activities
```

### Benefits

* Simplifies reporting
* Consistent categorization
* Easier analytics

### Tradeoff

Some real-world classifications may require more granular business rules.

---

# 5. Normalized ESG Data Model

## Decision

Convert all source data into a standardized emissions record structure.

## Standard Structure

```text
Activity Data
Unit
Emission Factor
CO₂e Emissions
Scope
Facility
Tenant
Source System
```

## Rationale

Source systems produce heterogeneous formats.

A normalized model enables:

* Consistent analytics
* Uniform reporting
* Simplified downstream processing

### Benefits

* Reduced complexity
* Easier dashboard development
* Consistent storage structure

---

# 6. Emission Calculation Strategy

## Decision

Use a generic calculation model:

```text
Emissions (kgCO₂e)
=
Activity Data × Emission Factor
```

## Rationale

Most emissions calculations ultimately rely on activity data combined with an emission factor.

Examples:

```text
Electricity → kWh × Grid Factor
Travel → Distance × Travel Factor
Procurement → Spend × Spend Factor
```

### Benefits

* Easy to understand
* Flexible across source systems
* Consistent implementation

### Tradeoff

The platform uses simplified emission factors suitable for demonstration purposes rather than comprehensive regulatory-grade calculations.

---

# 7. Source Traceability

## Decision

Maintain metadata linking every emission record to its originating source.

Tracked attributes include:

```text
Source System
Original File
Upload Timestamp
Facility
Tenant
```

## Rationale

Auditability is a core ESG requirement.

Users should be able to trace:

```text
Emission Record
      ↓
Original Upload
      ↓
Source System
```

### Benefits

* Transparency
* Easier validation
* Supports compliance workflows

---

# 8. Audit Metadata

## Decision

Store operational metadata for all ingested records.

Examples:

```text
created_at
tenant
facility
source_system
```

## Rationale

Supports accountability and future auditing requirements.

### Benefits

* Historical visibility
* Improved governance
* Better debugging capability

---

# 9. Django + Django REST Framework

## Decision

Use Django and Django REST Framework for backend development.

## Rationale

The project required:

* Rapid API development
* Relational data modeling
* Administrative capabilities
* Structured validation

DRF provides:

* Serializer-based validation
* REST API generation
* Extensible architecture

### Benefits

* Mature ecosystem
* Fast development
* Strong ORM support
* Clean API layer

---

# 10. PostgreSQL Database

## Decision

Use PostgreSQL as the primary database.

## Rationale

The application contains:

* Relational entities
* Tenant relationships
* Facility relationships
* Audit metadata
* Query-heavy reporting workflows

PostgreSQL provides:

* Reliability
* Strong relational support
* Production readiness

### Benefits

* Mature ecosystem
* Excellent performance
* Easy deployment on Render

---

# 11. Pandas for Data Processing

## Decision

Use Pandas for CSV parsing and transformation.

## Rationale

CSV ingestion requires:

* Data cleaning
* Transformation
* Validation
* Normalization

Pandas simplifies these operations and reduces custom parsing logic.

### Benefits

* Faster development
* Reliable CSV handling
* Flexible transformation capabilities

---

# 12. Seeded Demo Environment

## Decision

Automatically seed demo data during deployment.

Command:

```bash
python manage.py seed_demo_data
```

## Rationale

Render free deployments may restart or redeploy, causing demo data loss.

Seeding ensures reviewers always have:

```text
Tenant
Facilities
Source Systems
```

available immediately after deployment.

### Benefits

* Consistent demo experience
* Reduced setup effort
* Faster evaluation

---

# 13. Deployment Simplicity

## Decision

Deploy using:

```text
Frontend → Vercel
Backend → Render
Database → PostgreSQL
```

## Rationale

The assignment prioritizes functionality and architecture over infrastructure complexity.

This deployment approach provides:

* Simple setup
* Reliable hosting
* Fast iteration

### Benefits

* Low operational overhead
* Easy reproducibility
* Suitable for evaluation environments

---

# Summary

The platform architecture prioritizes:

1. Simplicity
2. Auditability
3. Traceability
4. ESG alignment
5. Extensibility
6. Multi-tenancy
7. Rapid deployment

The resulting design provides a practical foundation for ESG emissions data management while remaining straightforward to operate, demonstrate, and extend.
