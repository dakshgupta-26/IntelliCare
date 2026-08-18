import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import { Badge } from '../ui/Badge';
import { ForecastChart } from './ForecastChart';
import { Sliders, AlertOctagon } from 'lucide-react';

export const ForecastingSection: React.FC = () => {
  const showLstm = useSimStore((state) => state.showLstm);
  const showXgboost = useSimStore((state) => state.showXgboost);
  const showConfidenceIntervals = useSimStore((state) => state.showConfidenceIntervals);
  const simulateSpike = useSimStore((state) => state.simulateSpike);
  const toggleToggle = useSimStore((state) => state.toggleForecastToggle);

  return (
    <section id="intelligence" className="relative py-28 bg-navy-900/80 border-t border-b border-slate-800/80 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <Badge variant="cyan" size="md" className="mb-4">
            PREDICTIVE TIME-SERIES ENGINE
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            See what's coming.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            IntelliCare forecasts future hospital demand from historical operational patterns, regional events, and seasonal infection velocity before bottlenecks materialize.
          </p>
        </div>

        {/* Feature Engineering & Architecture Pipeline Pill */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 rounded-2xl bg-surface-100/60 border border-slate-800 backdrop-blur-md mb-8 text-xs font-mono">
          <div className="p-3 rounded-xl bg-surface-200/50 border border-slate-800 flex items-center gap-3">
            <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">1</span>
            <div>
              <span className="text-white block font-bold">Historical Data</span>
              <span className="text-[11px] text-slate-400">Multi-year presentations</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-200/50 border border-slate-800 flex items-center gap-3">
            <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">2</span>
            <div>
              <span className="text-white block font-bold">Feature Engineering</span>
              <span className="text-[11px] text-slate-400">Weather, holidays, day-of-week</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-200/50 border border-slate-800 flex items-center gap-3">
            <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">3</span>
            <div>
              <span className="text-white block font-bold">Stacked LSTM</span>
              <span className="text-[11px] text-slate-400">Recurrent temporal memory</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-200/50 border border-cyan-500/30 flex items-center gap-3 bg-cyan-950/20">
            <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">4</span>
            <div>
              <span className="text-cyan-300 block font-bold">Demand Forecast</span>
              <span className="text-[11px] text-cyan-400/80">T+2h to T+48h Horizon</span>
            </div>
          </div>
        </div>

        {/* Interactive Chart Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-surface-100 border border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">
              Chart Display Layers
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => toggleToggle('showLstm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer border ${
                showLstm
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'bg-surface-200 text-slate-500 border-slate-700 hover:text-slate-300'
              }`}
            >
              LSTM Horizon
            </button>

            <button
              onClick={() => toggleToggle('showXgboost')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer border ${
                showXgboost
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                  : 'bg-surface-200 text-slate-500 border-slate-700 hover:text-slate-300'
              }`}
            >
              XGBoost Baseline
            </button>

            <button
              onClick={() => toggleToggle('showConfidenceIntervals')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer border ${
                showConfidenceIntervals
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-[0_0_12px_rgba(20,184,166,0.2)]'
                  : 'bg-surface-200 text-slate-500 border-slate-700 hover:text-slate-300'
              }`}
            >
              95% Confidence Bounds
            </button>

            <button
              onClick={() => toggleToggle('simulateSpike')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer border flex items-center gap-1.5 ${
                simulateSpike
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse'
                  : 'bg-surface-200 text-slate-400 border-slate-700 hover:text-rose-300'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Simulate Surge Spike</span>
            </button>
          </div>
        </div>

        {/* Live SVG Chart */}
        <ForecastChart />

        {/* Technical Architecture Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-semibold text-cyan-400 uppercase">
                  Primary Model: Stacked LSTM
                </span>
                <Badge variant="cyan" size="sm">
                  RECURRENT NEURAL NET
                </Badge>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Learns non-linear temporal dependencies across multi-scale horizons (2h, 6h, 12h, 24h). Incorporates cell gates to retain long-term seasonal hospital patterns while responding to rapid influx spikes.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>MAE: 3.8 pts/hr</span>
              <span className="text-cyan-400">Inference: 14ms (GPU PyTorch)</span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-semibold text-indigo-400 uppercase">
                  Baseline Model: XGBoost Regressor
                </span>
                <Badge variant="indigo" size="sm">
                  GRADIENT BOOSTED TREES
                </Badge>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Provides tabular tree ensemble benchmarking for validation. Used to detect anomalies when neural predictions diverge from baseline statistical patterns.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>MAE: 5.4 pts/hr</span>
              <span className="text-indigo-400">Validation Speed: 2ms</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
