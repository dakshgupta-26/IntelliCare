import React from 'react';
import { Heart, Activity, Wind, Gauge, Users, ChevronRight } from 'lucide-react';
import { AnimatedWaveformSvg } from './AnimatedWaveformSvg';
import { useRouterStore } from '../../store/useRouterStore';

interface HeroLiveTelemetryOverlaysProps {
  onInspectSurge?: () => void;
}

export const HeroLiveTelemetryOverlays: React.FC<HeroLiveTelemetryOverlaysProps> = ({
  onInspectSurge
}) => {
  const navigate = useRouterStore((state) => state.navigate);

  const handleAction = () => {
    if (onInspectSurge) {
      onInspectSurge();
    } else {
      navigate('/app/dashboard');
    }
  };

  return (
    <div className="hero-hud-layer absolute inset-0 pointer-events-none z-20 select-none overflow-hidden">
      {/* ----------------------------------------------------------------- */}
      {/* HUD 1: LIVE PATIENT VITALS (Upper Transition Safe Zone)          */}
      {/* Placed in the upper-mid space, safe from nurse and patient       */}
      {/* ----------------------------------------------------------------- */}
      <div 
        className="pointer-events-auto absolute left-[36%] md:left-[38%] lg:left-[40%] xl:left-[42%] 2xl:left-[44%] top-[10%] sm:top-[11%] lg:top-[12%] hidden md:block w-[280px] lg:w-[310px] p-3.5 lg:p-4 rounded-2xl bg-[#040816]/85 backdrop-blur-2xl border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:border-cyan-500/40 hover:shadow-[0_25px_60px_rgba(34,211,238,0.2)] transition-all duration-300"
        style={{
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </span>
            <span className="text-xs font-sans font-semibold tracking-wide text-white">
              Live Patient Vitals
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <span>●</span>
            <span>Stable</span>
          </span>
        </div>

        {/* 4 Real-Time Animated Vitals Rows */}
        <div className="pt-2.5 space-y-2 font-mono">
          {/* Row 1: HR */}
          <div className="flex items-center justify-between py-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 w-8">HR</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-heartbeat" />
              <span className="text-sm font-bold text-white tracking-tight">72</span>
              <span className="text-[10px] text-slate-400 font-sans">bpm</span>
            </div>
            <AnimatedWaveformSvg type="ecg" width={105} height={18} color="#34D399" />
          </div>

          {/* Row 2: SpO2 */}
          <div className="flex items-center justify-between py-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 w-8">SpO₂</span>
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-sm font-bold text-white tracking-tight">98</span>
              <span className="text-[10px] text-slate-400 font-sans">%</span>
            </div>
            <AnimatedWaveformSvg type="spo2" width={105} height={18} color="#22D3EE" />
          </div>

          {/* Row 3: BP */}
          <div className="flex items-center justify-between py-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 w-8">BP</span>
              <Gauge className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-xs font-bold text-white tracking-tight">118/76</span>
              <span className="text-[10px] text-slate-400 font-sans">mmHg</span>
            </div>
            <AnimatedWaveformSvg type="bp" width={105} height={18} color="#14B8A6" />
          </div>

          {/* Row 4: RR */}
          <div className="flex items-center justify-between py-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 w-8">RR</span>
              <Wind className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-sm font-bold text-white tracking-tight">16</span>
              <span className="text-[10px] text-slate-400 font-sans">/min</span>
            </div>
            <AnimatedWaveformSvg type="rr" width={105} height={18} color="#38BDF8" />
          </div>
        </div>

        {/* Telemetry Status Line */}
        <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span>STREAM: 250Hz WSS</span>
          <span className="text-cyan-400 font-semibold">SIMULATED</span>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* HUD 2: PREDICTED ARRIVALS (Mid-Right Safe Zone)                   */}
      {/* Positioned on the right with controlled margin, leaving doctor clear */}
      {/* ----------------------------------------------------------------- */}
      <div 
        className="pointer-events-auto absolute right-[clamp(16px,2.5vw,48px)] top-[14%] sm:top-[16%] hidden xl:block w-[260px] lg:w-[280px] p-3.5 rounded-2xl bg-[#040816]/85 backdrop-blur-2xl border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:border-cyan-500/40 hover:shadow-[0_25px_60px_rgba(34,211,238,0.2)] transition-all duration-300"
        style={{
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Users className="w-3 h-3 text-cyan-400" />
            </div>
            <span className="text-xs font-sans font-semibold tracking-wide text-slate-200">
              Predicted Arrivals
            </span>
          </div>
          <span className="text-[9px] font-mono text-cyan-400 font-bold px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800">
            DEMO
          </span>
        </div>

        {/* Content Row: Main Percentage Stat + Dynamic Cyan Vertical Wave Bars */}
        <div className="flex items-end justify-between pt-2">
          <div>
            <div className="text-2xl font-mono font-extrabold text-cyan-400 tracking-tight leading-none">
              +18%
            </div>
            <div className="text-[10px] font-sans text-slate-300 pt-1">
              in next 6 hours
            </div>
          </div>

          {/* 7 Glowing Animated Gradient Bars */}
          <div className="flex items-end gap-1.5 h-9 px-2 py-1 rounded-xl bg-[#030612]/80 border border-white/[0.06]">
            {[32, 48, 62, 78, 92, 100, 82].map((heightPct, idx) => (
              <div
                key={idx}
                className="w-1.5 rounded-t-sm bg-gradient-to-t from-cyan-600 via-cyan-400 to-teal-300 transition-all duration-500 animate-pulse"
                style={{ 
                  height: `${heightPct}%`,
                  animationDelay: `${idx * 160}ms`,
                  boxShadow: '0 0 6px rgba(34, 211, 238, 0.4)'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* HUD 3: ICU BED OCCUPANCY (Lower-Right Safe Zone)                  */}
      {/* Sits comfortably in lower-right with intentional breathing space  */}
      {/* ----------------------------------------------------------------- */}
      <div 
        className="pointer-events-auto absolute right-[clamp(16px,2.5vw,48px)] bottom-[16%] sm:bottom-[18%] hidden lg:block w-[270px] lg:w-[290px] p-3.5 lg:p-4 rounded-2xl bg-[#040816]/85 backdrop-blur-2xl border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:border-cyan-500/40 hover:shadow-[0_25px_60px_rgba(34,211,238,0.2)] transition-all duration-300"
        style={{
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <span className="text-xs font-sans font-semibold tracking-wide text-slate-200">
            ICU Bed Occupancy
          </span>
          <span className="text-[10px] font-mono font-semibold text-rose-400">
            +12% <span className="text-slate-400 font-sans font-normal">vs. last 6 hrs</span>
          </span>
        </div>

        {/* Content Row: Radial Gauge + Bed Count + Spark Trend Bars */}
        <div className="flex items-center justify-between pt-2">
          {/* Radial Circular SVG Gauge */}
          <div className="relative w-13 h-13 shrink-0 flex items-center justify-center">
            <svg className="w-13 h-13 -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-[#09152C]"
                strokeWidth="4.5"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-cyan-400 transition-all duration-1000 ease-out"
                strokeWidth="4.5"
                strokeDasharray="125.66"
                strokeDashoffset="10.05" /* 92% fill */
                strokeLinecap="round"
                fill="none"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.7))'
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] font-mono font-extrabold text-white">92%</span>
            </div>
          </div>

          {/* Bed Numbers */}
          <div className="text-left pl-2">
            <div className="text-base font-mono font-extrabold text-white tracking-tight">
              74 <span className="text-xs font-mono font-medium text-slate-400">/ 80</span>
            </div>
            <div className="text-[11px] font-sans text-slate-300">
              Beds Occupied
            </div>
          </div>

          {/* Mini 7-Bar Historical Trajectory Sparkline */}
          <div className="flex items-end gap-1 h-7 px-2 py-1 rounded-lg bg-[#030612]/80 border border-white/[0.06]">
            {[35, 48, 58, 68, 80, 88, 94].map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-t-sm bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-300"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* HUD 4: INTERACTIVE BEDSIDE MONITOR HOTSPOT (Midground Right)      */}
      {/* ----------------------------------------------------------------- */}
      <div 
        className="pointer-events-auto absolute right-[18%] lg:right-[20%] top-[42%] hidden 2xl:flex items-center gap-2 group cursor-pointer"
        onClick={handleAction}
      >
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#060D1A]/90 border border-cyan-400/60 shadow-[0_0_20px_rgba(34,211,238,0.5)] group-hover:scale-110 transition-transform">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
          <Activity className="w-4 h-4 text-cyan-300" />
        </div>
        <div className="opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200 px-3 py-1.5 rounded-xl bg-[#060D1A]/95 backdrop-blur-xl border border-cyan-500/30 text-left shadow-2xl">
          <div className="text-[11px] font-mono font-bold text-white flex items-center gap-1">
            <span>Mindray Telemetry Bus</span>
            <ChevronRight className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-[9px] font-mono text-cyan-300">
            250Hz Live Stream • 12ms Latency
          </div>
        </div>
      </div>
    </div>
  );
};
