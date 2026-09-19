<div align="center">

# 🏥 IntelliCare
### Hybrid AI-RAG & Operations Research Framework for Dynamic Hospital Resource Allocation and Decision Support

[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google OR-Tools](https://img.shields.io/badge/Google_OR--Tools-MILP_Solver-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/optimization)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16_pgvector-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Redis](https://img.shields.io/badge/Redis-7.2_Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <b>Observe</b> • <b>Predict</b> • <b>Optimize</b> • <b>Explain</b> • <b>Simulate</b> • <b>Decide</b>
</p>

<p align="center">
  IntelliCare is a production-grade healthcare operations decision-support platform designed to eliminate hospital bottlenecks, ICU saturation, and nurse burnout before they manifest. Powered by multi-horizon neural forecasting (LSTM), Mixed-Integer Linear Programming (MILP via Google OR-Tools), and hybrid vector-keyword Retrieval-Augmented Generation (RAG).
</p>

---

[🚀 Quick Start](#-quick-start) • [🏛️ System Architecture](#️-system-architecture) • [🧠 Core AI & Optimization Engines](#-core-ai--optimization-engines) • [🔐 RBAC & Security](#-rbac--governance) • [📊 Mathematical Formulation](#-mathematical-formulation) • [📑 API & Schema](#-data-models--prisma-schema)

</div>

---

## ⚡ Executive Summary & Problem Space

Modern hospitals operate under extreme volatility: sudden emergency surges, high-acuity admissions, bed blocking, and staffing ratio mandates. Existing hospital management systems are **strictly reactive**—they record what happened in the past, rather than optimizing what should happen in the next 6 to 72 hours.

> **IntelliCare shifts hospital operations from retrospective fire-fighting to predictive mathematical optimization.**

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐     ┌───────────────┐     ┌──────────────┐     ┌───────────────┐
│   OBSERVE   │ ──► │   PREDICT    │ ──► │   OPTIMIZE    │ ──► │    EXPLAIN    │ ──► │   SIMULATE   │ ──► │    DECIDE     │
│ Live Census │     │ LSTM Demand  │     │  MILP Bounds  │     │ RAG Knowledge │     │   What-If    │     │ Human-in-Loop │
│  Telemetry  │     │ Multi-Horizon│     │ Google OR-Tool│     │   Citations   │     │ Crisis Sandbx│     │ Multi-Persona │
└─────────────┘     └──────────────┘     └───────────────┘     └───────────────┘     └──────────────┘     └───────────────┘
```

> ⚠️ **Important Clinical Boundary**: IntelliCare is an **operational decision-support system** for bed, nurse, physician, and equipment allocation. It is **not** an autonomous diagnostic or treatment tool. All recommendations require authorized clinical supervisor sign-off.

---

## 🏛️ System Architecture

IntelliCare is architected as a high-throughput, low-latency enterprise distributed system with strict isolation across the ingestion, compute, optimization, and presentation tiers.

```mermaid
flowchart TB
    subgraph Users ["👥 USERS / ACTORS"]
        Admin["Hospital Administrator\n• Monitor Operations\n• Approve Recommendations\n• View Analytics"]
        Manager["Department Manager\n• View Dept Status\n• Review Allocation\n• Run Scenarios"]
        Staff["Authorized Staff\n• View Resources\n• Operational Updates"]
    end

    subgraph Clients ["💻 CLIENT LAYER"]
        WebApp["Web / Desktop Application\n(React 19 + TypeScript + Vite + Tailwind CSS + Three.js)"]
    end

    subgraph Ingress ["🛡️ INGRESS & SECURITY LAYER"]
        LB["Load Balancer (HAProxy / NGINX)\nHTTPS / TLS 1.3"]
        Gateway["API Gateway (Kong / Express Gateway)\n• Rate Limiting • AuthN/AuthZ • Request Validation • Routing"]
    end

    subgraph Ingestion ["📥 DATA INGESTION LAYER"]
        Connectors["Connector Service\n• HL7 / FHIR Adapters\n• EHR / EMR Listeners"]
        Batch["Batch Ingestion Service\n• ETL Jobs\n• CSV / Excel Imports"]
        Stream["Stream Ingestion Service\n• Kafka / RabbitMQ\n• Live Telemetry Stream"]
    end

    subgraph Sources ["🏥 HOSPITAL SYSTEMS & DATA SOURCES"]
        EHR["EHR / EMR Systems"]
        ED["Emergency Dept System"]
        BedMgr["Bed Management System"]
        StaffSched["Staff Scheduling System"]
        OT["Operation Theatre System"]
        ExternalData["Public Health & Seasonal Data"]
    end

    subgraph Backend ["⚙️ BACKEND MICROSERVICES"]
        AuthSvc["Auth Service (JWT / RBAC)"]
        HospSvc["Hospital & Dept Service"]
        ResSvc["Resource Service"]
        PatientSvc["Patient Flow Service"]
        SchedSvc["Scheduling Service"]
        ForeSvc["Forecast Service"]
        OptSvc["Optimization Service"]
        RagSvc["RAG / Knowledge Service"]
        RecSvc["Recommendation Service"]
        ScenSvc["Scenario Service"]
        AlertSvc["Notification & Alert Service"]
        AuditSvc["Audit Service (SHA-256 Ledger)"]
    end

    subgraph AI_Opt ["🧠 AI/ML & OPTIMIZATION TIER"]
        subgraph ForecastEngine ["Neural Demand Forecasting"]
            DataPrep["Data Prep & Feature Engineering"]
            LSTM["Multi-Horizon LSTM Model"]
            XGB["XGBoost Regressor Baseline"]
            Eval["Model Evaluation (MAE, RMSE, MAPE)"]
            Infer["Real-time & Batch Inference"]
        end

        subgraph OptimizationEngine ["OR-Tools Optimization Engine"]
            InputOpt["Forecasted Demand + Capacity + Constraints"]
            MILP["MILP Mathematical Model\n(Google OR-Tools CBC / CP-SAT)"]
            AllocResult["Optimized Shift Allocation Vectors"]
        end

        subgraph RagEngine ["RAG / Knowledge Engine"]
            DocIngest["Document & SOP Ingestion"]
            Chunking["Text Extraction & Chunking"]
            Embed["Embedding Model (pgvector)"]
            HybridRet["Hybrid Retrieval (BM25 + Dense Vector)"]
            LLM["LLM Synthesis (Policy Grounded)"]
        end
    end

    subgraph Storage ["💾 PERSISTENCE & STORAGE TIER"]
        Postgres[(Primary PostgreSQL\nUsers, Resources, Allocations, Audit)]
        Timescale[(TimescaleDB\nPatient Flow, Telemetry, Load History)]
        RedisCache[(Redis Cache\nSessions, Rate Limits, API Cache)]
        S3Storage[(S3 Compatible Object Storage\nSOPs, PDF Reports, Model Artifacts)]
        VectorDB[(Vector Store\npgvector Embedding Chunks)]
    end

    subgraph CrossCutting ["🔒 CROSS-CUTTING CONCERNS"]
        Sec["Security: TLS 1.3 Everywhere, Encryption at Rest"]
        Obs["Observability: Prometheus Metrics + Grafana"]
        Log["Logging: Centralized ELK Stack"]
        AuditSec["Compliance: HIPAA / GDPR Ready + Cryptographic SHA-256 Audit Trail"]
    end

    %% Flows
    Users --> WebApp
    WebApp --> LB
    LB --> Gateway
    Gateway --> Backend

    Sources --> Ingestion
    Ingestion --> Backend
    Ingestion --> Storage

    Backend --> AI_Opt
    AI_Opt --> Storage
    Backend --> Storage

    DataPrep --> LSTM & XGB
    LSTM & XGB --> Eval --> Infer
    Infer --> InputOpt
    InputOpt --> MILP --> AllocResult
    DocIngest --> Chunking --> Embed --> HybridRet --> LLM
```

---

## 🛠️ Technology Stack Breakdown

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend Core** | React 19, TypeScript 5.5, Vite 5.4 | Ultra-fast client, strict type safety, zero build lag |
| **Styling & UI** | Tailwind CSS 3.4, Vanilla CSS Custom Tokens | Healthcare Blue, Cyan, Dark `#07111F`, Light `#F8FAFC` |
| **Motion & 3D** | Three.js, React Three Fiber, Drei, Lucide React | Interactive 3D digital twin hospital model & micro-interactions |
| **State & Data Store** | Zustand, Custom Router Store | Atomic state machines for telemetry, solvers, forecasts & RBAC |
| **Ingress & Gateway** | Kong / NGINX, Express API Gateway, WebSockets | TLS 1.3 termination, rate limiting, realtime telemetry push |
| **Backend Services** | Node.js, Express, Python 3.11 Microservices | Microservice architecture, RESTful endpoints & stream gateways |
| **Optimization Solver**| Google OR-Tools (CBC / CP-SAT), Python PuLP | Mixed-Integer Linear Programming (MILP) with custom weights |
| **Time-Series ML** | PyTorch (Multi-Horizon LSTM), XGBoost, Scikit-learn | Multi-horizon patient arrival & acuity regression forecasting |
| **Hybrid RAG** | PostgreSQL `pgvector`, BM25, LangChain, OpenAI / Claude | Grounded SOP document retrieval with sentence-level citations |
| **Databases & Cache** | PostgreSQL 16, TimescaleDB, Redis 7.2 | Relational schema, high-frequency time-series, low-latency caching |
| **ORM & Migrations** | Prisma 5 | 18+ strongly typed models, automated PostgreSQL migrations |
| **DevOps & Containers**| Docker, Docker Compose, Kubernetes, CI/CD | Containerized microservice deployment and horizontal scaling |
| **Observability** | Prometheus, Grafana, OpenTelemetry, Pino | Real-time APM, error tracking, latency percentiles (p95/p99) |

---

## 🧠 Core AI & Optimization Engines

### 1. 📈 Multi-Horizon Neural Demand Forecasting (LSTM + XGBoost)
Predicts inpatient admissions, ICU bed demand, and nurse-to-patient staffing requirements across **6H, 12H, 24H, 48H, and 72H horizons**.
* **Primary Model**: 3-layer Bidirectional LSTM with temporal attention mechanism.
* **Baseline Regressor**: Gradient Boosted Trees (XGBoost) trained on historical census, day-of-week, seasonal infection waves, and public holidays.
* **Uncertainty Quantification**: 95% Conformal Prediction intervals ($\pm \sigma$) providing robust upper/lower confidence bounds.
* **Telemetry Evaluation**: Live MAE ($2.38$), RMSE ($3.12$), and MAPE ($4.8\%$) tracking.

### 2. ⚙️ Mixed-Integer Linear Programming Solver (Google OR-Tools)
Calculates optimal bed reallocations, nurse shift adjustments, and equipment redeployments across departments in under **150 milliseconds**.
* **Decision Variables**: $x_{i,j,t} \in \mathbb{Z}^+$ (Quantity of resource $i$ allocated from department $j$ at time shift $t$).
* **Multi-Objective Balance**: Weighted minimization of unmet demand, staff overtime, transfer friction, and resource idle time.
* **Hard Constraints**: Statutory minimum nurse-to-patient ratios (e.g., ICU $1:2$, General Ward $1:4$), bed capacity limits, and equipment sterility turnover times.

### 3. 📚 Contextual Hybrid RAG Knowledge Engine
Grounds every automated recommendation in actual hospital standard operating procedures (SOPs), emergency overflow protocols, and clinical governance documents.
* **Hybrid Search**: Reciprocal Rank Fusion (RRF) combining dense semantic embeddings (`pgvector`) + sparse BM25 keyword matching.
* **Sentence-Level Citations**: All answers output precise document IDs, paragraph references, and compliance tags.
* **Non-Clinical Verification**: Explains *why* an operational shift was recommended with full administrative transparent reasoning.

### 4. 🧪 What-If Crisis Scenario Sandbox
Simulates severe stress scenarios without altering live hospital operations:
* **Crisis Presets**: Mass Casualty Incident (MCI), Winter Viral Surge, Mass Staff Shortage, ICU Power Failure & Step-Down.
* **Parametric Sliders**: Realtime adjustments for Emergency Arrival Rate ($+0\%$ to $+150\%$), Available Inpatient Beds, and Nurse Staffing Roster.
* **Delta Analysis**: Instant comparative graphs showing Baseline vs. Simulated census, bottleneck arrival timestamps, and automated mitigation playbooks.

---

## 📊 Mathematical Formulation

### Objective Function (Multi-Objective MILP)

$$\min Z = w_1 \sum_{d \in D} \sum_{t \in T} U_{d,t} + w_2 \sum_{d \in D} \sum_{t \in T} O_{d,t} + w_3 \sum_{i \in R} \sum_{j \neq k} C_{j,k} \cdot X_{i,j,k,t} + w_4 \sum_{d \in D} \sum_{t \in T} I_{d,t}$$

Where:
* $U_{d,t}$: Unmet patient demand in department $d$ at shift $t$.
* $O_{d,t}$: Staff overtime / ratio violation penalty.
* $X_{i,j,k,t}$: Number of units of resource $i$ transferred from department $j$ to department $k$.
* $C_{j,k}$: Physical transfer friction and setup cost.
* $I_{d,t}$: Idle buffer resource penalty.
* $w_1, w_2, w_3, w_4$: User-configurable objective priority weights.

### Key Constraints

1. **Statutory Staffing Ratio Mandate**:
   $$\text{Staff}_{d,t} \ge \alpha_d \cdot \text{Census}_{d,t} \quad \forall d \in D, \forall t \in T$$
2. **Physical Bed Capacity Ceiling**:
   $$\text{Census}_{d,t} \le \text{Capacity}_d \quad \forall d \in D$$
3. **Resource Conservation Law**:
   $$\sum_{d \in D} \text{Allocated}_{i,d,t} \le \text{TotalPool}_i \quad \forall i \in R, \forall t \in T$$

---

## 🔐 RBAC & Governance

IntelliCare enforces strict **Role-Based Access Control (RBAC)** across 5 operational personas:

| Role | Persona Name | Assigned Scope | Key Permissions |
| :--- | :--- | :--- | :--- |
| **`SUPER_ADMIN`** | Alex Ross | Global System | `MANAGE_ORGANIZATION`, `VIEW_AUDIT_LOGS`, `CONFIGURE_SOLVER` |
| **`HOSPITAL_ADMIN`** | Dr. Sarah Chen | Enterprise-Wide | `APPROVE_RECOMMENDATIONS`, `EXECUTE_OPTIMIZATION`, `VIEW_FINANCIALS` |
| **`DEPARTMENT_MANAGER`**| Dr. Marcus Vance | ICU & Critical Care | `MANAGE_DEPARTMENT_RESOURCES`, `RUN_SCENARIOS`, `VIEW_FORECASTS` |
| **`OPERATIONS_COORDINATOR`**| Elena Rostova | Emergency & Triage | `ACKNOWLEDGE_ALERTS`, `MODIFY_ALLOCATION`, `REQUEST_RESOURCES` |
| **`AUTHORIZED_STAFF`** | David Kim | Med-Surg Ward | `VIEW_RESOURCES`, `UPDATE_OCCUPANCY`, `REPORT_STATUS` |

> 🔒 **Cryptographic Audit Ledger**: Every recommendation sign-off, parameter change, and manual override is recorded with a **SHA-256 tamper-evident digest** containing actor identity, previous state, new state, and ISO-8601 timestamp.

---

## 📑 Data Models & Prisma Schema

IntelliCare features a robust PostgreSQL database schema defined in `prisma/schema.prisma` with 18 operational models:

```
├── Organization          # Multi-tenant hospital network entity
├── Department            # Clinical department (ICU, ED, Med-Surg, OR, PACU)
├── User                  # Authenticated personnel with RBAC role
├── Session               # Encrypted session tokens with TLS fingerprinting
├── Resource              # Tracked inventory (Beds, Nurses, Doctors, Ventilators)
├── ResourceAllocation    # Active and scheduled resource assignments
├── DemandRecord          # Historic time-series load & acuity telemetry
├── ForecastRun           # Neural forecast outputs with confidence bands
├── OptimizationRun       # MILP solver job results and allocation vectors
├── Scenario              # Saved what-if crisis simulation sandbox configurations
├── Document              # Clinical SOPs and policy guidelines
├── DocumentChunk         # Text chunks with 768-dim vector embeddings
├── Recommendation        # Generated operational shifts pending review
├── RecommendationReview  # Human-in-the-loop sign-off audit records
├── Alert                 # Active threshold breaches and severity alerts
└── AuditLog              # Cryptographic SHA-256 immutable event trail
```

---

## 🚀 Quick Start

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher
* *(Optional for backend)*: Docker & PostgreSQL 16 with `pgvector`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/dakshgupta-26/IntelliCare.git
cd IntelliCare
npm install
```

### 2. Configure Environment Variables
Create `.env` in the root directory:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/intellicare?schema=public"
JWT_SECRET="intellicare_super_secret_enterprise_key_2026"
VITE_API_URL="http://localhost:5000"
VITE_WS_URL="ws://localhost:5000/ws"
```

### 3. Launch the Application
```bash
# Run the complete frontend application
npm run dev
```

Visit **`http://localhost:5173`** in your browser:
* **Marketing & Architecture Overview**: `/`, `/platform`, `/intelligence`, `/optimization`, `/scenarios`, `/architecture`, `/technology`
* **Direct Workspace Command Center**: `/app/dashboard`
* **One-Click Role Switcher**: Click the persona badge in the top header or press <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>Cmd</kbd> + <kbd>K</kbd>.

### 4. Build for Production
```bash
npm run build
```

---

## 🧭 Application Routes

```
/                             # Editorial Marketing & 3D Digital Twin Platform
/platform                     # Platform Architecture Deep Dive
/intelligence                 # Neural Forecasting & Time-Series Engine
/optimization                 # Operations Research & MILP Solver Breakdown
/scenarios                    # What-If Crisis Sandbox Simulation
/architecture                 # Enterprise Distributed System Blueprint
/technology                   # Complete Tech Stack & Security Specs
/login                        # Authenticated Login with 1-Click Personas
/app/dashboard                # Realtime Command Center & 5 Core KPIs
/app/resources                # Resource Inventory, Bed Census & Data Table
/app/forecasting              # Multi-Horizon Neural Forecasting (LSTM vs XGBoost)
/app/optimization             # Interactive MILP Solver & Multi-Objective Weights
/app/scenarios                # Interactive What-If Crisis Sandbox
/app/knowledge                # Clinical SOP Library & Policy Viewer
/app/knowledge/assistant      # Hybrid RAG AI Assistant with Citations
/app/recommendations          # Human-in-the-Loop Review Center (Approve/Reject)
/app/analytics                # Retrospective Trends & Solver Impact Metrics
/app/alerts                   # Real-Time Triage Alert & Threshold Center
/app/activity                 # Cryptographic SHA-256 Immutable Audit Ledger
/app/settings                 # System Parameters, Thresholds & Preferences
/app/profile                  # User Identity, RBAC Permissions & Credentials
/admin                        # Organization Governance & User Provisioning
```

---

## 🛡️ Security, Privacy & HIPAA Compliance

* **Data Minimization**: IntelliCare processes aggregate census, acuity metrics, and operational flow without storing direct Patient Health Information (PHI) in optimization models.
* **Transport & Rest Encryption**: Enforced TLS 1.3 for all HTTP and WebSocket connections; AES-256 encryption at rest for databases and backups.
* **Zero Trust RBAC**: Granular role-level permissions validated at both API Gateway and client UI tiers.
* **Audit Non-Repudiation**: SHA-256 signed audit ledgers guarantee accountability for all operational modifications.

---

## 📄 License & Attribution

Distributed under the **Apache License 2.0**. See `LICENSE` for more information.

<div align="center">
  <sub>Built for Hospital Operations & Clinical Logistics Teams. Designed with precision.</sub>
</div>

---

## Local development without team credentials (DEV mode)

The auth server can run entirely locally, with no MongoDB Atlas, Mailjet or Google credentials:

```bash
brew services start mongodb-community     # or any MongoDB on 127.0.0.1:27017
cd server && npm install && npm run dev:local
```

`dev:local` loads `server/.env.dev` (`APP_ENV=dev`). It uses the local `intellicare_dev` database, placeholder JWT and cookie secrets, and prints verification codes and reset links to the server console instead of emailing them. Google OAuth is disabled. The server refuses to start in this mode with `NODE_ENV=production`. On first start it seeds five accounts, all with the password `IntelliCare@2026!`:

| Email | Role |
|---|---|
| sarah.chen@intellicare.health | Hospital admin |
| alex.ross@intellicare.health | Super admin |
| marcus.vance@intellicare.health | Department manager |
| elena.rostova@intellicare.health | Operations coordinator |
| david.kim@intellicare.health | Authorized staff |

The normal `npm run dev` with your own `server/.env` is unchanged.

---

## Running the ML & optimization service

The forecasting, appointment, optimization, scenario and RAG pages are powered by a Python service in [`ml-service/`](ml-service/README.md):

```bash
cd ml-service && uv sync && uv run python train.py && uv run uvicorn app.main:app --port 8000
```

Then `npm run dev` from the repo root. See [`ml-service/README.md`](ml-service/README.md) for details and model results.
