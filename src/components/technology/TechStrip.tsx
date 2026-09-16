import React from 'react';
import { ArrowRight, Layers, Cpu, Database, Binary, Activity, Code2, Sparkles } from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';

export const TechStrip: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);

  const techCategories = [
    {
      group: 'AI / Machine Learning',
      icon: Cpu,
      items: [
        { name: 'LSTM Neural Networks', role: 'Multi-Horizon Time-Series Forecasting' },
        { name: 'PyTorch & Python', role: 'Conformal Quantile Prediction Bands' }
      ]
    },
    {
      group: 'Context & Knowledge',
      icon: Database,
      items: [
        { name: 'RAG Architecture', role: 'Institutional Clinical SOP Grounding' },
        { name: 'pgvector & Embeddings', role: 'Dense Semantic Vector Search' }
      ]
    },
    {
      group: 'Mathematical Optimization',
      icon: Binary,
      items: [
        { name: 'Google OR-Tools', role: 'Exact MILP Mathematical Balancing' },
        { name: 'Constrained Formulation', role: 'Zero Statutory Ratio Violations' }
      ]
    },
    {
      group: 'Visualization & Motion',
      icon: Code2,
      items: [
        { name: 'Three.js & React 18', role: 'Real-Time 3D Digital Twin Simulation' },
        { name: 'GSAP, Lenis & Motion', role: 'Cinematic Hardware-Accelerated Animation' }
      ]
    }
  ];

  return (
    <section id="technology" className="relative py-24 bg-[#070B17] border-t border-b border-white/[0.08] text-slate-100 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1220] border border-white/[0.08] text-cyan-400 text-xs font-mono font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ENGINEERED FOR PRODUCTION</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight uppercase">
              The Engineering & Intelligence Stack
            </h3>
            <p className="mt-2 text-sm text-slate-400 font-sans max-w-xl">
              Strictly engineered with verified scientific computing libraries, exact mathematical solvers, and high-frequency real-time web technologies.
            </p>
          </div>

          <button
            onClick={() => navigate('/technology')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B1220] hover:bg-[#0E1626] border border-white/[0.08] hover:border-cyan-500/40 text-xs font-mono text-cyan-300 font-bold transition-all shrink-0 cursor-pointer shadow-md"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Explore Full Ecosystem</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Category Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {techCategories.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#070B17] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-white/[0.06]">
                    <div className="w-7 h-7 rounded-lg bg-[#0B1220] border border-white/[0.08] flex items-center justify-center text-cyan-400 group-hover:text-cyan-300">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                      {cat.group}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {cat.items.map((it, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {it.name}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {it.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Production Status</span>
                  <span className="text-cyan-400 font-bold">VERIFIED</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Minimal stream ticker */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Telemetry Pipeline: Apache Kafka &bull; HL7 v2 / FHIR R4 &bull; WebSocket WSS</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Airgapped VPC Compliant</span>
            <span>SOC 2 Type II Architecture</span>
            <span>HIPAA BAA Protocol</span>
          </div>
        </div>
      </div>
    </section>
  );
};
