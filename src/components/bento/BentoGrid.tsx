import React from 'react';
import { Badge } from '../ui/Badge';
import { TrendingUp, Cpu, BookOpen, Sliders, MessageSquare, Activity } from 'lucide-react';

export const BentoGrid: React.FC = () => {
  return (
    <section className="relative py-28 bg-navy-900/60 border-t border-b border-slate-800/80 overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[400px] bg-cyan-600/5 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <Badge variant="cyan" size="md" className="mb-4">
            COMPREHENSIVE CAPABILITY SUITE
          </Badge>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Six pillars of resilient hospital operations.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Engineered to address the entire hospital operations lifecycle from predictive horizon detection to auditable execution.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[240px]">
          {/* Bento 1: Predict Demand (Large 2x2) */}
          <div className="glass-panel-interactive md:col-span-2 md:row-span-2 p-8 rounded-3xl border border-slate-800 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <Badge variant="cyan" size="sm">
                  NEURAL TIME-SERIES
                </Badge>
              </div>

              <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                Predict Hospital Demand
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                Stacked LSTM networks forecast multi-horizon patient arrival velocity and high-acuity admission probabilities up to 48 hours in advance, learning seasonal infection waves and localized incident spikes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-100/90 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
              <span>95% Conformal Prediction Intervals</span>
              <span className="text-cyan-400 font-bold">MAE: 3.8 pts/hr</span>
            </div>
          </div>

          {/* Bento 2: Optimize Resources (2x1) */}
          <div className="glass-panel-interactive md:col-span-2 p-8 rounded-3xl border border-slate-800 flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white group-hover:text-teal-300 transition-colors">
                    Optimize Resources (MILP)
                  </h3>
                  <span className="text-xs font-mono text-slate-400">Google OR-Tools Constraint Solver</span>
                </div>
              </div>
              <Badge variant="teal" size="sm">
                EXACT MATH
              </Badge>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Solves multi-department integer assignment problems in &lt;100ms while guaranteeing mandatory clinical staffing ratios and overtime bounds.
            </p>
          </div>

          {/* Bento 3: Understand Context (1x1) */}
          <div className="glass-panel-interactive md:col-span-1 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-display font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                Contextual RAG
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hybrid vector + BM25 search grounds all recommendations in hospital SOPs.
              </p>
            </div>
            <span className="text-[11px] font-mono text-indigo-400">Dense Vector pgvector</span>
          </div>

          {/* Bento 4: Simulate Scenarios (1x1) */}
          <div className="glass-panel-interactive md:col-span-1 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-3">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-display font-bold text-white mb-1 group-hover:text-rose-300 transition-colors">
                What-If Sandbox
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stress-test hospital capacity against mass casualty and epidemic shocks.
              </p>
            </div>
            <span className="text-[11px] font-mono text-rose-400">Monte Carlo Sim</span>
          </div>

          {/* Bento 5: Explain Decisions (2x1) */}
          <div className="glass-panel-interactive md:col-span-2 p-8 rounded-3xl border border-slate-800 flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white group-hover:text-indigo-300 transition-colors">
                    Explain Decisions
                  </h3>
                  <span className="text-xs font-mono text-slate-400">Protocol Citations & Audit Trails</span>
                </div>
              </div>
              <Badge variant="indigo" size="sm">
                TRANSPARENCY
              </Badge>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Synthesizes clear, plain-English rationales with specific protocol citations so clinical coordinators understand the exact justification for every bed and staff shift.
            </p>
          </div>

          {/* Bento 6: Monitor Operations (2x1) */}
          <div className="glass-panel-interactive md:col-span-2 p-8 rounded-3xl border border-slate-800 flex flex-col justify-between group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Monitor Operations
                  </h3>
                  <span className="text-xs font-mono text-slate-400">Sub-Second WebSocket Feed</span>
                </div>
              </div>
              <Badge variant="cyan" size="sm" dot>
                LIVE STREAM
              </Badge>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Provides unified real-time visibility across ICU beds, emergency queue velocities, operating theatre schedules, and nursing utilization in a single live dashboard.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
