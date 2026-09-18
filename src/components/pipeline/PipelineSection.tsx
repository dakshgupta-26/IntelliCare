import React, { useState } from 'react';
import { 
  Eye, 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Sparkles,
  RefreshCw,
  ArrowRight,
  Activity
} from 'lucide-react';

export const PipelineSection: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [decisionStatus, setDecisionStatus] = useState<'pending' | 'accepted' | 'reviewed' | 'rejected'>('pending');

  const stages = [
    {
      id: 'observe',
      step: '01',
      title: 'OBSERVE',
      tag: 'Real-Time Telemetry',
      metric: '48 Streams Synced',
      status: '92% ICU Load',
      icon: <Eye className="w-4 h-4" />,
      tagline: 'Normalize fragmented hospital telemetry in real time',
      accent: 'cyan',
    },
    {
      id: 'predict',
      step: '02',
      title: 'PREDICT',
      tag: 'Neural Forecasting',
      metric: '+14.8% Surge Horizon',
      status: '91% Confidence',
      icon: <TrendingUp className="w-4 h-4" />,
      tagline: 'Forecast multi-horizon demand before surges materialize',
      accent: 'blue',
    },
    {
      id: 'optimize',
      step: '03',
      title: 'OPTIMIZE',
      tag: 'Mathematical Allocation',
      metric: '100% Constraints Met',
      status: '84% OR Utilization',
      icon: <Cpu className="w-4 h-4" />,
      tagline: 'Balance capacity under statutory clinical constraints',
      accent: 'teal',
    },
    {
      id: 'decide',
      step: '04',
      title: 'DECIDE',
      tag: 'Human Governance',
      metric: 'Physician Review Gate',
      status: 'Signed Execution',
      icon: <ShieldCheck className="w-4 h-4" />,
      tagline: 'Explain recommendations and empower clinical leadership',
      accent: 'emerald',
    },
  ];

  return (
    <section id="platform" className="relative pt-6 sm:pt-8 pb-16 sm:pb-20 bg-[#050814] text-slate-100 border-t border-white/[0.08] overflow-hidden">
      {/* Precision ambient background lighting */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[500px] bg-cyan-500/[0.03] blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/[0.03] blur-[180px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Incoming continuous telemetry conduit from CoreStory */}
        <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-cyan-400/40 to-cyan-400/90 mx-auto -mt-6 sm:-mt-8 mb-4 relative">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
        </div>

        {/* Compact Editorial Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1220] border border-cyan-500/30 mb-3 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-200 uppercase">
              THE INTELLICARE LIFECYCLE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-[10px] font-mono text-cyan-400 font-semibold tracking-wide">CLOSED-LOOP ENGINE</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-extrabold tracking-tight text-white leading-[1.08]">
            Observe <span className="text-cyan-400">&rarr;</span> Predict <span className="text-cyan-400">&rarr;</span> Optimize <span className="text-cyan-400">&rarr;</span> Decide.
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            One continuous operational intelligence pipeline turning raw campus telemetry into proactive, constraint-satisfying clinical rebalancing.
          </p>
        </div>

        {/* ================================================================ */}
        {/* Interactive Closed-Loop Circuit System                           */}
        {/* ================================================================ */}
        <div className="mb-8 max-w-6xl mx-auto">
          {/* Loop Conduit Header */}
          <div className="flex items-center justify-between px-4 py-2 rounded-t-xl bg-[#080E1C] border border-b-0 border-white/[0.08] text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-[spin_8s_linear_infinite]" />
              <span className="font-bold text-slate-200 uppercase tracking-wider">CLOSED-LOOP REBALANCING CIRCUIT</span>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ACTIVE FEEDBACK LOOP
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">STATE: STAGE 0{activeStage + 1} / 04</span>
            </div>
          </div>

          {/* 4 Interactive Connected Orbit Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 p-3 rounded-b-xl bg-[#070B17] border border-white/[0.08] shadow-2xl relative">
            {stages.map((st, idx) => {
              const isActive = idx === activeStage;
              return (
                <button
                  key={st.id}
                  onClick={() => setActiveStage(idx)}
                  className={`flex flex-col p-4 rounded-xl text-left transition-all duration-200 cursor-pointer relative group ${
                    isActive
                      ? 'bg-[#0E1729] border-2 border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.2)] text-white'
                      : 'bg-[#0A1120] border border-white/[0.06] text-slate-400 hover:text-white hover:border-white/[0.15] hover:bg-[#0C1424]'
                  }`}
                >
                  {/* Top Bar: Step & Icon */}
                  <div className="flex items-center justify-between w-full mb-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                          isActive
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-white/[0.05] text-slate-500'
                        }`}
                      >
                        {st.step}
                      </span>
                      <span className={`text-[10px] font-mono tracking-wider font-semibold uppercase ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                        {st.id}
                      </span>
                    </div>

                    <div className={isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}>
                      {st.icon}
                    </div>
                  </div>

                  {/* Node Title & Tag */}
                  <div className="mb-3">
                    <span className="font-display font-bold text-base tracking-tight text-white block">
                      {st.title}
                    </span>
                    <span className={`text-[11px] font-mono block mt-0.5 ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>
                      {st.tag}
                    </span>
                  </div>

                  {/* Live Node Metric Pill */}
                  <div className={`mt-auto pt-2.5 border-t text-[10px] font-mono flex items-center justify-between ${
                    isActive ? 'border-cyan-500/20 text-cyan-300' : 'border-white/[0.05] text-slate-500'
                  }`}>
                    <span className="truncate">{st.metric}</span>
                    <span className="font-bold shrink-0 ml-1">{st.status}</span>
                  </div>

                  {/* Flow Arrow to Next Step (Desktop Only) */}
                  {idx < 3 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-[#050814] border border-cyan-500/30 items-center justify-center text-cyan-400 shadow-sm pointer-events-none">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}

                  {/* Return Loop Indicator on Last Node */}
                  {idx === 3 && (
                    <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono text-emerald-400 items-center gap-1 shadow-sm pointer-events-none">
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                      <span>LOOP</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Continuous Feedback Conduit Banner */}
          <div className="mt-2.5 px-4 py-2 rounded-lg bg-[#080E1C]/80 border border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Closed Loop Feedback: Actions verified in Stage 04 immediately update telemetry baseline in Stage 01.</span>
            </div>
            <span className="hidden md:inline text-cyan-400 font-bold">ZERO DRIFT GUARANTEE</span>
          </div>
        </div>

        {/* Dynamic Interactive Stage Showcase Box */}
        <div className="bg-[#070B17] p-6 sm:p-10 rounded-2xl border border-white/[0.08] shadow-2xl">
          {/* ==================================================== */}
          {/* STAGE 01: OBSERVE — Real-Time Telemetry Module */}
          {/* ==================================================== */}
          {activeStage === 0 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                      STAGE 01 &bull; OBSERVE
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      CONTINUOUS INGESTION
                    </span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    Real-time operational telemetry across campus silos
                  </h3>
                </div>

                {/* System Status Banner */}
                <div className="p-3.5 rounded-xl bg-[#0B1220] border border-white/[0.08] flex items-center gap-3 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div className="text-xs font-mono">
                    <span className="font-bold text-white block">SYSTEM STATUS: SYNCHRONIZED</span>
                    <span className="text-slate-400">48 streams active &bull; Latency 184ms &bull; <span className="text-cyan-400 font-semibold">SIMULATED</span></span>
                  </div>
                </div>
              </div>

              {/* 6 Key Operational Telemetry Modules */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-4 rounded-xl bg-[#0B1220] border border-white/[0.08]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    ICU Occupancy
                  </span>
                  <span className="text-2xl font-display font-bold text-rose-300">92%</span>
                  <span className="text-[10px] font-mono text-slate-500 block mt-1">29/32 Beds</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0B1220] border border-white/[0.08]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Emergency Arrivals
                  </span>
                  <span className="text-2xl font-display font-bold text-amber-300">+18.4%</span>
                  <span className="text-[10px] font-mono text-slate-500 block mt-1">48 pts/hour</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0B1220] border border-white/[0.08]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Bed Availability
                  </span>
                  <span className="text-2xl font-display font-bold text-cyan-300">3 Beds</span>
                  <span className="text-[10px] font-mono text-slate-500 block mt-1">2 Iso, 1 Surg</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0B1220] border border-white/[0.08]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Staff Utilization
                  </span>
                  <span className="text-2xl font-display font-bold text-teal-300">82%</span>
                  <span className="text-[10px] font-mono text-slate-500 block mt-1">Ratio 1:2.1</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0B1220] border border-white/[0.08]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    OR Availability
                  </span>
                  <span className="text-2xl font-display font-bold text-white">84%</span>
                  <span className="text-[10px] font-mono text-slate-500 block mt-1">6/7 Active</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0B1220] border border-white/[0.08]">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Throughput
                  </span>
                  <span className="text-2xl font-display font-bold text-emerald-300">22.4</span>
                  <span className="text-[10px] font-mono text-slate-500 block mt-1">pts / hour</span>
                </div>
              </div>

              {/* Clean Telemetry Stream Visual */}
              <div className="p-5 rounded-xl bg-[#0B1220] border border-white/[0.08] font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 pb-3 border-b border-white/[0.08] mb-3">
                  <span className="font-bold text-slate-200">NORMALIZED TELEMETRY FEED (ADT / HL7 / FHIR)</span>
                  <span className="text-[10px] text-cyan-400 uppercase font-bold">STREAM TICKING</span>
                </div>

                <div className="space-y-2 text-slate-300">
                  <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02]">
                    <span className="text-slate-400">[19:14:02] ADT-A01 &bull; Ingest triage arrival presentation</span>
                    <span className="text-cyan-300 font-bold">Acuity Level 2 &bull; Bay 4</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02]">
                    <span className="text-slate-400">[19:14:18] HL7-ORU &bull; ICU Bed 08 vital telemetry synced</span>
                    <span className="text-emerald-300 font-bold">Stable &bull; MAP 82</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02]">
                    <span className="text-slate-400">[19:14:35] ROSTER-UPDATE &bull; Shift B Nurse Float Pool check-in</span>
                    <span className="text-teal-300 font-bold">6 Available FTEs</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STAGE 02: PREDICT — Neural Forecasting Module */}
          {/* ==================================================== */}
          {activeStage === 1 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                      STAGE 02 &bull; PREDICT
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      MULTI-HORIZON NEURAL TIME-SERIES
                    </span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    Predict patient demand before surges materialize
                  </h3>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0B1220] border border-white/[0.08] flex items-center gap-3 shrink-0">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <div className="text-xs font-mono">
                    <span className="font-bold text-white block">LSTM FORECAST</span>
                    <span className="text-slate-400">Demand: <strong className="text-cyan-300">+14.8%</strong> &bull; Confidence: <strong className="text-emerald-300">91%</strong></span>
                  </div>
                </div>
              </div>

              {/* Visual Pipeline Flow */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono text-center">
                <div className="p-3.5 rounded-xl bg-[#0B1220] border border-white/[0.08]">
                  <span className="text-slate-500 block mb-1">01 Ingest</span>
                  <span className="text-slate-200 font-bold">Historical Telemetry</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0E1626] border border-cyan-500/30 text-cyan-300">
                  <span className="text-cyan-400/80 block mb-1">02 Neural Model</span>
                  <span className="font-bold">LSTM + Conformal Bounds</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0B1220] border border-white/[0.08]">
                  <span className="text-slate-500 block mb-1">03 Target</span>
                  <span className="text-slate-200 font-bold">Future Horizon (+48h)</span>
                </div>
              </div>

              {/* Forecast SVG Chart Graphic */}
              <div className="p-6 rounded-xl bg-[#0B1220] border border-white/[0.08]">
                <div className="flex items-center justify-between text-xs font-mono mb-4">
                  <span className="font-bold text-slate-200">PROJECTED ICU DEMAND HORIZON (ACTUAL &bull; FORECAST &bull; CONFIDENCE INTERVAL)</span>
                  <span className="text-[10px] text-cyan-400 px-2.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 font-bold">
                    SIMULATED FORECAST
                  </span>
                </div>

                {/* SVG Curve Diagram */}
                <div className="relative w-full h-48 flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="confidenceBand" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#19C7F3" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#19C7F3" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>

                    {/* 95% Confidence Interval Area */}
                    <polygon
                      points="260,80 340,55 430,35 520,40 600,45 600,115 520,110 430,105 340,115 260,110"
                      fill="url(#confidenceBand)"
                    />

                    {/* Historical Actual Line (Solid Slate) */}
                    <path
                      d="M 0,110 L 60,105 L 120,115 L 180,95 L 260,85"
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth="2.5"
                    />

                    {/* Dividing Present Time Marker */}
                    <line x1="260" y1="10" x2="260" y2="150" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                    <text x="265" y="25" fill="#94A3B8" fontSize="9" fontFamily="monospace">NOW (T-0)</text>

                    {/* Projected Forecast Line (Cyan Dashed) */}
                    <path
                      d="M 260,85 L 340,75 L 430,60 L 520,70 L 600,75"
                      fill="none"
                      stroke="#19C7F3"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                    />

                    {/* Present Node */}
                    <circle cx="260" cy="85" r="4.5" fill="#19C7F3" />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-white/[0.08] mt-2">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-slate-400 inline-block" /> Actual Recorded Demand
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-cyan-400 inline-block border-dashed" /> LSTM Multi-Horizon Forecast (+14.8%)
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-2 bg-cyan-500/20 inline-block rounded" /> 95% Confidence Interval (91% Conf)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STAGE 03: OPTIMIZE — Mathematical Allocation Engine */}
          {/* ==================================================== */}
          {activeStage === 2 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/20">
                      STAGE 03 &bull; OPTIMIZE
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      MILP CONSTRAINED ALLOCATION
                    </span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    Prediction tells us what may happen. Optimization tells us what to do.
                  </h3>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0B1220] border border-white/[0.08] flex items-center gap-3 shrink-0">
                  <Cpu className="w-4 h-4 text-teal-400" />
                  <div className="text-xs font-mono">
                    <span className="font-bold text-white block">OR-TOOLS CONVERGED</span>
                    <span className="text-slate-400">84ms solve &bull; <strong className="text-emerald-300">0 Violations</strong></span>
                  </div>
                </div>
              </div>

              {/* Available Resources Pool Strip */}
              <div className="p-4 rounded-xl bg-[#0B1220] border border-white/[0.08]">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-3">
                  AVAILABLE HOSPITAL RESOURCES POOL
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                  <div className="p-3 rounded-lg bg-[#070B17] border border-white/[0.06]">
                    <span className="text-slate-400 text-[10px] block uppercase">Doctors</span>
                    <span className="text-xl font-bold text-white">42</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#070B17] border border-white/[0.06]">
                    <span className="text-slate-400 text-[10px] block uppercase">Nurses</span>
                    <span className="text-xl font-bold text-teal-300">118</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#070B17] border border-white/[0.06]">
                    <span className="text-slate-400 text-[10px] block uppercase">ICU Beds</span>
                    <span className="text-xl font-bold text-cyan-300">16</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#070B17] border border-white/[0.06]">
                    <span className="text-slate-400 text-[10px] block uppercase">OR Slots</span>
                    <span className="text-xl font-bold text-white">9</span>
                  </div>
                </div>
              </div>

              {/* Resource Allocation Dynamic Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Reallocation 1 */}
                <div className="p-4 rounded-xl bg-[#0B1220] border border-teal-500/30">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                    <span className="font-bold text-white">ICU Critical Care</span>
                    <span className="text-teal-300 font-bold px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">+2 Nurses</span>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed font-sans">
                    Reallocates 2 float nurses from Step-Down to preserve the mandatory 1:2 ICU ratio during evening surge.
                  </div>
                </div>

                {/* Reallocation 2 */}
                <div className="p-4 rounded-xl bg-[#0B1220] border border-teal-500/30">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                    <span className="font-bold text-white">Emergency Intake</span>
                    <span className="text-teal-300 font-bold px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">+3 Nurses</span>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed font-sans">
                    Deploys triage reinforcement to absorb arrival velocity spike (+18.4%) without triage queue overflow.
                  </div>
                </div>

                {/* Reallocation 3 */}
                <div className="p-4 rounded-xl bg-[#0B1220] border border-slate-700">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                    <span className="font-bold text-white">Surgical PACU</span>
                    <span className="text-slate-400 font-bold px-2 py-0.5 rounded bg-white/[0.05]">-1 Float</span>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed font-sans">
                    Rebalances non-urgent float reserve following scheduled post-operative block clearance.
                  </div>
                </div>
              </div>

              {/* Mathematical Objective & Resulting Metrics */}
              <div className="p-5 rounded-xl bg-[#0B1220] border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    SOLVER OBJECTIVE FUNCTION
                  </span>
                  <span className="text-sm font-mono font-bold text-white">
                    MINIMIZE ( Waiting Time + Resource Waste + Capacity Overload )
                  </span>
                </div>

                <div className="flex items-center gap-6 text-right font-mono">
                  <div>
                    <span className="text-xs text-slate-400 block">Waiting Time</span>
                    <span className="text-lg font-bold text-emerald-300">&darr; 18%</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Capacity Risk</span>
                    <span className="text-lg font-bold text-emerald-300">&darr; 27%</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Utilization</span>
                    <span className="text-lg font-bold text-cyan-300">&uarr; 11%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STAGE 04: DECIDE — Human Governance Gate Module */}
          {/* ==================================================== */}
          {activeStage === 3 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                      STAGE 04 &bull; DECIDE
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      HUMAN-IN-THE-LOOP GOVERNANCE
                    </span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    AI recommends. Human decides.
                  </h3>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center gap-2.5 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-mono font-bold text-blue-200">
                    HUMAN APPROVAL REQUIRED
                  </span>
                </div>
              </div>

              {/* Recommendation Card */}
              <div className="p-6 sm:p-8 rounded-xl bg-[#0B1220] border border-white/[0.08] space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                    INTELLICARE RECOMMENDATION DIRECTIVE #DISP-2026-B4
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    SOP REF: ICU-POLICY-4.2
                  </span>
                </div>

                <div className="text-xl sm:text-2xl font-display font-bold text-white">
                  Move 2 float nurses &rarr; ICU Critical Care Unit
                </div>

                <div className="p-4 rounded-xl bg-[#070B17] border border-white/[0.06] text-sm text-slate-300 leading-relaxed font-sans">
                  <strong className="text-white block font-mono text-xs uppercase mb-1">Operational Rationale:</strong>
                  Projected ICU demand exceeds current clinical staffing capacity during the upcoming evening window (19:00 - 23:00). Early reallocation avoids statutory ratio violations.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-300 bg-white/[0.02] p-3.5 rounded-lg border border-white/[0.04]">
                  <div>&bull; Projected Waiting Time: <span className="text-emerald-300 font-bold">&darr; 18%</span></div>
                  <div>&bull; Campus Capacity Risk: <span className="text-emerald-300 font-bold">&darr; 27%</span></div>
                </div>

                {/* Coordinator Action Buttons */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setDecisionStatus('accepted')}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      decisionStatus === 'accepted'
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{decisionStatus === 'accepted' ? 'Order Authorized' : 'Accept Directive'}</span>
                  </button>

                  <button
                    onClick={() => setDecisionStatus('reviewed')}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                      decisionStatus === 'reviewed'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                        : 'bg-[#101728] border-white/[0.1] text-slate-300 hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Review Rationale</span>
                  </button>

                  <button
                    onClick={() => setDecisionStatus('rejected')}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                      decisionStatus === 'rejected'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-400'
                        : 'bg-[#101728] border-white/[0.1] text-slate-300 hover:text-rose-300'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Directive</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Footer Controls */}
          <div className="pt-6 mt-8 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-slate-500">
              Stage {activeStage + 1} of 4: <strong className="text-slate-200 font-sans">{stages[activeStage].title}</strong>
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveStage((activeStage + 3) % 4)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                &larr; Previous Stage
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => setActiveStage((activeStage + 1) % 4)}
                className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer"
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
