import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, ArrowDown, Activity, CheckCircle2 } from 'lucide-react';

export const CoreStory: React.FC = () => {
  // Interactive surge tension simulation slider
  const [surgeLevel, setSurgeLevel] = useState<number>(20); // 0% to 45%

  // Derived tension dynamics
  const patientDemandPercent = Math.round(100 + surgeLevel * 1.4);
  const bedOccupancyPercent = Math.min(98, Math.round(76 + surgeLevel * 0.44));
  const staffUtilizationPercent = Math.min(96, Math.round(70 + surgeLevel * 0.52));
  const surgeBufferPercent = Math.max(2, 100 - bedOccupancyPercent);
  const isSurgeBreach = bedOccupancyPercent >= 90;

  const dynamicFactors = [
    {
      step: '01',
      title: 'Demand changes by the hour',
      subtitle: 'Triage arrivals, emergency diversions, and seasonal spikes arrive without warning.',
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

  // SVG capacity monitoring curve coordinates based on slider
  const demandPeakY = Math.max(25, 95 - surgeLevel * 1.55); // lower Y is higher demand
  const capacityLineY = 55; // rigid resource line

  return (
    <section id="problem" className="relative py-28 sm:py-36 bg-[#070B17] text-slate-100 border-t border-white/[0.08] overflow-hidden">
      {/* Precision architectural dark grid & ambient depth */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[500px] bg-rose-500/[0.03] blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Section Header */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1220] border border-white/[0.08] mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-200 uppercase">
              THE OPERATIONAL TENSION
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[10px] font-mono text-cyan-400/90 font-medium">CAPACITY PARADOX</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
            Hospital capacity doesn't stand still.
          </h2>

          <p className="mt-4 font-display text-2xl sm:text-3xl font-semibold text-slate-300">
            Demand changes by the hour. Resources cannot.
          </p>

          <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed font-normal">
            When operational surges hit triage, the latency between observing a capacity breach and mobilizing specialized clinicians determines whether patient flow remains stable or collapses into diversion.
          </p>
        </div>

        {/* 12-Column Split: Editorial Structural Realities vs Operations Monitoring Capacity Tension Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Core Realities */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-between gap-4">
            {dynamicFactors.map((item) => (
              <div
                key={item.step}
                className="p-6 sm:p-7 rounded-2xl bg-[#0B1220] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-200 flex flex-col justify-between gap-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#070B17] border border-white/[0.1] text-cyan-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {item.step}
                    </span>
                    <h3 className="text-lg font-display font-bold text-white">
                      {item.title}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-display text-2xl font-bold text-white">
                      {item.metric}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      {item.metricLabel}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed pl-10">
                  {item.subtitle}
                </p>
              </div>
            ))}

            {/* Core vulnerability alert */}
            <div className="p-5 rounded-2xl bg-[#0E1626] border border-amber-500/30 text-white flex items-start gap-3.5 shadow-sm mt-1">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider block">
                  The Core Vulnerability
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-medium mt-1">
                  "Reacting late has an operational cost: once surge crosses physical thresholds, recovery latency scales non-linearly."
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Animated Operations Monitoring Capacity Tension Visualization */}
          <div className="lg:col-span-6 xl:col-span-6 bg-[#0B1220] p-6 sm:p-8 rounded-2xl border border-white/[0.08] shadow-2xl flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Capacity Tension Monitoring System
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-300 font-semibold">
                  SIMULATED TELEMETRY
                </span>
              </div>

              {/* Interactive Influx Slider */}
              <div className="mt-5 p-4 rounded-xl bg-[#070B17] border border-white/[0.08]">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="font-bold text-slate-300">Simulate Acute Intake Surge</span>
                  <span className="font-bold text-rose-400">+{surgeLevel}% Influx Velocity</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={45}
                  step={5}
                  value={surgeLevel}
                  onChange={(e) => setSurgeLevel(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  aria-label="Simulate acute intake surge percentage"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
                  <span>Baseline (T-0)</span>
                  <span>Surge (+20%)</span>
                  <span>Severe Influx (+45%)</span>
                </div>
              </div>

              {/* Operations Monitoring Visualization (SVG Curve with Thresholds & Risk Zone) */}
              <div className="mt-5 p-4 rounded-xl bg-[#070B17] border border-white/[0.08] relative">
                <div className="flex items-center justify-between text-[11px] font-mono mb-2 text-slate-400">
                  <span className="font-semibold text-slate-300">CAMPUS CAPACITY vs PATIENT VELOCITY</span>
                  <span className={isSurgeBreach ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {isSurgeBreach ? 'CRITICAL RISK ZONE' : 'STABLE OPERATING ENVELOPE'}
                  </span>
                </div>

                <div className="relative w-full h-36">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 460 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="riskZoneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FB7185" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#FB7185" stopOpacity="0.02" />
                      </linearGradient>
                      <linearGradient id="demandCurveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#19C7F3" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#19C7F3" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Risk Zone Shaded Area above Capacity Line */}
                    <rect x="0" y="0" width="460" height={capacityLineY} fill="url(#riskZoneGradient)" />

                    {/* Statutory Capacity Line */}
                    <line x1="0" y1={capacityLineY} x2="460" y2={capacityLineY} stroke="#FB7185" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="8" y={capacityLineY - 6} fill="#FB7185" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      CAPACITY THRESHOLD (MAX STATIC BEDS)
                    </text>

                    {/* Dynamic Demand Area under curve */}
                    <path
                      d={`M 0,105 C 120,95 200,${demandPeakY + 25} 320,${demandPeakY} S 400,${demandPeakY - 5} 460,${demandPeakY} L 460,120 L 0,120 Z`}
                      fill="url(#demandCurveGradient)"
                    />

                    {/* Dynamic Demand Curve */}
                    <path
                      d={`M 0,105 C 120,95 200,${demandPeakY + 25} 320,${demandPeakY} S 400,${demandPeakY - 5} 460,${demandPeakY}`}
                      fill="none"
                      stroke="#19C7F3"
                      strokeWidth="2.5"
                    />

                    {/* Proactive Intervention Point marker */}
                    <g transform="translate(180, 20)">
                      <line x1="0" y1="0" x2="0" y2="85" stroke="#34D399" strokeWidth="1" strokeDasharray="2 2" />
                      <circle cx="0" cy="50" r="3" fill="#34D399" />
                      <rect x="-60" y="0" width="120" height="18" rx="4" fill="#0B1220" stroke="#34D399" strokeWidth="1" />
                      <text x="0" y="12" textAnchor="middle" fill="#34D399" fontSize="8" fontFamily="monospace" fontWeight="bold">
                        INTELLICARE WINDOW
                      </text>
                    </g>

                    {/* Peak Marker Dot */}
                    <circle cx="420" cy={demandPeakY} r="4" fill={isSurgeBreach ? '#FB7185' : '#19C7F3'} />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-white/[0.06] mt-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" /> Patient Demand Curve
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-rose-400 inline-block border-dashed" /> Static Capacity Limit
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Proactive Intervention (T-4h)
                  </span>
                </div>
              </div>

              {/* 4 Vector Indicators in Tension */}
              <div className="flex flex-col gap-2.5 mt-5">
                {/* 1. Patient Demand */}
                <div className="p-3 rounded-xl bg-[#070B17] border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-200 block">Patient Demand</span>
                    <span className="text-[10px] font-mono text-slate-400">Presentation Index: {patientDemandPercent}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-rose-400">
                    <span>Surging</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* 2. Available Beds */}
                <div className="p-3 rounded-xl bg-[#070B17] border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-200 block">Available Beds</span>
                    <span className="text-[10px] font-mono text-slate-400">ICU Occupancy: {bedOccupancyPercent}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-rose-400">
                    <span>Depleting</span>
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                </div>

                {/* 3. Staff Capacity */}
                <div className="p-3 rounded-xl bg-[#070B17] border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-200 block">Clinical Staff Capacity</span>
                    <span className="text-[10px] font-mono text-slate-400">Roster Utilization: {staffUtilizationPercent}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-400">
                    <span>Fixed Bounds</span>
                    <Minus className="w-4 h-4" />
                  </div>
                </div>

                {/* 4. Surge Buffer */}
                <div className="p-3 rounded-xl bg-[#070B17] border border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-200 block">Surge Capacity Buffer</span>
                    <span className="text-[10px] font-mono text-slate-400">Remaining Safety Margin: {surgeBufferPercent}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-rose-400">
                    <span>{surgeBufferPercent < 10 ? 'Critical Reserve' : 'Constrained'}</span>
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Transition to IntelliCare */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="font-semibold block text-cyan-200 font-display">
                  IntelliCare closes this latency gap
                </strong>
                By predicting demand curves hours in advance, IntelliCare mobilizes nurse pools and bed transitions mathematically before capacity thresholds are breached.
              </div>
            </div>
          </div>
        </div>

        {/* Continuity Transition Indicator */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2.5 text-xs font-mono text-slate-400 bg-[#0B1220] px-5 py-2.5 rounded-full border border-white/[0.08] shadow-sm">
            <span className="text-cyan-400 font-bold">OPERATIONAL TELEMETRY</span>
            <span className="text-slate-600">&rarr;</span>
            <span className="text-white font-bold">The Closed-Loop Intelligence Lifecycle</span>
            <ArrowDown className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};
