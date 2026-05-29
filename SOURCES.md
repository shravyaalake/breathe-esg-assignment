# SOURCES.md

## Overview

This document describes the reference materials, domain knowledge, assumptions, and sample data sources used while designing and implementing the Multi-Tenant ESG Emissions Data Ingestion & Tracking Platform.

The project was developed as a demonstration of ESG emissions data ingestion, normalization, and traceability workflows rather than as a production-ready regulatory reporting system.

---

# ESG Domain References

The overall platform design was influenced by commonly accepted ESG and greenhouse gas accounting concepts.

## Greenhouse Gas Protocol (GHG Protocol)

The platform's emissions classification model follows the widely adopted concept of:

```text
Scope 1
Scope 2
Scope 3
```

These categories provide the foundation for organizing emissions data across multiple business activities.

### Influence on the Project

* Scope classification model
* Emissions categorization
* ESG reporting structure
* Data normalization strategy

---

# Source System Research

The ingestion workflows were inspired by common enterprise data export patterns rather than direct integrations with live systems.

The project simulates how ESG-related information is commonly extracted from operational systems.

---

## SAP Procurement Export

Represents procurement and supplier spend data.

Typical procurement exports may contain:

```text
Supplier
Purchase Category
Spend Amount
Currency
Business Unit
```

### Platform Usage

Mapped to:

```text
Scope 3
Purchased Goods & Services
```

### Purpose

Demonstrate ingestion of supplier-related emissions data and spend-based emissions calculations.

---

## Utility Portal Export

Represents electricity consumption records typically exported from utility providers or energy management systems.

Typical exports may contain:

```text
Facility
Billing Period
Electricity Consumption
Unit (kWh)
```

### Platform Usage

Mapped to:

```text
Scope 2
Purchased Electricity
```

### Purpose

Demonstrate ingestion of operational energy consumption data.

---

## Travel Platform Export

Represents business travel records.

Typical exports may contain:

```text
Traveler
Travel Type
Distance
Trip Date
```

### Platform Usage

Mapped to:

```text
Scope 3
Business Travel
```

### Purpose

Demonstrate ingestion of employee travel-related emissions activities.

---

# Sample Data Assumptions

The application includes seeded demonstration data.

These records were created for evaluation and demonstration purposes and do not represent real organizational emissions data.

---

## Demo Tenant

```text
ABC Manufacturing Ltd
```

Industry:

```text
Automotive
```

Purpose:

Provide a realistic enterprise context for demonstrating multi-tenant ESG workflows.

---

## Demo Facilities

```text
BLR01 - Bengaluru Plant
PUN01 - Pune Plant
CHE01 - Chennai Plant
HYD01 - Hyderabad Plant
MUM01 - Mumbai Plant
DEL01 - Delhi Plant
```

Purpose:

Simulate geographically distributed manufacturing operations.

---

## Demo Source Systems

```text
SAP Procurement Export
Utility Portal Export
Travel Platform Export
```

Purpose:

Represent common ESG data sources encountered in enterprise sustainability programs.

---

# Emission Calculation Assumptions

The platform uses a simplified emissions calculation model:

```text
Emissions (kgCO₂e)
=
Activity Data × Emission Factor
```

The objective is to demonstrate the ingestion and calculation workflow.

### Examples

#### Electricity

```text
kWh × Grid Emission Factor
```

#### Travel

```text
Distance × Travel Emission Factor
```

#### Procurement

```text
Spend × Spend-Based Emission Factor
```

### Important Note

The emission factors used within the project are illustrative and intended for demonstration purposes only.

The platform is not intended to provide regulatory-grade emissions accounting.

---

# Technical References

The implementation was built using documentation and standard usage patterns from the following technologies:

## Frontend

```text
React
Vite
React Router
Axios
Tailwind CSS
```

Used for:

* User interface
* Routing
* API communication
* Styling

---

## Backend

```text
Django
Django REST Framework
```

Used for:

* Data modeling
* REST APIs
* Validation
* Business logic

---

## Data Processing

```text
Pandas
```

Used for:

* CSV parsing
* Data transformation
* Normalization workflows

---

## Database

```text
PostgreSQL
```

Used for:

* Relational data storage
* Multi-tenant data management
* Audit metadata storage

---

# Data Limitations

The following constraints apply to the project:

## No Live Integrations

The platform does not connect directly to:

```text
SAP APIs
Utility Provider APIs
Travel Management APIs
```

Instead, representative CSV exports are used.

---

## No Regulatory Certification

The platform is designed as a technical demonstration and should not be considered a certified ESG reporting solution.

---

## Simplified Emission Factors

Emission calculations use illustrative factors and assumptions.

Real-world implementations would require:

* Verified factor databases
* Regional factors
* Industry-specific methodologies
* Periodic factor updates

---

# Summary

The platform combines ESG reporting concepts, common enterprise data export patterns, and modern web technologies to demonstrate a practical emissions data ingestion workflow.

All sample organizations, facilities, source systems, and emissions data are provided for demonstration purposes and are intended to showcase:

* Multi-tenancy
* Data normalization
* Scope classification
* Source traceability
* Auditability
* ESG-focused reporting workflows

rather than serve as authoritative environmental reporting data.
