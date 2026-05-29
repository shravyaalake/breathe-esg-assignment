# TRADEOFFS.md

## Overview

This document outlines the major tradeoffs made during the design and implementation of the Multi-Tenant ESG Emissions Data Ingestion & Tracking Platform.

The project was developed with a focus on delivering a working, extensible, and auditable ESG ingestion system within a limited implementation timeline. As a result, several design decisions favor simplicity, maintainability, and demonstration value over full enterprise-scale functionality.

---

# 1. CSV-Based Ingestion vs Direct System Integrations

## Chosen Approach

CSV file uploads through the web interface.

## Alternative

Direct integrations with:

* SAP APIs
* Utility provider APIs
* Travel management platforms
* Enterprise data warehouses

## Why This Choice Was Made

CSV exports are a common denominator across enterprise systems and provide a practical way to demonstrate ingestion workflows without requiring access to proprietary systems.

### Advantages

* Faster implementation
* Easier testing
* Simpler deployment
* No dependency on external systems

### Limitations

* No real-time synchronization
* Manual upload process
* Limited automation

### Future Enhancement

Introduce scheduled connectors and API-based integrations.

---

# 2. Shared Database Multi-Tenancy vs Tenant-Specific Databases

## Chosen Approach

Single PostgreSQL database with tenant-scoped records.

## Alternative

Separate database per tenant.

## Why This Choice Was Made

The shared-database approach significantly reduces operational complexity while still supporting logical tenant isolation.

### Advantages

* Simpler deployment
* Lower infrastructure cost
* Easier maintenance
* Faster development

### Limitations

* Requires strict tenant filtering
* Less isolation than dedicated databases

### Future Enhancement

Support schema-per-tenant or database-per-tenant architectures for larger deployments.

---

# 3. Simplified ESG Data Model vs Full ESG Framework Coverage

## Chosen Approach

Support core ESG emissions tracking focused on Scope 1, Scope 2, and Scope 3 emissions.

## Alternative

Comprehensive ESG platform supporting:

* Environmental metrics
* Social indicators
* Governance metrics
* Regulatory disclosures
* Sustainability reporting frameworks

## Why This Choice Was Made

The assignment primarily focuses on emissions data ingestion and normalization.

A narrower scope enabled deeper implementation of ingestion, traceability, and auditability features.

### Advantages

* Clear problem focus
* Faster implementation
* Simpler user experience

### Limitations

* Does not cover broader ESG reporting requirements

### Future Enhancement

Extend the model to support additional ESG dimensions and reporting standards.

---

# 4. Rule-Based Scope Classification vs Dynamic Classification Engine

## Chosen Approach

Predefined mappings between source systems and ESG scopes.

Examples:

```text
Utility Data → Scope 2
Procurement Data → Scope 3
Travel Data → Scope 3
```

## Alternative

Configurable classification engine with user-defined rules.

## Why This Choice Was Made

The current set of source systems has predictable classifications.

A simple mapping approach reduced implementation complexity.

### Advantages

* Easy to understand
* Easy to maintain
* Consistent results

### Limitations

* Limited flexibility
* Not suitable for highly customized reporting requirements

### Future Enhancement

Introduce configurable classification rules and approval workflows.

---

# 5. Simplified Emission Factors vs Regulatory-Grade Calculations

## Chosen Approach

Use a generalized calculation model:

```text
Emissions = Activity Data × Emission Factor
```

## Alternative

Integration with:

* Regional emission factor databases
* Government datasets
* Industry-specific factor catalogs
* Time-dependent factor calculations

## Why This Choice Was Made

The objective was to demonstrate the ingestion and calculation workflow rather than provide production-grade emissions accounting.

### Advantages

* Simpler implementation
* Easier testing
* Consistent calculation model

### Limitations

* Not suitable for regulatory reporting
* Emission factors may not reflect real-world variability

### Future Enhancement

Integrate verified emission factor libraries and regional datasets.

---

# 6. Audit Metadata vs Full Audit Logging

## Chosen Approach

Store key metadata including:

```text
Tenant
Facility
Source System
Upload Timestamp
Creation Timestamp
```

## Alternative

Full change-history tracking for every record update and deletion.

## Why This Choice Was Made

The implemented metadata provides traceability while keeping the data model lightweight.

### Advantages

* Lower complexity
* Smaller storage footprint
* Easier implementation

### Limitations

* Limited historical reconstruction
* No version history for record edits

### Future Enhancement

Implement versioned audit logs and change tracking.

---

# 7. Seeded Demo Data vs Persistent Demo Environment

## Chosen Approach

Automatically recreate demo master data during deployment.

```bash
python manage.py seed_demo_data
```

## Alternative

Maintain a permanently managed demo environment.

## Why This Choice Was Made

Free-tier deployment platforms may restart instances or redeploy applications.

Automatic seeding guarantees a consistent evaluation experience.

### Advantages

* Reliable demo setup
* Reduced reviewer friction
* Faster onboarding

### Limitations

* Demo data is not user-generated
* Uploaded data may not persist indefinitely

### Future Enhancement

Persist demo uploads and provide environment snapshots.

---

# 8. REST APIs vs GraphQL

## Chosen Approach

Django REST Framework APIs.

## Alternative

GraphQL API layer.

## Why This Choice Was Made

REST is straightforward, widely understood, and well-supported by Django REST Framework.

### Advantages

* Fast development
* Mature tooling
* Simpler frontend integration

### Limitations

* Less flexible querying
* Potential over-fetching

### Future Enhancement

Introduce GraphQL for advanced reporting and analytics use cases.

---

# 9. PostgreSQL Relational Model vs Data Lake Architecture

## Chosen Approach

Structured relational storage using PostgreSQL.

## Alternative

Data lake or document-based architecture.

## Why This Choice Was Made

The platform contains well-defined relationships between:

```text
Tenant
Facility
Source System
Upload
Emission Record
```

A relational model naturally fits these requirements.

### Advantages

* Strong consistency
* Clear relationships
* Mature ecosystem

### Limitations

* Less flexible for highly unstructured ESG datasets

### Future Enhancement

Introduce hybrid storage for large-scale analytical workloads.

---

# 10. Assignment-Focused Scope vs Enterprise Platform Scope

## Chosen Approach

Prioritize:

* Data ingestion
* Normalization
* Traceability
* Auditability
* Scope classification

## Excluded Features

The following were intentionally not implemented:

* Real ERP integrations
* Single Sign-On (SSO)
* Role-based access control
* Workflow approvals
* Regulatory disclosure generation
* Advanced analytics
* Forecasting models
* Automated ESG reporting exports

## Why This Choice Was Made

Given the available time, focusing on core ESG data ingestion produced a more complete and reliable solution than attempting a broader but partially implemented platform.

---

# Conclusion

The platform intentionally prioritizes:

1. Simplicity
2. Demonstrability
3. Auditability
4. Traceability
5. Extensibility

Several enterprise-scale features were deferred in favor of delivering a robust ingestion and normalization pipeline. The current architecture provides a strong foundation for future expansion while remaining practical to implement, evaluate, and maintain.
