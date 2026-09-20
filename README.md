<div align="center">

# 🏥 IntelliCare

### AI-Driven Hospital Decision-Support: Demand Forecasting, Resource Optimization and Dynamic Appointment Scheduling

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.14_LSTM-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![OR-Tools](https://img.shields.io/badge/Google_OR--Tools-MILP_%2B_CP--SAT-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com/optimization)
[![MongoDB](https://img.shields.io/badge/MongoDB-Auth_Store-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**Observe → Predict → Optimize → Explain → Simulate → Decide**

Final year project · BE-A33 · Department of Computer Engineering, Vishwakarma Institute of Technology

</div>

---

## What this is

Hospital systems mostly record what already happened. IntelliCare forecasts what is about to happen, computes the resource allocation that best absorbs it, explains every recommendation against hospital policy, and leaves the final decision to a human.

The pipeline is end-to-end and real: models are trained from data by `train.py`, the optimizer is a genuine mathematical solver, and the dashboard reads live model output over HTTP.

> **Clinical boundary.** IntelliCare is an **operational** decision-support system for beds, staff, equipment and appointments. It does not diagnose, triage clinically, or recommend treatment. Every resource change is a recommendation that requires human approval.

---

## The six engines

| # | Engine | What it does | Implementation |
|---|---|---|---|
| 1 | **Demand forecasting** | Predicts ICU / ward / emergency bed demand 2, 6, 12 and 24 h ahead with 95% intervals | 2-layer LSTM (PyTorch) + XGBoost, one direct model per horizon, compared against a persistence baseline |
| 2 | **Appointment analytics** | Predicts patient no-show risk and consultation length | Random Forest vs XGBoost classifier; XGBoost regressor; demographic-parity fairness audit |
| 3 | **Resource optimization** | Turns forecast demand into actions: open surge beds, move float nurses, approve overtime, assign ventilators | Mixed-Integer Linear Program, OR-Tools SCIP, multi-objective with configurable weights |
| 4 | **Appointment scheduling** | Conflict-free schedule from predicted durations, with no-show-aware overbooking | OR-Tools CP-SAT: per-doctor no-overlap, per-department room capacity, minimal-disruption rescheduling |
| 5 | **Policy grounding (RAG)** | Cites the SOP behind every recommendation and answers policy questions | TF-IDF vector index over 7 hospital SOPs; optional LLM synthesis; extractive fallback |
| 6 | **Scenario simulation** | Stress-tests mass casualty, viral surge, staff shortage and ICU outage without touching live data | Re-forecast → re-optimize → baseline vs scenario deltas and bottleneck timing |

Every solver has a **deterministic fallback**: if the MILP, CP-SAT or LLM fails, priority rules take over so the system still answers.

---

## Results on held-out data

Regenerate with `cd ml-service && uv run python train.py`; the full report is [`ml-service/reports/metrics.md`](ml-service/reports/metrics.md).

**Forecasting** — mean absolute error in beds, on the last 60 days, never seen in training:

| Unit | Model | +2 h | +6 h | +12 h | +24 h |
|---|---|---|---|---|---|
| ICU (123 beds) | XGBoost | **1.82** | **2.81** | **3.36** | **3.50** |
| | LSTM | 3.03 | 3.25 | 3.38 | 3.64 |
| | Persistence baseline | 2.22 | 4.58 | 6.33 | 5.11 |
| General ward (1,323) | XGBoost | **20.36** | **31.38** | 38.17 | **39.94** |
| | LSTM | 35.59 | 37.91 | **37.74** | 42.77 |
| | Persistence baseline | 36.07 | 88.93 | 125.44 | 102.07 |
| Emergency (92) | XGBoost | **1.47** | **2.18** | 2.73 | 2.99 |
| | LSTM | 2.27 | 2.42 | **2.72** | **2.92** |
| | Persistence baseline | 6.81 | 18.26 | 25.95 | 5.43 |

Overall MAPE is 1.9–5.3%. Both models beat the naive baseline everywhere except ICU at +2 h, where the LSTM (3.03) trails persistence (2.22): at very short horizons occupancy barely moves, so "no change" is hard to beat. XGBoost dominates short horizons; the LSTM catches up at 12–24 h and wins for emergency.

**Appointments** — 20% stratified hold-out of 40,000 bookings:

| Task | Model | Result |
|---|---|---|
| No-show | Random Forest *(selected)* | ROC-AUC **0.674**, accuracy 0.753, recall 0.389 |
| | XGBoost | ROC-AUC 0.673 |
| Consultation duration | XGBoost *(selected)* | MAE **2.84 min**, R² 0.666 |
| | Fixed slot per department (baseline) | MAE 4.40 min, R² 0.284 |

Top no-show drivers: prior no-show rate (0.24), booking lead time (0.17), distance (0.13), SMS reminder (0.10).

**Fairness audit** — high-risk flag rates must not differ across protected groups (limit 5 points):

| Attribute | Parity gap | Verdict |
|---|---|---|
| Gender | 0.3 points | pass |
| Age band | 2.5 points | pass |
| *(If age were used as a feature)* | *15.4 points* | *rejected: +0.009 AUC is not worth the bias* |

Age and gender are excluded from the model inputs by design; they are used only to audit it.

---

## Data provenance

Hourly, patient-level hospital data is not publicly available (patient privacy), so demand and appointment records are **synthetic**, produced by `ml-service/app/data_gen.py` with realistic structure: daily and weekly cycles, winter surges, random mass-arrival events, and behavioural no-show drivers. The models never see the generating formulas.

**Capacity is calibrated to Government of India open data**, so the simulated facility is a real hospital's size:

| Figure | Value | Source |
|---|---|---|
| Total beds | 1,538 | Dr. Ram Manohar Lohia Hospital, New Delhi — National Health Profile 2023, via data.gov.in |
| Peer hospitals | Safdarjung 2,995 · Lady Hardinge 1,800 | same table |
| National context | 41,245 government hospitals, 825,234 beds | NHP 2021 state/UT table, data.gov.in |

Unit mix (8% ICU / 6% emergency), nurse establishment and surge pools are **our documented assumptions**, since per-hospital breakdowns are not published. Details and the plan for training on real HMIS district data: [`ml-service/README.md`](ml-service/README.md#data-provenance).

---

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│  React 18 + TypeScript + Vite + Tailwind + Recharts        │
│  Marketing site · Auth · Decision-support workspace         │
└───────────────┬───────────────────────┬────────────────────┘
                │ /auth, /api           │ VITE_ML_API_URL
                ▼                       ▼
┌───────────────────────────┐  ┌────────────────────────────────────┐
│ Node + Express (port 5000)│  │ Python + FastAPI (port 8000)       │
│ JWT access/refresh, RBAC, │  │ ┌────────────────────────────────┐ │
│ sessions, OTP email,      │  │ │ Forecasting   LSTM + XGBoost   │ │
│ staff provisioning, audit │  │ │ Appointments  RF + XGBoost     │ │
│            │              │  │ │ Optimization  MILP + CP-SAT    │ │
│            ▼              │  │ │ RAG           TF-IDF over SOPs │ │
│      MongoDB (users,      │  │ │ Scenarios     re-forecast      │ │
│      sessions, audit)     │  │ └────────────────────────────────┘ │
└───────────────────────────┘  │ artifacts/ trained models          │
                               │ data/sops/ policy corpus           │
                               └────────────────────────────────────┘
```

---

## Quick start

**Prerequisites:** Node 18+, [uv](https://docs.astral.sh/uv/), MongoDB running locally (`brew services start mongodb-community`). On macOS, XGBoost needs OpenMP: `brew install libomp`.

```bash
# 1. ML service — trains all models on first run (~3 min), then serves them
cd ml-service && uv sync && uv run python train.py
uv run uvicorn app.main:app --port 8000

# 2. Auth server — local DEV mode, no team credentials needed
cd server && npm install && npm run dev:local

# 3. Frontend
npm install && npm run dev        # http://localhost:3000
```

Sign in with a seeded account, password `IntelliCare@2026!`:

| Email | Role |
|---|---|
| sarah.chen@intellicare.health | Hospital admin |
| alex.ross@intellicare.health | Super admin |
| marcus.vance@intellicare.health | Department manager |
| elena.rostova@intellicare.health | Operations coordinator |
| david.kim@intellicare.health | Authorized staff |

`npm run dev:local` prints email verification codes and reset links to its console instead of sending email, and refuses to run in production. Teams with MongoDB Atlas credentials use the normal `npm run dev` with `server/.env`.

API docs (Swagger): http://localhost:8000/docs

---

## Application routes

| Route | What it shows | Data source |
|---|---|---|
| `/app/forecasting` | LSTM vs XGBoost forecasts, confidence bands, accuracy table | ML service |
| `/app/appointments` | Doctor schedules, wait-time metrics, rescheduling, no-show predictor | ML service |
| `/app/optimization` | MILP solver, objective weights, allocation and actions | ML service |
| `/app/scenarios` | Crisis presets, bottleneck timing, mitigation plan | ML service |
| `/app/recommendations` | Human-in-the-loop approve / modify / reject + audit log | ML service |
| `/app/knowledge`, `/app/knowledge/assistant` | SOP library and grounded policy assistant | ML service |
| `/app/models` | Model accuracy and fairness report | ML service |
| `/app/dashboard`, `/app/resources`, `/app/analytics`, `/app/alerts`, `/app/activity` | Operations overview | **demo data (not yet wired)** |
| `/`, `/platform`, `/intelligence`, `/optimization`, `/scenarios`, `/architecture`, `/technology` | Marketing and architecture pages | static |

---

## Governance, safety and ethics

- **Human-in-the-loop.** Recommendations are advisory; an administrator approves, modifies or rejects each one and every decision is logged with actor, timestamp and before/after quantity.
- **Emergency override.** Emergency patients bypass the queue entirely and are seen by the first free doctor; the rest of the day is then re-optimized around them (SOP-EMG-06).
- **Fail-safe fallbacks.** Solver or LLM failure degrades to deterministic priority rules rather than stopping.
- **Algorithmic fairness.** No-show predictions exclude age and gender and are audited for demographic parity on every training run.
- **Policy grounding.** Every recommendation cites the SOP clause that justifies it.
- **RBAC.** Five roles across the workspace, enforced by the auth server for account and staff operations.

---

## Limitations (current state)

Being explicit about what is not done yet:

- Demand and appointment data are synthetic; only capacity figures come from real open data.
- ML service state (recommendations, approvals, audit log, clinic day) is in memory and resets when the service restarts.
- Dashboard, Resources, Analytics, Alerts and Activity still show demo data.
- Settings pages are UI only; they do not yet change solver or forecast parameters.
- The ML service has no authentication of its own, so role checks do not yet gate optimizer actions.
- Not containerized or deployed; everything runs locally.
- `prisma/schema.prisma` is a legacy design artifact from an earlier PostgreSQL plan and is not used.

## Roadmap

1. Wire the dashboard and activity pages to real model output.
2. Persist recommendations, approvals and the audit trail in MongoDB.
3. A second forecasting model trained on real HMIS district data, and the Kaggle no-show dataset for appointment analytics.
4. Swap TF-IDF retrieval for dense vector embeddings (FAISS / Chroma).
5. Role enforcement on ML endpoints; containerization and deployment.

---

<div align="center">
<sub>BE-A33 · Aryan Pawar · Daksh Gupta · Tejas Lokhande · Ishika Jain — guided by Dr. Priyanka Amol Kadam</sub>
</div>
