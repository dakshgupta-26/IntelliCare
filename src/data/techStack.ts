import { TechItem } from '../types/architecture';

export const TECH_STACK: TechItem[] = [
  // Frontend
  {
    name: 'React 18 & Vite',
    category: 'Frontend',
    role: 'Client Runtime & Build Engine',
    description: 'Blazing fast ESM dev server with optimized production bundling, code-splitting, and typed component architecture.',
    badge: 'Core UI',
    status: 'production'
  },
  {
    name: 'TypeScript',
    category: 'Frontend',
    role: 'Type-Safe Architecture',
    description: 'Strict compile-time validation for clinical metrics, telemetry contracts, and simulation parameters.',
    badge: 'Safety',
    status: 'production'
  },
  {
    name: 'Tailwind CSS',
    category: 'Frontend',
    role: 'Design System & Tokens',
    description: 'Curated deep navy and healthcare cyan color palette, glassmorphism tokens, and responsive utility architecture.',
    badge: 'Design System',
    status: 'production'
  },
  {
    name: 'Zustand',
    category: 'Frontend',
    role: 'Reactive State Store',
    description: 'Lightweight, hook-based global state for real-time telemetry updates, slider simulations, and scenario presets.',
    badge: 'State',
    status: 'production'
  },

  // Motion
  {
    name: 'GSAP & ScrollTrigger',
    category: 'Motion',
    role: 'Timeline & Scroll Engine',
    description: 'Hardware-accelerated choreographed transitions, SVG path drawing, numbers counting, and staged pipeline storytelling.',
    badge: 'Cinematic',
    status: 'production'
  },
  {
    name: 'Lenis',
    category: 'Motion',
    role: 'Smooth Scroll Normalizer',
    description: 'Inertial smooth scrolling coupled with GSAP ScrollTrigger ticker, maintaining native touch and reduced-motion fallbacks.',
    badge: 'UX',
    status: 'production'
  },
  {
    name: 'Three.js & R3F',
    category: 'Motion',
    role: 'Interactive 3D Visualizer',
    description: 'GPU-culled procedural hospital intelligence network with bezier particle flows and dynamic camera parallax.',
    badge: 'WebGL',
    status: 'production'
  },

  // Backend & Microservices
  {
    name: 'Python FastAPI & ML Services',
    category: 'Backend',
    role: 'Inference & Math Server',
    description: 'High-throughput asynchronous service serving PyTorch LSTM tensors and OR-Tools optimization solvers.',
    badge: 'Inference',
    status: 'integrated'
  },
  {
    name: 'Node.js & NestJS Gateway',
    category: 'Backend',
    role: 'API Gateway & Orchestration',
    description: 'Enterprise API gateway routing telemetry, managing RBAC sessions, and broadcasting WebSocket events.',
    badge: 'Gateway',
    status: 'integrated'
  },

  // Communication
  {
    name: 'WebSockets (ws:// / wss://)',
    category: 'Communication',
    role: 'Bidirectional Telemetry',
    description: 'Low-latency event pipe broadcasting live hospital metric updates, optimization completions, and alert triggers.',
    badge: 'Real-time',
    status: 'production'
  },
  {
    name: 'gRPC & Protocol Buffers',
    category: 'Communication',
    role: 'Internal Microservice RPC',
    description: 'Strict binary contract serialization between Node gateway and Python mathematical optimization worker nodes.',
    badge: 'Low Latency',
    status: 'integrated'
  },
  {
    name: 'RESTful OpenAPI v3',
    category: 'Communication',
    role: 'Client-Facing Standard API',
    description: 'Standardized schema-documented endpoints for reporting, historical query retrieval, and system configuration.',
    badge: 'Standards',
    status: 'production'
  },

  // Data & Storage
  {
    name: 'PostgreSQL & pgvector',
    category: 'Data & Storage',
    role: 'Relational & Vector Store',
    description: 'ACID-compliant storage for patient flow logs, institutional SOP text chunks, and 1536-dim dense vector embeddings.',
    badge: 'Primary DB',
    status: 'integrated'
  },
  {
    name: 'Redis',
    category: 'Data & Storage',
    role: 'In-Memory Cache & Pub/Sub',
    description: 'Sub-millisecond caching for real-time bed counts, fast state synchronization, and live channel broadcasting.',
    badge: 'Cache',
    status: 'integrated'
  },
  {
    name: 'Apache Kafka',
    category: 'Data & Storage',
    role: 'Event Stream Bus',
    description: 'Fault-tolerant distributed log buffering continuous EHR events, HL7/FHIR feeds, and telemetry signals.',
    badge: 'Stream',
    status: 'integrated'
  },

  // AI & ML
  {
    name: 'Stacked LSTM Networks',
    category: 'AI & ML',
    role: 'Time-Series Demand Predictor',
    description: 'Recurrent neural networks trained on multi-year hourly presentation series with seasonal embeddings.',
    badge: 'Forecasting',
    status: 'production'
  },
  {
    name: 'XGBoost Baseline Regressor',
    category: 'AI & ML',
    role: 'Gradient Boosted Benchmark',
    description: 'Tabular tree ensemble providing fast baseline comparison, feature importance, and non-linear interactions.',
    badge: 'Baseline',
    status: 'production'
  },
  {
    name: 'Dense Vector + BM25 RAG',
    category: 'AI & ML',
    role: 'Hybrid Contextual Retrieval',
    description: 'Dual-encoder semantic embeddings combined with BM25 sparse keyword matching over hospital operational SOPs.',
    badge: 'RAG',
    status: 'production'
  },

  // Optimization
  {
    name: 'MILP (Mixed-Integer Linear Programming)',
    category: 'Optimization',
    role: 'Exact Mathematical Formulation',
    description: 'Constrained objective minimization balancing staff fatigue, bed capacity, and waiting times with integer decision variables.',
    badge: 'Math',
    status: 'production'
  },
  {
    name: 'Google OR-Tools',
    category: 'Optimization',
    role: 'Industrial Solver Engine',
    description: 'Fast branch-and-bound linear programming solver determining global optimal allocations in under 100 milliseconds.',
    badge: 'Solver',
    status: 'production'
  },

  // Infrastructure
  {
    name: 'Docker & Kubernetes (K8s)',
    category: 'Infrastructure',
    role: 'Container Orchestration',
    description: 'Isolated microservice containers with horizontal pod autoscaling based on incoming optimization solver loads.',
    badge: 'DevOps',
    status: 'integrated'
  },
  {
    name: 'Prometheus & Grafana',
    category: 'Infrastructure',
    role: 'Observability & Metrics',
    description: 'Continuous monitoring of model inference latencies, solver execution times, and WebSocket connection health.',
    badge: 'Monitoring',
    status: 'integrated'
  }
];
