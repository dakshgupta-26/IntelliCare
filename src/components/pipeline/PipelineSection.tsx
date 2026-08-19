import React, { useState } from 'react';
import { Eye, TrendingUp, Cpu, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useRouterStore } from '../../store/useRouterStore';

export const PipelineSection: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);
  const navigate = useRouterStore((state) => state.navigate);

  const stages = [
    {
      id: 'observe',
      step: '01',
      title: 'OBSERVE',
      tag: 'Continuous Telemetry',
      icon: <Eye className="w-5 h-5" />,
      headline: 'Normalize fragmented hospital telemetry in real time',
      description: 'Ingests real-time ADT feeds, HL7/FHIR bed sensors, triage arrival queues, and nursing shift rosters without replacing existing legacy EHRs.',
      tech: 'Kafka Streams & Schema Registry',
      visualOutput: 'Stream of 14,000+ hourly events normalized into clinical feature tensors.',
      metric: '< 100ms',
      metricLabel: 'Ingestion Latency',
    },
    {
      id: 'predict',
      step: '02',
      title: 'PREDICT',
      tag: 'Neural Forecasting',
      icon: <TrendingUp className="w-5 h-5" />,
      headline: 'Forecast multi-horizon demand before surges materialize',
      description: 'Stacked LSTM neural networks compute 2h to 48h horizon patient arrival probabilities with 95% conformal prediction intervals.',
      tech: 'PyTorch Multi-Horizon LSTM',
      visualOutput: 'Projected demand spikes flagged 4 hours before triage overcrowding occurs.',
      metric: '3.8 pts/hr',
      metricLabel: 'Forecast MAE',
    },
    {
      id: 'optimize',
      step: '03',
      title: 'OPTIMIZE',
      tag: 'Mathematical Solver',
      icon: <Cpu className="w-5 h-5" />,
      headline: 'Balance capacity under statutory clinical constraints',
      description: 'Mixed-Integer Linear Programming (MILP) calculates optimal global allocations for beds, floater nurses, and on-call physicians.',
      tech: 'Google OR-Tools MILP Solver',
      visualOutput: 'Exact rebalance vectors eliminating bottlenecks while maintaining strict 1:2 ICU ratios.',
      metric: '84ms',
      metricLabel: 'Global Solve Time',
    },
    {
      id: 'decide',
      step: '04',
      title: 'DECIDE',
      tag: 'Grounded Human Authority',
      icon: <ShieldCheck className="w-5 h-5" />,
      headline: 'Explain recommendations and empower clinical leaders',
      description: 'Grounded in institutional SOPs via hybrid vector RAG. Every dispatch advisory requires explicit coordinator authorization.',
      tech: 'Hybrid pgvector RAG & HITL Gate',
      visualOutput: 'Clear plain-English justifications with verified clinical protocol citations.',
      metric: '100%',
      metricLabel: 'Audited Decisions',
    },
  ];

  const current = stages[activeStage];

  return (
    <section id="product-flow" className="relative py-32 bg-section-softBlue text-slate-900 border-t border-blue-100 overflow-hidden">
      {/* Background radial accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-200/40 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Badge variant="cyan" size="md" className="mb-4 bg-blue-100 text-blue-800 border-blue-300">
            THE INTELLICARE LIFECYCLE
          </Badge>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            From operational data to confident decisions.
          </h2>

          <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A single, continuous progression that transforms noisy clinical telemetry into proactive operational action.
          </p>
        </div>

        {/* Cinematic 4-Stage Horizontal Stepper */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-2.5 rounded-2xl bg-white border border-blue-200 shadow-lg mb-10">
          {stages.map((st, idx) => {
            const isActive = idx === activeStage;
            return (
              <button
                key={st.id}
                onClick={() => setActiveStage(idx)}
                className={`flex flex-col items-start p-4 rounded-xl text-left transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      isActive ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {st.step}
                  </span>
                  <div className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                    {st.icon}
                  </div>
                </div>

                <span className="font-display font-bold text-sm tracking-wider uppercase">
                  {st.title}
                </span>
                <span className={`text-[11px] font-mono mt-0.5 truncate w-full ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>
                  {st.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Horizontal Stage Showcase Box */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-blue-200/80 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Narrative Details (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100 px-3 py-1 rounded-full">
                STAGE {current.step} &bull; {current.tag}
              </span>
              <span className="text-xs font-mono text-slate-500">
                LIFECYCLE STEP {activeStage + 1} OF 4
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {current.headline}
            </h3>

            <p className="text-base text-slate-600 leading-relaxed">
              {current.description}
            </p>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 flex items-start gap-3 mt-2">
              <div className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-slate-900 block uppercase">
                  Operational Transformation
                </span>
                <span className="text-xs text-slate-700 leading-relaxed mt-0.5 block">
                  {current.visualOutput}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/platform')}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-700 hover:text-cyan-900 transition-colors cursor-pointer"
              >
                <span>Deep Dive on {current.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Key Spec Card (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-8 rounded-2xl flex flex-col justify-between gap-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Engine Specification
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                ACTIVE
              </span>
            </div>

            <div>
              <span className="text-xs font-mono text-cyan-400 block mb-1">
                Underlying Technology
              </span>
              <h4 className="text-xl font-display font-bold text-white mb-4">
                {current.tech}
              </h4>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col">
                <span className="text-3xl font-display font-bold text-cyan-300">
                  {current.metric}
                </span>
                <span className="text-xs font-mono text-slate-400 mt-1">
                  {current.metricLabel}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Step {activeStage + 1} / 4</span>
              <button
                onClick={() => setActiveStage((activeStage + 1) % stages.length)}
                className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer font-bold"
              >
                Next Stage &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
