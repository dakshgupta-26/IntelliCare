import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import { Slider } from '../ui/Slider';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { RotateCcw, Zap } from 'lucide-react';

export const InteractiveOptimizationDemo: React.FC = () => {
  const optParams = useSimStore((state) => state.optParams);
  const optResult = useSimStore((state) => state.optResult);
  const setOptParam = useSimStore((state) => state.setOptParam);
  const resetOptParams = useSimStore((state) => state.resetOptParams);

  return (
    <div id="optimization-demo" className="glass-panel p-6 sm:p-8 rounded-3xl border border-teal-500/30 shadow-2xl relative overflow-hidden text-slate-100">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="teal" size="sm" dot>
              INTERACTIVE CAPACITY BALANCING
            </Badge>
            <span className="text-[11px] font-mono text-slate-500">
              SOLVER: GOOGLE OR-TOOLS (MILP)
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
            Simulate Capacity & Constraint Optimization
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Adjust operational constraints to evaluate instant global reallocations under strict clinical bounds.
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          iconPosition="left"
          onClick={resetOptParams}
        >
          Reset Sliders
        </Button>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Sliders (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 bg-surface-50/70 p-6 rounded-2xl border border-slate-800">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <span>Operational Constraints</span>
            <span className="text-teal-400 text-[10px]">DYNAMIC MILP SOLVE</span>
          </span>

          {/* Slider 1: Emergency Demand */}
          <Slider
            label="Emergency Demand Influx"
            min={0.8}
            max={2.0}
            step={0.05}
            value={optParams.emergencyDemandMultiplier}
            formatValue={(val) => {
              const delta = Math.round((val - 1.0) * 100);
              return delta > 0 ? `+${delta}% Surge` : delta < 0 ? `${delta}% Deficit` : 'Baseline (100%)';
            }}
            onChange={(val) => setOptParam('emergencyDemandMultiplier', val)}
            helperText="Simulates patient intake surge via ambulances and walk-ins."
          />

          {/* Slider 2: ICU Capacity */}
          <Slider
            label="Active ICU Bed Capacity"
            min={20}
            max={50}
            step={1}
            value={optParams.icuBedCapacity}
            unit=" Beds"
            onChange={(val) => setOptParam('icuBedCapacity', val)}
            helperText="Number of operational, staffed high-dependency beds."
          />

          {/* Slider 3: Nurse Staffing Availability */}
          <Slider
            label="Nursing Pool Availability"
            min={0.7}
            max={1.3}
            step={0.05}
            value={optParams.nurseStaffingLevel}
            formatValue={(val) => {
              const delta = Math.round((val - 1.0) * 100);
              return delta > 0 ? `+${delta}% Surplus` : delta < 0 ? `${delta}% Deficit` : '100% Full Roster';
            }}
            onChange={(val) => setOptParam('nurseStaffingLevel', val)}
            helperText="Accounts for sick calls, mandatory rest periods, and floater pools."
          />

          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500 leading-normal">
            * Linear program strictly enforces 1:2 nurse-to-patient ratio for intensive care beds.
          </div>
        </div>

        {/* Right Column: Computed Outcomes (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Key Metrics 4-Box Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Projected ICU Load */}
            <div className="p-4 rounded-xl bg-surface-100 border border-slate-800 flex flex-col">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Projected ICU Load
              </span>
              <span
                className={`text-2xl font-display font-bold ${
                  optResult.expectedIcuLoadPercent > 90
                    ? 'text-rose-400'
                    : optResult.expectedIcuLoadPercent > 80
                    ? 'text-amber-400'
                    : 'text-teal-300'
                }`}
              >
                {optResult.expectedIcuLoadPercent}%
              </span>
              <span className="text-[10px] font-mono text-slate-500 mt-1">
                {optResult.expectedIcuLoadPercent > 90 ? 'Critical Surge' : 'Manageable'}
              </span>
            </div>

            {/* Staff Utilization */}
            <div className="p-4 rounded-xl bg-surface-100 border border-slate-800 flex flex-col">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Staff Utilization
              </span>
              <span
                className={`text-2xl font-display font-bold ${
                  optResult.overallStaffUtilizationPercent > 90
                    ? 'text-rose-400'
                    : optResult.overallStaffUtilizationPercent > 80
                    ? 'text-amber-400'
                    : 'text-cyan-300'
                }`}
              >
                {optResult.overallStaffUtilizationPercent}%
              </span>
              <span className="text-[10px] font-mono text-slate-500 mt-1">
                {optResult.overallStaffUtilizationPercent > 85 ? 'Overtime Alert' : 'Sustainable'}
              </span>
            </div>

            {/* Projected Wait Time */}
            <div className="p-4 rounded-xl bg-surface-100 border border-slate-800 flex flex-col">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                ED Wait Time
              </span>
              <span
                className={`text-2xl font-display font-bold ${
                  optResult.projectedWaitTimeMinutes > 45
                    ? 'text-rose-400'
                    : 'text-white'
                }`}
              >
                {optResult.projectedWaitTimeMinutes}m
              </span>
              <span className="text-[10px] font-mono text-slate-500 mt-1">
                Triage Level 3
              </span>
            </div>

            {/* Overload Risk */}
            <div className="p-4 rounded-xl bg-surface-100 border border-slate-800 flex flex-col">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Overload Risk
              </span>
              <span
                className={`text-2xl font-display font-bold ${
                  optResult.overloadRiskScore > 75
                    ? 'text-rose-400'
                    : optResult.overloadRiskScore > 50
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {optResult.overloadRiskScore}/100
              </span>
              <span className="text-[10px] font-mono text-slate-500 mt-1">
                Resilience Index
              </span>
            </div>
          </div>

          {/* Real-Time Optimization Solution Summary */}
          <div className="p-5 rounded-2xl bg-surface-100 border border-teal-500/20 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-400" />
                <span>RECOMMENDED REALLOCATION PLAN</span>
              </span>
              <Badge variant={optResult.isFeasible ? 'emerald' : 'rose'} size="sm">
                {optResult.isFeasible ? 'GLOBAL OPTIMUM FOUND' : 'CONSTRAINTS TIGHT'}
              </Badge>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed">
              {optResult.expectedIcuLoadPercent > 90 ? (
                <span>
                  High surge detected. Solver recommends transferring{' '}
                  <strong className="text-teal-300">
                    +{optResult.recommendedNurseReallocation['Emergency'] || 4} Floater Nurses
                  </strong>{' '}
                  to Emergency and{' '}
                  <strong className="text-teal-300">
                    +{optResult.recommendedNurseReallocation['ICU'] || 2} Critical Care Nurses
                  </strong>{' '}
                  to ICU, while accelerating discharge evaluations in General Medicine to preserve bed turnover.
                </span>
              ) : (
                <span>
                  Operational equilibrium maintained. Minor balance recommendation of{' '}
                  <strong className="text-teal-300">
                    +{optResult.recommendedNurseReallocation['Emergency'] || 2} Nurses
                  </strong>{' '}
                  to intake triage to keep expected wait times under {optResult.projectedWaitTimeMinutes} minutes.
                </span>
              )}
            </div>

            {/* Solver Math Spec */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Objective Score: {optResult.objectiveValue}</span>
              <span className="text-teal-400">OR-Tools MILP &bull; 0 Violations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
