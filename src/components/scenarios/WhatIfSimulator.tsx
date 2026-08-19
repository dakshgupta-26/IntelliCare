import React, { useState } from 'react';
import { useSimStore } from '../../store/useSimStore';
import { SCENARIO_PRESETS } from '../../data/scenarios';
import { Slider } from '../ui/Slider';
import { Badge } from '../ui/Badge';
import { Clock, Users, BedDouble, Zap, ArrowRight } from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';

export const WhatIfSimulator: React.FC = () => {
  const activeScenario = useSimStore((state) => state.activeScenario);
  const setActiveScenario = useSimStore((state) => state.setActiveScenario);
  const navigate = useRouterStore((state) => state.navigate);

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

  const riskBadgeStyles = {
    LOW: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    MODERATE: 'bg-amber-100 text-amber-800 border-amber-300',
    HIGH: 'bg-rose-100 text-rose-800 border-rose-300',
    CRITICAL: 'bg-rose-200 text-rose-900 border-rose-400 font-bold',
  } as const;

  return (
    <section id="scenarios" className="relative py-32 bg-section-lightGray text-slate-900 border-t border-slate-200 overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-rose-100/40 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div className="max-w-3xl">
            <Badge variant="rose" size="md" className="mb-4 bg-rose-100 text-rose-800 border-rose-300">
              STRESS-TESTING & SCENARIO SANDBOX
            </Badge>

            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              What if tomorrow changes?
            </h2>

            <p className="mt-4 text-xl text-slate-600 font-normal leading-relaxed">
              Stress-test hospital capacity against mass casualty incidents, viral epidemics, and acute staff shortages in a digital sandbox before physical resources are strained.
            </p>
          </div>

          <button
            onClick={() => navigate('/scenarios')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-mono font-bold transition-all shadow-md cursor-pointer shrink-0"
          >
            <span>Explore Scenarios</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Preset Incident Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {SCENARIO_PRESETS.map((sc) => {
            const isSelected = sc.id === activeScenario.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`p-5 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-white border-rose-500 shadow-lg ring-2 ring-rose-400 text-slate-900'
                    : 'bg-white/80 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-700">
                      {sc.category}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug font-display">
                    {sc.name}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {sc.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>ED: +{sc.parameters.emergencyDemandChangePercent}%</span>
                  <span>Beds: {sc.parameters.icuBedChange}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Scenario Sandbox & Projections */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Shock Parameter Controls (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                Scenario Shock Parameters
              </span>
              <span className="text-[10px] font-mono text-rose-700 font-bold px-2 py-0.5 rounded bg-rose-100">
                INTERACTIVE DEMO
              </span>
            </div>

            <Slider
              label="Emergency Intake Surge Shock"
              min={-20}
              max={80}
              step={5}
              value={customEDSurge}
              formatValue={(v) => (v >= 0 ? `+${v}% Influx` : `${v}% Influx`)}
              onChange={setCustomEDSurge}
              helperText="Simulates sudden presentation spike from multi-vehicle collision or epidemic wave."
            />

            <Slider
              label="ICU Bed Availability Shift"
              min={-10}
              max={10}
              step={1}
              value={customIcuBedChange}
              formatValue={(v) => (v >= 0 ? `+${v} Beds` : `${v} Beds`)}
              onChange={setCustomIcuBedChange}
              helperText="Capacity shifts from quarantine isolations or rapid step-downs."
            />

            <Slider
              label="Nursing Pool Availability"
              min={-30}
              max={20}
              step={5}
              value={customNurseChange}
              formatValue={(v) => (v >= 0 ? `+${v}% Staff` : `${v}% Absenteeism`)}
              onChange={setCustomNurseChange}
              helperText="Shift absenteeism due to travel disruption, illness, or strikes."
            />

            <div className="pt-2 border-t border-slate-200 text-[11px] font-mono text-slate-500">
              * Discrete-event capacity simulations under stochastic demand models.
            </div>
          </div>

          {/* Right Column: Projected Impact Scorecard (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                Simulated Operational Impact Scorecard
              </span>
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${riskBadgeStyles[riskLevel]}`}>
                RISK LEVEL: {riskLevel}
              </span>
            </div>

            {/* 3 Metric Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Projected ICU Load</span>
                </span>
                <span className="text-2xl font-display font-bold text-slate-900">
                  {calculatedIcuLoad}%
                </span>
                <span className="text-[10px] font-mono text-slate-500 mt-1">
                  {calculatedIcuLoad > 92 ? 'Capacity Warning' : 'Operational'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Projected ED Wait</span>
                </span>
                <span className="text-2xl font-display font-bold text-amber-700">
                  {calculatedWaitTime} min
                </span>
                <span className="text-[10px] font-mono text-slate-500 mt-1">
                  Average Triage 3
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:col-span-1 col-span-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-rose-600" />
                  <span>Staff Shortfall</span>
                </span>
                <span className="text-2xl font-display font-bold text-rose-700">
                  {calculatedStaffShortfall > 0 ? `${calculatedStaffShortfall} FTEs` : 'Balanced'}
                </span>
                <span className="text-[10px] font-mono text-slate-500 mt-1">
                  Required floater staff
                </span>
              </div>
            </div>

            {/* Preemptive Action Plan */}
            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-rose-700" />
                <span className="text-xs font-mono font-bold text-rose-900 uppercase tracking-wider">
                  IntelliCare Preemptive Recommendation
                </span>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {activeScenario.projectedImpact.automatedMitigation}
              </p>

              <div className="pt-2 border-t border-rose-200/80 flex items-center justify-between text-[11px] font-mono text-slate-600">
                <span>Simulation Precision: 99.4%</span>
                <span className="text-rose-700 font-bold">MILP Action Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
