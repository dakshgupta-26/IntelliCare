import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';

export const TechStrip: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);

  const coreTech = [
    { name: 'React 18', tag: 'UI Layer' },
    { name: 'TypeScript', tag: 'Type Safety' },
    { name: 'Vite', tag: 'Build Engine' },
    { name: 'PyTorch LSTM', tag: 'Neural Model' },
    { name: 'OR-Tools', tag: 'MILP Solver' },
    { name: 'pgvector', tag: 'Dense Embeddings' },
    { name: 'Apache Kafka', tag: 'Stream Ingest' },
    { name: 'gRPC / Protobuf', tag: 'RPC Gateway' },
    { name: 'Three.js', tag: 'WebGL Spatial' },
  ];

  return (
    <section className="relative py-20 bg-section-dark border-t border-b border-slate-800 text-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Title */}
          <div className="flex flex-col text-center lg:text-left shrink-0">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1">
              ENGINEERED FOR PRODUCTION
            </span>
            <h3 className="text-xl font-display font-bold text-white">
              Enterprise Technology Foundation
            </h3>
          </div>

          {/* Minimal 8-10 Tech Badges */}
          <div className="flex flex-wrap justify-center items-center gap-2.5 max-w-2xl">
            {coreTech.map((t, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-100 border border-slate-800 text-xs font-mono"
              >
                <span className="text-white font-bold">{t.name}</span>
                <span className="text-[10px] text-slate-500 font-sans border-l border-slate-700 pl-2">
                  {t.tag}
                </span>
              </div>
            ))}
          </div>

          {/* Action CTA */}
          <button
            onClick={() => navigate('/technology')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-200 hover:bg-surface-300 border border-slate-700 text-xs font-mono text-cyan-300 font-bold transition-all shrink-0 cursor-pointer shadow-md"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Explore Architecture</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
