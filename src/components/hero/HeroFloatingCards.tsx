import React from 'react';
import { TrendingUp, Activity, CheckCircle2, Shield } from 'lucide-react';

export const HeroFloatingCards: React.FC = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 px-1 sm:px-2 z-10">
      {/* Metric 1 */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#0B1020]/90 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-200 group shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] sm:text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider truncate">
            Demand Forecast
          </span>
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
        </div>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            +18.4%
          </span>
          <span className="text-[10px] sm:text-xs font-mono text-cyan-300 font-medium">T+4h</span>
        </div>
        <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between font-mono">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
            <span className="truncate">LSTM Model</span>
          </div>
          <span className="text-[8px] text-slate-500 uppercase tracking-tight">SIMULATED</span>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#0B1020]/90 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-200 group shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] sm:text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider truncate">
            ICU Capacity
          </span>
          <Activity className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform shrink-0" />
        </div>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-xl sm:text-2xl font-display font-bold text-rose-300 tracking-tight">
            92%
          </span>
          <span className="text-[10px] sm:text-xs font-mono text-slate-400">29/32 Beds</span>
        </div>
        <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between font-mono">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
            <span className="truncate">Surge Threshold</span>
          </div>
          <span className="text-[8px] text-slate-500 uppercase tracking-tight">SIMULATED</span>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#0B1020]/90 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-200 group shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] sm:text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider truncate">
            MILP Rebalance
          </span>
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform shrink-0" />
        </div>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-xl sm:text-2xl font-display font-bold text-teal-300 tracking-tight">
            84ms
          </span>
          <span className="text-[10px] sm:text-xs font-mono text-emerald-400">0 Violations</span>
        </div>
        <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between font-mono">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
            <span className="truncate">OR-Tools Solver</span>
          </div>
          <span className="text-[8px] text-slate-500 uppercase tracking-tight">SOLVED</span>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#0B1020]/90 border border-white/[0.08] hover:border-white/[0.16] transition-all duration-200 group shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] sm:text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider truncate">
            Governance Gate
          </span>
          <Shield className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform shrink-0" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight truncate">
            HITL Active
          </span>
        </div>
        <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between font-mono">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
            <span className="truncate">Clinical Sign-Off</span>
          </div>
          <span className="text-[8px] text-slate-500 uppercase tracking-tight">MANDATORY</span>
        </div>
      </div>
    </div>
  );
};

