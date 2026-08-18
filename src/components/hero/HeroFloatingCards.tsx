import React from 'react';
import { TrendingUp, Activity, CheckCircle2, Zap, AlertTriangle } from 'lucide-react';

export const HeroFloatingCards: React.FC = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
      {/* Card 1: Demand Forecast */}
      <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_4px_25px_rgba(6,182,212,0.1)] group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
            Demand Forecast
          </span>
          <TrendingUp className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-display font-bold text-white tracking-tight">
            +18.4%
          </span>
          <span className="text-xs font-mono text-cyan-300 font-medium">T+4h</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>LSTM Neural Horizon</span>
        </div>
      </div>

      {/* Card 2: ICU Utilization */}
      <div className="glass-panel p-4 rounded-2xl border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_4px_25px_rgba(245,158,11,0.1)] group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
            ICU Utilization
          </span>
          <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-display font-bold text-amber-300 tracking-tight">
            92%
          </span>
          <span className="text-xs font-mono text-slate-400">29/32 Beds</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Surge Threshold Guard</span>
        </div>
      </div>

      {/* Card 3: Resource Efficiency */}
      <div className="glass-panel p-4 rounded-2xl border border-teal-500/20 hover:border-teal-400/40 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_4px_25px_rgba(20,184,166,0.1)] group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
            Resource Efficiency
          </span>
          <Activity className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-display font-bold text-teal-300 tracking-tight">
            84%
          </span>
          <span className="text-xs font-mono text-emerald-400">+6.2% vs Base</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
          <span>Cross-Dept Balancing</span>
        </div>
      </div>

      {/* Card 4: Optimization Engine */}
      <div className="glass-panel p-4 rounded-2xl border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300 transform hover:-translate-y-1 shadow-[0_4px_25px_rgba(99,102,241,0.1)] group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
            Optimization
          </span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-display font-bold text-white tracking-tight">
            READY
          </span>
          <span className="text-xs font-mono text-cyan-400">84ms</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>MILP Solver Feasible</span>
        </div>
      </div>
    </div>
  );
};
