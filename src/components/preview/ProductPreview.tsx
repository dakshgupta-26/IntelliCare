import React, { useState } from 'react';
import { Badge } from '../ui/Badge';
import { TrendingUp, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export const ProductPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rebalance' | 'advisory'>('overview');

  return (
    <section className="relative py-32 bg-section-darkAlt text-slate-100 border-t border-slate-800 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-teal-500/10 blur-[180px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="cyan" size="md" className="mb-4">
            OPERATIONAL COMMAND LAYER
          </Badge>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            One unified operating system.
          </h2>

          <p className="mt-4 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Real-time telemetry, neural forecasts, and mathematical rebalance advisories synthesized into an intuitive command interface.
          </p>
        </div>

        {/* 3D Perspective Dashboard Preview Frame */}
        <div className="relative mx-auto max-w-5xl rounded-3xl p-1 bg-gradient-to-b from-cyan-500/30 via-slate-700/40 to-slate-800/80 shadow-[0_25px_70px_rgba(0,0,0,0.8)]">
          <div className="bg-navy-950/95 rounded-[22px] p-6 sm:p-8 backdrop-blur-2xl border border-slate-800 flex flex-col gap-6">
            {/* Dashboard Mock Window Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-3">
                  INTELLICARE OPERATING SUITE &bull; HOSPITAL CENTRAL COMMAND
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono text-emerald-300">STREAM SYNCED</span>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-mono">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Campus Telemetry
              </button>
              <button
                onClick={() => setActiveTab('rebalance')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'rebalance'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                MILP Allocations
              </button>
              <button
                onClick={() => setActiveTab('advisory')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'advisory'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Grounded Advisories
              </button>
            </div>

            {/* Dashboard Main Visual Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Box 1: Realtime Influx */}
              <div className="p-5 rounded-2xl bg-surface-100/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400 uppercase">Emergency Influx</span>
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-3xl font-display font-bold text-white block">+18.4%</span>
                  <span className="text-xs font-mono text-cyan-400 mt-1 block">T+4h Horizon Spike</span>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-800 flex justify-between text-[11px] font-mono text-slate-500">
                  <span>Confidence: 94.2%</span>
                  <span className="text-emerald-400">Normalizing</span>
                </div>
              </div>

              {/* Box 2: ICU Acuity */}
              <div className="p-5 rounded-2xl bg-surface-100/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400 uppercase">ICU Bed Acuity</span>
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  </div>
                  <span className="text-3xl font-display font-bold text-rose-300 block">29 / 32</span>
                  <span className="text-xs font-mono text-slate-400 mt-1 block">92% Capacity Limit</span>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-800 flex justify-between text-[11px] font-mono text-slate-500">
                  <span>Step-downs: 3 Pending</span>
                  <span className="text-amber-400">Escalating</span>
                </div>
              </div>

              {/* Box 3: Optimization Dispatch */}
              <div className="p-5 rounded-2xl bg-surface-100/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400 uppercase">Solver Vector</span>
                    <Zap className="w-4 h-4 text-teal-400" />
                  </div>
                  <span className="text-3xl font-display font-bold text-teal-300 block">+4 Floaters</span>
                  <span className="text-xs font-mono text-slate-400 mt-1 block">Ward &rarr; Emergency Triage</span>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-800 flex justify-between text-[11px] font-mono text-slate-500">
                  <span>OR-Tools 84ms</span>
                  <span className="text-teal-400">Optimal</span>
                </div>
              </div>
            </div>

            {/* Bottom Live Dispatch Preview Strip */}
            <div className="p-4 rounded-xl bg-surface-50 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">
                  Advisory #DISP-2026-B4 verified against SOP-ICU-2024.3 and authorized by Clinical Director.
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold shrink-0">
                AUDIT TOKEN: 0x8F4A2C
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
