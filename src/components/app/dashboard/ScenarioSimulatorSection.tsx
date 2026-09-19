import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useRouterStore } from '../../../store/useRouterStore';

interface ScenarioPresetOption {
  id: string;
  name: string;
  category: string;
  description: string;
  edDelta: number;
  icuDelta: number;
  staffDelta: number;
}

const PRESETS: ScenarioPresetOption[] = [
  {
    id: 'baseline',
    name: 'Baseline Operations',
    category: 'Normal State',
    description: 'Current baseline throughput and scheduled shift allocations.',
    edDelta: 0,
    icuDelta: 0,
    staffDelta: 0
  },
  {
    id: 'ed-surge',
    name: 'ED Surge (+25%)',
    category: 'Surge',
    description: 'Sudden spike in acute respiratory and triage presentations.',
    edDelta: 25,
    icuDelta: -1,
    staffDelta: 0
  },
  {
    id: 'icu-surge',
    name: 'ICU Surge / MCI',
    category: 'Critical Surge',
    description: 'Regional multi-casualty incident requiring immediate resuscitation bays and critical care.',
    edDelta: 40,
    icuDelta: -4,
    staffDelta: -5
  },
  {
    id: 'staff-shortage',
    name: 'Staff Shortage (-15%)',
    category: 'Staffing Disruption',
    description: 'Severe weather transit stoppage causing 15% staff absenteeism across clinical units.',
    edDelta: 10,
    icuDelta: 0,
    staffDelta: -15
  },
  {
    id: 'bed-constraint',
    name: 'Bed Capacity Constraint',
    category: 'Facility Maintenance',
    description: 'Mandatory negative-pressure filtration maintenance taking 6 isolation beds offline.',
    edDelta: 0,
    icuDelta: -6,
    staffDelta: 0
  },
  {
    id: 'equipment-failure',
    name: 'Critical Equipment Outage',
    category: 'Telemetry Interruption',
    description: 'CT scanner power supply interruption and 4 ventilator sterilization delays.',
    edDelta: 15,
    icuDelta: -2,
    staffDelta: 0
  }
];

export const ScenarioSimulatorSection: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ed-surge');
  const [isSimulating, setIsSimulating] = useState(false);
  const navigate = useRouterStore((state) => state.navigate);

  const selectedPreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[1];

  // Dynamic calculations based on selected preset
  const calculateMetrics = (p: ScenarioPresetOption) => {
    const baselineICU = 90.6;
    const scenarioICU = Math.min(100, Math.max(70, Number((baselineICU + Math.abs(p.icuDelta) * 2.8 + p.edDelta * 0.15).toFixed(1))));
    const icuDelta = Number((scenarioICU - baselineICU).toFixed(1));

    const baselineBeds = 28;
    const scenarioBeds = Math.max(0, baselineBeds - Math.abs(p.icuDelta) - Math.round(p.edDelta * 0.3));
    const bedDelta = scenarioBeds - baselineBeds;

    const baselineStaff = 91.2;
    const scenarioStaff = Math.min(100, Math.max(60, Number((baselineStaff - Math.abs(p.staffDelta) * 0.9).toFixed(1))));
    const staffDelta = Number((scenarioStaff - baselineStaff).toFixed(1));

    const baselineEDWait = 34; // minutes
    const scenarioEDWait = Math.round(baselineEDWait + p.edDelta * 1.4);
    const edWaitDelta = scenarioEDWait - baselineEDWait;

    return {
      icu: { current: `${baselineICU}%`, scenario: `${scenarioICU}%`, delta: `${icuDelta > 0 ? '+' : ''}${icuDelta}%`, critical: scenarioICU >= 95 },
      beds: { current: `${baselineBeds} Beds`, scenario: `${scenarioBeds} Beds`, delta: `${bedDelta} Beds`, critical: scenarioBeds < 10 },
      staff: { current: `${baselineStaff}%`, scenario: `${scenarioStaff}%`, delta: `${staffDelta}%`, critical: scenarioStaff < 80 },
      wait: { current: `${baselineEDWait}m`, scenario: `${scenarioEDWait}m`, delta: `+${edWaitDelta}m`, critical: scenarioEDWait > 60 }
    };
  };

  const metrics = calculateMetrics(selectedPreset);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 700);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#07111f] border border-slate-800/90 shadow-lg flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Digital Twin Engine
              </span>
              <span className="text-slate-700">•</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                SIMULATION
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-display font-bold text-white tracking-tight">
              Operational What-If Simulation
            </h2>
          </div>

          <button
            onClick={() => navigate('/app/scenarios')}
            className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Full Scenario Sandbox</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Preset Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 my-3.5">
          {PRESETS.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.2)] text-white'
                    : 'bg-[#0a1628] border-slate-800/90 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="text-[10px] font-mono uppercase text-slate-500 truncate mb-0.5">
                  {preset.category}
                </div>
                <div className="text-xs font-bold truncate">
                  {preset.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Scenario Description & Action */}
        <div className="p-3 rounded-xl bg-[#081324] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
          <div className="text-xs text-slate-300">
            <span className="font-bold text-white font-mono">{selectedPreset.name}: </span>
            {selectedPreset.description}
          </div>

          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_12px_rgba(168,85,247,0.3)] shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Computing...' : 'Recalculate State'}</span>
          </button>
        </div>

        {/* Digital Twin State Transition Table / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {/* Metric 1: ICU Occupancy */}
          <div className="p-3.5 rounded-xl bg-[#0a1628] border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
              ICU Bed Occupancy
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-mono text-slate-400">Current: {metrics.icu.current}</span>
              <span className={`text-base font-mono font-bold ${metrics.icu.critical ? 'text-rose-400' : 'text-white'}`}>
                {metrics.icu.scenario}
              </span>
            </div>
            <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500">Projected Delta</span>
              <span className={`font-bold ${metrics.icu.critical ? 'text-rose-400' : 'text-amber-400'}`}>
                {metrics.icu.delta}
              </span>
            </div>
          </div>

          {/* Metric 2: Available Beds */}
          <div className="p-3.5 rounded-xl bg-[#0a1628] border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
              Available Bed Buffer
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-mono text-slate-400">Current: {metrics.beds.current}</span>
              <span className={`text-base font-mono font-bold ${metrics.beds.critical ? 'text-rose-400' : 'text-white'}`}>
                {metrics.beds.scenario}
              </span>
            </div>
            <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500">Projected Delta</span>
              <span className={`font-bold ${metrics.beds.critical ? 'text-rose-400' : 'text-teal-400'}`}>
                {metrics.beds.delta}
              </span>
            </div>
          </div>

          {/* Metric 3: Staff Utilization */}
          <div className="p-3.5 rounded-xl bg-[#0a1628] border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
              Staff Ratio Compliance
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-mono text-slate-400">Current: {metrics.staff.current}</span>
              <span className={`text-base font-mono font-bold ${metrics.staff.critical ? 'text-rose-400' : 'text-white'}`}>
                {metrics.staff.scenario}
              </span>
            </div>
            <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500">Projected Delta</span>
              <span className={`font-bold ${metrics.staff.critical ? 'text-rose-400' : 'text-slate-300'}`}>
                {metrics.staff.delta}
              </span>
            </div>
          </div>

          {/* Metric 4: ED Wait Pressure */}
          <div className="p-3.5 rounded-xl bg-[#0a1628] border border-slate-800">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1">
              Emergency Boarding Delay
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-mono text-slate-400">Current: {metrics.wait.current}</span>
              <span className={`text-base font-mono font-bold ${metrics.wait.critical ? 'text-rose-400' : 'text-white'}`}>
                {metrics.wait.scenario}
              </span>
            </div>
            <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500">Projected Delta</span>
              <span className={`font-bold ${metrics.wait.critical ? 'text-rose-400' : 'text-amber-400'}`}>
                {metrics.wait.delta}
              </span>
            </div>
          </div>
        </div>

        {/* Automated Mitigations Banner */}
        <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-purple-950/20 via-surface-100 to-[#0a1628] border border-purple-500/20 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-purple-300">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Recommended Mitigation: Trigger elective surgical hold and deploy floater nurses to resus bays.</span>
          </div>
          <button
            onClick={() => navigate('/app/optimization')}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Solve with MILP</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
