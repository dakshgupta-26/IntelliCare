import React from 'react';
import {
  CheckCircle2,
  ArrowRight,
  Zap,
  Code
} from 'lucide-react';
import { useOptimizationStore } from '../../store/useOptimizationStore';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';

export const OptimizationPage: React.FC = () => {
  const currentResult = useOptimizationStore((state) => state.currentResult);
  const objectiveWeights = useOptimizationStore((state) => state.objectiveWeights);
  const setObjectiveWeight = useOptimizationStore((state) => state.setObjectiveWeight);
  const activeJob = useOptimizationStore((state) => state.activeJob);
  const runOptimizationSolver = useOptimizationStore((state) => state.runOptimizationSolver);
  const isMathDrawerOpen = useOptimizationStore((state) => state.isMathDrawerOpen);
  const setMathDrawerOpen = useOptimizationStore((state) => state.setMathDrawerOpen);

  const isRunning = activeJob !== null && activeJob.status !== 'COMPLETED';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header & Solver Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Operations Research Engine
            </span>
            <span className="text-slate-600">•</span>
            <Badge variant="teal" size="sm">
              Google OR-Tools MILP
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Resource Optimization
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            "Turn predicted demand into actionable allocation." Mixed-Integer Linear Programming balancing ratios and capacity.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            icon={<Code className="w-3.5 h-3.5 text-cyan-400" />}
            onClick={() => setMathDrawerOpen(true)}
          >
            Mathematical Model
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Zap className={`w-3.5 h-3.5 ${isRunning ? 'animate-bounce' : ''}`} />}
            onClick={() => runOptimizationSolver()}
            disabled={isRunning}
          >
            {isRunning ? 'Solving Matrix...' : 'Run MILP Solver'}
          </Button>
        </div>
      </div>

      {/* 2. Asynchronous Job State Tracker (When Running or Recently Finished) */}
      {activeJob && (
        <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 animate-slide-up space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <h3 className="text-sm font-bold text-white">
                OR-Tools Execution Pipeline — Job #{activeJob.jobId}
              </h3>
            </div>
            <Badge variant={activeJob.status === 'COMPLETED' ? 'emerald' : 'cyan'} size="sm">
              {activeJob.status}
            </Badge>
          </div>

          <div className="w-full bg-surface-300 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-cyan to-indigo-500 h-full transition-all duration-500"
              style={{ width: `${activeJob.progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
            <span>{activeJob.currentStepMessage}</span>
            <span>{activeJob.progressPercent}%</span>
          </div>
        </div>
      )}

      {/* 3. Objective Function Weight Tuning Matrix */}
      <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-display font-bold text-white">
              Multi-Objective Operational Priority Weighting
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Configure penalty factors for unmet demand, patient wait times, and overtime compensation
            </p>
          </div>
          <Badge variant="cyan" size="sm">SCIP SOLVER 8.0</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Weight 1: Unmet Demand */}
          <div className="p-4 rounded-xl bg-surface-200/50 dark:bg-[#07111f] border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Minimize Unmet Demand</span>
              <span className="text-cyan-400 font-bold">{objectiveWeights.MINIMIZE_UNMET_DEMAND}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={objectiveWeights.MINIMIZE_UNMET_DEMAND}
              onChange={(e) => setObjectiveWeight('MINIMIZE_UNMET_DEMAND', Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <span className="text-[10px] text-slate-400 block">Priority: Life-safety admissions</span>
          </div>

          {/* Weight 2: Wait Times */}
          <div className="p-4 rounded-xl bg-surface-200/50 dark:bg-[#07111f] border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Minimize Wait Times</span>
              <span className="text-teal-400 font-bold">{objectiveWeights.MINIMIZE_WAIT_TIME}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={objectiveWeights.MINIMIZE_WAIT_TIME}
              onChange={(e) => setObjectiveWeight('MINIMIZE_WAIT_TIME', Number(e.target.value))}
              className="w-full accent-teal-400"
            />
            <span className="text-[10px] text-slate-400 block">Triage backlog decongestion</span>
          </div>

          {/* Weight 3: Balance Utilization */}
          <div className="p-4 rounded-xl bg-surface-200/50 dark:bg-[#07111f] border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Balance Ward Load</span>
              <span className="text-indigo-400 font-bold">{objectiveWeights.BALANCE_UTILIZATION}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={objectiveWeights.BALANCE_UTILIZATION}
              onChange={(e) => setObjectiveWeight('BALANCE_UTILIZATION', Number(e.target.value))}
              className="w-full accent-indigo-400"
            />
            <span className="text-[10px] text-slate-400 block">Even distribution across beds</span>
          </div>

          {/* Weight 4: Overtime Staffing */}
          <div className="p-4 rounded-xl bg-surface-200/50 dark:bg-[#07111f] border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Minimize Staff Overtime</span>
              <span className="text-purple-400 font-bold">{objectiveWeights.MINIMIZE_STAFF_OVERTIME}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={objectiveWeights.MINIMIZE_STAFF_OVERTIME}
              onChange={(e) => setObjectiveWeight('MINIMIZE_STAFF_OVERTIME', Number(e.target.value))}
              className="w-full accent-purple-400"
            />
            <span className="text-[10px] text-slate-400 block">Utilizes floater pool first</span>
          </div>
        </div>
      </div>

      {/* 4. Visual Before & Recommended After Allocation Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-display font-bold text-white">
              Recommended Optimal Resource Shifts
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Evaluated {currentResult.variablesCount} decision variables across {currentResult.constraintsCount} statutory constraints
            </p>
          </div>

          <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Optimal Feasible (Solved in {currentResult.solveDurationMs}ms)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentResult.shifts.map((shift, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 hover:border-cyan-500/40 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                    {shift.departmentName}
                  </span>
                  <h4 className="text-base font-display font-bold text-white mt-0.5">
                    {shift.resourceName}
                  </h4>
                </div>
                <Badge
                  variant={shift.delta > 0 ? 'emerald' : 'indigo'}
                  size="sm"
                >
                  {shift.delta > 0 ? `+${shift.delta} ${shift.unit}` : `${shift.delta} ${shift.unit}`}
                </Badge>
              </div>

              {/* Before vs After Visual Pill */}
              <div className="p-3 rounded-xl bg-surface-200/50 dark:bg-[#07111f] border border-slate-800 flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">CURRENT ASSIGNED</span>
                  <span className="text-base font-bold text-slate-300">
                    {shift.currentAllocated} {shift.unit}
                  </span>
                </div>

                <ArrowRight className="w-5 h-5 text-cyan-400" />

                <div className="text-right">
                  <span className="text-cyan-400 block text-[10px] font-bold">RECOMMENDED OPTIMAL</span>
                  <span className="text-base font-bold text-white">
                    {shift.recommendedAllocated} {shift.unit}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {shift.rationale}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Evaluated Constraint Status Matrix */}
      <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-display font-bold text-white">
          Active Binding Bounds & Compliance Checks
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentResult.constraintsEvaluated.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl bg-surface-200/40 dark:bg-[#07111f] border border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{c.name}</span>
                <Badge
                  variant={c.status === 'ACTIVE_BINDING' ? 'amber' : 'emerald'}
                  size="sm"
                >
                  {c.status.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{c.description}</p>
              <div className="pt-1 text-[11px] font-mono text-cyan-400">
                Formula: <code>{c.formulaDisplay}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Mathematical Formulation Drawer */}
      <Drawer
        isOpen={isMathDrawerOpen}
        onClose={() => setMathDrawerOpen(false)}
        title="MILP Mathematical Formulation"
        subtitle="Google OR-Tools SCIP Exact Integer Programming Formulation"
        width="xl"
      >
        <div className="space-y-6 text-xs font-mono leading-relaxed">
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 space-y-2">
            <span className="font-bold block">Operational Decision Support Disclaimer:</span>
            <p className="text-slate-300">
              The objective formulation models operational resource throughput, clinical ratio compliance, and overtime penalties. It does not replace medical clinician judgement.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-200/50 border border-slate-800 space-y-2">
            <span className="text-white font-bold block text-sm">1. Global Objective Function</span>
            <div className="p-3 bg-surface-300 rounded-lg text-cyan-300 font-mono text-[11px] overflow-x-auto">
              min Z = ∑ (w_d * UnmetDemand_d) + ∑ (w_w * WaitTime_d) + ∑ (c_r * Overtime_r)
            </div>
            <p className="text-slate-400">
              Where w_d is the department acuity penalty weight, w_w is wait time cost, and c_r is overtime penalty factor.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-200/50 border border-slate-800 space-y-2">
            <span className="text-white font-bold block text-sm">2. Statutory Nurse Ratio Bounds</span>
            <div className="p-3 bg-surface-300 rounded-lg text-emerald-300 font-mono text-[11px] overflow-x-auto">
              Staff_ICU(t) ≥ 0.5 * NonVent_Patients(t) + 1.0 * Vent_Patients(t)<br />
              Staff_Ward(t) ≥ 0.2 * Inpatients_Ward(t)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-200/50 border border-slate-800 space-y-2">
            <span className="text-white font-bold block text-sm">3. Physical Capacity Invariants</span>
            <div className="p-3 bg-surface-300 rounded-lg text-amber-300 font-mono text-[11px] overflow-x-auto">
              Allocated_Beds(d, t) ≤ NominalCapacity(d) + SurgeExpansionBays(d)
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
