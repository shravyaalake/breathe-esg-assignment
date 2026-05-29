# Breathe ESG Assignment

A lightweight ESG (Environmental, Social and Governance) emissions ingestion and review platform built as part of the Breathe ESG technical assignment.

The application demonstrates:

* multi-tenant ESG data ingestion
* CSV-based ingestion from multiple source systems
* Scope 1 / Scope 2 / Scope 3 categorization
* normalization pipeline
* source-of-truth tracking
* review workflow
* audit-ready activity lifecycle
* deployed frontend + backend

---

# Live Deployment

Frontend:

```text
https://breathe-esg-assignment-omega.vercel.app/
```


Admin Panel:

```text
https://breathe-esg-assignment-g4i4.onrender.com/admin/
```

---

# Demo Credentials

Admin credentials:

```text
username: admin
password: <YOUR_PASSWORD>
```

(Replace with your actual credentials or remove if not required.)

---

# Problem Statement

Organizations receive ESG-related operational data from multiple systems:

```text
SAP Procurement
Utility Portals
Travel Platforms
```

These systems export data in inconsistent formats and units.

The challenge is to:

```text
ingest
normalize
categorize
review
trace
```

ESG activity data across tenants and facilities.

This project demonstrates a practical architecture for handling this flow.

---

# Features Implemented

## 1. Multi-Tenant Data Model

Supports tenant ownership for:

```text
Facilities
Source Systems
Uploads
Activities
```

Example tenant:

```text
ABC Manufacturing Ltd
```

---

## 2. CSV Upload / Ingestion

Supports ingestion through:

```text
CSV Upload
```

Supported demo source systems:

```text
SAP Procurement Export
Utility Portal Export
Travel Platform Export
```

Upload fields:

```text
Tenant ID
Source System ID
CSV file
```

---

## 3. ESG Scope Categorization

Supports:

```text
Scope 1
Scope 2
Scope 3
```

Example mapping:

```text
Diesel Fuel → Scope 1
Procurement Activity → Scope 3
```

---

## 4. Activity Review Workflow

Review lifecycle:

```text
PENDING
APPROVED
REJECTED
LOCKED
```

Actions available:

```text
Approve
Reject
Lock
```

---

## 5. Source-of-Truth Tracking

Each activity can be traced back to:

```text
tenant
facility
source system
ingestion batch
timestamps
review status
```

This supports auditability and traceability.

---

## 6. Unit Normalization

Supports normalization-ready quantities and units.

Example:

```text
litre
litres
L
```

normalized into:

```text
L
```

Supported sample units:

```text
L
KG
EA
```

---

# Tech Stack

## Backend

```text
Python
Django
Django REST Framework
PostgreSQL
```

## Frontend

```text
React
Vite
Axios
Tailwind CSS
```

## Deployment

```text
Render (backend)
Vercel (frontend)
```

---

# Architecture Overview

```text
CSV Upload
      ↓
Raw Record Storage
      ↓
Normalization
      ↓
Scope Categorization
      ↓
Review Workflow
      ↓
Dashboard / Activity Review
```

---

# Project Structure

```text
backend/
    audit/
    config/
    dashboard/
    ingestion/
    normalization/
    review/
    sources/
    tenants/

frontend/

sample-data/
```

---

# Running Locally

## Backend

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
cd backend
python manage.py migrate
```

Seed demo data:

```bash
python manage.py seed_demo_data
```

Run server:

```bash
python manage.py runserver
```

Backend:

```text
http://localhost:8000
```

---

## Frontend

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# Demo Instructions

Because the deployed environment automatically seeds demo master data after redeployment, use:

Tenant ID:

```text
1
```

Source System ID:

```text
1
```

for the included sample SAP procurement CSV.

Steps:

1. Open CSV Upload
2. Use:

```text
Tenant ID = 1
Source System ID = 1
```

3. Upload sample CSV (https://github.com/shravyaalake/breathe-esg-assignment/tree/master/sample-data)
4. Open Activity Review
5. Review normalized activities
6. Approve / Reject / Lock records

---

# Known Limitation

The backend is deployed on a free Render instance.

Free deployments may sleep after inactivity and redeploy demo master data.

To ensure reviewer usability:

```text
seed_demo_data
```

automatically restores:

```text
Tenant
Facilities
Source Systems
```

after redeployment.

Uploaded CSV activity records may not persist permanently in the free environment.

---

## Additional Documentation

| Document | Description |
|-----------|-------------|
| [MODEL.md](./MODEL.md) | Core data model, entities, relationships, and traceability design |
| [DECISIONS.md](./DECISIONS.md) | Key architectural and implementation decisions |
| [TRADEOFFS.md](./TRADEOFFS.md) | Design tradeoffs, limitations, and future enhancements |
| [SOURCES.md](./SOURCES.md) | ESG references, assumptions, and source-system research |

for detailed architecture, decisions, tradeoffs and research.
