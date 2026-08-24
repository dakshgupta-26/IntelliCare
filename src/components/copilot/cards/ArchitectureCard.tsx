import React, { useState } from 'react';
import { Layers, ArrowRight, Server, Database, Activity, Cpu } from 'lucide-react';
import { useRouterStore } from '../../../store/useRouterStore';
import { useCopilotStore } from '../../../store/useCopilotStore';

interface ArchitectureCardProps {
  title: string;
  subtitle?: string;
}

export const ArchitectureCard: React.FC<ArchitectureCardProps> = ({
  title,
  subtitle
}) => {
  const [selectedLayer, setSelectedLayer] = useState<'INGESTION' | 'GATEWAY' | 'AI_SOLVER' | 'STORAGE' | 'CLIENT'>('AI_SOLVER');
  const navigate = useRouterStore((state) => state.navigate);
  const setOpen = useCopilotStore((state) => state.setOpen);

  const layerDetails = {
    INGESTION: {
      name: 'Event Streaming & Ingestion Layer',
      desc: 'Apache Kafka & FHIR ingestion bus handling continuous real-time HL7 messages and EHR telemetry.',
      tech: 'Kafka, WebSockets, gRPC, HL7/FHIR'
    },
    GATEWAY: {
      name: 'API Gateway & Orchestration Core',
      desc: 'NestJS / Express server enforcing JWT authentication, RBAC authorization, and WebSocket event distribution.',
      tech: 'NestJS, Node.js, Express, Helmet, ws'
    },
    AI_SOLVER: {
      name: 'Python ML Inference & MILP Solvers',
      desc: 'High-throughput microservices running PyTorch Stacked LSTM models and Google OR-Tools branch-and-bound solvers.',
      tech: 'FastAPI, PyTorch LSTM, Google OR-Tools CBC'
    },
    STORAGE: {
      name: 'Hybrid Relational & Vector Persistence',
      desc: 'PostgreSQL with pgvector for 1536-dim SOP embeddings alongside Redis in-memory telemetry caching.',
      tech: 'PostgreSQL, pgvector, Redis, Prisma'
    },
    CLIENT: {
      name: 'Interactive Clinical Command Center',
      desc: 'Hardware-accelerated React 18 frontend with GSAP scroll choreography, Lenis normalizer, and Three.js visualizer.',
      tech: 'React 18, Vite, TypeScript, Tailwind, GSAP, R3F'
    }
  };

  const handleOpenArchitecturePage = () => {
    navigate('/architecture');
    setOpen(false);
  };

  return (
    <div className="my-3 rounded-2xl bg-midnight-900/90 border border-indigo-500/30 p-4 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl text-slate-100">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center text-brand-lavender">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-display tracking-wide">{title}</h4>
            {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
          </div>
        </div>
      </div>

      {/* Interactive Microservice Flow Graphic */}
      <div className="grid grid-cols-5 gap-1.5 mb-3 bg-midnight-950/80 p-2 rounded-xl border border-slate-800 text-center">
        {[
          { key: 'INGESTION', label: 'Kafka Bus', icon: Activity },
          { key: 'GATEWAY', label: 'NestJS Gateway', icon: Server },
          { key: 'AI_SOLVER', label: 'PyTorch / MILP', icon: Cpu },
          { key: 'STORAGE', label: 'pgvector / Redis', icon: Database },
          { key: 'CLIENT', label: 'React UI', icon: Layers }
        ].map((node) => {
          const Icon = node.icon;
          const isActive = selectedLayer === node.key;
          return (
            <button
              key={node.key}
              onClick={() => setSelectedLayer(node.key as any)}
              className={`p-1.5 rounded-lg flex flex-col items-center gap-1 transition-all ${
                isActive
                  ? 'bg-indigo-500/20 border border-indigo-400/50 text-indigo-300 shadow-[0_0_12px_rgba(155,140,255,0.3)]'
                  : 'hover:bg-surface-100 text-slate-400 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-mono leading-tight">{node.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Layer Inspector Drawer */}
      <div className="bg-surface-50/90 p-3 rounded-xl border border-white/5 mb-3">
        <h5 className="text-xs font-bold text-indigo-300 font-display flex items-center gap-1.5 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-lavender animate-pulse" />
          {layerDetails[selectedLayer].name}
        </h5>
        <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
          {layerDetails[selectedLayer].desc}
        </p>
        <div className="text-[10px] font-mono text-cyan-300 bg-midnight-950/60 px-2 py-1 rounded-md border border-cyan-500/20">
          Stack: {layerDetails[selectedLayer].tech}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <span className="text-[10px] font-mono text-slate-400">
          Latency: &lt;100ms End-to-End
        </span>

        <button
          onClick={handleOpenArchitecturePage}
          className="text-xs font-semibold text-brand-lavender hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          View Enterprise Architecture
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
