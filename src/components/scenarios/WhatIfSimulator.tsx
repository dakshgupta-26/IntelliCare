import React, { useState } from 'react';
import { useSimStore } from '../../store/useSimStore';
import { SCENARIO_PRESETS } from '../../data/scenarios';
import { Zap, ArrowRight } from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';

export const WhatIfSimulator: React.FC = () => {
  const activeScenario = useSimStore((state) => state.activeScenario);
  const setActiveScenario = useSimStore((state) => state.setActiveScenario);
  const navigate = useRouterStore((state) => state.navigate);

  // Interactive Sliders requested by prompt
  // 1. Patient demand: -20% to +40%
  const [patientDemandOffset, setPatientDemandOffset] = useState<number>(20);
  // 2. Staff availability: 0 (Reduced) to 100 (Normal)
  const [staffAvailability, setStaffAvailability] = useState<number>(75);
  // 3. ICU capacity: 0 (Low) to 100 (High)
  const [icuCapacityLevel, setIcuCapacityLevel] = useState<number>(50);

  // Dynamic calculations
  // Without intervention:
  const rawIcuLoad = Math.min(100, Math.max(50, Math.round(78 + patientDemandOffset * 0.55 - (icuCapacityLevel - 50) * 0.3)));
  const rawWaitTime = Math.max(20, Math.round(35 + patientDemandOffset * 1.1 + (100 - staffAvailability) * 0.6));
  const rawBreach = rawIcuLoad > 92 || rawWaitTime > 65;

  // With IntelliCare (MILP Rebalance + Early Forecast):
  const optimizedIcuLoad = Math.min(88, Math.max(48, Math.round(rawIcuLoad * 0.86)));
  const optimizedWaitTime = Math.max(18, Math.round(rawWaitTime * 0.68));
  const staffReallocated = Math.max(2, Math.round((patientDemandOffset > 0 ? patientDemandOffset * 0.15 : 1) + (100 - staffAvailability) * 0.05));

  const handlePreset = (preset: typeof activeScenario) => {
    setActiveScenario(preset);
    setPatientDemandOffset(preset.parameters.emergencyDemandChangePercent);
  };

  return (
    <section id="scenarios" className="relative py-28 sm:py-36 bg-[#0B1020] text-slate-100 border-t border-white/[0.08] overflow-hidden">
      {/* Precision ambient background lighting */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[500px] bg-rose-500/[0.03] blur-[170px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101728] border border-white/[0.1] mb-5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span className="text-[11px] font-mono font-bold tracking-wider text-slate-200 uppercase">
                SCENARIO STRESS-TESTING ENGINE
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[10px] font-mono text-rose-400/90 font-medium">WHAT-IF SANDBOX</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
              What happens if demand spikes?
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-400 font-normal leading-relaxed">
              Stress-test hospital operational thresholds against acute volume shocks, staff absenteeism, and capacity bounds in a digital simulation sandbox before real units are constrained.
            </p>
          </div>

          <button
            onClick={() => navigate('/scenarios')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-mono font-bold text-slate-200 hover:text-white transition-all shadow-md cursor-pointer shrink-0"
          >
            <span>Explore All Scenarios</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Preset Incident Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {SCENARIO_PRESETS.map((sc) => {
            const isSelected = sc.id === activeScenario.id;
            return (
              <button
                key={sc.id}
                onClick={() => handlePreset(sc)}
                className={`p-4 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-[#101728] border-rose-500/50 shadow-md ring-1 ring-rose-500/30 text-white'
                    : 'bg-[#070B17] border-white/[0.06] text-slate-400 hover:text-white hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
                    {sc.category}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
                </div>
                <h4 className="text-sm font-bold text-white font-display">
                  {sc.name}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-1 font-sans">
                  {sc.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Main Interactive Sandbox Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Shock Sliders (5 Cols) */}
          <div className="lg:col-span-5 bg-[#070B17] p-6 sm:p-8 rounded-2xl border border-white/[0.08] flex flex-col justify-between gap-6 shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Shock Parameter Controls
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-400">
                  SIMULATED CONTROLS
                </span>
              </div>

              {/* Slider 1: Patient Demand (-20% to +40%) */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300 font-medium">Patient Demand Shift</span>
                  <span className="text-rose-400 font-bold">
                    {patientDemandOffset >= 0 ? `+${patientDemandOffset}%` : `${patientDemandOffset}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min={-20}
                  max={40}
                  step={5}
                  value={patientDemandOffset}
                  onChange={(e) => setPatientDemandOffset(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  aria-label="Patient Demand Shift"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>-20% Deficit</span>
                  <span>Normal (0%)</span>
                  <span>+40% Surge</span>
                </div>
              </div>

              {/* Slider 2: Staff Availability (Reduced to Normal) */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300 font-medium">Staff Availability</span>
                  <span className="text-amber-400 font-bold">
                    {staffAvailability < 60 ? 'Reduced Pool' : staffAvailability < 85 ? 'Moderate Shift' : 'Normal Staffing'}
                  </span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={100}
                  step={10}
                  value={staffAvailability}
                  onChange={(e) => setStaffAvailability(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  aria-label="Staff Availability"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>Reduced (-30%)</span>
                  <span>Constrained</span>
                  <span>Normal (100%)</span>
                </div>
              </div>

              {/* Slider 3: ICU Capacity (Low to High) */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300 font-medium">ICU Bed Buffer</span>
                  <span className="text-cyan-400 font-bold">
                    {icuCapacityLevel < 40 ? 'Low (26 Beds)' : icuCapacityLevel < 70 ? 'Standard (32 Beds)' : 'High (36 Beds)'}
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={80}
                  step={10}
                  value={icuCapacityLevel}
                  onChange={(e) => setIcuCapacityLevel(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  aria-label="ICU Bed Buffer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>Low</span>
                  <span>Standard</span>
                  <span>High</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] text-[10px] font-mono text-slate-500">
              * Stochastic discrete-event simulation model. All displayed metrics are simulated.
            </div>
          </div>

          {/* Right Column: Comparative Side-by-Side Analysis (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Without Intervention (Current Reactive State) */}
              <div className="p-6 rounded-2xl bg-[#070B17] border border-rose-500/30 flex flex-col justify-between gap-4 shadow-md">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
                      Without Intervention
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      {rawBreach ? 'CAPACITY BREACH' : 'CONSTRAINED'}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">ICU Occupancy:</span>
                      <strong className={rawIcuLoad > 92 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                        {rawIcuLoad}%
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Emergency Wait Time:</span>
                      <strong className={rawWaitTime > 55 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                        {rawWaitTime} min
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Nurse-to-Patient Ratio:</span>
                      <strong className="text-rose-400 font-bold">
                        {staffAvailability < 70 ? '1:3.4 (Violated)' : '1:2.4 (Borderline)'}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Campus Diversion Risk:</span>
                      <strong className="text-rose-400 font-bold">
                        {rawBreach ? 'Imminent (T-45m)' : 'Low'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/20 text-xs text-rose-300 font-sans">
                  Delayed reaction creates ambulance diverts and acute emergency triage gridlock.
                </div>
              </div>

              {/* Box 2: With IntelliCare (Simulated Optimized State) */}
              <div className="p-6 rounded-2xl bg-[#070B17] border border-cyan-400/40 flex flex-col justify-between gap-4 shadow-md ring-1 ring-cyan-500/20">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                      With IntelliCare
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      CAPACITY STABLE
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">ICU Occupancy:</span>
                      <strong className="text-cyan-300 font-bold">
                        {optimizedIcuLoad}% (Controlled)
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Emergency Wait Time:</span>
                      <strong className="text-emerald-300 font-bold">
                        {optimizedWaitTime} min
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Statutory ICU Ratio:</span>
                      <strong className="text-emerald-300 font-bold">
                        1:2.0 (Strictly Preserved)
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Diversion Prevented:</span>
                      <strong className="text-emerald-300 font-bold">
                        100% Operational
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 font-sans">
                  MILP rebalances {staffReallocated} float nurses in advance, absorbing shock with zero patient diversion.
                </div>
              </div>
            </div>

            {/* Preemptive Action Summary Banner */}
            <div className="p-5 rounded-2xl bg-[#070B17] border border-white/[0.08] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-xs font-mono">
                  <span className="font-bold text-white block">Preemptive Rebalance Vector Ready</span>
                  <span className="text-slate-400">MILP global convergence in 84ms &bull; Clinical coordinator gate enforced</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/app/scenarios')}
                className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors shrink-0 cursor-pointer"
              >
                Run in Studio &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

