import React, { useState } from 'react';
import {
  Play,
  Save,
  RotateCcw,
  CheckCircle2,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { useScenarioStore } from '../../store/useScenarioStore';
import { useRouterStore } from '../../store/useRouterStore';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const ScenariosPage: React.FC = () => {
  const currentParameters = useScenarioStore((state) => state.currentParameters);
  const setParameter = useScenarioStore((state) => state.setParameter);
  const resetParameters = useScenarioStore((state) => state.resetParameters);
  const currentResult = useScenarioStore((state) => state.currentResult);
  const savedScenarios = useScenarioStore((state) => state.savedScenarios);
  const loadPreset = useScenarioStore((state) => state.loadPreset);
  const activePresetId = useScenarioStore((state) => state.activePresetId);
  const runSimulation = useScenarioStore((state) => state.runSimulation);
  const isSimulating = useScenarioStore((state) => state.isSimulating);
  const saveCurrentScenario = useScenarioStore((state) => state.saveCurrentScenario);
  const navigate = useRouterStore((state) => state.navigate);

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDesc, setSaveDesc] = useState('');

  const handleSave = () => {
    if (!saveName.trim()) return;
    saveCurrentScenario(saveName, saveDesc, 'Custom');
    setIsSaveModalOpen(false);
    setSaveName('');
    setSaveDesc('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              What-If Capacity Sandbox
            </span>
            <span className="text-slate-600">•</span>
            <Badge variant="purple" size="sm">
              MONTE CARLO STOCHASTIC SIMULATION
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            What happens if tomorrow changes?
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Simulate emergency patient surges, staff absenteeism, and ICU bed constraints before they occur.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => resetParameters()}
          >
            Reset
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<Save className="w-3.5 h-3.5" />}
            onClick={() => setIsSaveModalOpen(true)}
          >
            Save Scenario
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />}
            onClick={() => runSimulation()}
            disabled={isSimulating}
          >
            {isSimulating ? 'Simulating Engine...' : 'Run Simulation'}
          </Button>
        </div>
      </div>

      {/* 2. Preset Crisis Templates */}
      <div className="p-4 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-3">
        <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block">
          Preset Crisis & Surge Archetypes
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {savedScenarios.slice(0, 3).map((sc) => (
            <div
              key={sc.id}
              onClick={() => loadPreset(sc.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                activePresetId === sc.id
                  ? 'bg-purple-500/15 border-purple-500/50 shadow-md'
                  : 'bg-surface-200/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-white truncate">{sc.name}</span>
                <Badge variant="purple" size="sm">{sc.category}</Badge>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {sc.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Interactive Scenario Variable Sliders & Sandbox Controls */}
      <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-5">
        <h3 className="text-base font-display font-bold text-white">
          Scenario Parameter Adjustments
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slider 1: Emergency Demand Delta */}
          <div className="p-4 rounded-2xl bg-surface-200/40 dark:bg-[#07111f] border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Emergency Intake Surge</span>
              <span className={`font-bold ${currentParameters.emergencyDemandDeltaPercent > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {currentParameters.emergencyDemandDeltaPercent > 0 ? `+${currentParameters.emergencyDemandDeltaPercent}%` : `${currentParameters.emergencyDemandDeltaPercent}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="100"
              step="5"
              value={currentParameters.emergencyDemandDeltaPercent}
              onChange={(e) => setParameter('emergencyDemandDeltaPercent', Number(e.target.value))}
              className="w-full accent-rose-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>-30%</span>
              <span>Baseline (0%)</span>
              <span>+100% (MCI)</span>
            </div>
          </div>

          {/* Slider 2: ICU Bed Availability */}
          <div className="p-4 rounded-2xl bg-surface-200/40 dark:bg-[#07111f] border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">ICU Bed Delta</span>
              <span className={`font-bold ${currentParameters.icuBedDelta < 0 ? 'text-amber-400' : 'text-cyan-400'}`}>
                {currentParameters.icuBedDelta > 0 ? `+${currentParameters.icuBedDelta} beds` : `${currentParameters.icuBedDelta} beds`}
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={currentParameters.icuBedDelta}
              onChange={(e) => setParameter('icuBedDelta', Number(e.target.value))}
              className="w-full accent-amber-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>-10 (Pod Outage)</span>
              <span>Nominal (0)</span>
              <span>+10 (Surge Bays)</span>
            </div>
          </div>

          {/* Slider 3: Nurse Staffing Availability */}
          <div className="p-4 rounded-2xl bg-surface-200/40 dark:bg-[#07111f] border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Nurse Availability Delta</span>
              <span className={`font-bold ${currentParameters.nurseAvailabilityDeltaPercent < 0 ? 'text-rose-400' : 'text-teal-400'}`}>
                {currentParameters.nurseAvailabilityDeltaPercent > 0 ? `+${currentParameters.nurseAvailabilityDeltaPercent}%` : `${currentParameters.nurseAvailabilityDeltaPercent}%`}
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="30"
              step="5"
              value={currentParameters.nurseAvailabilityDeltaPercent}
              onChange={(e) => setParameter('nurseAvailabilityDeltaPercent', Number(e.target.value))}
              className="w-full accent-teal-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>-40% (Severe Absenteeism)</span>
              <span>Nominal</span>
              <span>+30% (Agency Rota)</span>
            </div>
          </div>
        </div>

        {/* Operational Policy Interventions Toggles */}
        <div className="p-4 rounded-2xl bg-surface-200/40 dark:bg-[#07111f] border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentParameters.rapidDischargeAcceleration}
                onChange={(e) => setParameter('rapidDischargeAcceleration', e.target.checked)}
                className="rounded bg-surface-200 border-slate-700 text-cyan-400 focus:ring-cyan-400"
              />
              <span className="text-slate-200">Accelerate Rapid Ward Discharge (NEWS2 &lt;= 2)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentParameters.electiveSurgeryHold}
                onChange={(e) => setParameter('electiveSurgeryHold', e.target.checked)}
                className="rounded bg-surface-200 border-slate-700 text-purple-400 focus:ring-purple-400"
              />
              <span className="text-slate-200">Hold Category C Elective Surgeries</span>
            </label>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Play className="w-3.5 h-3.5" />}
            onClick={() => runSimulation()}
          >
            Compute Impact Matrix
          </Button>
        </div>
      </div>

      {/* 4. Scenario Simulation Results: Baseline vs Scenario Delta */}
      {currentResult && (
        <div className="space-y-6">
          {/* Summary Health & Pressure Tier Banner */}
          <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-slate-400 uppercase">Simulated Impact Assessment</span>
                <span className="text-slate-600">•</span>
                <Badge
                  variant={currentResult.hospitalSummary.riskTier === 'CRITICAL' ? 'rose' : currentResult.hospitalSummary.riskTier === 'HIGH' ? 'amber' : 'emerald'}
                  size="sm"
                  dot
                >
                  RISK TIER: {currentResult.hospitalSummary.riskTier}
                </Badge>
              </div>
              <h3 className="text-xl font-display font-bold text-white">
                Projected Capacity Pressure Index: {currentResult.hospitalSummary.capacityPressureIndex} / 100
              </h3>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-surface-200/50 border border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px]">UNMET DEMAND</span>
                <span className="text-lg font-bold text-rose-400">{currentResult.hospitalSummary.totalUnmetDemand} Patients</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-200/50 border border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px]">STAFF DEFICIT</span>
                <span className="text-lg font-bold text-amber-400">{currentResult.hospitalSummary.criticalStaffDeficit} Nurses</span>
              </div>
            </div>
          </div>

          {/* Department Breakdown Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentResult.departments.map((d) => (
              <div
                key={d.departmentId}
                className="p-5 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 font-bold truncate">{d.departmentName}</span>
                  <Badge variant={d.riskStatus === 'CRITICAL' ? 'rose' : d.riskStatus === 'MODERATE' ? 'amber' : 'emerald'} size="sm">
                    {d.riskStatus}
                  </Badge>
                </div>

                <div className="p-3 rounded-xl bg-surface-200/50 dark:bg-[#07111f] border border-slate-800 flex items-baseline justify-between font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Baseline</span>
                    <span className="text-sm font-bold text-slate-300">{d.baselineUtilization}%</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                  <div className="text-right">
                    <span className="text-[10px] text-cyan-400 block font-bold">Scenario</span>
                    <span className={`text-base font-bold ${d.scenarioUtilization > 100 ? 'text-rose-400' : 'text-white'}`}>
                      {d.scenarioUtilization}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] font-mono text-slate-400">
                  <div className="flex justify-between">
                    <span>Unmet Patients:</span>
                    <span className={d.unmetDemandPatients > 0 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                      {d.unmetDemandPatients}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wait Time Delta:</span>
                    <span className={d.estimatedWaitTimeMinutesDelta > 0 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                      {d.estimatedWaitTimeMinutesDelta > 0 ? `+${d.estimatedWaitTimeMinutesDelta} mins` : `${d.estimatedWaitTimeMinutesDelta} mins`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Automated Mitigation Recommendations */}
          <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Automated Operational Mitigation Playbook
            </h4>

            <div className="space-y-2">
              {currentResult.automatedMitigations.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-surface-200/40 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{m}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                icon={<Cpu className="w-4 h-4" />}
                onClick={() => navigate('/app/optimization')}
              >
                Launch MILP Solver for this Scenario →
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Save Scenario Modal */}
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="Save Custom What-If Scenario"
        subtitle="Store these parameters for future baseline comparisons and multi-scenario evaluations."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setIsSaveModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Save to Library
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Scenario Title"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="e.g. Major Transit Stoppage & Freezing Fog"
          />
          <Input
            label="Description & Context"
            value={saveDesc}
            onChange={(e) => setSaveDesc(e.target.value)}
            placeholder="Document key assumptions and estimated staffing disruption..."
          />
        </div>
      </Modal>
    </div>
  );
};
