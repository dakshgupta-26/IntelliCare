import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, ArrowDown, Activity, CheckCircle2 } from 'lucide-react';

export const CoreStory: React.FC = () => {
  // Interactive surge tension simulation slider
  const [surgeLevel, setSurgeLevel] = useState<number>(20); // 0% to 50%

  // Derived tension dynamics
  const patientDemandPercent = Math.round(100 + surgeLevel * 1.4);
  const bedOccupancyPercent = Math.min(98, Math.round(76 + surgeLevel * 0.44));
  const staffUtilizationPercent = Math.min(96, Math.round(70 + surgeLevel * 0.52));
  const surgeBufferPercent = Math.max(2, 100 - bedOccupancyPercent);

  const dynamicFactors = [
    {
      step: '01',
      title: 'Demand changes by the hour',
      subtitle: 'Triage arrivals, emergency diversions, and seasonal spikes arrive without notice.',
      metric: '+28%',
      metricLabel: 'Hourly presentation variance',
    },
    {
      step: '02',
      title: 'Physical resources cannot scale instantaneously',
      subtitle: 'ICU isolation beds, sterile surgical suites, and specialized intensivists have rigid bounds.',
      metric: '94%',
      metricLabel: 'Peak capacity threshold',
    },
    {
      step: '03',
      title: 'Local friction creates campus gridlock',
      subtitle: 'A single delayed discharge cascade blocks emergency admissions and backs up triage bays.',
      metric: '< 15m',
      metricLabel: 'Propagation delay',
    },
  ];

  return (
    <section id="problem" className="relative py-28 sm:py-36 bg-[#F8FAFC] text-slate-900 border-t border-slate-200 overflow-hidden">
      {/* Precision architectural light grid */}
      <div className="absolute inset-0 bg-grid-pattern-light opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Section Header */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 border border-slate-300 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-700 uppercase">
              THE OPERATIONAL TENSION
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-[10px] font-mono text-slate-500">SIMULATED SCENARIO</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
            Hospital capacity doesn't stand still.
          </h2>

          <p className="mt-4 font-display text-2xl sm:text-3xl font-semibold text-slate-600">
            Demand changes by the hour. Resources cannot.
          </p>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
            When operational surges hit triage, the latency between observing a capacity breach and mobilizing specialized clinicians determines whether patient flow remains stable or collapses into diversion.
          </p>
        </div>

        {/* 12-Column Split: Editorial Structural Drivers (7 Cols) vs Live Dynamic Tension Visualizer (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Core Realities */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between gap-4">
            {dynamicFactors.map((item) => (
              <div
                key={item.step}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {item.step}
                    </span>
                    <h3 className="text-lg font-display font-bold text-slate-900">
                      {item.title}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-display text-2xl font-bold text-slate-900">
                      {item.metric}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      {item.metricLabel}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed pl-10">
                  {item.subtitle}
                </p>
              </div>
            ))}

            {/* Core insight callout */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white flex items-start gap-3.5 shadow-sm mt-2">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider block">
                  The Core Vulnerability
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-medium mt-1">
                  "When capacity tightens, the cost of reacting late rises exponentially."
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Animated Tension Visualizer */}
          <div className="lg:col-span-6 xl:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xl flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-600" />
                  <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                    Interactive Capacity Tension Gauge
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                  ILLUSTRATIVE SCENARIO
                </span>
              </div>

              {/* Interactive Surge Slider */}
              <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="font-bold text-slate-700">Simulate Acute Intake Surge</span>
                  <span className="font-bold text-rose-600">+{surgeLevel}% Influx</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={45}
                  step={5}
                  value={surgeLevel}
                  onChange={(e) => setSurgeLevel(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                  aria-label="Simulate acute intake surge percentage"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1.5">
                  <span>Baseline (T-0)</span>
                  <span>Moderate Surge (+20%)</span>
                  <span>Severe Influx (+45%)</span>
                </div>
              </div>

              {/* 4 Vector Indicators in Tension */}
              <div className="flex flex-col gap-3 mt-4">
                {/* 1. Patient Demand */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-700 block">Patient Demand</span>
                    <span className="text-[10px] font-mono text-slate-500">Index vs Baseline: {patientDemandPercent}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-rose-600">
                    <span>Surging</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* 2. Available Beds */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-700 block">Available Beds</span>
                    <span className="text-[10px] font-mono text-slate-500">ICU Occupancy: {bedOccupancyPercent}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-rose-600">
                    <span>Depleting</span>
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                </div>

                {/* 3. Staff Capacity */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-700 block">Clinical Staff Capacity</span>
                    <span className="text-[10px] font-mono text-slate-500">Roster Utilization: {staffUtilizationPercent}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-600">
                    <span>Fixed Bounds</span>
                    <Minus className="w-4 h-4" />
                  </div>
                </div>

                {/* 4. Surge Capacity Buffer */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-700 block">Surge Capacity Buffer</span>
                    <span className="text-[10px] font-mono text-slate-500">Remaining Safety Margin: {surgeBufferPercent}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-rose-600">
                    <span>{surgeBufferPercent < 10 ? 'Critical Reserve' : 'Constrained'}</span>
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Transition to Solution */}
            <div className="p-4 rounded-xl bg-cyan-50/80 border border-cyan-200/80 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
              <div className="text-xs text-cyan-900 leading-relaxed">
                <strong className="font-semibold block text-cyan-950 font-display">
                  IntelliCare bridges this gap
                </strong>
                By projecting surges hours in advance, IntelliCare reallocates clinical staff and bed buffers mathematically before capacity limits are breached.
              </div>
            </div>
          </div>
        </div>

        {/* Section Footer Transition */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm">
            <span>OPERATIONAL DATA</span>
            <span className="text-slate-300">&rarr;</span>
            <span className="text-slate-900 font-bold">The Closed-Loop Intelligence Lifecycle</span>
            <ArrowDown className="w-3.5 h-3.5 text-cyan-600 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

