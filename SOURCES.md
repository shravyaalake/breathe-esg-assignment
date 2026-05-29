# SOURCES.md

## Overview

The project requested support for three ESG-related source systems:

```text
SAP Procurement
Utility Portal
Travel Platform
```

The goal was not to reproduce enterprise systems exactly, but to model realistic ingestion patterns and understand how such systems would contribute ESG data.

For each source:

* a realistic export style was researched
* a representative subset of fields was modeled
* sample CSV data was created
* limitations and real-world deployment concerns were documented

---

# 1. SAP Procurement Export

## What Was Researched

Enterprise procurement systems such as SAP commonly export:

```text
Purchase Orders
Material Procurement
Fuel Purchases
Vendor Transactions
Spend Data
Invoices
```

Typical exports contain:

```text
purchase order
plant/facility
material code
description
quantity
unit
currency
vendor
posting date
```

CSV and spreadsheet exports are common for ESG reporting pipelines.

## What Was Implemented

Representative procurement upload data.

Example fields:

```text
PurchaseOrder
PurchaseOrderItem
PostingDate
PlantCode
MaterialCode
MaterialDescription
Quantity
Unit
NetAmount
Currency
VendorCode
```

Sample records include:

```text
Diesel Fuel
Lubricant Oil
Steel Raw Material
```

## Why These Fields Were Chosen

These fields help demonstrate:

```text
facility attribution
material tracking
procurement activity
scope classification
basic ESG traceability
```

For example:

```text
Diesel procurement → Scope 1
Material procurement → Scope 3
```

## Sample Data Characteristics

Sample CSV intentionally contains:

* realistic procurement naming
* plant codes
* vendor references
* quantities and units
* posting dates

while remaining small enough for review/demo purposes.

## What Would Break in Real Deployment

A real SAP integration would require handling:

```text
multiple SAP schemas
ERP-specific metadata
currency normalization
purchase lifecycle states
invoice reconciliation
missing data quality
supplier mappings
```

Additionally:

```text
Scope categorization rules
```

would likely require configurable business logic.

---

# 2. Utility Portal Export

## What Was Researched

Utility providers typically expose:

```text
electricity usage
gas usage
billing cycles
meter readings
consumption history
```

Exports often contain:

```text
facility
meter
date range
energy consumed
unit
cost
region
```

Many ESG systems calculate:

```text
Scope 2 emissions
```

from utility consumption.

## What Was Implemented

A simplified utility portal representation.

Representative ingestion support includes:

```text
facility attribution
activity normalization
Scope categorization readiness
CSV ingestion flow
```

The implementation models how utility data would move through:

```text
upload → normalization → review
```

without reproducing a full billing platform.

## Why This Was Chosen

The project prioritizes:

```text
architecture thinking
data modeling
ingestion flow
```

rather than reproducing enterprise utility software.

The simplified structure demonstrates:

```text
multi-source ESG ingestion
```

while remaining manageable.

## Sample Data Characteristics

Representative sample shape:

```text
facility
activity
quantity
unit
timestamp/date
```

with normalization-ready units.

## What Would Break in Real Deployment

Real deployments would need:

```text
meter hierarchies
regional tariffs
billing corrections
utility provider differences
timezone handling
estimated readings
unit conversions
electricity emission factors
```

Regional electricity emissions would also require:

```text
country/state-specific CO2e factors
```

---

# 3. Travel Platform Export

## What Was Researched

Corporate travel systems commonly export:

```text
employee travel
flight bookings
hotel stays
transport mode
trip distances
travel spend
```

Example fields include:

```text
booking date
travel type
origin
destination
distance
transport mode
cost
employee/business unit
```

Travel data frequently contributes to:

```text
Scope 3 emissions
```

through business travel reporting.

## What Was Implemented

A simplified travel-platform representation.

The prototype supports:

```text
CSV ingestion
source attribution
tenant ownership
normalization pipeline
review workflow
```

rather than complex travel calculations.

## Why This Was Chosen

Travel emissions often require:

```text
distance estimation
carrier information
hotel factors
regional assumptions
```

which significantly increase complexity.

A representative structure was implemented to demonstrate:

```text
multi-source ESG ingestion
```

without overengineering.

## Sample Data Characteristics

Representative travel-style fields:

```text
travel type
facility/business unit
distance
unit
travel date
```

kept intentionally lightweight for demonstration.

## What Would Break in Real Deployment

Real travel systems would require:

```text
airline integrations
distance calculations
flight class multipliers
hotel emissions
currency normalization
travel policy mapping
duplicate booking handling
```

Business travel emissions may also vary depending on:

```text
aircraft type
seat class
hotel energy model
transport mode
```

---

# Why CSV Was Chosen

Although modern enterprise systems expose APIs, CSV export/import remains common for ESG reporting.

Reasons:

```text
manual reporting workflows
ERP exports
monthly reporting batches
compliance uploads
vendor reporting pipelines
```

Using CSV upload provided:

```text
realistic enterprise behavior
simple reviewability
fast deployment
clear ingestion demonstration
```

while staying aligned with project scope.

---

# Final Observation

This prototype intentionally models:

```text
representative ESG ingestion patterns
```

rather than exact enterprise integrations.

The objective was to demonstrate:

```text
data modeling
multi-tenancy
traceability
review workflow
normalization thinking
engineering judgment
```

through realistic but simplified source systems.
