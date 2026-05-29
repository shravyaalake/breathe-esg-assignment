# Multi-Tenant ESG Emissions Data Ingestion & Tracking Platform

## Overview

The Multi-Tenant ESG Emissions Data Ingestion & Tracking Platform is a web application designed to ingest emissions-related data from multiple enterprise source systems, normalize the data into a standardized ESG model, classify emissions into Scope 1, Scope 2, and Scope 3 categories, and maintain complete traceability back to the original source data.

The platform demonstrates how organizations can consolidate sustainability-related information from disparate operational systems into a unified ESG reporting workflow.

---

## Key Features

### Multi-Tenant Architecture

The platform supports multiple organizations through tenant-scoped data isolation.

Current demo tenant:

```text
ABC Manufacturing Ltd
```

---

### ESG Data Ingestion

Upload emissions-related CSV files through the web interface.

Supported workflow:

```text
CSV Upload
     ↓
Validation
     ↓
Parsing
     ↓
Normalization
     ↓
Scope Classification
     ↓
Emission Calculation
     ↓
Storage
```

---

### Multiple Source Systems

The platform currently supports:

#### SAP Procurement Export

Represents:

```text
Supplier Procurement
Purchased Goods
Vendor Spend
```

Mapped to:

```text
Scope 3
```

---

#### Utility Portal Export

Represents:

```text
Electricity Consumption
Energy Usage
Utility Bills
```

Mapped to:

```text
Scope 2
```

---

#### Travel Platform Export

Represents:

```text
Business Travel
Employee Travel
```

Mapped to:

```text
Scope 3
```

---

### ESG Scope Classification

The system classifies emissions according to the GHG Protocol framework.

#### Scope 1

Direct emissions:

```text
Fuel Combustion
Diesel Usage
Natural Gas
```

#### Scope 2

Purchased electricity:

```text
Electricity Consumption
Grid Power
Utility Usage
```

#### Scope 3

Indirect value-chain emissions:

```text
Procurement
Business Travel
Supplier Activities
```

---

### Data Normalization

Data from different source systems is transformed into a standardized ESG structure.

Normalized record format:

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

This enables consistent reporting and analytics across heterogeneous data sources.

---

### Source Traceability

Every emission record retains metadata linking it back to its origin.

Tracked information includes:

```text
Tenant
Facility
Source System
Upload Timestamp
Original File
```

Traceability chain:

```text
Emission Record
      ↓
Upload Batch
      ↓
Original CSV
      ↓
Source System
```

---

### Auditability

The platform stores metadata required for audit and compliance workflows.

Examples:

```text
created_at
tenant
facility
source_system
upload_timestamp
```

---

## System Architecture

```text
Frontend (React + Vite)
           ↓
      REST APIs
           ↓
Django REST Framework
           ↓
Business Logic Layer
           ↓
PostgreSQL Database
```

---

## Technology Stack

### Frontend

* React
* Vite
* Axios
* React Router
* Tailwind CSS

### Backend

* Django
* Django REST Framework
* Pandas

### Database

* PostgreSQL

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: PostgreSQL

---

## Data Model

The platform is built around the following core entities:

### Tenant

Represents an organization using the platform.

### Facility

Represents a physical operational location.

### Source System

Represents the origin of uploaded ESG data.

### Upload Batch

Represents an ingestion event.

### Emission Record

Represents a normalized emissions activity record.

Relationship overview:

```text
Tenant
 ├── Facilities
 ├── Source Systems
 ├── Upload Batches
 └── Emission Records
```

Additional design details are documented in:

```text
MODEL.md
```

---

## Emission Calculation

The platform uses a simplified emissions calculation model:

```text
Emissions (kgCO₂e)
=
Activity Data × Emission Factor
```

Examples:

### Electricity

```text
kWh × Grid Emission Factor
```

### Travel

```text
Distance × Travel Emission Factor
```

### Procurement

```text
Spend × Spend-Based Factor
```

The calculation logic is intended for demonstration purposes and does not represent regulatory-grade emissions accounting.

---

## Running Locally

### Prerequisites

* Python 3.12+
* Node.js 18+
* PostgreSQL

---

### Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the environment:

#### Windows

```bash
venv\Scripts\activate
```

#### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r ../requirements.txt
```

Apply migrations:

```bash
python manage.py migrate
```

Seed demo data:

```bash
python manage.py seed_demo_data
```

Start the server:

```bash
python manage.py runserver
```

Backend runs on:

```text
http://localhost:8000
```

---

### Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Demo Data

The application includes seeded demo data.

### Tenant

```text
ABC Manufacturing Ltd
```

### Facilities

```text
BLR01 - Bengaluru Plant
PUN01 - Pune Plant
CHE01 - Chennai Plant
HYD01 - Hyderabad Plant
MUM01 - Mumbai Plant
DEL01 - Delhi Plant
```

### Source Systems

```text
SAP Procurement Export
Utility Portal Export
Travel Platform Export
```

---

## Deployment

### Backend

Hosted on Render.

Deployment steps:

```bash
python manage.py migrate
python manage.py seed_demo_data
python manage.py collectstatic --no-input
```

### Frontend

Hosted on Vercel.

---

## Demo Workflow

### Step 1

Open the application.

---

### Step 2

Select:

```text
Tenant: ABC Manufacturing Ltd
```

---

### Step 3

Choose a source system:

```text
SAP Procurement Export
Utility Portal Export
Travel Platform Export
```

---

### Step 4

Upload a sample CSV file.

---

### Step 5

Verify successful ingestion.

---

### Step 6

Review:

* Emission Records
* Scope Classification
* Audit Information
* Dashboard Data

---

## Assumptions

* CSV files are used as representative enterprise exports.
* Scope mappings are predefined.
* Emission factors are simplified for demonstration.
* Demo data is automatically seeded during deployment.
* The platform focuses on emissions tracking rather than full ESG disclosure workflows.

---

## Limitations

Current implementation intentionally excludes:

* Live ERP integrations
* Utility provider APIs
* Single Sign-On (SSO)
* Role-based access control
* Workflow approvals
* Advanced ESG reporting exports
* Regulatory disclosure generation

These decisions are documented in:

```text
TRADEOFFS.md
```

---

## Additional Documentation

### MODEL.md

Explains:

* Core entities
* Relationships
* Multi-tenancy
* Scope classification
* Traceability model

### DECISIONS.md

Explains:

* Architectural decisions
* Technology choices
* Data modeling rationale

### TRADEOFFS.md

Explains:

* Simplifications
* Design compromises
* Future improvements

### SOURCES.md

Explains:

* ESG domain references
* Data assumptions
* Source-system research
* Technical references

---

## Future Enhancements

Potential next steps include:

* Real ERP integrations
* Automated ingestion pipelines
* Role-based access control
* Configurable emission factors
* Advanced analytics dashboards
* Regulatory reporting exports
* Multi-region emission factor support
* Approval workflows

---

## Conclusion

This project demonstrates a practical ESG data ingestion architecture that combines multi-tenancy, emissions normalization, scope classification, auditability, and source traceability into a unified platform. The design emphasizes extensibility, transparency, and simplicity while providing a strong foundation for future ESG reporting and sustainability management workflows.
