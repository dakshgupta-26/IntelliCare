import React from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ArrowLeft, ArrowRight, Scale } from 'lucide-react';
import { useRouterStore } from '../store/useRouterStore';
import { ResourceFlowVisualizer } from '../components/optimization/ResourceFlowVisualizer';
import { InteractiveOptimizationDemo } from '../components/optimization/InteractiveOptimizationDemo';

export const OptimizationPage: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);

  const constraints = [
    {
      title: 'Mandatory Clinical Acuity Ratios',
      formula: 'Staff_{ICU}(t) >= ceil(Demand_{ICU}(t) / 2.0)',
      explanation: 'Statutory 1:2 nurse-to-patient ratio strictly enforced for all ventilated and high-dependency ICU beds without exception.',
    },
    {
      title: 'Physical Bed Capacity Conservation',
      formula: 'Beds_{occupied}(dept, t) <= BedCapacity_{max}(dept)',
      explanation: 'No department can exceed physical floor and fire safety limits. Surplus demand forces automated step-down or triage diverts.',
    },
    {
      title: 'Staff Rest Period & Shift Bounds',
      formula: 'ShiftHours_{staff}(w) <= 40 + MaxPermissibleOvertime',
      explanation: 'Prevents clinical burnout and clinician fatigue errors by capping consecutive shift extensions and prioritizing floater pools.',
    },
    {
      title: 'Elective vs. Emergent Priority Balancing',
      formula: 'min(sum(w_emergent * WaitTime) + sum(w_elective * CancellationRisk))',
      explanation: 'Prioritizes life-critical emergency admissions while minimizing elective surgery cancellations via weighted penalty matrices.',
    },
  ];

  return (
    <div className="pt-28 pb-20 bg-section-dark text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono text-teal-400 hover:text-teal-300 mb-8 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="max-w-4xl mb-14">
          <Badge variant="teal" size="md" className="mb-4">
            DEEP-DIVE &bull; MATHEMATICAL OPTIMIZATION
          </Badge>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Mixed-Integer Linear Programming (MILP)
          </h1>

          <p className="mt-6 text-xl text-slate-300 leading-relaxed font-normal">
            How IntelliCare formulates hospital capacity as an exact mathematical program in Google OR-Tools to resolve clinical bottlenecks deterministically.
          </p>
        </div>

        {/* Solver Benchmark Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="glass-panel p-6 rounded-2xl border border-teal-500/20">
            <span className="text-xs font-mono text-slate-400 uppercase">Average Solve Time</span>
            <span className="text-3xl font-display font-bold text-teal-300 mt-2 block">84ms</span>
            <span className="text-[11px] font-mono text-slate-500 mt-1 block">Sub-100ms Target</span>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-teal-500/20">
            <span className="text-xs font-mono text-slate-400 uppercase">Binary Variables</span>
            <span className="text-3xl font-display font-bold text-white mt-2 block">1,480</span>
            <span className="text-[11px] font-mono text-slate-500 mt-1 block">Evaluated Simultaneously</span>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-teal-500/20">
            <span className="text-xs font-mono text-slate-400 uppercase">Constraint Violations</span>
            <span className="text-3xl font-display font-bold text-emerald-400 mt-2 block">0.0%</span>
            <span className="text-[11px] font-mono text-slate-500 mt-1 block">Provably Feasible Bounds</span>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-teal-500/20">
            <span className="text-xs font-mono text-slate-400 uppercase">Engine Core</span>
            <span className="text-3xl font-display font-bold text-cyan-300 mt-2 block">OR-Tools</span>
            <span className="text-[11px] font-mono text-slate-500 mt-1 block">Branch-and-Bound Solver</span>
          </div>
        </div>

        {/* Live Rebalance Vector Flow Visualizer */}
        <div className="mb-16">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400">
              Live Cross-Department Allocation Vector
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Optimal staffing transfers computed under real-time demand
            </span>
          </div>
          <ResourceFlowVisualizer />
        </div>

        {/* Mathematical Constraint Formulations */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 mb-16">
          <div className="max-w-3xl mb-8">
            <Badge variant="teal" size="sm" className="mb-2">
              FORMAL MATHEMATICAL FORMULATIONS
            </Badge>
            <h3 className="text-2xl font-display font-bold text-white">
              Deterministic Clinical Bounds & Optimization Objective
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              Our MILP formulation models patient queues, clinical certifications, and physical infrastructure as a continuous-discrete state space.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {constraints.map((c, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-surface-200/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Scale className="w-4 h-4 text-teal-400" />
                    <h4 className="text-base font-display font-bold text-white">
                      {c.title}
                    </h4>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-700/80 text-xs font-mono text-teal-300 mb-4 break-all">
                    <code>{c.formula}</code>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {c.explanation}
                  </p>
                </div>
                <div className="pt-3 mt-4 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>Hard Statutory Constraint</span>
                  <span className="text-emerald-400">Always Feasible</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Optimization Sandbox */}
        <div className="mb-20">
          <InteractiveOptimizationDemo />
        </div>

        {/* Bottom Navigation CTA */}
        <div className="p-10 rounded-3xl bg-surface-100 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-display font-bold text-white mb-1">
              Next: What-If Scenario Sandboxing Engine
            </h3>
            <p className="text-sm text-slate-400">
              See how our simulation engine tests resilience against mass-casualty events and epidemic surges.
            </p>
          </div>

          <Button
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/scenarios')}
          >
            Explore Scenarios
          </Button>
        </div>
      </div>
    </div>
  );
};
