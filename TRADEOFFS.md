# TRADEOFFS.md

## Overview

Given the limited scope and time of an engineering project, several production-grade features were intentionally not implemented.

The goal was to prioritize:

* a working deployed system
* clean architecture
* meaningful data modeling
* traceability
* multi-tenancy support
* review workflow demonstration

instead of attempting enterprise completeness.

---

# 1. Full Audit Versioning / Immutable History

## Not Built

A complete immutable audit system for every record change.

Example:

```text
Before:
Quantity = 100

After:
Quantity = 120

Changed by:
user@email.com

Reason:
Correction from supplier report
```

The current implementation tracks:

* source system
* ingestion batch
* timestamps
* review status

but does not maintain a permanent edit timeline for every field change.

## Why

A proper audit/versioning system requires:

* immutable history tables
* version snapshots
* change diffs
* actor tracking
* rollback logic

This significantly increases implementation complexity.

For project scope, demonstrating source-of-truth tracking and review status was prioritized.

## Future Improvement

Introduce:

```text
ActivityVersion
AuditEvent
ChangeHistory
```

tables to support regulatory-grade traceability.

---

# 2. Production-Grade Authentication & RBAC

## Not Built

Role-based access control and authentication.

Examples:

```text
Admin
Reviewer
Auditor
Tenant User
```

Currently, the prototype demonstrates review actions but does not restrict access by role.

## Why

A complete authorization system would require:

* authentication provider integration
* permissions model
* tenant-aware access rules
* protected APIs
* role management UI

The project did not explicitly require authentication.

Priority was given to:

```text
multi-tenancy
ingestion
normalization
review workflow
deployment
```

instead of access control.

## Future Improvement

Add:

```text
JWT authentication
RBAC
tenant-level authorization
reviewer permissions
admin-only workflows
```

---

# 3. Advanced ESG Emissions Engine

## Not Built

A production-level emissions calculation engine.

Examples intentionally excluded:

```text
supplier-specific emission factors
regional electricity factors
hotel/travel emission logic
spend-based procurement emissions
versioned emissions libraries
automatic factor updates
```

The implementation currently demonstrates:

* Scope categorization
* basic CO2e calculation support
* normalized activities
* ingestion-to-review flow

## Why

Real ESG emissions systems are highly complex.

Production implementations usually require:

```text
GHG Protocol mapping
regional datasets
factor libraries
industry-specific calculations
regulatory validation
```

Building this fully was outside project scope.

Priority was given to demonstrating:

```text
architecture
data flow
traceability
review lifecycle
multi-source ingestion
```

## Future Improvement

Add:

```text
emission factor database
configurable calculation engine
region-aware factors
supplier-level Scope 3 estimation
transparent calculation breakdowns
```

---

# Final Note

These tradeoffs were deliberate.

The focus was to build:

```text
a working, deployable, explainable ESG prototype
```

with strong architectural foundations rather than attempting incomplete enterprise-scale functionality.
