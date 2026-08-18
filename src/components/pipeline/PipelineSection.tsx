import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import { PIPELINE_STEPS } from '../../data/pipelineSteps';
import { Badge } from '../ui/Badge';
import { ArrowRight, Eye, TrendingUp, Cpu, BookOpen, Sliders, ShieldCheck, ChevronRight, Check } from 'lucide-react';

export const PipelineSection: React.FC = () => {
  const activeIndex = useSimStore((state) => state.activePipelineIndex);
  const setActiveIndex = useSimStore((state) => state.setActivePipelineIndex);

  const activeStep = PIPELINE_STEPS[activeIndex] || PIPELINE_STEPS[0];

  const stepIcons = [
    <Eye className="w-5 h-5" />,
    <TrendingUp className="w-5 h-5" />,
    <Cpu className="w-5 h-5" />,
    <BookOpen className="w-5 h-5" />,
    <Sliders className="w-5 h-5" />,
    <ShieldCheck className="w-5 h-5" />
  ];

  return (
    <section id="pipeline" className="relative py-28 bg-navy-950 overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="indigo" size="md" className="mb-4">
            END-TO-END INTELLIGENCE LIFECYCLE
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            From Data to Decision
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            The closed-loop architecture connecting continuous hospital telemetry to mathematically verified, human-governed operational actions.
          </p>
        </div>

        {/* Interactive Step Stepper Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 p-2 rounded-2xl bg-surface-100/70 border border-slate-800 backdrop-blur-xl mb-12 shadow-2xl">
          {PIPELINE_STEPS.map((step, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={step.id}
                onClick={() => setActiveIndex(idx)}
                className={`relative flex flex-col items-center sm:items-start p-3.5 rounded-xl text-left transition-all duration-300 cursor-pointer focus:outline-none ${
                  isActive
                    ? 'bg-surface-200 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)] text-white'
                    : 'hover:bg-surface-200/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step.number}
                  </span>
                  <div
                    className={`transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-500'
                    }`}
                  >
                    {stepIcons[idx]}
                  </div>
                </div>
                <span className="font-mono text-xs font-bold tracking-wider uppercase">
                  {step.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 hidden md:block w-2 h-2 rotate-45 bg-surface-200 border-r border-b border-cyan-500/40" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Interactive Visualizer */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Narrative & Details */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Badge variant="cyan" size="sm">
                STAGE {activeStep.number} &bull; {activeStep.badge}
              </Badge>
              <span className="text-xs font-mono text-slate-500">
                LIFECYCLE PIPELINE STEP {activeIndex + 1} OF 6
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
              {activeStep.headline}
            </h3>

            <p className="text-base font-medium text-cyan-300/90">
              {activeStep.subhead}
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">
              {activeStep.description}
            </p>

            {/* Input / Output Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
              <div className="p-3.5 rounded-xl bg-surface-100/80 border border-slate-800">
                <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Inputs Ingested
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeStep.inputs.map((item, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded bg-surface-200 text-slate-300 border border-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-100/80 border border-slate-800">
                <span className="text-[11px] font-mono font-semibold text-cyan-400 uppercase tracking-wider block mb-2">
                  Deterministic Outputs
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeStep.outputs.map((item, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Flow Diagram */}
          <div className="lg:col-span-5 bg-surface-50/90 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-semibold text-slate-300">
                STAGE COMPUTATION TENSOR
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                STATUS: ACTIVE
              </span>
            </div>

            {/* Algorithmic Flow Nodes */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                Core Engines & Formulations
              </span>
              {activeStep.algorithms.map((alg, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-100 border border-slate-800/80 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-mono text-slate-200">
                      {alg}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              ))}
            </div>

            {/* Next Step Shortcut Button */}
            <div className="pt-2">
              <button
                onClick={() => setActiveIndex((activeIndex + 1) % PIPELINE_STEPS.length)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-surface-200 hover:bg-surface-300 border border-slate-700 text-xs font-mono text-cyan-300 transition-colors cursor-pointer"
              >
                <span>Advance to Step {(activeIndex + 1) % PIPELINE_STEPS.length + 1}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
