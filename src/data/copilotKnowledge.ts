import { DocumentCitation, SlashCommand, TourStep } from '../types/copilot';

export const COPILOT_SLASH_COMMANDS: SlashCommand[] = [
  {
    command: '/forecast',
    label: 'Forecast ICU & ED Demand',
    description: 'Analyze multi-horizon LSTM projections and surge probability',
    icon: 'TrendingUp',
    category: 'Intelligence',
    prompt: 'Provide a detailed breakdown of current ICU demand forecasting, comparing LSTM predictions with baseline and statutory capacity thresholds.'
  },
  {
    command: '/optimization',
    label: 'Explain MILP Optimization',
    description: 'Review branch-and-bound solver formulation, objective weights, and allocations',
    icon: 'Cpu',
    category: 'Intelligence',
    prompt: 'Explain how the Mixed-Integer Linear Programming (MILP) solver formulated and solved the current hospital resource reallocation.'
  },
  {
    command: '/rag',
    label: 'Search Hospital SOPs (RAG)',
    description: 'Query grounded institutional clinical protocols and escalation matrices',
    icon: 'BookOpen',
    category: 'Intelligence',
    prompt: 'Query the hybrid RAG database for current Emergency Department overflow escalation thresholds and mandatory nurse staffing ratios.'
  },
  {
    command: '/scenario',
    label: 'Simulate What-If Surge',
    description: 'Test hospital resilience against mass casualty or epidemic surge models',
    icon: 'Sliders',
    category: 'Operations',
    prompt: 'Run a what-if surge simulation scenario (+35% trauma intake) and explain the system response.'
  },
  {
    command: '/architecture',
    label: 'System Architecture Preview',
    description: 'Inspect event streaming pipeline, microservices, and database layers',
    icon: 'Layers',
    category: 'System',
    prompt: 'Show the complete IntelliCare end-to-end microservice architecture and data pipeline.'
  },
  {
    command: '/algorithms',
    label: 'Explore ML & OR Algorithms',
    description: 'Compare LSTM, XGBoost, MILP, pgvector RAG, and OR-Tools solvers',
    icon: 'Binary',
    category: 'System',
    prompt: 'Explain the mathematical formulations and algorithms powering IntelliCare.'
  },
  {
    command: '/tour',
    label: 'Start Guided Website Tour',
    description: 'Interactive walkthrough highlighting hero, forecasting, solver, RAG, and tech',
    icon: 'Compass',
    category: 'Navigation',
    prompt: 'Give me a complete guided tour of the IntelliCare platform.'
  },
  {
    command: '/resources',
    label: 'Inspect Bed & Staff Telemetry',
    description: 'Check active bed utilization, ventilator telemetry, and nurse ratios',
    icon: 'Activity',
    category: 'Operations',
    prompt: 'What is the current resource utilization across ICU, Emergency, and General Wards?'
  },
  {
    command: '/alerts',
    label: 'Active Clinical Escalations',
    description: 'View active high-acuity alerts, threshold breaches, and pending approvals',
    icon: 'AlertTriangle',
    category: 'Operations',
    prompt: 'Summarize all high-priority operational alerts and recommended actions.'
  },
  {
    command: '/help',
    label: 'Copilot Capabilities & Help',
    description: 'Learn how to use IntelliCare AI Copilot for operational decision support',
    icon: 'HelpCircle',
    category: 'Navigation',
    prompt: 'What capabilities and queries can you assist me with as the IntelliCare AI Copilot?'
  }
];

export const COPILOT_TOUR_STEPS: TourStep[] = [
  {
    targetId: 'problem',
    title: '1. The Healthcare Capacity Bottleneck',
    description: 'Hospitals experience severe capacity strain from static scheduling and disjointed data. IntelliCare bridges this with dynamic AI and Operations Research.',
    route: '/',
    placement: 'bottom',
    badge: 'Core Problem'
  },
  {
    targetId: 'product-flow',
    title: '2. Continuous 4-Stage Pipeline',
    description: 'Telemetry ingestion, recurrent time-series forecasting, exact mathematical optimization, and grounded clinical explanation.',
    route: '/',
    placement: 'top',
    badge: 'Pipeline Architecture'
  },
  {
    targetId: 'intelligence',
    title: '3. Predictive Time-Series Intelligence',
    description: 'Stacked LSTM neural networks predict patient presentation spikes 24–72 hours in advance with 95% confidence intervals.',
    route: '/',
    placement: 'top',
    badge: 'Forecasting Core'
  },
  {
    targetId: 'optimization',
    title: '4. Mixed-Integer Linear Programming (MILP)',
    description: 'Google OR-Tools optimizes bed reassignments and floater nurse dispatch in under 100ms while strictly enforcing statutory ratios.',
    route: '/',
    placement: 'top',
    badge: 'Solver Engine'
  },
  {
    targetId: 'rag',
    title: '5. Contextual RAG & SOP Grounding',
    description: 'Dense vector embeddings + BM25 sparse keyword ranking ground AI recommendations directly in verified hospital clinical SOPs.',
    route: '/',
    placement: 'top',
    badge: 'Clinical Grounding'
  },
  {
    targetId: 'scenarios',
    title: '6. What-If Scenario Sandbox',
    description: 'Hospital administrators can simulate mass casualties, viral surges, and supply bottlenecks with real-time solver reallocation.',
    route: '/',
    placement: 'top',
    badge: 'Simulation'
  },
  {
    targetId: 'architecture',
    title: '7. Enterprise Architecture',
    description: 'Event streaming with Kafka, NestJS API gateway, Python PyTorch/OR-Tools workers, Redis caching, and PostgreSQL/pgvector.',
    route: '/architecture',
    placement: 'top',
    badge: 'Microservices'
  }
];

export const KNOWLEDGE_CITATIONS_DATABASE: Record<string, DocumentCitation> = {
  'sop-icu': {
    documentId: 'doc-sop-icu-01',
    documentTitle: 'Intensive Care Unit Clinical Staffing & Acuity Protocol',
    documentCode: 'SOP-ICU-2024.3',
    section: 'Section 2.1: Mechanical Ventilation & 1:1 Mandatory Ratio',
    confidenceScore: 0.96,
    retrievalMethod: 'Dense Vector (Cosine Similarity)',
    matchedSnippet: 'Any patient receiving invasive mechanical ventilation requires a minimum 1:1 dedicated Registered Nurse (CCRN certified). Floor step-downs must be approved by the Attending Intensivist.'
  },
  'sop-er': {
    documentId: 'doc-sop-er-02',
    documentTitle: 'Emergency Department Overflow Escalation SOP',
    documentCode: 'ED-ESC-09',
    section: 'Section 2.1: Level 2 Action Matrix & Fast-Track Discharge',
    confidenceScore: 0.94,
    retrievalMethod: 'Hybrid Rerank (Vector + BM25)',
    matchedSnippet: 'When Emergency Department census exceeds 92% or ambulance offload delay exceeds 30 minutes, Level 2 escalation mandates deploying 4 floater nurses to triage and opening 6 fast-track surge bays.'
  },
  'sop-surg': {
    documentId: 'doc-sop-surg-03',
    documentTitle: 'Operating Theater & Elective Surgical Capacity Protocol',
    documentCode: 'SURG-OR-PRIOR-04',
    section: 'Section 3.2: De-escalation & Postponement Safeguards',
    confidenceScore: 0.91,
    retrievalMethod: 'Dense Vector (Cosine Similarity)',
    matchedSnippet: 'Elective surgeries requiring post-operative ICU beds may only be rescheduled when emergency trauma arrivals exceed 85% of projected surge buffer. Cancellation requires Chief Medical Officer authorization.'
  },
  'sop-staff': {
    documentId: 'doc-sop-staff-04',
    documentTitle: 'Hospital Floater Pool Allocation & Overtime Governance',
    documentCode: 'HR-STAFF-2024.1',
    section: 'Section 4.3: Fatigue Management & Cross-Department Floating',
    confidenceScore: 0.89,
    retrievalMethod: 'BM25 Keyword Search',
    matchedSnippet: 'Nurses completing consecutive 12-hour shifts may not be assigned to high-acuity critical care without a minimum 10-hour rest window. Floater pool dispatch minimizes expensive third-party locum tenens agency reliance.'
  }
};
