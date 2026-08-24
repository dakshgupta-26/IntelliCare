import { ContextScope, CardData, DocumentCitation, ThinkingStage } from '../types/copilot';
import { KNOWLEDGE_CITATIONS_DATABASE } from '../data/copilotKnowledge';

export interface CopilotEngineResult {
  text: string;
  thinkingStages: ThinkingStage[];
  cards?: CardData[];
  citations?: DocumentCitation[];
  suggestedFollowUps: string[];
  actionTrigger?: {
    type: 'TOUR' | 'NAVIGATE' | 'SPOTLIGHT';
    target?: string;
  };
}

export function generateCopilotAnswer(prompt: string, context: ContextScope): CopilotEngineResult {
  const p = prompt.toLowerCase().trim();

  // 1. Tour / Walkthrough Request
  if (p.includes('tour') || p.startsWith('/tour') || p.includes('guide me') || p.includes('walkthrough')) {
    return {
      text: `### 🌟 Welcome to the Interactive IntelliCare Guided Tour!

I will guide you through the core modules of the IntelliCare platform, highlighting our **Continuous 4-Stage Operational Intelligence Pipeline**:

1. **The Healthcare Capacity Bottleneck**: Understanding the operational crisis.
2. **End-to-End Pipeline**: How raw telemetry transforms into clinical decisions.
3. **Time-Series Forecasting**: Recurrent neural networks (LSTM) predicting patient surges.
4. **MILP Optimization**: Exact mathematical solver (Google OR-Tools) balancing beds & staff in under 100ms.
5. **Contextual RAG Core**: Grounding every automated recommendation in verified hospital SOPs.
6. **Scenario Simulator**: Real-time stress-testing under mass casualty and epidemic surge conditions.

*Click "Next" in the floating tour banner below or let me guide you to any specific section at any time!*`,
      thinkingStages: ['SYNTHESIS'],
      suggestedFollowUps: [
        'How does the LSTM forecast compare to XGBoost?',
        'Explain the MILP mathematical objective function',
        'Show system architecture dataflow'
      ],
      actionTrigger: {
        type: 'TOUR',
        target: 'problem'
      }
    };
  }

  // 2. Navigation / Section Spotlight Requests
  if (p.includes('take me to') || p.includes('show section') || p.includes('go to')) {
    if (p.includes('forecasting') || p.includes('intelligence')) {
      return {
        text: `Navigating you directly to the **Predictive Time-Series Intelligence** section. Here you can interact with multi-step LSTM horizons and 95% confidence intervals.`,
        thinkingStages: ['SYNTHESIS'],
        suggestedFollowUps: ['How does LSTM handle seasonality?', 'Explain MILP optimization'],
        actionTrigger: { type: 'SPOTLIGHT', target: 'intelligence' }
      };
    }
    if (p.includes('optimization') || p.includes('solver') || p.includes('milp')) {
      return {
        text: `Highlighting the **Mixed-Integer Linear Programming (MILP) Solver** section. The system guarantees zero statutory violations while minimizing staff overtime.`,
        thinkingStages: ['OPTIMIZATION', 'SYNTHESIS'],
        suggestedFollowUps: ['What solver do you use?', 'Show SOP staffing constraints'],
        actionTrigger: { type: 'SPOTLIGHT', target: 'optimization' }
      };
    }
    if (p.includes('rag') || p.includes('knowledge') || p.includes('sop')) {
      return {
        text: `Highlighting the **Contextual RAG & Decision Grounding** section. Discover how dense vector search + BM25 retrieve verified hospital SOPs.`,
        thinkingStages: ['RAG_RETRIEVAL', 'SYNTHESIS'],
        suggestedFollowUps: ['What is the ICU staffing ratio?', 'Show emergency escalation triggers'],
        actionTrigger: { type: 'SPOTLIGHT', target: 'rag' }
      };
    }
    if (p.includes('architecture') || p.includes('microservice')) {
      return {
        text: `Navigating to the **Enterprise Microservice Architecture** view. Review the Kafka stream, NestJS gateway, Python solver nodes, and Redis state sync.`,
        thinkingStages: ['SYNTHESIS'],
        suggestedFollowUps: ['What database is used for vectors?', 'How are WebSockets handled?'],
        actionTrigger: { type: 'NAVIGATE', target: '/architecture' }
      };
    }
    if (p.includes('scenario') || p.includes('what-if') || p.includes('simulator')) {
      return {
        text: `Bringing you to the **What-If Scenario Sandbox**. Adjust admission surge multipliers and test hospital resilience dynamically.`,
        thinkingStages: ['SYNTHESIS'],
        suggestedFollowUps: ['Simulate mass casualty surge', 'How fast does the solver react?'],
        actionTrigger: { type: 'SPOTLIGHT', target: 'scenarios' }
      };
    }
  }

  // 3. Forecasting & Predictive Intelligence
  if (p.includes('forecast') || p.includes('lstm') || p.includes('xgboost') || p.includes('time-series') || p.includes('prediction') || p.startsWith('/forecast')) {
    return {
      text: `### 📈 Predictive Demand Forecasting Engine

IntelliCare deploys a dual-model architecture to project hospital patient presentation rates across multiple temporal horizons (**6h, 12h, 24h, 72h**).

#### Model Architecture Comparison:
* **Stacked LSTM Neural Network (Primary)**:
  * Captures non-linear recurrent temporal dependencies and multi-day cyclic diurnal patterns.
  * Utilizes learned embeddings for day-of-week, statutory holidays, and local meteorological features.
  * Outputs asymmetric **95% Confidence Intervals (CI)** via quantile loss estimation ($Q_{0.025}, Q_{0.5}, Q_{0.975}$).
* **XGBoost Regressor (Benchmark)**:
  * Gradient-boosted decision trees trained on rolling lag aggregates ($t-1, t-3, t-24$).
  * Fast inference ($\approx 4\\text{ms}$) acting as an ensemble validator and baseline comparison.

#### Current Forecast Horizon (${context.department}):
* **Projected Peak**: 18:00 – 22:00 (Expected Census: **29 beds** / 90.6% utilization).
* **Mean Absolute Percentage Error (MAPE)**: **4.2%** on 24-hour holdout test set.
* **Proactive Horizon**: Gives floor coordinators a **6-hour proactive window** to reallocate nursing staff before emergency triage bottlenecks occur.`,
      thinkingStages: ['TELEMETRY', 'SYNTHESIS'],
      cards: [
        {
          type: 'forecast',
          title: 'ICU & ED Patient Presentation Forecast (24h)',
          subtitle: 'Stacked LSTM vs XGBoost Baseline with 95% Confidence Interval',
          meta: {
            currentCensus: 24,
            projectedPeak: 29,
            peakTime: '20:00',
            confidenceBand: '±1.8 beds',
            modelMape: '4.2%'
          }
        }
      ],
      citations: [KNOWLEDGE_CITATIONS_DATABASE['sop-icu']],
      suggestedFollowUps: [
        'Why does the forecast predict a spike at 18:00?',
        'How does MILP optimization respond to this spike?',
        'Compare LSTM vs XGBoost accuracy metrics'
      ]
    };
  }

  // 4. Optimization & Mixed-Integer Linear Programming (MILP)
  if (p.includes('optimization') || p.includes('milp') || p.includes('solver') || p.includes('or-tools') || p.includes('allocate') || p.includes('resource') || p.startsWith('/optimization')) {
    return {
      text: `### ⚙️ Mixed-Integer Linear Programming (MILP) Formulation

IntelliCare uses **Google OR-Tools (CBC/SCIP branch-and-bound solver)** to formulate hospital resource allocation as an exact constrained mathematical optimization problem.

#### Mathematical Objective Function:
$$\\min \\quad \\sum_{t \\in T} \\left( w_1 \\cdot \\text{UnmetDemand}_t + w_2 \\cdot \\text{OvertimeHours}_t + w_3 \\cdot \\text{ElectivePostponements}_t + w_4 \\cdot \\text{TransferCost}_t \\right)$$

#### Strict Constraints Enforced:
1. **Statutory Acuity Ratios**:
   $$\\text{Nurses}_{\\text{ICU}}(t) \\ge \\max\\left(1.0 \\cdot \\text{VentilatedPatients}(t), \\; 0.5 \\cdot \\text{TotalICU}(t)\\right)$$
2. **Physical Capacity Upper Bounds**:
   $$\\text{OccupiedBeds}_d(t) \\le \\text{Capacity}_d, \\quad \\forall d \\in \\text{Departments}$$
3. **Fatigue Management Limits**:
   $$\\text{ConsecutiveShiftHours}(n) \\le 12, \\quad \\text{RestInterval}(n) \\ge 10\\text{h}$$

#### Current Solver Execution:
* **Solver Runtime**: **84ms** to reach global optimality.
* **Decision Result**: Dispatched **4 Floater Nurses** from Ward 4 to ICU to accommodate the projected 18:00 surge with **0 statutory violations** and **$0 agency locum fees**.`,
      thinkingStages: ['TELEMETRY', 'OPTIMIZATION', 'SYNTHESIS'],
      cards: [
        {
          type: 'optimization',
          title: 'MILP Resource Reallocation Matrix',
          subtitle: 'Google OR-Tools global optimal solution computed in 84ms',
          data: {
            transfers: [
              { from: 'Ward 4 Floater Pool', to: 'ICU High Acuity', count: 4, unit: 'Nurses', costDelta: '-$3,200 (No Overtime)' },
              { from: 'Step-Down Reserve', to: 'Emergency Zone Yellow', count: 6, unit: 'Beds', costDelta: 'Zero Capital' }
            ],
            constraintsSatisfied: 18,
            statutoryViolations: 0,
            solverTimeMs: 84
          }
        }
      ],
      citations: [KNOWLEDGE_CITATIONS_DATABASE['sop-icu'], KNOWLEDGE_CITATIONS_DATABASE['sop-staff']],
      suggestedFollowUps: [
        'How are nurse fatigue constraints defined?',
        'What happens if elective surgeries need rescheduling?',
        'Show RAG SOP for ICU nurse staffing'
      ]
    };
  }

  // 5. Hybrid RAG & SOP Grounding
  if (p.includes('rag') || p.includes('sop') || p.includes('grounding') || p.includes('vector') || p.includes('citation') || p.includes('policy') || p.startsWith('/rag')) {
    return {
      text: `### 📚 Hybrid Contextual RAG Architecture

IntelliCare grounds all automated decision recommendations in institutional Standard Operating Procedures (SOPs), clinical staffing mandates, and regional health authority guidelines.

#### Dual-Stage Retrieval Pipeline:
1. **Dense Vector Semantic Search**:
   * Text chunks embedded via high-dimensional models (1536-dim) stored in **PostgreSQL with \`pgvector\`** with HNSW indexing.
   * Calculates cosine distance: $\\text{sim}(q, d) = \\frac{q \\cdot d}{\\|q\\| \\|d\\|}$.
2. **BM25 Sparse Keyword Matching**:
   * Exact matching on clinical terminology, procedure codes (e.g. \`SOP-ICU-2024.3\`, \`ED-ESC-09\`), and acronyms.
3. **Cross-Encoder Re-ranking**:
   * Merges vector and sparse scores to generate high-confidence context snippets delivered to the LLM prompt.

#### Grounded Protocol Active in Current Context:
* **Protocol**: **SOP-ICU-2024.3 Section 2.1** — *Mechanical Ventilation & 1:1 Mandatory Ratio*.
* **Protocol**: **ED-ESC-09 Level 2** — *Emergency Department Overflow Escalation Protocol*.
* **Confidence Score**: **96.4% retrieval grounding**.`,
      thinkingStages: ['RAG_RETRIEVAL', 'SYNTHESIS'],
      citations: [
        KNOWLEDGE_CITATIONS_DATABASE['sop-icu'],
        KNOWLEDGE_CITATIONS_DATABASE['sop-er'],
        KNOWLEDGE_CITATIONS_DATABASE['sop-surg']
      ],
      suggestedFollowUps: [
        'What triggers Level 2 Emergency Escalation?',
        'How does RAG prevent AI hallucinations in clinical ops?',
        'Explain the mathematical formulation'
      ]
    };
  }

  // 6. System Architecture & Tech Stack
  if (p.includes('architecture') || p.includes('tech stack') || p.includes('microservice') || p.includes('backend') || p.includes('database') || p.includes('kafka') || p.startsWith('/architecture') || p.startsWith('/algorithms')) {
    return {
      text: `### 🏛️ Enterprise Microservice & Data Architecture

IntelliCare is built for sub-second, mission-critical healthcare operational reliability:

\`\`\`
[ Hospital EHR / FHIR Feeds / IoT Telemetry ]
                     │
                     ▼
          [ Apache Kafka Event Bus ]
                     │
                     ▼
     [ NestJS / Node API Gateway (Port 5000) ]
        ├── WebSocket Live Event Broadcast (ws://)
        ├── Redis Sub-ms Cache (Telemetry & State)
        └── PostgreSQL + pgvector (ACID & Embeddings)
                     │ (gRPC / REST)
                     ▼
      [ Python High-Performance Worker Nodes ]
        ├── PyTorch Stacked LSTM (Demand Forecasting)
        ├── XGBoost Regressor (Feature Importance & Benchmark)
        └── Google OR-Tools (MILP Exact Solver)
                     │
                     ▼
      [ React 18 + Vite + Three.js Command Center ]
\`\`\`

#### Key Technical Highlights:
* **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, GSAP, Lenis smooth scrolling, Three.js WebGL procedural network.
* **API & Gateway**: NestJS & Express, JWT-based RBAC, Helmet security headers, WebSocket telemetry stream.
* **Math & AI Core**: PyTorch LSTM, Google OR-Tools CBC/SCIP solver, pgvector semantic retrieval.
* **Resilience**: Caching layer handles 10,000+ telemetry heartbeats/sec with sub-millisecond read latency.`,
      thinkingStages: ['SYNTHESIS'],

      cards: [
        {
          type: 'architecture',
          title: 'IntelliCare End-to-End System Dataflow',
          subtitle: 'Event bus, ML inference pipeline, MILP solver, and real-time UI'
        },
        {
          type: 'algorithm',
          title: 'Algorithmic Foundation',
          subtitle: 'Mathematical properties and runtime characteristics'
        }
      ],
      suggestedFollowUps: [
        'How does the system maintain HIPAA/FHIR compliance?',
        'What is the solver latency under 1,000-bed scale?',
        'Start guided website tour'
      ]
    };
  }

  // 7. What-If Scenario Simulations
  if (p.includes('scenario') || p.includes('simulate') || p.includes('what if') || p.includes('surge') || p.includes('mass casualty') || p.startsWith('/scenario')) {
    return {
      text: `### 🧪 Dynamic What-If Capacity Simulation

The IntelliCare Scenario Simulation Engine allows clinical directors and hospital administrators to evaluate stress scenarios before real-world disruptions strike.

#### Configured Simulation Parameters:
* **Scenario Type**: Multi-Vehicle Highway Collision (Mass Casualty Incident).
* **Admission Surge Factor**: **+35% Emergent Trauma Influx** over 4 hours.
* **Staff Absenteeism**: 10% baseline winter surge absence.
* **ICU Baseline Headroom**: 6 unoccupied critical care beds.

#### Automated Reallocation Response:
1. **Fast-Track Step-Down**: 3 stable post-op patients transferred to Step-Down Unit B (NEWS2 score $\\le 2$).
2. **Elective Surgery Preservation**: Non-emergent orthopedic procedures delayed by 2 hours; 0 cancellations required.
3. **Staff Mobilization**: Triggered on-call CCRN floater roster with **12-minute mobilization alert**.
4. **Estimated Bottleneck Avoidance**: **142 patient-hours of emergency wait time saved**.`,
      thinkingStages: ['TELEMETRY', 'OPTIMIZATION', 'SYNTHESIS'],
      cards: [
        {
          type: 'recommendation',
          title: 'Mass Casualty Level 2 Mitigation Protocol',
          subtitle: 'Generated proactive action plan to maintain 100% statutory ratio compliance',
          data: {
            impactMetrics: [
              { label: 'ED Wait Time Reduction', value: '-48 mins' },
              { label: 'ICU Capacity Protected', value: '100%' },
              { label: 'Statutory Violations', value: '0' }
            ]
          }
        }
      ],
      citations: [KNOWLEDGE_CITATIONS_DATABASE['sop-er'], KNOWLEDGE_CITATIONS_DATABASE['sop-surg']],
      suggestedFollowUps: [
        'How do I test a viral epidemic surge scenario?',
        'Can I export this simulation as a PDF report?',
        'Explain the mathematical optimization model'
      ]
    };
  }

  // 8. Alerts & Clinical Escalations
  if (p.includes('alert') || p.includes('escalat') || p.includes('emergency') || p.startsWith('/alerts')) {
    return {
      text: `### 🚨 Active Operational Alerts & Escalation Summary

Current telemetry indicates high acuity across 2 departments at **IntelliCare Metropolitan Medical Center**:

| Severity | Department | Trigger Condition | Recommended Proactive Action |
| :--- | :--- | :--- | :--- |
| 🔴 **CRITICAL** | **Emergency (ED-TRAUMA)** | Census at **93.8%** (>92% Level 2 threshold) | Mobilize 4 Floater Nurses; Open 6 Zone Blue Surge Bays |
| 🟡 **WARNING** | **ICU (CCU-NORTH)** | Projected 90.6% occupancy at 18:00 | Reallocate 4 CCRN nurses from Ward 4 floater pool |
| 🟢 **NOMINAL** | **Surgical Suite (OR)** | 7/8 Theaters in active session | Schedule on track; zero surgical delays |

*All actions have been validated against hospital SOPs and MILP constraints for human-in-the-loop sign-off.*`,
      thinkingStages: ['TELEMETRY', 'RAG_RETRIEVAL', 'SYNTHESIS'],
      citations: [KNOWLEDGE_CITATIONS_DATABASE['sop-er']],
      suggestedFollowUps: [
        'Approve floater nurse transfer',
        'Show ICU demand forecast for next 12 hours',
        'Explain ED overflow escalation protocol'
      ]
    };
  }

  // 9. Current Resource Utilization / Telemetry
  if (p.includes('resource') || p.includes('bed') || p.includes('utilization') || p.includes('telemetry') || p.startsWith('/resources')) {
    return {
      text: `### 📊 Real-Time Hospital Telemetry Overview

* **Hospital**: **IntelliCare Metropolitan Medical Center** (Demo Tier 1 Trauma Center)
* **Total Licensed Beds**: **240** | **Occupied Beds**: **212** (**88.3% System Utilization**)
* **Active Intensive Care Beds**: **24 / 28 Occupied (85.7%)**
* **Mechanical Ventilators**: **19 / 24 Active (79.2%)**
* **Registered Nurse On-Duty Ratio**: **91.2% optimal coverage**

#### Departmental Acuity Breakdown:
1. **Emergency & Trauma**: 93.8% occupancy (Surge protocol active).
2. **ICU (Critical Care)**: 85.7% occupancy (Projected 90.6% at 18:00 peak).
3. **General Medicine Wards 1-4**: 86.5% occupancy (Stable buffer).
4. **Pediatric Intensive Care**: 68.2% occupancy (Nominal).`,
      thinkingStages: ['TELEMETRY', 'SYNTHESIS'],
      suggestedFollowUps: [
        'Why is ICU occupancy projected to increase?',
        'What recommendations exist for Emergency?',
        'How does MILP optimization balance nurse staffing?'
      ]
    };
  }

  // 10. Default / Comprehensive Overview
  return {
    text: `### 🏥 IntelliCare AI Copilot — Hospital Operations Intelligence

I am your proactive clinical operations and resource allocation copilot for **IntelliCare**.

#### What I Can Help You With:
1. **📈 Demand Forecasting**: Explain multi-horizon LSTM and XGBoost predictions, confidence bands, and presentation spikes.
2. **⚙️ MILP Optimization**: Walk through exact Google OR-Tools mathematical formulations, constraints, and nurse reallocation decisions.
3. **📚 Hybrid RAG Grounding**: Query verified clinical Standard Operating Procedures (SOPs), nurse-to-patient statutory ratios, and emergency escalation policies.
4. **🧪 What-If Scenarios**: Simulate mass casualty surges, epidemic waves, and staff shortage stress tests.
5. **🏛️ System Architecture**: Inspect microservices, Kafka pipelines, pgvector embeddings, and real-time WebSocket streams.
6. **🌟 Interactive Tour**: Launch a guided spotlight tour of the entire IntelliCare platform.

*Try asking a question or typing \`/\` to select from quick operational commands.*`,
    thinkingStages: ['SYNTHESIS'],
    suggestedFollowUps: [
      'Explain IntelliCare overview and novelty',
      'How does forecasting predict ICU surges?',
      'Show MILP mathematical solver formulation',
      'Give me a guided platform tour'
    ]
  };
}
