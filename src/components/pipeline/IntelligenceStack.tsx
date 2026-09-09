import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';

export const IntelligenceStack: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<number>(0);
  const navigate = useRouterStore((state) => state.navigate);

  const layers = [
    {
      id: 'forecast',
      step: '01',
      name: 'FORECAST',
      question: 'What is likely to happen?',
      tech: 'LSTM / Multi-Horizon Neural Forecasting',
      contribution: 'Anticipates patient presentation surges, triage bottlenecks, and bed demand 2h to 48h in advance with conformal uncertainty bounds.',
      output: 'Projected demand distributions and acuity profiles per department',
      badge: 'Neural Inference',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      id: 'understand',
      step: '02',
      name: 'UNDERSTAND',
      question: 'What context matters?',
      tech: 'RAG / Operational Knowledge Retrieval',
      contribution: 'Embeds institutional SOPs, union nurse-to-patient staffing thresholds, surgeon availability calendars, and surge escalation policies.',
      output: 'Contextual compliance constraints and audit-ready clinical directives',
      badge: 'Context Retrieval',
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      id: 'optimize',
      step: '03',
      name: 'OPTIMIZE',
      question: 'What should we do?',
      tech: 'MILP / Mathematical Optimization Solver',
      contribution: 'Formulates global capacity as a Mixed-Integer Linear Program, resolving trade-offs across beds, rosters, and emergency diverts in milliseconds.',
      output: 'Exact, constraint-satisfying resource rebalance plan',
      badge: 'OR-Tools MILP',
      badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    },
  ];

  const pipelineSteps = [
    'Hospital Telemetry',
    'Forecasting',
    'Context Retrieval',
    'Optimization',
    'Recommendation',
    'Human Approval',
  ];

  return (
    <section className="relative py-28 sm:py-36 bg-[#070B17] text-slate-100 border-t border-white/[0.08] overflow-hidden">
      {/* Precision ambient background lighting */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[500px] bg-cyan-500/[0.03] blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1020] border border-white/[0.1] mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-200 uppercase">
              THE THREE-LAYER ENGINE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[10px] font-mono text-cyan-400/90 font-medium">INTELLIGENCE STACK</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
            Technological depth engineered for operational outcomes.
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            IntelliCare connects predictive forecasting, operational knowledge grounding, and mathematical optimization into a unified decision engine.
          </p>
        </div>

        {/* Visual Pipeline Connecting Telemetry to Human Approval */}
        <div className="mb-14 p-4 sm:p-5 rounded-2xl bg-[#0B1020] border border-white/[0.08] shadow-lg max-w-5xl mx-auto">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-3 text-center">
            END-TO-END INTELLIGENCE FLOW
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {pipelineSteps.map((step, idx) => {
              const isLast = idx === pipelineSteps.length - 1;
              return (
                <div
                  key={step}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isLast
                      ? 'bg-blue-950/40 border-blue-500/40 text-blue-300 shadow-sm'
                      : 'bg-[#101728] border-white/[0.06] text-slate-300'
                  }`}
                >
                  <span className="text-[9px] font-mono text-slate-500 block mb-0.5">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-mono font-bold block leading-tight">
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 Technological Layers Deep-Dive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {layers.map((layer, idx) => {
            const isSelected = idx === selectedLayer;
            return (
              <div
                key={layer.id}
                onClick={() => setSelectedLayer(idx)}
                className={`p-6 sm:p-8 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-6 ${
                  isSelected
                    ? 'bg-[#0B1020] border-cyan-400/40 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-cyan-500/20'
                    : 'bg-[#0B1020]/60 border-white/[0.08] hover:border-white/[0.14] hover:bg-[#0B1020]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/[0.06] text-slate-300">
                      LAYER {layer.step}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${layer.badgeColor}`}>
                      {layer.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-display font-bold text-white mb-1">
                    {layer.name}
                  </h3>
                  <span className="text-sm font-display font-semibold text-cyan-300 block mb-4">
                    {layer.question}
                  </span>

                  <div className="text-xs font-mono text-slate-400 mb-4 pb-4 border-b border-white/[0.08]">
                    {layer.tech}
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed font-sans">
                    {layer.contribution}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#101728] border border-white/[0.06] text-xs font-mono">
                  <span className="text-[10px] text-slate-400 block uppercase mb-1">Engine Output</span>
                  <span className="text-slate-200 font-medium leading-tight block">
                    {layer.output}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Dive Action Link */}
        <div className="mt-14 text-center">
          <button
            onClick={() => navigate('/technology')}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <span>Explore Mathematical Solver & ML Architecture</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
