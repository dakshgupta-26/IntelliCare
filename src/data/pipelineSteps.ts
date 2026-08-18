import { PipelineStep } from '../types/architecture';

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'step-observe',
    number: '01',
    label: 'OBSERVE',
    headline: 'Continuous Ingestion of Operational Hospital Signals',
    subhead: 'Real-time telemetry across EHR, triage feeds, bed management, and staffing registries.',
    description: 'IntelliCare connects to fragmented hospital data streams without disrupting clinical workflows. Ingests admission velocity, acuity indices, bed turnaround telemetry, and staff attendance logs via standard event queues.',
    inputs: ['EHR Admission Logs', 'ADT Bed Telemetry', 'Staff Shift Rotas', 'Triage Acuity Scores'],
    algorithms: ['Kafka Event Streaming', 'Schema Normalization', 'Missing Value Imputation'],
    outputs: ['Unified Operational Tensor', 'Cleaned Real-Time Telemetry Stream'],
    accentColor: '#0ea5e9',
    badge: 'Real-Time Ingestion'
  },
  {
    id: 'step-predict',
    number: '02',
    label: 'PREDICT',
    headline: 'Multi-Horizon Demand & Acuity Forecasting',
    subhead: 'Deep neural time-series forecasting capturing temporal seasonality and non-linear demand shifts.',
    description: 'Long Short-Term Memory (LSTM) recurrent networks coupled with gradient-boosted trees (XGBoost) predict emergency presentations, admission conversion rates, and department-level bed demand 2 to 48 hours into the future.',
    inputs: ['Historical Hourly Presentations', 'Weather & Regional Events', 'Seasonal Infection Waves', 'Day-of-Week Cycles'],
    algorithms: ['Stacked LSTM Network', 'XGBoost Baseline Regressor', 'Conformal Prediction Intervals (95% CI)'],
    outputs: ['Hourly Demand Forecast', 'Acuity Distribution Curve', 'Surge Spike Probability'],
    accentColor: '#06b6d4',
    badge: 'Neural Forecasting'
  },
  {
    id: 'step-optimize',
    number: '03',
    label: 'OPTIMIZE',
    headline: 'Constrained Mathematical Resource Allocation',
    subhead: 'MILP & Google OR-Tools solving multi-department scheduling and bed assignment constraints in milliseconds.',
    description: 'Translates projected demand into provably optimal staff allocations and bed assignments. Respects clinical nurse-to-patient mandatory ratios, overtime bounds, fatigue limits, and physical equipment availability.',
    inputs: ['Projected Hourly Demand', 'Available Staff Roster', 'Bed Capacities', 'Clinical Policy Constraints'],
    algorithms: ['Mixed-Integer Linear Programming (MILP)', 'Google OR-Tools Branch & Bound', 'Multi-Objective Pareto Optimization'],
    outputs: ['Staff Reallocation Plan', 'Bed Conversion Directives', 'Bottleneck Risk Mitigations'],
    accentColor: '#14b8a6',
    badge: 'Mathematical Optimization'
  },
  {
    id: 'step-explain',
    number: '04',
    label: 'EXPLAIN',
    headline: 'Contextual RAG & Operational Policy Grounding',
    subhead: 'Hybrid dense-sparse retrieval connecting recommendations to institutional SOPs and protocols.',
    description: 'Every recommendation is grounded in hospital policy. IntelliCare uses dense vector embeddings combined with BM25 sparse search across institutional SOPs to synthesize plain-English justifications with precise protocol citations.',
    inputs: ['Solver Recommendations', 'Hospital SOPs & Policies', 'Clinical Escalation Playbooks'],
    algorithms: ['Hybrid Vector Search (pgvector)', 'BM25 Keyword Retrieval', 'LLM Contextual Reasoning & Citation'],
    outputs: ['Plain-Language Decision Justification', 'SOP Section Citations', 'Confidence & Audit Trail'],
    accentColor: '#8b5cf6',
    badge: 'RAG & Contextual Intelligence'
  },
  {
    id: 'step-simulate',
    number: '05',
    label: 'SIMULATE',
    headline: 'What-If Dynamic Scenario Sandboxing',
    subhead: 'Interactive stress-testing of hospital capacity against emergency surges, outages, and mass casualties.',
    description: 'Operations teams and hospital leadership can simulate external shocks—such as a 30% sudden emergency surge, bed closures due to maintenance, or staff absenteeism—and evaluate system resiliency before real-world impact.',
    inputs: ['Shock Parameters (Demand, Beds, Staff)', 'Current Operational State', 'Policy Rule Sets'],
    algorithms: ['Discrete-Event Simulation (DES)', 'Monte Carlo Uncertainty Estimation', 'Elasticity Analysis'],
    outputs: ['Stress Test Scorecards', 'Breach Point Timelines', 'Preemptive Countermeasures'],
    accentColor: '#ec4899',
    badge: 'Scenario Simulation'
  },
  {
    id: 'step-decide',
    number: '06',
    label: 'DECIDE',
    headline: 'Human-in-the-Loop Clinical & Operational Governance',
    subhead: 'AI recommends, clinical supervisors and bed managers decide. Zero autonomous actions.',
    description: 'IntelliCare is strictly a decision-support system. Clinical coordinators review, adjust, approve, or reject proposed allocations with a single click, maintaining total human agency, ethical oversight, and complete auditability.',
    inputs: ['Generated Optimization Plan', 'Contextual Explanations', 'Scenario Projections'],
    algorithms: ['RBAC Approval State Machine', 'Immutable Audit Logging', 'Feedback Loop Re-weighting'],
    outputs: ['Authorized Allocation Action', 'Shift Handoff Briefing', 'Continuous Learning Feedback'],
    accentColor: '#10b981',
    badge: 'Human Oversight'
  }
];
