import React, { useState } from 'react';
import { Badge } from '../ui/Badge';

interface ArchLayer {
  id: string;
  name: string;
  badge: string;
  description: string;
  technologies: string[];
  protocol: string;
  accent: string;
}

export const ArchitectureSection: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<string>('ai-opt');

  const layers: ArchLayer[] = [
    {
      id: 'ingest',
      name: 'Layer 1: Enterprise Data Ingestion & Normalization',
      badge: 'STREAMING PIPELINE',
      description: 'Continuous ingestion of hospital telemetry from EHR, ADT, HL7/FHIR bed feeds, triage desks, and staff attendance rotas.',
      technologies: ['Apache Kafka', 'Schema Registry', 'Redis In-Memory Buffers', 'REST Webhooks'],
      protocol: 'HL7 v2 / FHIR / Kafka Streams',
      accent: 'cyan'
    },
    {
      id: 'backend',
      name: 'Layer 2: Backend Gateway & Microservices Orchestration',
      badge: 'GATEWAY & RPC',
      description: 'High-performance API Gateway routing authenticated client requests and communicating with Python ML worker services over low-latency gRPC channels.',
      technologies: ['Node.js & NestJS', 'gRPC & Protobuf', 'WebSockets (wss://)', 'OpenAPI v3'],
      protocol: 'Binary Protobuf & JSON-RPC',
      accent: 'blue'
    },
    {
      id: 'ai-opt',
      name: 'Layer 3: AI Inference & Mathematical Optimization Core',
      badge: 'PREDICT & SOLVE',
      description: 'PyTorch stacked LSTM neural time-series demand predictors combined with Google OR-Tools branch-and-bound MILP constraint solver.',
      technologies: ['Python FastAPI', 'PyTorch LSTM', 'XGBoost Regressor', 'Google OR-Tools MILP'],
      protocol: 'Asynchronous GPU/CPU Worker Threads',
      accent: 'teal'
    },
    {
      id: 'rag-knowledge',
      name: 'Layer 4: Contextual RAG & Knowledge Store',
      badge: 'HYBRID RETRIEVAL',
      description: 'Dense vector embeddings stored in PostgreSQL pgvector combined with BM25 sparse keyword indices across institutional clinical SOPs.',
      technologies: ['PostgreSQL & pgvector', 'BM25 Sparse Search', 'OpenAI/Anthropic LLM Grounding'],
      protocol: 'Hybrid Cosine Reranking + Sparse Inverted Index',
      accent: 'indigo'
    },
    {
      id: 'client-hitl',
      name: 'Layer 5: Decision Support UI & Human Oversight Gateway',
      badge: 'FRONTEND & GOVERNANCE',
      description: 'Type-safe React client with GSAP motion storytelling, Three.js WebGL spatial intelligence visualizers, and state-machine-governed coordinator authorization.',
      technologies: ['React 18', 'TypeScript', 'Vite Bundler', 'Tailwind CSS', 'Zustand', 'GSAP', 'Lenis', 'Three.js'],
      protocol: 'Browser DOM / Canvas WebGL / WebSocket WSS',
      accent: 'emerald'
    }
  ];

  return (
    <section id="architecture" className="relative py-28 bg-navy-900/80 border-t border-b border-slate-800/80 overflow-hidden">
      {/* Radial lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/5 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <Badge variant="cyan" size="md" className="mb-4">
            ENTERPRISE SYSTEM DESIGN
          </Badge>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Built like a real intelligence platform.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Modular multi-tier architecture engineered for horizontal scalability, sub-100ms mathematical solver convergence, and strict clinical air-gapping.
          </p>
        </div>

        {/* Layered Architectural Diagram & Exploded View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Stacked Layer Buttons (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {layers.map((layer) => {
              const isSelected = layer.id === selectedLayer;
              return (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayer(layer.id)}
                  className={`p-5 rounded-2xl text-left transition-all duration-300 border cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-surface-200 border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.15)] text-white'
                      : 'bg-surface-100/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-surface-200/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                      {layer.badge}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {layer.protocol}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {layer.name}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {layer.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {layer.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-300 text-slate-300 border border-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Layer Spec & Transport Details (5 Cols) */}
          <div className="lg:col-span-5 sticky top-28 bg-surface-50/90 p-6 rounded-3xl border border-slate-800 flex flex-col gap-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Protocol & Transport Blueprint
              </span>
              <Badge variant="cyan" size="sm">
                SPECIFICATION
              </Badge>
            </div>

            {/* Architecture Node Wireframe Flow */}
            <div className="p-4 rounded-xl bg-navy-950/80 border border-slate-800 text-xs font-mono flex flex-col gap-3">
              <div className="text-slate-400">
                [Client Frontend: React 18 + Vite]
              </div>
              <div className="text-cyan-400 pl-4">
                &darr; REST / WebSocket Gateway (WSS)
              </div>
              <div className="text-slate-400">
                [API Gateway: Node.js / NestJS]
              </div>
              <div className="text-indigo-400 pl-4">
                &darr; Internal gRPC Binary Channel (Protobuf)
              </div>
              <div className="text-slate-400">
                [Inference & Solver Engine: Python FastAPI + OR-Tools]
              </div>
              <div className="text-teal-400 pl-4">
                &darr; pgvector & Kafka Streams
              </div>
              <div className="text-slate-400">
                [Enterprise Data Store: PostgreSQL + Redis]
              </div>
            </div>

            <div className="flex flex-col gap-2 text-xs text-slate-300 leading-relaxed">
              <strong className="text-white font-mono uppercase text-[11px] block">
                Security & Airgap Isolation
              </strong>
              <span>
                Operational solvers and machine learning models execute inside isolated containerized VPCs with zero direct public internet exposure. Client interactions are mediated through strict JWT and mTLS authenticated gateways.
              </span>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>gRPC-Web Supported</span>
              <span className="text-emerald-400">Zero Cold Start</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
