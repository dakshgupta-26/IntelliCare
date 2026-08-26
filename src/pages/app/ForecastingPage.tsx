import React from 'react';
import {
  Cpu,
  RefreshCw
} from 'lucide-react';
import { useForecastStore } from '../../store/useForecastStore';
import { useHospitalStore } from '../../store/useHospitalStore';
import { useRouterStore } from '../../store/useRouterStore';
import { ForecastHorizon, ForecastModelType } from '../../types/forecasting';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const ForecastingPage: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);
  const forecastData = useForecastStore((state) => state.forecastData);
  const selectedHorizon = useForecastStore((state) => state.selectedHorizon);
  const setHorizon = useForecastStore((state) => state.setHorizon);
  const selectedModel = useForecastStore((state) => state.selectedModel);
  const setModel = useForecastStore((state) => state.setModel);
  const selectedDepartmentId = useForecastStore((state) => state.selectedDepartmentId);
  const setDepartmentId = useForecastStore((state) => state.setDepartmentId);
  const showConfidenceBands = useForecastStore((state) => state.showConfidenceBands);
  const setShowConfidenceBands = useForecastStore((state) => state.setShowConfidenceBands);
  const showSurgeAnomaly = useForecastStore((state) => state.showSurgeAnomaly);
  const setShowSurgeAnomaly = useForecastStore((state) => state.setShowSurgeAnomaly);
  const isGeneratingForecast = useForecastStore((state) => state.isGeneratingForecast);
  const triggerForecastRefresh = useForecastStore((state) => state.triggerForecastRefresh);

  const departments = useHospitalStore((state) => state.departments);

  const horizons: ForecastHorizon[] = ['6H', '12H', '24H', '48H', '72H'];
  const models: { type: ForecastModelType; label: string; tag: string }[] = [
    { type: 'LSTM', label: 'Multi-Horizon LSTM (Primary)', tag: 'Neural Recurrent' },
    { type: 'XGBOOST', label: 'XGBoost Regressor (Baseline)', tag: 'Gradient Boosted Trees' },
    { type: 'RANDOM_FOREST', label: 'Random Forest Regressor', tag: 'Bootstrap Bagged Trees' },
    { type: 'ENSEMBLE', label: 'Bayesian Super-Ensemble', tag: 'Dynamic Stacking' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Heading & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              Predictive Inference Engine
            </span>
            <span className="text-slate-600">•</span>
            <Badge variant="cyan" size="sm">
              DEMO / EVALUATION DATASET
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Demand Intelligence
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            "Understand what is likely to happen next." Multi-horizon patient arrivals and acuity surge forecasts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isGeneratingForecast ? 'animate-spin' : ''}`} />}
            onClick={() => triggerForecastRefresh()}
            disabled={isGeneratingForecast}
          >
            {isGeneratingForecast ? 'Inferring...' : 'Refresh Inference'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<Cpu className="w-3.5 h-3.5 text-cyan-400" />}
            onClick={() => navigate('/app/models')}
          >
            ML Model Studio →
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Cpu className="w-3.5 h-3.5" />}
            onClick={() => navigate('/app/optimization')}
          >
            Send to Optimizer →
          </Button>
        </div>
      </div>

      {/* 2. Controls Ribbon: Department, Horizon, Model, Toggles */}
      <div className="p-5 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        {/* Department Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Department:</span>
          <select
            value={selectedDepartmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="bg-surface-200/80 dark:bg-[#07111f] border border-slate-700/80 dark:border-slate-800 rounded-xl py-1.5 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 appearance-none cursor-pointer"
          >
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>

        {/* Horizon Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Horizon:</span>
          <div className="flex items-center bg-surface-200/80 dark:bg-[#07111f] p-1 rounded-xl border border-slate-800">
            {horizons.map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedHorizon === h
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Model Architecture Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Model:</span>
          <select
            value={selectedModel}
            onChange={(e) => setModel(e.target.value as any)}
            className="bg-surface-200/80 dark:bg-[#07111f] border border-slate-700/80 dark:border-slate-800 rounded-xl py-1.5 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 appearance-none cursor-pointer"
          >
            {models.map((m) => (
              <option key={m.type} value={m.type}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Confidence interval and Anomaly toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showConfidenceBands}
              onChange={(e) => setShowConfidenceBands(e.target.checked)}
              className="rounded bg-surface-200 border-slate-700 text-cyan-400 focus:ring-cyan-400"
            />
            <span className="text-slate-300">95% CI Bounds</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showSurgeAnomaly}
              onChange={(e) => setShowSurgeAnomaly(e.target.checked)}
              className="rounded bg-surface-200 border-slate-700 text-rose-400 focus:ring-rose-400"
            />
            <span className="text-rose-300">Surge Anomaly Scenario</span>
          </label>
        </div>
      </div>

      {/* 3. Main Forecast SVG Visualization Chart */}
      <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-display font-bold text-white tracking-tight">
              Emergency Department Patient Arrival Forecast
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Conformal Prediction Bounds (95% CI) • Peak Expected at 20:00 (146 pts/hr)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-300 rounded-full" />
              <span className="text-slate-400">Historical Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-cyan-400 rounded-full" />
              <span className="text-cyan-300 font-bold">LSTM Primary</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-indigo-400 rounded-full border-dashed" />
              <span className="text-indigo-300">XGBoost Baseline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-400 rounded-full" />
              <span className="text-emerald-300">Random Forest</span>
            </div>
          </div>
        </div>

        {/* SVG Curve Canvas */}
        <div className="relative h-72 w-full pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 800 240" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 50, 100, 150, 200].map((v) => (
              <g key={v}>
                <line
                  x1="0"
                  y1={220 - v * 1.05}
                  x2="800"
                  y2={220 - v * 1.05}
                  stroke="currentColor"
                  className="text-slate-800/80"
                  strokeDasharray="4 4"
                />
                <text x="0" y={216 - v * 1.05} className="text-[9px] font-mono fill-slate-500">
                  {v} pts
                </text>
              </g>
            ))}

            {/* Current Time Cutoff (T = 16:00) */}
            <line x1="400" y1="10" x2="400" y2="220" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="406" y="24" className="text-[10px] font-mono fill-cyan-400 font-bold">
              CURRENT (16:00) ➔ FUTURE INFERENCE
            </text>

            {/* 95% Confidence Interval Shaded Band */}
            {showConfidenceBands && (
              <path
                d="M 400,88 L 460,70 L 530,55 L 600,75 L 670,110 L 740,145 L 800,152 L 800,175 L 740,185 L 670,140 L 600,105 L 530,85 L 460,95 L 400,105 Z"
                fill="url(#confidence-band-glow)"
                opacity="0.35"
              />
            )}

            {/* Surge Anomaly Curve (If Toggled) */}
            {showSurgeAnomaly && (
              <polyline
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2"
                strokeDasharray="4 4"
                points="400,80 460,45 530,30 600,60 670,105 740,145 800,150"
              />
            )}

            {/* Historical Actual Line (00:00 to 16:00) */}
            <polyline
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2.5"
              points="0,178 60,184 120,190 180,170 240,142 300,123 360,105 400,90"
            />

            {/* Random Forest Baseline Forecast Line (16:00 to 06:00) */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="1.8"
              strokeDasharray="2 2"
              points="400,94 460,86 530,78 600,90 670,120 740,148 800,152"
            />

            {/* XGBoost Baseline Forecast Line (16:00 to 06:00) */}
            <polyline
              fill="none"
              stroke="#818cf8"
              strokeWidth="2"
              strokeDasharray="3 3"
              points="400,98 460,90 530,85 600,95 670,125 740,155 800,160"
            />

            {/* LSTM Primary Forecast Line (16:00 to 06:00) */}
            <polyline
              fill="none"
              stroke="#06b6d4"
              strokeWidth="3"
              points="400,90 460,78 530,68 600,85 670,118 740,150 800,155"
            />

            {/* Peak Anchor Callout */}
            <g>
              <circle cx="530" cy="68" r="5" fill="#06b6d4" className="animate-ping" />
              <circle cx="530" cy="68" r="4" fill="#06b6d4" />
              <rect x="490" y="32" width="85" height="24" rx="6" fill="#07111f" stroke="#06b6d4" strokeWidth="1" />
              <text x="496" y="48" className="text-[10px] font-mono font-bold fill-cyan-300">
                Peak: 146 pts/hr
              </text>
            </g>

            <defs>
              <linearGradient id="confidence-band-glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* X-Axis Time Labels */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 px-1 border-t border-slate-800/80 pt-2">
          {forecastData.points.map((p, idx) => (
            <span key={idx} className={p.isPeakArrivalWindow ? 'text-cyan-400 font-bold' : ''}>
              {p.hourLabel.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Model Evaluation & Statistical Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1: MAE */}
        <div className="p-5 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800">
          <span className="text-xs font-mono text-slate-400 block">Mean Absolute Error (MAE)</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
            {forecastData.metrics.mae} <span className="text-xs text-slate-400">pts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Evaluated on 142,800 test steps</p>
        </div>

        {/* Metric 2: RMSE */}
        <div className="p-5 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800">
          <span className="text-xs font-mono text-slate-400 block">Root Mean Squared Error</span>
          <div className="text-2xl font-bold font-mono text-teal-400 mt-1">
            {forecastData.metrics.rmse} <span className="text-xs text-slate-400">pts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Low sensitivity to outlier swings</p>
        </div>

        {/* Metric 3: MAPE */}
        <div className="p-5 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800">
          <span className="text-xs font-mono text-slate-400 block">Mean Absolute % Error</span>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">
            {forecastData.metrics.mape}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Industry benchmark standard &lt; 8.0%</p>
        </div>

        {/* Metric 4: Inference Latency */}
        <div className="p-5 rounded-2xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800">
          <span className="text-xs font-mono text-slate-400 block">Inference Latency</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {forecastData.metrics.inferenceLatencyMs} <span className="text-xs text-slate-400">ms</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Sub-100ms multi-horizon roll forward</p>
        </div>
      </div>
    </div>
  );
};
