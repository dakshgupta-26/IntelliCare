import React from 'react';
import { Badge } from '../ui/Badge';
import { ResourceFlowVisualizer } from './ResourceFlowVisualizer';
import { InteractiveOptimizationDemo } from './InteractiveOptimizationDemo';
import { ArrowRight } from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';

export const OptimizationSection: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);

  return (
    <section id="optimization" className="relative py-32 bg-section-dark text-slate-100 border-t border-slate-800/80 overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-teal-500/10 blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-3xl">
            <Badge variant="teal" size="md" className="mb-4">
              MATHEMATICAL RESOURCE BALANCING
            </Badge>

            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Prediction is only half the problem.
            </h2>

            <p className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-gradient-teal">
              Optimization decides what happens next.
            </p>

            <p className="mt-6 text-lg sm:text-xl text-slate-400 font-normal leading-relaxed">
              Forecasting alone cannot resolve overcrowding. IntelliCare formulates hospital capacity as a Mixed-Integer Linear Program (MILP), computing exact global allocations under clinical, legal, and physical constraints in milliseconds.
            </p>
          </div>

          <button
            onClick={() => navigate('/optimization')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30 text-xs font-mono font-bold transition-all shadow-md cursor-pointer shrink-0"
          >
            <span>Explore Optimization</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* MILP Visual Equation Concept: Predicted Demand + Available Resources + Constraints -> MILP -> Optimal Allocation */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 rounded-2xl bg-surface-100/80 border border-slate-800 backdrop-blur-md mb-12 text-center text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-surface-200/50 border border-slate-800 flex flex-col justify-center items-center">
            <span className="text-slate-400 text-[11px] block mb-1">Input 1</span>
            <span className="text-white font-bold text-sm">Predicted Demand</span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-200/50 border border-slate-800 flex flex-col justify-center items-center">
            <span className="text-slate-400 text-[11px] block mb-1">Input 2</span>
            <span className="text-white font-bold text-sm">Available Staff & Beds</span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-200/50 border border-slate-800 flex flex-col justify-center items-center">
            <span className="text-slate-400 text-[11px] block mb-1">Constraints</span>
            <span className="text-white font-bold text-sm">1:2 Ratios & Bounds</span>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-500/40 text-teal-300 flex flex-col justify-center items-center">
            <span className="text-teal-400 text-[11px] block mb-1">Solver</span>
            <span className="font-bold text-sm">Google OR-Tools (MILP)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex flex-col justify-center items-center col-span-2 md:col-span-1">
            <span className="text-emerald-400 text-[11px] block mb-1">Output</span>
            <span className="font-bold text-sm">Optimal Rebalance Plan</span>
          </div>
        </div>

        {/* Cross-Department Resource Flow Visualizer */}
        <div className="mb-12">
          <ResourceFlowVisualizer />
        </div>

        {/* Interactive Optimization Sandbox */}
        <InteractiveOptimizationDemo />
      </div>
    </section>
  );
};
