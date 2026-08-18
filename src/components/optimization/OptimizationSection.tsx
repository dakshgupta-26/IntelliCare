import React from 'react';
import { Badge } from '../ui/Badge';
import { ResourceFlowVisualizer } from './ResourceFlowVisualizer';
import { InteractiveOptimizationDemo } from './InteractiveOptimizationDemo';

export const OptimizationSection: React.FC = () => {
  return (
    <section id="optimization" className="relative py-28 bg-navy-950 overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-teal-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <Badge variant="teal" size="md" className="mb-4">
            MATHEMATICAL RESOURCE BALANCING
          </Badge>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Prediction tells you what's coming.
          </h2>

          <p className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-cyan">
            Optimization tells you what to do.
          </p>

          <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed">
            Forecasting alone does not resolve bottlenecks. IntelliCare formulates hospital capacity as a Mixed-Integer Linear Program (MILP), computing exact global allocations under clinical, legal, and physical constraints.
          </p>
        </div>

        {/* MILP Constraint Pipeline Visual */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 p-3 rounded-2xl bg-surface-100/70 border border-slate-800 backdrop-blur-md mb-12 text-center text-xs font-mono">
          <div className="p-3 rounded-xl bg-surface-200/40 border border-slate-800">
            <span className="text-slate-400 block mb-1">Step 1</span>
            <span className="text-white font-bold">Predicted Demand</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-200/40 border border-slate-800">
            <span className="text-slate-400 block mb-1">Step 2</span>
            <span className="text-white font-bold">Available Roster</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-200/40 border border-slate-800">
            <span className="text-slate-400 block mb-1">Step 3</span>
            <span className="text-white font-bold">Clinical Bounds</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-200/40 border border-slate-800">
            <span className="text-slate-400 block mb-1">Step 4</span>
            <span className="text-white font-bold">MILP Formulation</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-200/40 border border-slate-800">
            <span className="text-slate-400 block mb-1">Step 5</span>
            <span className="text-white font-bold">Google OR-Tools</span>
          </div>
          <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-500/40 text-teal-300">
            <span className="text-teal-400 block mb-1">Step 6</span>
            <span className="font-bold">Optimal Plan</span>
          </div>
        </div>

        {/* Department Live Allocation Flow Visualizer */}
        <div className="mb-12">
          <ResourceFlowVisualizer />
        </div>

        {/* Interactive Optimization Slider Sandbox */}
        <InteractiveOptimizationDemo />
      </div>
    </section>
  );
};
