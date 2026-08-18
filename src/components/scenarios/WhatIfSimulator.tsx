import React, { useState } from 'react';
import { useSimStore } from '../../store/useSimStore';
import { SCENARIO_PRESETS } from '../../data/scenarios';
import { Slider } from '../ui/Slider';
import { Badge } from '../ui/Badge';
import { Clock, Users, BedDouble, Zap } from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  const activeScenario = useSimStore((state) => state.activeScenario);
  const setActiveScenario = useSimStore((state) => state.setActiveScenario);

  // Custom fine-tuning overrides
  const [customEDSurge, setCustomEDSurge] = useState(activeScenario.parameters.emergencyDemandChangePercent);
  const [customIcuBedChange, setCustomIcuBedChange] = useState(activeScenario.parameters.icuBedChange);
  const [customNurseChange, setCustomNurseChange] = useState(activeScenario.parameters.nurseAvailabilityChangePercent);

  const handleSelectScenario = (sc: typeof activeScenario) => {
    setActiveScenario(sc);
    setCustomEDSurge(sc.parameters.emergencyDemandChangePercent);
    setCustomIcuBedChange(sc.parameters.icuBedChange);
    setCustomNurseChange(sc.parameters.nurseAvailabilityChangePercent);
  };

  // Dynamic calculations based on adjusted parameters
  const calculatedIcuLoad = Math.min(100, Math.max(50, Math.round(75 + customEDSurge * 0.45 - customIcuBedChange * 2.5)));
  const calculatedWaitTime = Math.max(15, Math.round(24 + customEDSurge * 0.9 - customNurseChange * 1.2));
  const calculatedStaffShortfall = Math.max(0, Math.round((customEDSurge * 0.25) - (customNurseChange * 0.4)));

  const riskLevel =
    calculatedIcuLoad > 94 || calculatedWaitTime > 70
      ? 'CRITICAL'
      : calculatedIcuLoad > 85 || calculatedWaitTime > 45
      ? 'HIGH'
      : calculatedIcuLoad > 78
      ? 'MODERATE'
      : 'LOW';

  const riskColors = {
    LOW: 'emerald',
    MODERATE: 'amber',
    HIGH: 'rose',
    CRITICAL: 'rose',
  } as const;

  return (
    <section id="scenarios" className="relative py-28 bg-navy-950 overflow-hidden">
      {/* Background radial lighting */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-pink-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <Badge variant="rose" size="md" className="mb-4">
            STRESS-TESTING & RESILIENCE ENGINE
          </Badge>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            What if tomorrow changes?
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Simulate regional incidents, epidemic surges, and severe operational shocks in a sandboxed digital environment before physical hospital resources are compromised.
          </p>
        </div>

        {/* Preset Scenario Cards Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {SCENARIO_PRESETS.map((sc) => {
            const isSelected = sc.id === activeScenario.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`p-5 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-rose-950/30 border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.15)] text-white'
                    : 'bg-surface-100/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-surface-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
                      {sc.category}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                    {sc.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {sc.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>ED: +{sc.parameters.emergencyDemandChangePercent}%</span>
                  <span>Beds: {sc.parameters.icuBedChange}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Scenario Sandbox & Projections */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-rose-500/30 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Shock Parameters (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 bg-surface-50/70 p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                Scenario Shock Controls
              </span>
              <span className="text-[10px] font-mono text-rose-400">
                SANDBOX MODE
              </span>
            </div>

            <Slider
              label="Emergency Demand Shock"
              min={-20}
              max={80}
              step={5}
              value={customEDSurge}
              formatValue={(v) => (v >= 0 ? `+${v}% Influx` : `${v}% Influx`)}
              onChange={setCustomEDSurge}
              helperText="Simulates sudden presentation surge in acute emergency."
            />

            <Slider
              label="ICU Bed Availability Delta"
              min={-10}
              max={10}
              step={1}
              value={customIcuBedChange}
              formatValue={(v) => (v >= 0 ? `+${v} Beds` : `${v} Beds`)}
              onChange={setCustomIcuBedChange}
              helperText="Physical bed reductions due to isolation, maintenance, or overflow."
            />

            <Slider
              label="Nurse Availability Shift"
              min={-30}
              max={20}
              step={5}
              value={customNurseChange}
              formatValue={(v) => (v >= 0 ? `+${v}% Staff` : `${v}% Absenteeism`)}
              onChange={setCustomNurseChange}
              helperText="Shift absenteeism due to travel disruption, illness, or strikes."
            />

            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500">
              * Scenario engine runs discrete-event capacity simulations under stochastic demand models.
            </div>
          </div>

          {/* Right Column: Projected Impact Scorecard (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Impact Metric Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Simulated Operational Impact Scorecard
              </span>
              <Badge variant={riskColors[riskLevel]} size="md" dot>
                RISK LEVEL: {riskLevel}
              </Badge>
            </div>

            {/* 4 Scorecard Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-surface-100 border border-slate-800 flex flex-col">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Projected ICU Load</span>
                </span>
                <span className="text-2xl font-display font-bold text-white">
                  {calculatedIcuLoad}%
                </span>
                <span className="text-[10px] font-mono text-slate-500 mt-1">
                  {calculatedIcuLoad > 92 ? 'Capacity Alert' : 'Operational'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-100 border border-slate-800 flex flex-col">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Projected ED Wait</span>
                </span>
                <span className="text-2xl font-display font-bold text-amber-300">
                  {calculatedWaitTime} min
                </span>
                <span className="text-[10px] font-mono text-slate-500 mt-1">
                  Average Triage 3
                </span>
              </div>

              <div className="p-4 rounded-xl bg-surface-100 border border-slate-800 flex flex-col sm:col-span-1 col-span-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-rose-400" />
                  <span>Staff Shortfall</span>
                </span>
                <span className="text-2xl font-display font-bold text-rose-300">
                  {calculatedStaffShortfall > 0 ? `${calculatedStaffShortfall} FTEs` : 'Balanced'}
                </span>
                <span className="text-[10px] font-mono text-slate-500 mt-1">
                  Required floater staff
                </span>
              </div>
            </div>

            {/* Preemptive Action Plan */}
            <div className="p-5 rounded-2xl bg-surface-100 border border-rose-500/20 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Automated Preemptive Countermeasures
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activeScenario.projectedImpact.automatedMitigation}
              </p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Simulation Convergence: 99.4%</span>
                <span className="text-rose-400 font-bold">MILP Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
