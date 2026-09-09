import React from 'react';
import { Activity, Cpu, Users, Stethoscope } from 'lucide-react';

export const HeroFloatingCards: React.FC = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 px-1 sm:px-2 z-10">
      {/* Metric 1: ICU 92% OCCUPIED */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#0B1220]/90 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-200 group shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] sm:text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider truncate">
            ICU
          </span>
          <Activity className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform shrink-0" />
        </div>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            92%
          </span>
          <span className="text-[10px] sm:text-xs font-mono text-rose-300 font-semibold uppercase">OCCUPIED</span>
        </div>
        <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between font-mono">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
            <span className="truncate">29/32 Beds</span>
          </div>
          <span className="text-[8px] text-slate-400 bg-white/[0.06] px-1 py-0.5 rounded uppercase tracking-tight">
            SIMULATED
          </span>
        </div>
      </div>

      {/* Metric 2: OR 84% CAPACITY */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#0B1220]/90 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-200 group shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] sm:text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider truncate">
            OR
          </span>
          <Stethoscope className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
        </div>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            84%
          </span>
          <span className="text-[10px] sm:text-xs font-mono text-cyan-300 font-semibold uppercase">CAPACITY</span>
        </div>
        <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between font-mono">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
            <span className="truncate">6/7 Active Suites</span>
          </div>
          <span className="text-[8px] text-slate-400 bg-white/[0.06] px-1 py-0.5 rounded uppercase tracking-tight">
            SIMULATED
          </span>
        </div>
      </div>

      {/* Metric 3: EMERGENCY +18% ARRIVALS */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#0B1220]/90 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-200 group shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] sm:text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider truncate">
            Emergency
          </span>
          <Cpu className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
        </div>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            +18%
          </span>
          <span className="text-[10px] sm:text-xs font-mono text-amber-300 font-semibold uppercase">ARRIVALS</span>
        </div>
        <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between font-mono">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <span className="truncate">Triage Influx</span>
          </div>
          <span className="text-[8px] text-slate-400 bg-white/[0.06] px-1 py-0.5 rounded uppercase tracking-tight">
            DEMO
          </span>
        </div>
      </div>

      {/* Metric 4: STAFF 82% UTILIZATION */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#0B1220]/90 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-200 group shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] sm:text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider truncate">
            Staff
          </span>
          <Users className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform shrink-0" />
        </div>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            82%
          </span>
          <span className="text-[10px] sm:text-xs font-mono text-teal-300 font-semibold uppercase">UTILIZATION</span>
        </div>
        <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between font-mono">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
            <span className="truncate">Ratio 1:2.1</span>
          </div>
          <span className="text-[8px] text-slate-400 bg-white/[0.06] px-1 py-0.5 rounded uppercase tracking-tight">
            ILLUSTRATIVE
          </span>
        </div>
      </div>
    </div>
  );
};

