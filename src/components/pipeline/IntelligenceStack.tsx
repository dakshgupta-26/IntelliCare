import React, { useState } from 'react';
import { ArrowRight, Sparkles, BookOpen, Cpu, Database, FileText, CheckCircle2 } from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';

export const IntelligenceStack: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<number>(1);
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
      icon: Sparkles,
    },
    {
      id: 'understand',
      step: '02',
      name: 'UNDERSTAND',
      question: 'What context matters?',
      tech: 'RAG / Operational Knowledge Grounding',
      contribution: 'Retrieves institutional SOPs, statutory nurse-to-patient staffing thresholds, union shift constraints, and surge escalation policies.',
      output: 'Contextual compliance constraints and audit-ready clinical directives',
      badge: 'Context Retrieval',
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      icon: BookOpen,
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
      icon: Cpu,
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

  const ragSources = [
    { name: 'Hospital Clinical SOPs', code: 'SOP-ICU-4.2', detail: 'Mandatory 1:2 Critical Care Nurse-to-Patient Ratio' },
    { name: 'Operational Shift Policies', code: 'POL-ROSTER-B', detail: 'Float nurse pool reassignment protocol across adjacent wards' },
    { name: 'Staffing Agreements', code: 'UNION-AGR-8', detail: 'Maximum continuous shift length and fatigue safeguards' },
    { name: 'Department Guidelines', code: 'DIR-ED-TRIAGE', detail: 'Acute intake escalation protocol at 90% bay occupancy' },
    { name: 'Resource Constraints', code: 'ISO-ROOM-BOUNDS', detail: 'Negative pressure isolation bed clearance requirements' }
  ];

  return (
    <section id="intelligence-stack" className="relative py-28 sm:py-36 bg-[#070B17] text-slate-100 border-t border-white/[0.08] overflow-hidden">
      {/* Precision ambient background lighting */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[500px] bg-cyan-500/[0.03] blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1220] border border-white/[0.08] mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-200 uppercase">
              THE THREE-LAYER ENGINE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[10px] font-mono text-cyan-400 font-medium">INTELLIGENCE STACK</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
            Forecast + Context + Optimization.
          </h2>

          <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Mathematical algorithms without context fail in clinical realities. IntelliCare connects neural predictions, institutional guidelines, and exact solvers into one unified system.
          </p>
        </div>

        {/* Visual Pipeline Connecting Telemetry to Human Approval */}
        <div className="mb-14 p-4 sm:p-5 rounded-2xl bg-[#0B1220] border border-white/[0.08] shadow-lg max-w-5xl mx-auto">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-3 text-center">
            END-TO-END DATA FLOW & DECISION CHAIN
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 relative">
            {pipelineSteps.map((step, idx) => {
              const isLast = idx === pipelineSteps.length - 1;
              return (
                <div
                  key={step}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isLast
                      ? 'bg-blue-950/40 border-blue-500/40 text-blue-300 shadow-sm'
                      : 'bg-[#070B17] border-white/[0.06] text-slate-300'
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

        {/* 3 Core Technological Layers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {layers.map((layer, idx) => {
            const isSelected = idx === selectedLayer;
            const IconComp = layer.icon;
            return (
              <div
                key={layer.id}
                onClick={() => setSelectedLayer(idx)}
                className={`p-6 sm:p-8 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-6 ${
                  isSelected
                    ? 'bg-[#0B1220] border-cyan-400/40 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-cyan-500/20'
                    : 'bg-[#0B1220]/60 border-white/[0.08] hover:border-white/[0.14] hover:bg-[#0B1220]'
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

                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-cyan-400">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white">
                      {layer.name}
                    </h3>
                  </div>

                  <span className="text-sm font-display font-semibold text-cyan-300 block mb-3">
                    {layer.question}
                  </span>

                  <div className="text-xs font-mono text-slate-400 mb-4 pb-4 border-b border-white/[0.08]">
                    {layer.tech}
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed font-sans">
                    {layer.contribution}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#070B17] border border-white/[0.06] text-xs font-mono">
                  <span className="text-[10px] text-slate-400 block uppercase mb-1">Engine Output</span>
                  <span className="text-slate-200 font-medium leading-tight block">
                    {layer.output}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual RAG Knowledge Architecture Experience */}
        <div className="max-w-6xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#0B1220] border border-white/[0.08] shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
                  LAYER 02 DEEP DIVE &bull; GROUNDED RAG
                </span>
                <span className="text-xs font-mono text-slate-500">
                  DENSE VECTOR (PGVECTOR) + BM25
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white">
                How IntelliCare Grounds Directives in Hospital SOPs
              </h3>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/[0.06] text-slate-300 shrink-0">
              Zero Hallucination Guarantee
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Document Knowledge Sources (6 Cols) */}
            <div className="lg:col-span-6 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-2">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Indexed Institutional Knowledge Base</span>
              </span>

              {ragSources.map((src, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#070B17] border border-white/[0.06] flex items-start gap-3">
                  <FileText className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="text-white font-bold">{src.name}</span>
                      <span className="text-indigo-300 text-[10px] bg-indigo-950/50 px-1.5 py-0.2 rounded border border-indigo-800">{src.code}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans">{src.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Context-Aware Recommendation Rationale (6 Cols) */}
            <div className="lg:col-span-6 flex flex-col justify-between h-full bg-[#070B17] p-6 rounded-2xl border border-white/[0.06]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                    CONTEXT-AWARE RECOMMENDATION SYNTHESIS
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Active Directive:</span>
                    <div className="text-lg font-display font-bold text-white">
                      Move 2 float nurses &rarr; ICU Critical Care
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0B1220] border border-white/[0.06] text-xs font-mono space-y-2">
                    <span className="text-indigo-300 font-bold block">Context Retrieved from Knowledge Base:</span>
                    <div className="text-slate-300 flex items-start gap-2">
                      <span className="text-indigo-400">&bull;</span>
                      <span><strong>ICU Staffing Threshold:</strong> Minimum 1:2 nurse-to-patient ratio required by policy.</span>
                    </div>
                    <div className="text-slate-300 flex items-start gap-2">
                      <span className="text-indigo-400">&bull;</span>
                      <span><strong>Current Shift Policy:</strong> Float pool has 6 available nurses eligible for critical care transfer.</span>
                    </div>
                    <div className="text-slate-300 flex items-start gap-2">
                      <span className="text-indigo-400">&bull;</span>
                      <span><strong>Shift Constraints:</strong> Prevents overtime violation; conforms to union fatigue rules.</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    By retrieving exact institutional policies before recommending allocations, IntelliCare ensures clinical coordinators receive recommendations that are legally compliant, clinically safe, and immediately actionable.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Retrieval Latency: 18ms</span>
                <span className="text-emerald-400 font-bold">100% Citation Grounded</span>
              </div>
            </div>
          </div>
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
