import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, ArrowDown, Activity, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const CoreStory: React.FC = () => {
  const dynamicFactors = [
    {
      title: 'Demand changes continuously',
      subtitle: 'Surges arrive unexpectedly across triage, ambulance arrivals, and seasonal epidemics.',
      detail: 'Epidemic peaks, seasonal virus shifts, and localized trauma incidents spike arrivals without notice.',
      metric: '+28%',
      metricLabel: 'Hourly arrival variance',
    },
    {
      title: 'Resources are strictly limited',
      subtitle: 'ICU beds, surgical suites, and specialized clinical staff cannot be scaled instantaneously.',
      detail: 'Staffing ratios, physical isolation beds, and ventilator equipment enforce hard mathematical limits.',
      metric: '94%',
      metricLabel: 'Peak capacity ceiling',
    },
    {
      title: 'Decisions are deeply interconnected',
      subtitle: 'A delayed discharge in General Medicine creates an admission gridlock in Emergency and ICU.',
      detail: 'Reallocating nurses or beds to one department creates cascading trade-offs across all other units.',
      metric: '< 15m',
      metricLabel: 'Cascading delay latency',
    },
  ];

  return (
    <section id="problem" className="relative py-32 bg-section-offwhite text-slate-900 border-t border-slate-200 overflow-hidden">
      {/* Subtle light background grid */}
      <div className="absolute inset-0 bg-grid-pattern-light opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Eyebrow */}
        <div className="max-w-4xl mb-16">
          <Badge variant="cyan" size="md" className="mb-4 bg-cyan-100 text-cyan-800 border-cyan-300">
            THE REALITY OF CLINICAL CAPACITY
          </Badge>

          {/* Huge Editorial Headline */}
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Hospital operations are dynamic.
          </h2>

          <p className="mt-6 text-xl sm:text-2xl text-slate-600 font-normal leading-relaxed max-w-3xl">
            Static schedules and backward-looking reports fail when clinical demand fluctuates by the hour.
          </p>
        </div>

        {/* Editorial Layout: Left Dynamic Points vs Right Live Tension Gauge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Progressive Dynamic Realities (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {dynamicFactors.map((item, idx) => (
              <div
                key={idx}
                className="glass-panel-light-interactive p-6 sm:p-8 rounded-3xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="flex flex-col gap-1.5 max-w-md">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <h3 className="text-xl font-display font-bold text-slate-900">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed pl-10">
                    {item.subtitle}
                  </p>
                </div>

                <div className="sm:text-right shrink-0 pl-10 sm:pl-0 sm:border-l sm:border-slate-200 sm:pl-6">
                  <span className="font-display text-2xl font-bold text-slate-900 block">
                    {item.metric}
                  </span>
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                    {item.metricLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Dynamic System Tension Visualizer (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-600" />
                <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                  Operational System Tension
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">
                HIGH VOLATILITY
              </span>
            </div>

            {/* 4 Vector Indicators */}
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-sm font-medium text-slate-700">Patient Demand</span>
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-rose-600">
                  <span>Surging</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-sm font-medium text-slate-700">Available Beds</span>
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-rose-600">
                  <span>Depleting</span>
                  <ArrowDownRight className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-sm font-medium text-slate-700">Clinical Staff Roster</span>
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-600">
                  <span>Fixed Shift Bounds</span>
                  <Minus className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-sm font-medium text-slate-700">Surge Capacity Buffer</span>
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-rose-600">
                  <span>Critical (94%)</span>
                  <ArrowDownRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Transition into IntelliCare Solution */}
            <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200/80 flex items-start gap-3 mt-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-cyan-900 block font-display">
                  IntelliCare bridges the gap
                </span>
                <p className="text-xs text-cyan-800/90 leading-relaxed mt-0.5">
                  Turning disjointed operational telemetry into predictive foresight, continuous optimization, and grounded human decisions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Footer Transition */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm">
            <span>FROM OBSERVATION TO ACTION</span>
            <ArrowDown className="w-3.5 h-3.5 text-cyan-600 animate-bounce" />
            <span className="text-slate-900 font-bold">The Closed-Loop Intelligence Flow</span>
          </div>
        </div>
      </div>
    </section>
  );
};
