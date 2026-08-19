import React from 'react';
import { TrendingUp, Activity, CheckCircle2, Shield } from 'lucide-react';

export const HeroFloatingCards: React.FC = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto mt-14 grid grid-cols-2 md:grid-cols-4 gap-3.5 px-4 z-10">
      {/* Metric 1 */}
      <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_4px_25px_rgba(22,199,243,0.08)] group">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
            Demand Forecast
          </span>
          <TrendingUp className="w-3.5 h-3.5 text-brand-cyan group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-display font-bold text-white tracking-tight">
            +18.4%
          </span>
          <span className="text-xs font-mono text-cyan-300 font-medium">T+4h Horizon</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>LSTM Neural Inference</span>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="glass-panel p-4 rounded-2xl border border-rose-500/20 hover:border-rose-400/40 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_4px_25px_rgba(244,63,94,0.08)] group">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
            ICU Capacity
          </span>
          <Activity className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-display font-bold text-rose-300 tracking-tight">
            92%
          </span>
          <span className="text-xs font-mono text-slate-400">29/32 Beds</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          <span>Surge Guard Active</span>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="glass-panel p-4 rounded-2xl border border-teal-500/20 hover:border-teal-400/40 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_4px_25px_rgba(45,212,191,0.08)] group">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
            MILP Rebalance
          </span>
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-display font-bold text-teal-300 tracking-tight">
            84ms
          </span>
          <span className="text-xs font-mono text-emerald-400">0 Violations</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
          <span>OR-Tools Optimization</span>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="glass-panel p-4 rounded-2xl border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_4px_25px_rgba(99,102,241,0.08)] group">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
            Governance
          </span>
          <Shield className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-display font-bold text-white tracking-tight">
            Human-in-Loop
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span>Clinical Gate Enforced</span>
        </div>
      </div>
    </div>
  );
};
