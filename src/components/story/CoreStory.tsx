import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, Activity, CheckCircle2, ShieldAlert } from 'lucide-react';

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
      subtitle: 'Triage presentations, emergency diversions, and seasonal spikes arrive non-linearly without warning.',
      metric: '+28%',
      metricLabel: 'Hourly presentation variance',
    },
    {
      step: '02',
      title: 'Physical resources cannot scale instantaneously',
      subtitle: 'ICU isolation suites, sterile surgical blocks, and board-certified intensivists have rigid physical boundaries.',
      metric: '94%',
      metricLabel: 'Peak capacity threshold',
    },
    {
      step: '03',
      title: 'Local friction creates campus gridlock',
      subtitle: 'A single delayed discharge cascade blocks acute inpatient transfers and backs up ambulance intake bays.',
      metric: '< 15m',
      metricLabel: 'Surge propagation latency',
    },
  ];

  // SVG capacity curve geometry based on surgeLevel
  const demandPeakY = Math.max(22, 90 - surgeLevel * 1.5);
  const capacityLineY = 52;

  return (
    <section
      id="problem"
      className="relative pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-10 bg-[#070B17] text-[#F8FAFC] border-t border-white/[0.07] overflow-hidden"
    >
      {/* Precision atmospheric dark depth & barely-visible blue-gray technical grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[550px] h-[450px] bg-cyan-500/[0.02] blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-rose-500/[0.02] blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Section Header */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1020] border border-white/[0.07] mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#19C7F3]" />
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#A7B4C8] uppercase">
              THE OPERATIONAL TENSION
            </span>
            <span className="text-[#64748B]">|</span>
            <span className="text-[10px] font-mono text-[#19C7F3] font-medium">CAPACITY PARADOX</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.08]">
            Hospital capacity doesn't stand still.
          </h2>

          <p className="mt-4 font-display text-2xl sm:text-3xl font-semibold text-[#A7B4C8]">
            Demand changes by the hour. Resources cannot.
          </p>

          <p className="mt-5 text-base sm:text-lg text-[#64748B] max-w-2xl leading-relaxed font-normal">
            When operational surges hit triage, the latency between observing a capacity breach and mobilizing specialized clinicians determines whether hospital patient flow remains stable or collapses into ambulance diversion.
          </p>
        </div>

        {/* 12-Column Split: Structural Realities vs Capacity Tension Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Core Realities (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            {dynamicFactors.map((item) => (
              <div
                key={item.step}
                className="p-6 sm:p-7 rounded-2xl bg-[#0A1020] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-200 flex flex-col justify-between gap-4 shadow-[0_8px_24px_rgba(0,0,0,0.35)] group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-[#070B17] border border-white/[0.07] text-[#19C7F3] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {item.step}
                    </span>
                    <h3 className="text-lg font-display font-bold text-[#F8FAFC] group-hover:text-[#4DD8FF] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-display text-2xl font-bold text-[#F8FAFC]">
                      {item.metric}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B] uppercase block">
                      {item.metricLabel}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#A7B4C8] leading-relaxed pl-10 font-sans">
                  {item.subtitle}
                </p>
              </div>
            ))}

            {/* Core vulnerability alert */}
            <div className="p-5 rounded-2xl bg-[#0D1526] border border-amber-500/25 text-[#F8FAFC] flex items-start gap-3.5 shadow-sm mt-1">
              <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-mono font-bold text-[#F59E0B] uppercase tracking-wider block">
                  The Core Vulnerability
                </span>
                <p className="text-sm text-[#A7B4C8] leading-relaxed font-normal mt-1">
                  "Reacting late has an operational cost: once surge crosses physical capacity thresholds, recovery latency scales non-linearly across all units."
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Animated Operations Monitoring Capacity Tension Visualization (6 Cols) */}
          <div className="lg:col-span-6 bg-[#0A1020] p-6 sm:p-8 rounded-2xl border border-white/[0.07] shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#19C7F3]" />
                  <span className="text-xs font-mono font-bold text-[#F8FAFC] uppercase tracking-wider">
                    Capacity Tension System
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-[#A7B4C8] font-semibold border border-white/[0.05]">
                  REAL-TIME TELEMETRY
                </span>
              </div>

              {/* Interactive Influx Slider (Level 2 to Level 3) */}
              <div className="mt-5 p-4 rounded-xl bg-[#070B17] border border-white/[0.07]">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="font-semibold text-[#A7B4C8]">Simulate Acute Intake Surge</span>
                  <span className="font-bold text-[#FB7185]">+{surgeLevel}% Influx Velocity</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={45}
                  step={5}
                  value={surgeLevel}
                  onChange={(e) => setSurgeLevel(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#0D1526] rounded-lg appearance-none cursor-pointer accent-[#19C7F3]"
                  aria-label="Simulate acute intake surge percentage"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#64748B] mt-1.5">
                  <span>Baseline (T-0)</span>
                  <span>Surge (+20%)</span>
                  <span>Severe Influx (+45%)</span>
                </div>
              </div>

              {/* Dynamic Capacity vs Demand SVG Curve Visualization */}
              <div className="mt-5 p-4 rounded-xl bg-[#070B17] border border-white/[0.07] relative">
                <div className="flex items-center justify-between text-[11px] font-mono mb-2 text-[#A7B4C8]">
                  <span className="font-semibold text-[#A7B4C8]">CAMPUS CAPACITY vs PATIENT VELOCITY</span>
                  <span className={isSurgeBreach ? 'text-[#FB7185] font-bold flex items-center gap-1' : 'text-[#34D399] font-bold flex items-center gap-1'}>
                    {isSurgeBreach ? (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5" />
                        CRITICAL RISK ZONE
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
                        STABLE OPERATING ENVELOPE
                      </>
                    )}
                  </span>
                </div>

                <div className="relative w-full h-36">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 460 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="riskZoneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FB7185" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#FB7185" stopOpacity="0.01" />
                      </linearGradient>
                      <linearGradient id="demandCurveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#19C7F3" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#19C7F3" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Subtle grid lines */}
                    <line x1="0" y1="30" x2="460" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="60" x2="460" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="90" x2="460" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                    {/* Risk Zone Shaded Area above Capacity Line */}
                    <rect x="0" y="0" width="460" height={capacityLineY} fill="url(#riskZoneGradient)" />

                    {/* Statutory Capacity Limit Line */}
                    <line
                      x1="0"
                      y1={capacityLineY}
                      x2="460"
                      y2={capacityLineY}
                      stroke="#FB7185"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="8"
                      y={capacityLineY - 6}
                      fill="#FB7185"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      CAPACITY THRESHOLD (MAX STATIC BEDS)
                    </text>

                    {/* Dynamic Demand Area under curve */}
                    <path
                      d={`M 0,105 C 120,95 200,${demandPeakY + 22} 320,${demandPeakY} S 400,${demandPeakY - 5} 460,${demandPeakY} L 460,120 L 0,120 Z`}
                      fill="url(#demandCurveGradient)"
                    />

                    {/* Dynamic Demand Curve */}
                    <path
                      d={`M 0,105 C 120,95 200,${demandPeakY + 22} 320,${demandPeakY} S 400,${demandPeakY - 5} 460,${demandPeakY}`}
                      fill="none"
                      stroke="#19C7F3"
                      strokeWidth="2.5"
                    />

                    {/* Proactive Intervention Window */}
                    <g transform="translate(180, 18)">
                      <line x1="0" y1="0" x2="0" y2="85" stroke="#34D399" strokeWidth="1" strokeDasharray="2 2" />
                      <circle cx="0" cy="50" r="3" fill="#34D399" />
                      <rect x="-62" y="0" width="124" height="18" rx="4" fill="#0D1526" stroke="#34D399" strokeWidth="1" />
                      <text x="0" y="12" textAnchor="middle" fill="#34D399" fontSize="8" fontFamily="monospace" fontWeight="bold">
                        PROACTIVE WINDOW (T-4h)
                      </text>
                    </g>

                    {/* Peak Marker Dot */}
                    <circle cx="420" cy={demandPeakY} r="4" fill={isSurgeBreach ? '#FB7185' : '#19C7F3'} />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] pt-2 border-t border-white/[0.05] mt-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-[#19C7F3] inline-block" /> Patient Demand Curve
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-[#FB7185] inline-block border-dashed" /> Static Capacity Limit
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#34D399] inline-block" /> Proactive Window
                  </span>
                </div>
              </div>

              {/* 4 Vector Indicators in Tension */}
              <div className="flex flex-col gap-2 mt-5">
                {/* 1. Patient Demand */}
                <div className="p-3 rounded-xl bg-[#070B17] border border-white/[0.07] hover:bg-[#0D1526] transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#FB7185] animate-pulse" />
                    <div>
                      <span className="text-xs font-medium text-[#F8FAFC] block">PATIENT DEMAND</span>
                      <span className="text-[10px] font-mono text-[#64748B]">Presentation Index: {patientDemandPercent}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#FB7185]">
                    <span>↑ SURGING</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* 2. Available Beds */}
                <div className="p-3 rounded-xl bg-[#070B17] border border-white/[0.07] hover:bg-[#0D1526] transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#FB7185]" />
                    <div>
                      <span className="text-xs font-medium text-[#F8FAFC] block">AVAILABLE BEDS</span>
                      <span className="text-[10px] font-mono text-[#64748B]">ICU Occupancy: {bedOccupancyPercent}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#FB7185]">
                    <span>↓ DEPLETING</span>
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                </div>

                {/* 3. Staff Capacity */}
                <div className="p-3 rounded-xl bg-[#070B17] border border-white/[0.07] hover:bg-[#0D1526] transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                    <div>
                      <span className="text-xs font-medium text-[#F8FAFC] block">STAFF CAPACITY</span>
                      <span className="text-[10px] font-mono text-[#64748B]">Roster Utilization: {staffUtilizationPercent}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#F59E0B]">
                    <span>→ CONSTRAINED</span>
                    <Minus className="w-4 h-4" />
                  </div>
                </div>

                {/* 4. Surge Buffer */}
                <div className="p-3 rounded-xl bg-[#070B17] border border-white/[0.07] hover:bg-[#0D1526] transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${surgeBufferPercent < 10 ? 'bg-[#FB7185]' : 'bg-[#F59E0B]'}`} />
                    <div>
                      <span className="text-xs font-medium text-[#F8FAFC] block">SURGE BUFFER</span>
                      <span className="text-[10px] font-mono text-[#64748B]">Remaining Safety Margin: {surgeBufferPercent}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#FB7185]">
                    <span>↓ {surgeBufferPercent < 10 ? 'CRITICAL RESERVE' : 'EXHAUSTING'}</span>
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Transition to IntelliCare (Inner Panel Level 3) */}
            <div className="p-4 rounded-xl bg-[#0D1526] border border-[#19C7F3]/25 flex items-start gap-3 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-[#19C7F3] shrink-0 mt-0.5" />
              <div className="text-xs text-[#A7B4C8] leading-relaxed">
                <strong className="font-semibold block text-[#F8FAFC] font-display">
                  IntelliCare closes this latency gap
                </strong>
                By predicting acute demand curves hours in advance, IntelliCare mobilizes nurse pools and bed step-downs mathematically before statutory capacity thresholds are breached.
              </div>
            </div>
          </div>
        </div>

        {/* Continuous Telemetry Stream Conduit to Closed-Loop Lifecycle */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1020] border border-cyan-500/20 text-[11px] font-mono text-cyan-300 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-semibold tracking-wider uppercase">CONTINUOUS TELEMETRY FEED</span>
            <span className="text-slate-500">&rarr;</span>
            <span className="text-slate-200">CLOSED-LOOP ENGINE</span>
          </div>

          {/* Vertical continuous data connector line */}
          <div className="w-px h-8 sm:h-10 bg-gradient-to-b from-cyan-400/60 via-cyan-400/20 to-transparent relative mt-2.5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-ping" />
          </div>
        </div>
      </div>
    </section>
  );
};
