import React from 'react';
import { Database, Clock, Shuffle, ArrowDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const CoreStory: React.FC = () => {
  const problems = [
    {
      icon: <Database className="w-6 h-6 text-amber-400" />,
      tag: 'SILOED DATA ECOSYSTEMS',
      title: 'Fragmented Operations',
      description:
        'Data lives trapped across disconnected EHRs, admission registries, triage desks, and staffing spreadsheets with zero unified real-time visibility.',
      impact: 'Admissions and acuity shifts cannot be correlated before clinical bottlenecks occur.',
      solutionTag: 'Kafka Stream Normalization',
      badgeColor: 'amber' as const,
    },
    {
      icon: <Clock className="w-6 h-6 text-rose-400" />,
      tag: 'DELAYED INTERVENTIONS',
      title: 'Reactive Planning',
      description:
        'Resources and staffing are planned around current or past conditions rather than anticipated multi-hour horizon surges.',
      impact: 'Emergency overcrowding causes domino delays in ICU admissions and elective surgical cancellations.',
      solutionTag: 'Multi-Horizon Neural Forecasting',
      badgeColor: 'rose' as const,
    },
    {
      icon: <Shuffle className="w-6 h-6 text-cyan-400" />,
      tag: 'MULTI-DIMENSIONAL BOTTLENECKS',
      title: 'Complex Constraints',
      description:
        'Staff rosters, nurse-to-patient mandatory ratios, bed acuity classes, and incoming demand must be mathematically balanced at the same time.',
      impact: 'Manual spreadsheets fail to compute globally optimal assignments under combinatorial explosion.',
      solutionTag: 'MILP & Google OR-Tools',
      badgeColor: 'cyan' as const,
    },
  ];

  return (
    <section id="platform" className="relative py-28 bg-navy-900/60 border-t border-b border-slate-800/80">
      {/* Background illumination */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <Badge variant="cyan" size="md" className="mb-4">
            THE HOSPITAL CAPACITY PARADOX
          </Badge>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Hospitals generate enormous amounts of data.
          </h2>

          <p className="mt-4 font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-cyan">
            IntelliCare turns that data into decisions.
          </p>

          <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed">
            Modern healthcare systems are rich in telemetry but poor in forward-looking operational synthesis. Static scheduling cannot keep pace with dynamic clinical demand.
          </p>
        </div>

        {/* 3 Core Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {problems.map((prob, idx) => (
            <div
              key={idx}
              className="glass-panel-interactive p-8 rounded-3xl border border-slate-800 flex flex-col justify-between group hover:border-slate-700 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-surface-200 border border-slate-700/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {prob.icon}
                  </div>
                  <Badge variant={prob.badgeColor} size="sm">
                    {prob.tag}
                  </Badge>
                </div>

                <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {prob.title}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  {prob.description}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/80 mt-4 flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-400 leading-snug">
                    {prob.impact}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>IntelliCare: {prob.solutionTag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transition callout */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 bg-surface-100 px-4 py-2 rounded-full border border-slate-800">
            <span>OPERATIONAL CONTINUUM</span>
            <ArrowDown className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
            <span className="text-cyan-300">From Raw Data to Human Action</span>
          </div>
        </div>
      </div>
    </section>
  );
};
