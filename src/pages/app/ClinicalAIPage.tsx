import React, { useState } from 'react';
import {
  Activity,
  Heart,
  CheckCircle2,
  Sliders,
  Pill,
  GitBranch,
  Zap,
  Layers,
  Thermometer,
  Wind,
  Droplet,
  ShieldAlert
} from 'lucide-react';
import { useClinicalAIStore } from '../../store/useClinicalAIStore';
import { useRouterStore } from '../../store/useRouterStore';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const ClinicalAIPage: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);
  const patientVitals = useClinicalAIStore((state) => state.patientVitals);
  const activePresetId = useClinicalAIStore((state) => state.activePresetId);
  const presets = useClinicalAIStore((state) => state.presets);
  const riskAssessment = useClinicalAIStore((state) => state.riskAssessment);
  const updateVital = useClinicalAIStore((state) => state.updateVital);
  const loadPreset = useClinicalAIStore((state) => state.loadPreset);

  const selectedDrugIds = useClinicalAIStore((state) => state.selectedDrugIds);
  const availableDrugs = useClinicalAIStore((state) => state.availableDrugs);
  const drugInteractions = useClinicalAIStore((state) => state.drugInteractions);
  const toggleDrug = useClinicalAIStore((state) => state.toggleDrug);
  const clearDrugs = useClinicalAIStore((state) => state.clearDrugs);

  const [activeTab, setActiveTab] = useState<'risk' | 'drugs'>('risk');

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'CRITICAL_ALERT':
        return 'text-rose-400 bg-rose-500/20 border-rose-500/40 animate-pulse';
      case 'HIGH':
        return 'text-amber-400 bg-amber-500/20 border-amber-500/40';
      case 'MODERATE':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40';
      case 'LOW':
      default:
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* 1. Header Command Greeting */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-surface-100 dark:bg-[#0c182c] border border-slate-700/80 dark:border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Clinical Decision Support System (CDSS)
            </span>
            <span className="text-slate-600">•</span>
            <Badge variant={riskAssessment.riskTier === 'CRITICAL_ALERT' ? 'rose' : 'cyan'} size="sm" dot>
              {riskAssessment.riskTier.replace('_', ' ')}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            AI Clinical Deterioration & Risk Engine
          </h1>
          <p className="mt-1 text-sm text-slate-300 max-w-3xl leading-relaxed">
            Multi-model patient risk stratifier powered by <strong>Random Forest</strong> (Sepsis / Shock), <strong>XGBoost</strong> (ICU Readmission), and <strong>LSTM</strong> (12-Hour Trajectory Decompensation).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            icon={<GitBranch className="w-4 h-4 text-cyan-400" />}
            onClick={() => navigate('/app/models')}
          >
            ML Model Studio →
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Activity className="w-4 h-4" />}
            onClick={() => navigate('/app/recommendations')}
          >
            Clinical Directives →
          </Button>
        </div>
      </div>

      {/* 2. Top Patient Case Presets Ribbon */}
      <div className="p-5 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Load Clinical Case Simulation Presets:
          </span>
          <span className="text-[11px] font-mono text-cyan-400">
            Click any patient to test model predictions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          {presets.map((p) => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => loadPreset(p.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-md'
                    : 'bg-surface-200/50 dark:bg-[#07111f] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-200 truncate">{p.bedCode}</span>
                  <span className="text-[10px] text-cyan-400">{p.department}</span>
                </div>
                <div className="text-[11px] text-slate-300 truncate">{p.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Navigation Tabs: Patient Vitals & Risk vs Drug Matrix */}
      <div className="flex items-center border-b border-slate-800 space-x-2 text-xs font-mono max-w-full overflow-x-auto whitespace-nowrap custom-scrollbar pb-0.5">
        <button
          onClick={() => setActiveTab('risk')}
          className={`pb-3 px-3 transition-colors cursor-pointer border-b-2 font-bold flex items-center gap-2 shrink-0 ${
            activeTab === 'risk'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>1. Patient Vitals & Multi-Model Risk Stratifier</span>
        </button>

        <button
          onClick={() => setActiveTab('drugs')}
          className={`pb-3 px-3 transition-colors cursor-pointer border-b-2 font-bold flex items-center gap-2 shrink-0 ${
            activeTab === 'drugs'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>2. Neural Drug-Drug Interaction Matrix</span>
          {drugInteractions.length > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {drugInteractions.length} Alerts
            </span>
          )}
        </button>
      </div>

      {/* 4. TAB 1: Patient Vitals & Multi-Model Risk Stratifier */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          {/* Main 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (5 Cols): Live Interactive Vital Sign Controls */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    Interactive Physiological Telemetry
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Adjust real-time vitals and biomarker levels
                  </p>
                </div>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {/* Heart Rate */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-400" /> Heart Rate:
                    </span>
                    <span className={`font-bold ${patientVitals.heartRate > 110 || patientVitals.heartRate < 50 ? 'text-rose-400' : 'text-cyan-400'}`}>
                      {patientVitals.heartRate} BPM
                    </span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={190}
                    step={1}
                    value={patientVitals.heartRate}
                    onChange={(e) => updateVital('heartRate', Number(e.target.value))}
                    className="w-full accent-rose-400 cursor-pointer"
                  />
                </div>

                {/* Blood Pressure (Systolic / Diastolic) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Systolic (SBP):</span>
                      <span className="text-cyan-400 font-bold">{patientVitals.systolicBp}</span>
                    </div>
                    <input
                      type="range"
                      min={60}
                      max={220}
                      step={2}
                      value={patientVitals.systolicBp}
                      onChange={(e) => updateVital('systolicBp', Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Diastolic (DBP):</span>
                      <span className="text-cyan-400 font-bold">{patientVitals.diastolicBp}</span>
                    </div>
                    <input
                      type="range"
                      min={35}
                      max={130}
                      step={1}
                      value={patientVitals.diastolicBp}
                      onChange={(e) => updateVital('diastolicBp', Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>

                {/* MAP Callout */}
                <div className="p-2.5 rounded-xl bg-surface-200/60 border border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Mean Arterial Pressure (MAP):</span>
                  <span className={`font-bold ${patientVitals.meanArterialPressure < 65 ? 'text-rose-400 font-bold animate-pulse' : 'text-slate-200'}`}>
                    {patientVitals.meanArterialPressure} mmHg {patientVitals.meanArterialPressure < 65 ? '(Hypoperfusion)' : ''}
                  </span>
                </div>

                {/* SpO2 Oxygen Saturation */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-cyan-400" /> SpO2 Oxygen Sat:
                    </span>
                    <span className={`font-bold ${patientVitals.spo2Oxygen < 92 ? 'text-rose-400' : 'text-teal-400'}`}>
                      {patientVitals.spo2Oxygen}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={70}
                    max={100}
                    step={1}
                    value={patientVitals.spo2Oxygen}
                    onChange={(e) => updateVital('spo2Oxygen', Number(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                </div>

                {/* Respiratory Rate */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Respiratory Rate:</span>
                    <span className={`font-bold ${patientVitals.respiratoryRate > 24 ? 'text-amber-400' : 'text-slate-200'}`}>
                      {patientVitals.respiratoryRate} bpm
                    </span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={48}
                    step={1}
                    value={patientVitals.respiratoryRate}
                    onChange={(e) => updateVital('respiratoryRate', Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Serum Lactate */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-amber-400" /> Serum Lactate:
                    </span>
                    <span className={`font-bold ${patientVitals.serumLactate > 2.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {patientVitals.serumLactate} mmol/L
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={12.0}
                    step={0.1}
                    value={patientVitals.serumLactate}
                    onChange={(e) => updateVital('serumLactate', Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Body Temp */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-rose-400" /> Core Temperature:
                    </span>
                    <span className={`font-bold ${patientVitals.temperatureCelsius > 38.3 ? 'text-rose-400' : 'text-slate-200'}`}>
                      {patientVitals.temperatureCelsius} °C
                    </span>
                  </div>
                  <input
                    type="range"
                    min={35.0}
                    max={41.0}
                    step={0.1}
                    value={patientVitals.temperatureCelsius}
                    onChange={(e) => updateVital('temperatureCelsius', Number(e.target.value))}
                    className="w-full accent-rose-400 cursor-pointer"
                  />
                </div>

                {/* Supplemental O2 Toggle */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-300">Supplemental O2 Administered:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={patientVitals.supplementalOxygen}
                      onChange={(e) => updateVital('supplementalOxygen', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500" />
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column (7 Cols): Multi-Model Risk Inferences & Forecast */}
            <div className="lg:col-span-7 space-y-6">
              {/* 3 Model Cards: RF vs XGBoost vs LSTM */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Random Forest Sepsis Risk */}
                <div className="p-5 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1">
                        <GitBranch className="w-3.5 h-3.5" /> Random Forest
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">Gini Tree Split</span>
                    </div>
                    <span className="text-xs font-mono text-slate-300 block">Sepsis / Shock Risk</span>
                    <div className="text-3xl font-display font-extrabold text-white mt-1">
                      {riskAssessment.randomForestSepsisRisk}%
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
                    <div
                      className={`h-full ${riskAssessment.randomForestSepsisRisk > 60 ? 'bg-rose-500' : 'bg-emerald-400'}`}
                      style={{ width: `${riskAssessment.randomForestSepsisRisk}%` }}
                    />
                  </div>
                </div>

                {/* 2. XGBoost ICU Readmission / Decompensation */}
                <div className="p-5 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" /> XGBoost
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">Hessian Boost</span>
                    </div>
                    <span className="text-xs font-mono text-slate-300 block">48H ICU Decompensation</span>
                    <div className="text-3xl font-display font-extrabold text-white mt-1">
                      {riskAssessment.xgboostIcuDeteriorationRisk}%
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
                    <div
                      className={`h-full ${riskAssessment.xgboostIcuDeteriorationRisk > 60 ? 'bg-rose-500' : 'bg-amber-400'}`}
                      style={{ width: `${riskAssessment.xgboostIcuDeteriorationRisk}%` }}
                    />
                  </div>
                </div>

                {/* 3. LSTM Temporal Decompensation */}
                <div className="p-5 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" /> Recurrent LSTM
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">Sequence Memory</span>
                    </div>
                    <span className="text-xs font-mono text-slate-300 block">12H Collapse Velocity</span>
                    <div className="text-3xl font-display font-extrabold text-white mt-1">
                      {riskAssessment.lstmCardiacArrestRisk}%
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
                    <div
                      className={`h-full ${riskAssessment.lstmCardiacArrestRisk > 60 ? 'bg-rose-500' : 'bg-cyan-400'}`}
                      style={{ width: `${riskAssessment.lstmCardiacArrestRisk}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Standardized Score Badges (NEWS2 + SOFA) */}
              <div className="p-5 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-surface-200/80">
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Standardized Early Warning</span>
                    <span className="text-sm font-bold text-white">
                      NEWS2 Score: <strong className="text-cyan-400">{riskAssessment.news2Score} / 20</strong> &bull; SOFA: <strong className="text-indigo-400">{riskAssessment.sofaScore} / 24</strong>
                    </span>
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-xl border text-xs font-bold ${getTierColor(riskAssessment.riskTier)}`}>
                  STATUS: {riskAssessment.riskTier.replace('_', ' ')}
                </div>
              </div>

              {/* LSTM 12-Hour Deterioration Trajectory Forecast Curve */}
              <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                      LSTM 12-Hour Recurrent Trajectory
                    </span>
                    <h4 className="text-base font-display font-bold text-white">
                      Predicted Patient Risk Drift Over Time
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Conformal Bounds (95% CI)
                  </span>
                </div>

                <div className="relative h-44 w-full bg-surface-200/30 dark:bg-[#07111f] rounded-2xl border border-slate-800 p-4">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 120" preserveAspectRatio="none">
                    {/* Critical Threshold Line */}
                    <line x1="20" y1="36" x2="580" y2="36" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="25" y="30" className="text-[8px] font-mono fill-rose-400 font-bold">
                      CRITICAL ALERT THRESHOLD (70%)
                    </text>

                    {/* Polyline trajectory */}
                    <polyline
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="3"
                      points={riskAssessment.riskTrajectoryNext12Hours
                        .map((pt, i) => {
                          const x = 30 + (i / 6) * 540;
                          const y = 110 - (pt.projectedRiskScore / 100) * 95;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />

                    {/* Points */}
                    {riskAssessment.riskTrajectoryNext12Hours.map((pt, i) => {
                      const x = 30 + (i / 6) * 540;
                      const y = 110 - (pt.projectedRiskScore / 100) * 95;
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
                          <text x={x} y="118" textAnchor="middle" className="text-[8px] font-mono fill-slate-400">
                            {pt.hourLabel}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Actionable AI Clinical Directives */}
              <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-3">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  Automated AI Clinical Directives
                </span>
                <div className="space-y-2.5">
                  {riskAssessment.clinicalDirectives.map((d) => (
                    <div
                      key={d.id}
                      className="p-3.5 rounded-2xl bg-surface-200/50 dark:bg-[#07111f] border border-slate-800 flex items-start gap-3"
                    >
                      <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs font-mono mb-1">
                          <span className="font-bold text-white">{d.action}</span>
                          <span className="text-[10px] text-cyan-400">{d.targetWindow}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          Protocol Reference: {d.guidelineRef}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 2: Neural Drug-Drug Interaction Matrix */}
      {activeTab === 'drugs' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Badge variant="indigo" size="sm" className="mb-2">
                  PHARMACOGENOMICS &bull; GRAPH NEURAL NETWORK
                </Badge>
                <h3 className="text-xl font-display font-bold text-white">
                  Multi-Medication Contraindication & Interaction Checker
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Select co-prescribed medications to simulate CYP450 enzyme metabolism conflicts, QT-prolongation, and synergistic bleeding risks.
                </p>
              </div>

              {selectedDrugIds.length > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearDrugs}
                >
                  Clear Selection ({selectedDrugIds.length})
                </Button>
              )}
            </div>

            {/* Drug Selection Pills */}
            <div>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Select Active Medication Regimen:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 font-mono text-xs">
                {availableDrugs.map((drug) => {
                  const isSelected = selectedDrugIds.includes(drug.id);
                  return (
                    <button
                      key={drug.id}
                      onClick={() => toggleDrug(drug.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-sm'
                          : 'bg-surface-200/40 dark:bg-[#07111f] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-bold text-slate-200 block truncate">{drug.brandName}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{drug.genericName}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                        isSelected ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-slate-700'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-black" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interaction Results Output */}
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Neural Matrix Evaluation ({drugInteractions.length} Identified Conflict{drugInteractions.length === 1 ? '' : 's'})
                </span>
              </div>

              {drugInteractions.length === 0 ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center font-mono text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-emerald-300 font-bold">No Major Adverse Pharmacokinetic Conflicts Detected</p>
                  <p className="text-slate-400 text-[11px] mt-1">Selected medications do not exhibit high-risk CYP enzyme competition.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {drugInteractions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-surface-200/50 dark:bg-[#07111f] border border-slate-800 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-base text-white">
                            {item.drugA} &bull; {item.drugB}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                              item.severity === 'CONTRAINDICATED'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                                : item.severity === 'MAJOR'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                            }`}
                          >
                            {item.severity}
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400">
                            Confidence: {item.mlConfidence}%
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="p-3 rounded-xl bg-surface-300/30 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase block mb-1">
                            Molecular Mechanism:
                          </span>
                          <p className="text-slate-300 leading-relaxed">
                            {item.interactionMechanism}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-surface-300/30 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase block mb-1">
                            Clinical Risk:
                          </span>
                          <p className="text-rose-300 leading-relaxed font-semibold">
                            {item.clinicalImpact}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono">
                        <span className="text-cyan-400 font-bold uppercase block mb-1">
                          AI Suggested Clinical Action & Alternative:
                        </span>
                        <p className="text-cyan-200 leading-relaxed">
                          {item.actionRecommendation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
