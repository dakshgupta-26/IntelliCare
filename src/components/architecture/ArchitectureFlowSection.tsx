import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Cpu, 
  GitBranch, 
  BookOpen, 
  Sliders, 
  Layers, 
  ShieldCheck, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  ChevronRight, 
  Terminal,
  Activity,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useRouterStore } from '../../store/useRouterStore';

interface PipelineNode {
  id: string;
  step: string;
  name: string;
  shortDesc: string;
  badge: string;
  badgeVariant: 'cyan' | 'teal' | 'indigo' | 'emerald' | 'amber' | 'violet' | 'purple' | 'rose' | 'slate';
  icon: React.ComponentType<{ className?: string }>;
  purpose: string;
  inputs: string[];
  outputs: string[];
  techStack: { name: string; category: string }[];
  sla: string;
  samplePayload: Record<string, unknown>;
}

const PIPELINE_NODES: PipelineNode[] = [
  {
    id: 'data-sources',
    step: '01',
    name: 'DATA SOURCES',
    shortDesc: 'EHR, ADT, Bed Management, Staff Rosters, IoT Vitals',
    badge: 'STREAMING FEEDS',
    badgeVariant: 'cyan',
    icon: Database,
    purpose: 'Continuous ingestion of raw hospital telemetry across distributed clinical systems, electronic health records, bed sensors, and staff scheduling rosters.',
    inputs: [
      'Epic / Cerner EHR (FHIR R4 resources)',
      'ADT HL7 v2 messages (A01, A02, A03, A08)',
      'IoT Bed occupancy sensors & telemetry monitors',
      'Nurse rostering and shift rota databases (Kronos/API)',
      'EMS Ambulance dispatch CAD telemetry'
    ],
    outputs: [
      'Raw JSON event envelopes with UTC timestamps',
      'Parsed HL7 message representations',
      'MQTT sensor packets with device heartbeats'
    ],
    techStack: [
      { name: 'Kafka Connect', category: 'Ingestion' },
      { name: 'HL7 MLLP Listener', category: 'Protocol' },
      { name: 'FHIR REST Client', category: 'API' },
      { name: 'MQTT Broker', category: 'IoT' }
    ],
    sla: '1,840 events/sec • <50ms transport',
    samplePayload: {
      source_id: 'ED_TRIAGE_FEED_04',
      message_type: 'ADT^A08',
      event_timestamp: '2026-09-09T19:20:00Z',
      patient_hash: '9f8b2c4...e1',
      acuity_esi: 2,
      assigned_bay: 'ED-BAY-12',
      vitals: { hr: 104, spo2: 94, bp_systolic: 142 }
    }
  },
  {
    id: 'ingestion-streaming',
    step: '02',
    name: 'INGESTION & STREAMING',
    shortDesc: 'Kafka Event Bus, HL7/FHIR Converters, Schema Registry',
    badge: 'EVENT STREAMING',
    badgeVariant: 'indigo',
    icon: Zap,
    purpose: 'High-throughput, fault-tolerant message streaming with schema validation, idempotent deduplication, and ordered topic partitioning.',
    inputs: [
      'Raw incoming event streams from all hospital endpoints',
      'Avro schemas registered in Schema Registry',
      'Replay requests from disaster-recovery mirrors'
    ],
    outputs: [
      'Partitioned Kafka topics (hospital-events.admissions)',
      'Dead-letter queue (DLQ) for malformed packets',
      'Sub-millisecond in-memory buffer in Redis'
    ],
    techStack: [
      { name: 'Apache Kafka', category: 'Event Bus' },
      { name: 'Confluent Schema Registry', category: 'Schema' },
      { name: 'Redis Cache', category: 'Buffer' },
      { name: 'gRPC Protobuf', category: 'RPC' }
    ],
    sla: '99.999% uptime • <12ms message latency',
    samplePayload: {
      topic: 'prod.telemetry.admissions',
      partition: 3,
      offset: 1489201,
      key: 'HOSP_METRO_GENERAL',
      headers: { 'trace-id': 'tr-7f8e-4902', 'schema-ver': 'v2.4' },
      payload_bytes: 428
    }
  },
  {
    id: 'normalization',
    step: '03',
    name: 'NORMALIZATION',
    shortDesc: 'Time-series Aggregators, Feature Store, Census Rollups',
    badge: 'FEATURE PIPELINE',
    badgeVariant: 'teal',
    icon: Layers,
    purpose: 'Standardization of heterogeneous timestamps, spatial census rollups, rolling-window aggregation, and clinical feature engineering.',
    inputs: [
      'Unstructured streaming admission and discharge events',
      'Historical 90-day intake tensors',
      'Regional calendar, weather, and epidemic surveillance signals'
    ],
    outputs: [
      'Canonical time-series tensors (hourly & 15-min intervals)',
      'Engineered lag features (t-1h, t-24h, t-7d, moving averages)',
      'Real-time bed occupancy matrix across 8 core departments'
    ],
    techStack: [
      { name: 'Python Polars', category: 'Data Engine' },
      { name: 'DuckDB', category: 'Aggregator' },
      { name: 'Redis Feature Store', category: 'Low-Latency Cache' },
      { name: 'NumPy / SciPy', category: 'Tensors' }
    ],
    sla: '5-minute rolling epoch • Zero drift',
    samplePayload: {
      census_snapshot: '2026-09-09T19:20:00Z',
      departments: {
        ED: { active_census: 44, capacity: 48, utilization_pct: 91.6 },
        ICU: { active_census: 22, capacity: 24, utilization_pct: 91.7 },
        OR: { active_census: 10, capacity: 12, utilization_pct: 83.3 }
      },
      rolling_lag_arrivals_1h: 18,
      rolling_lag_arrivals_4h: 62
    }
  },
  {
    id: 'forecasting-engine',
    step: '04',
    name: 'FORECASTING ENGINE',
    shortDesc: 'Neural Forecasting, Stacked LSTM, Attention Transformers',
    badge: 'NEURAL INFERENCE',
    badgeVariant: 'indigo',
    icon: Cpu,
    purpose: 'Deep neural time-series prediction generating multi-horizon arrival curves, acuity distribution, and 95% quantile uncertainty intervals.',
    inputs: [
      'Normalized feature tensors from Feature Store',
      'Pretrained stacked LSTM weights + Temporal Fusion Transformer',
      'Active environmental and seasonality vectors'
    ],
    outputs: [
      'Point forecasts for T+2h, T+4h, T+12h, T+24h, T+48h',
      'Quantile confidence bands (P10, P50, P90)',
      'Anomaly spike probability distribution'
    ],
    techStack: [
      { name: 'PyTorch 2.4', category: 'Deep Learning' },
      { name: 'CUDA 12.2', category: 'GPU Acceleration' },
      { name: 'TorchScript', category: 'Model Export' },
      { name: 'FastAPI Worker', category: 'Microservice' }
    ],
    sla: '42ms batch inference SLA • 94.2% accuracy',
    samplePayload: {
      model: 'lstm_multihorizon_v4.2',
      forecast_horizon: '48h',
      predictions: [
        { horizon: '+2h', p50: 52, p10: 47, p90: 58, spike_risk: 0.12 },
        { horizon: '+4h', p50: 64, p10: 56, p90: 74, spike_risk: 0.38 },
        { horizon: '+8h', p50: 71, p10: 61, p90: 83, spike_risk: 0.86 }
      ],
      bottleneck_detected: 'ICU_CAPACITY_EXCEEDED_AT_T+8H'
    }
  },
  {
    id: 'rag-knowledge',
    step: '05',
    name: 'RAG & KNOWLEDGE',
    shortDesc: 'Vector Embeddings, Clinical SOPs, Escalation Protocols, pgvector',
    badge: 'HYBRID RETRIEVAL',
    badgeVariant: 'purple',
    icon: BookOpen,
    purpose: 'Semantic grounding against institutional SOPs, escalation handbooks, and clinical governance guidelines to enforce organizational policy compliance.',
    inputs: [
      'Predicted operational strain alerts and bottleneck coordinates',
      'Pre-indexed hospital clinical SOP document corpus',
      'Staff union ratio bylaws and mandatory step-down criteria'
    ],
    outputs: [
      'Top-3 retrieved institutional SOP passages with semantic scores',
      'Hard clinical constraints to inject into optimization solver',
      'Policy compliance citations for coordinator review'
    ],
    techStack: [
      { name: 'PostgreSQL pgvector', category: 'Vector Store' },
      { name: 'BM25 Sparse Search', category: 'Keyword Ranker' },
      { name: 'text-embedding-3', category: 'Embeddings' },
      { name: 'Reranker Model', category: 'Cross-Encoder' }
    ],
    sla: '18ms hybrid retrieval • Cosine sim > 0.88',
    samplePayload: {
      query: 'ICU surge protocol step-down to telemetry ward',
      top_matches: [
        { doc_id: 'SOP-ICU-SURGE-104', title: 'Code Surge Tier 2 Escalation', score: 0.942 },
        { doc_id: 'SOP-NURSE-RATIO-01', title: 'Critical Care Staffing Ratios (1:2)', score: 0.898 }
      ],
      mandatory_rules: ['Staffing ratio 1:2 cannot be breached', 'Step-down requires Attending signature']
    }
  },
  {
    id: 'optimization-solver',
    step: '06',
    name: 'OPTIMIZATION SOLVER',
    shortDesc: 'Mixed-Integer Linear Programming (MILP), Google OR-Tools',
    badge: 'EXACT SOLVER',
    badgeVariant: 'teal',
    icon: GitBranch,
    purpose: 'Formulation and resolution of capacity rebalancing as a constrained Mixed-Integer Linear Program (MILP), guaranteeing mathematically proven globally optimal resource distribution.',
    inputs: [
      'Forecasted patient admission demand vectors',
      'Available staff rosters, skill levels, and bed availability',
      'Hard constraints: 1:2 nurse ratios, isolation requirements',
      'Soft constraints with penalty weights: staff overtime, transfer delay'
    ],
    outputs: [
      'Optimal resource allocation matrix',
      'Nurse redeployment schedule (+4 to ED, +2 to ICU)',
      'Elective surgical buffer adjustments and early step-down list'
    ],
    techStack: [
      { name: 'Google OR-Tools', category: 'MILP Solver' },
      { name: 'SCIP / CBC Backend', category: 'C++ Branch & Bound' },
      { name: 'NumPy Optimizer', category: 'Matrix Ops' },
      { name: 'Cython Bindings', category: 'Low Overhead' }
    ],
    sla: '<85ms solver convergence • 0% constraint violations',
    samplePayload: {
      solver: 'Google OR-Tools MILP v9.8',
      status: 'OPTIMAL',
      objective_score: 148.24,
      solve_time_ms: 64.2,
      actions: [
        { type: 'STAFF_REDEPLOY', from: 'SURGICAL_WARD', to: 'ED_INTAKE', qty: 4 },
        { type: 'BED_ESCALATION', dept: 'ICU_STEPDOWN', beds: 3 }
      ]
    }
  },
  {
    id: 'decision-engine',
    step: '07',
    name: 'DECISION ENGINE',
    shortDesc: 'Recommendation Ranker, Sensitivity Analysis, Impact Projections',
    badge: 'DECISION LOGIC',
    badgeVariant: 'amber',
    icon: Sliders,
    purpose: 'Translation of raw mathematical solver output and SOP citations into prioritized, transparent action cards with trade-off explanations and recovery projections.',
    inputs: [
      'MILP optimization solution vectors',
      'Grounded clinical SOP excerpts from RAG pipeline',
      'Department sensitivity and historical coordinator acceptance rates'
    ],
    outputs: [
      'Ranked operational directives (Priority 1: High, Priority 2: Medium)',
      'Estimated capacity impact (+18% ED throughput, 0 ICU divert)',
      'Full explainability rationale with linked policy guidelines'
    ],
    techStack: [
      { name: 'FastAPI Decision Layer', category: 'API Engine' },
      { name: 'Pydantic V2', category: 'Schema Validation' },
      { name: 'Explainability Matrix', category: 'XAI' },
      { name: 'WebSocket Broadcaster', category: 'Real-time' }
    ],
    sla: '<15ms ranking latency • Deterministic rules',
    samplePayload: {
      directive_id: 'DIR-2026-0818-B4',
      priority: 'HIGH_URGENCY',
      title: 'Mobilize 4 Floater Nurses to ED Intake Bay 6-9',
      projected_impact: 'Prevents 14-bed bottleneck at 20:00',
      grounded_sop: 'SOP-ICU-SURGE-104 §4.2',
      confidence_score: 0.96
    }
  },
  {
    id: 'hitl-approval',
    step: '08',
    name: 'HUMAN APPROVAL GATE',
    shortDesc: 'Operations Director & Charge Nurse Review, Auditable Ledger',
    badge: 'HUMAN-IN-THE-LOOP',
    badgeVariant: 'emerald',
    icon: ShieldCheck,
    purpose: 'Mandatory clinical and operational coordinator authorization before any dispatch order is transmitted to hospital staff or downstream dispatch terminals.',
    inputs: [
      'Ranked decision support cards and risk projections',
      'Authorized coordinator digital signature and credentials',
      'Interactive override and parameter fine-tuning adjustments'
    ],
    outputs: [
      'Cryptographically signed operational dispatch order',
      'Automated staff paging notifications via Vocera / Mobile',
      'Immutable audit trail log with full reasoning chain'
    ],
    techStack: [
      { name: 'React 18 / TypeScript', category: 'Client Shell' },
      { name: 'WebCrypto API', category: 'Signatures' },
      { name: 'Immutable Audit Ledger', category: 'Compliance' },
      { name: 'HL7 Outbound Dispatcher', category: 'Hospital EMR' }
    ],
    sla: '100% human governance • Zero autonomous execution',
    samplePayload: {
      order_id: 'DISP-2026-0818-B4',
      status: 'AUTHORIZED_BY_COORDINATOR',
      approver: 'Dr. Sarah Lin (Chief of Operations)',
      signed_at: '2026-09-09T19:24:12Z',
      execution_mode: 'DISPATCHED_TO_WARD_MANAGERS',
      immutable_hash: 'sha256:d8a9e10...4f'
    }
  }
];

export const ArchitectureFlowSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('forecasting-engine');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'io' | 'tech' | 'json'>('overview');
  const navigate = useRouterStore((state) => state.navigate);

  const selectedNode = PIPELINE_NODES.find((n) => n.id === selectedId) || PIPELINE_NODES[3];
  const currentIndex = PIPELINE_NODES.findIndex((n) => n.id === selectedId);

  // Auto-play pulse through pipeline
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSelectedId((prev) => {
        const idx = PIPELINE_NODES.findIndex((n) => n.id === prev);
        const nextIdx = (idx + 1) % PIPELINE_NODES.length;
        return PIPELINE_NODES[nextIdx].id;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section id="architecture-flow" className="relative py-32 bg-[#070B17] text-slate-100 border-t border-white/[0.08] overflow-hidden">
      {/* Radial background ambient gradient */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-cyan-500/[0.03] blur-[180px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1220] border border-white/[0.08] text-cyan-400 text-xs font-mono font-bold mb-4">
              <Activity className="w-3.5 h-3.5" />
              <span>END-TO-END DATA PIPELINE</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
              From Raw Hospital Signal to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">Verified Decision.</span>
            </h2>

            <p className="mt-4 text-lg sm:text-xl text-slate-400 font-normal leading-relaxed">
              Every admission, telemetry alert, and staff shift flows through an 8-stage distributed pipeline. Fully traceable, mathematical, and guarded by human approval.
            </p>
          </div>

          {/* Scrubber Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B1220] border border-white/[0.08] text-xs font-mono font-bold text-slate-200 hover:text-white hover:bg-[#0E1626] transition-all cursor-pointer shadow-sm"
              title={isPlaying ? 'Pause auto-cycle' : 'Resume auto-cycle'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{isPlaying ? 'Pause Pulse' : 'Auto Pulse'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setSelectedId(PIPELINE_NODES[0].id);
              }}
              className="p-2 rounded-xl bg-[#0B1220] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-[#0E1626] transition-all cursor-pointer"
              title="Reset to stage 01"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/architecture')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
            >
              <span>Full Spec</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Horizontal Visual Pipeline Nodes (Scrollable on mobile) */}
        <div className="mb-10 pb-4 overflow-x-auto scrollbar-thin">
          <div className="min-w-[960px] flex items-center justify-between relative">
            {/* Connecting Track Line behind nodes */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
            
            {/* Active Progress Highlight Line */}
            <div 
              className="absolute top-1/2 left-4 h-0.5 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${(currentIndex / (PIPELINE_NODES.length - 1)) * 96}%` }}
            />

            {PIPELINE_NODES.map((node, idx) => {
              const isSelected = node.id === selectedId;
              const isPast = idx < currentIndex;
              const IconComp = node.icon;

              return (
                <button
                  key={node.id}
                  onClick={() => {
                    setIsPlaying(false);
                    setSelectedId(node.id);
                  }}
                  className={`group relative z-10 flex flex-col items-center cursor-pointer transition-all duration-300 focus:outline-none ${
                    isSelected ? 'scale-105' : 'hover:scale-102 opacity-75 hover:opacity-100'
                  }`}
                >
                  {/* Node Circle */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border shadow-lg ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(25,199,243,0.35)]'
                        : isPast
                        ? 'bg-[#0E1626] border-teal-500/50 text-teal-300'
                        : 'bg-[#0B1220] border-white/[0.08] text-slate-400'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>

                  {/* Step & Label */}
                  <div className="mt-3 text-center">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 group-hover:text-slate-300 block">
                      {node.step}
                    </span>
                    <span className={`text-xs font-bold whitespace-nowrap block mt-0.5 ${
                      isSelected ? 'text-cyan-300' : 'text-slate-300'
                    }`}>
                      {node.name.split(' ')[0]}
                    </span>
                  </div>

                  {/* Active Indicator Pip */}
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 shadow-[0_0_8px_rgba(25,199,243,0.9)] animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Node Detailed Inspector Card */}
        <div className="bg-[#0B1220] rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Header Strip */}
          <div className="p-6 sm:p-8 border-b border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#070B17]/60">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <selectedNode.icon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-1">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    STAGE {selectedNode.step} OF 08
                  </span>
                  <Badge variant={selectedNode.badgeVariant} size="sm">
                    {selectedNode.badge}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400 border-l border-white/[0.1] pl-2.5">
                    SLA: {selectedNode.sla}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  {selectedNode.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
                  {selectedNode.shortDesc}
                </p>
              </div>
            </div>

            {/* Inspector Tab Selector */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#070B17] border border-white/[0.08] shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('io')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeTab === 'io'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Inputs & Outputs
              </button>
              <button
                onClick={() => setActiveTab('tech')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeTab === 'tech'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tech Stack
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'json'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3 h-3" />
                <span>Payload</span>
              </button>
            </div>
          </div>

          {/* Tab Content Body */}
          <div className="p-6 sm:p-8">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Architectural Purpose & Role
                  </h4>
                  <p className="text-base text-slate-200 leading-relaxed font-sans">
                    {selectedNode.purpose}
                  </p>

                  <div className="mt-4 p-4 rounded-2xl bg-surface-200/50 border border-slate-800 text-xs font-mono flex flex-col gap-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-bold text-white uppercase tracking-wider">Operational Assurance</span>
                      <span className="text-cyan-400 font-bold">VERIFIED</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 pt-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Zero data loss architecture with Kafka replication factor 3 across availability zones.</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Deterministic telemetry contract with strictly enforced Protobuf schemas.</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Primary Technologies Deployed
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {selectedNode.techStack.map((tech, i) => (
                      <div key={i} className="p-3 rounded-xl bg-surface-200/70 border border-slate-800 flex flex-col">
                        <span className="text-xs font-bold text-white">{tech.name}</span>
                        <span className="text-[10px] font-mono text-cyan-400 mt-0.5">{tech.category}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Processing SLA</span>
                    <span className="text-cyan-300 font-bold">{selectedNode.sla}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'io' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs Column */}
                <div className="p-6 rounded-2xl bg-surface-200/40 border border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                      Upstream Inputs ({selectedNode.inputs.length})
                    </h4>
                  </div>
                  <ul className="flex flex-col gap-2.5 text-xs text-slate-300 font-mono">
                    {selectedNode.inputs.map((inp, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-100 border border-slate-800/80">
                        <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{inp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outputs Column */}
                <div className="p-6 rounded-2xl bg-surface-200/40 border border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                      Downstream Deliverables ({selectedNode.outputs.length})
                    </h4>
                  </div>
                  <ul className="flex flex-col gap-2.5 text-xs text-slate-300 font-mono">
                    {selectedNode.outputs.map((out, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-100 border border-slate-800/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{out}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'tech' && (
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Engineered Stack Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {selectedNode.techStack.map((t, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-surface-200/60 border border-slate-800 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold block mb-1">
                          {t.category}
                        </span>
                        <h5 className="text-base font-bold text-white">
                          {t.name}
                        </h5>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                        <span>Production Status</span>
                        <span className="text-emerald-400 font-bold">ACTIVE</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'json' && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Sample Telemetry Envelope: {selectedNode.name}</span>
                  <span className="text-emerald-400">JSON-SCHEMA VALID</span>
                </div>
                <pre className="p-4 rounded-2xl bg-navy-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                  {JSON.stringify(selectedNode.samplePayload, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
