import React, { useState } from 'react';
import { Sliders } from 'lucide-react';
import { Slider } from '../../../ui/Slider';

interface ThresholdsSectionProps {
  onMarkDirty: () => void;
}

interface ThresholdRule {
  id: string;
  metric: string;
  category: string;
  currentValue: number;
  warningThreshold: number;
  criticalThreshold: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  enabled: boolean;
  notificationPolicy: 'IMMEDIATE' | 'BATCHED_15M' | 'DIGEST';
  description: string;
}

export const ThresholdsSection: React.FC<ThresholdsSectionProps> = ({ onMarkDirty }) => {
  const [rules, setRules] = useState<ThresholdRule[]>([
    {
      id: 'rule-icu-occ',
      metric: 'ICU Bed Occupancy Threshold',
      category: 'Critical Care',
      currentValue: 88,
      warningThreshold: 80,
      criticalThreshold: 90,
      unit: '%',
      min: 50,
      max: 100,
      step: 1,
      enabled: true,
      notificationPolicy: 'IMMEDIATE',
      description: 'Triggers critical surge alerts and step-down discharge candidate evaluations.'
    },
    {
      id: 'rule-ed-surge',
      metric: 'Emergency Arrival Surge Delta',
      category: 'Emergency Medicine',
      currentValue: 14,
      warningThreshold: 10,
      criticalThreshold: 15,
      unit: '%',
      min: 0,
      max: 40,
      step: 1,
      enabled: true,
      notificationPolicy: 'IMMEDIATE',
      description: 'Triggers Level 2 overflow protocols when arrival forecasts exceed baseline.'
    },
    {
      id: 'rule-bed-general',
      metric: 'General Ward Census Capacity',
      category: 'Inpatient Medicine',
      currentValue: 84,
      warningThreshold: 75,
      criticalThreshold: 88,
      unit: '%',
      min: 50,
      max: 100,
      step: 1,
      enabled: true,
      notificationPolicy: 'BATCHED_15M',
      description: 'Activates rapid-discharge rounds and opens PACU transition beds.'
    },
    {
      id: 'rule-staff-util',
      metric: 'Clinical Staff Workload Utilization',
      category: 'Workforce & Nursing',
      currentValue: 82,
      warningThreshold: 75,
      criticalThreshold: 85,
      unit: '%',
      min: 40,
      max: 100,
      step: 1,
      enabled: true,
      notificationPolicy: 'BATCHED_15M',
      description: 'Recommends floater nurse call-in before mandatory statutory ratios are breached.'
    },
    {
      id: 'rule-vent-avail',
      metric: 'Ventilator Buffer Minimum Standby',
      category: 'Biomedical Equipment',
      currentValue: 3,
      warningThreshold: 4,
      criticalThreshold: 2,
      unit: ' units',
      min: 0,
      max: 10,
      step: 1,
      enabled: true,
      notificationPolicy: 'IMMEDIATE',
      description: 'Triggers biomedical central depot staging when calibrated ventilators run low.'
    }
  ]);

  const handleUpdateWarning = (id: string, val: number) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, warningThreshold: val } : r))
    );
    onMarkDirty();
  };

  const handleUpdateCritical = (id: string, val: number) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, criticalThreshold: val } : r))
    );
    onMarkDirty();
  };

  const handleToggleEnabled = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
    onMarkDirty();
  };

  return (
    <div className="space-y-6">
      {/* Alerting Logic Philosophy Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-cyan-500/[0.04] border border-cyan-500/20 flex items-start gap-3.5">
        <Sliders className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs font-mono space-y-1">
          <span className="font-bold text-white block">Multi-Stage Threshold Surveillance</span>
          <p className="text-slate-300 font-sans leading-relaxed">
            IntelliCare enforces a 3-tier boundary architecture: <span className="text-emerald-400 font-mono">Normal (Green)</span>, <span className="text-amber-400 font-mono">Warning (Amber)</span>, and <span className="text-rose-400 font-mono">Critical (Red)</span>. Threshold adjustments instantly update real-time telemetry streaming and automated MILP solver objective triggers.
          </p>
        </div>
      </div>

      {/* Rules list */}
      <div className="space-y-4">
        {rules.map((rule) => {
          const isTriggered = rule.currentValue >= rule.criticalThreshold;
          const isWarning = rule.currentValue >= rule.warningThreshold && !isTriggered;

          return (
            <div
              key={rule.id}
              className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                rule.enabled
                  ? 'bg-[#070D1A] border-white/[0.08]'
                  : 'bg-black/30 border-white/[0.04] opacity-60'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.06] text-slate-400">
                      {rule.category}
                    </span>
                    <h4 className="font-display font-bold text-sm sm:text-base text-white">
                      {rule.metric}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {rule.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Current Telemetry</span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        isTriggered
                          ? 'text-rose-400'
                          : isWarning
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {rule.currentValue}{rule.unit}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleEnabled(rule.id)}
                    className={`text-xs font-mono px-3 py-1 rounded-xl border transition-colors cursor-pointer ${
                      rule.enabled
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                        : 'bg-white/[0.05] border-white/[0.08] text-slate-500'
                    }`}
                  >
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              {/* Multi-Stage Visual Scale */}
              <div className="mt-4 pt-1 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-emerald-400">Normal (Below {rule.warningThreshold}{rule.unit})</span>
                  <span className="text-amber-400">Warning ({rule.warningThreshold}{rule.unit} - {rule.criticalThreshold}{rule.unit})</span>
                  <span className="text-rose-400">Critical (Above {rule.criticalThreshold}{rule.unit})</span>
                </div>

                {/* Visual Multi-Colored Scale Bar with indicator */}
                <div className="relative h-2.5 w-full rounded-full bg-slate-900 border border-white/[0.08] overflow-hidden flex">
                  <div
                    style={{ width: `${((rule.warningThreshold - rule.min) / (rule.max - rule.min)) * 100}%` }}
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500/70"
                  />
                  <div
                    style={{
                      width: `${((rule.criticalThreshold - rule.warningThreshold) / (rule.max - rule.min)) * 100}%`
                    }}
                    className="h-full bg-gradient-to-r from-amber-500/70 to-amber-500"
                  />
                  <div className="h-full flex-1 bg-gradient-to-r from-rose-500 to-rose-600" />
                </div>
              </div>

              {/* Sliders for Warning & Critical Thresholds */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <Slider
                  label="Warning Alert Threshold"
                  value={rule.warningThreshold}
                  min={rule.min}
                  max={rule.criticalThreshold - 1}
                  step={rule.step}
                  unit={rule.unit}
                  onChange={(val: number) => handleUpdateWarning(rule.id, val)}
                  helperText="Initial operational awareness and nursing notification threshold."
                />

                <Slider
                  label="Critical Breach Threshold"
                  value={rule.criticalThreshold}
                  min={rule.warningThreshold + 1}
                  max={rule.max}
                  step={rule.step}
                  unit={rule.unit}
                  onChange={(val: number) => handleUpdateCritical(rule.id, val)}
                  helperText="Immediate pager dispatch, EOC alert, and automatic bed reserve unlock."
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
