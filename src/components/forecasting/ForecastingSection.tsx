import React from 'react';
import { useSimStore } from '../../store/useSimStore';
import { Badge } from '../ui/Badge';
import { ForecastChart } from './ForecastChart';
import { Sliders, AlertOctagon, ArrowRight } from 'lucide-react';
import { useRouterStore } from '../../store/useRouterStore';

export const ForecastingSection: React.FC = () => {
  const showLstm = useSimStore((state) => state.showLstm);
  const showXgboost = useSimStore((state) => state.showXgboost);
  const showConfidenceIntervals = useSimStore((state) => state.showConfidenceIntervals);
  const simulateSpike = useSimStore((state) => state.simulateSpike);
  const toggleToggle = useSimStore((state) => state.toggleForecastToggle);
  const navigate = useRouterStore((state) => state.navigate);

  return (
    <section id="intelligence" className="relative py-32 bg-white text-slate-900 border-t border-slate-200 overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-cyan-100/40 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-3xl">
            <Badge variant="cyan" size="md" className="mb-4 bg-cyan-100 text-cyan-800 border-cyan-300">
              PREDICTIVE TIME-SERIES INTELLIGENCE
            </Badge>

            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              See what's coming.
            </h2>

            <p className="mt-4 text-xl text-slate-600 font-normal leading-relaxed">
              LSTM-powered demand forecasting that anticipates future patient volume hours before bottlenecks appear.
            </p>
          </div>

          <button
            onClick={() => navigate('/intelligence')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-mono font-bold transition-all shadow-md cursor-pointer shrink-0"
          >
            <span>Explore Intelligence</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Layer Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-8">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-700" />
            <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
              Interactive Forecast Layers
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => toggleToggle('showLstm')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer border ${
                showLstm
                  ? 'bg-cyan-600 text-white border-cyan-700 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
              }`}
            >
              LSTM Neural Forecast
            </button>

            <button
              onClick={() => toggleToggle('showXgboost')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer border ${
                showXgboost
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
              }`}
            >
              XGBoost Baseline
            </button>

            <button
              onClick={() => toggleToggle('showConfidenceIntervals')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer border ${
                showConfidenceIntervals
                  ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
              }`}
            >
              95% Confidence Bounds
            </button>

            <button
              onClick={() => toggleToggle('simulateSpike')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer border flex items-center gap-1.5 ${
                simulateSpike
                  ? 'bg-rose-600 text-white border-rose-700 shadow-md animate-pulse'
                  : 'bg-white text-rose-700 border-rose-300 hover:bg-rose-50'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Simulate Surge Anomaly</span>
            </button>
          </div>
        </div>

        {/* Live SVG Time-Series Chart */}
        <ForecastChart />

        {/* Minimal Narrative Summary Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-700 uppercase tracking-wider block mb-1">
                Multi-Horizon Forecasting
              </span>
              <h4 className="text-base font-display font-bold text-slate-900 mb-2">
                T+2h to T+48h Lookahead
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Learns non-linear temporal dependencies across historical presentations, regional calendars, and weather vectors.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-200 text-xs font-mono text-slate-500 flex justify-between">
              <span>Recurrent Architecture</span>
              <span className="font-bold text-slate-800">PyTorch GPU</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                Ensemble Validation
              </span>
              <h4 className="text-base font-display font-bold text-slate-900 mb-2">
                XGBoost Benchmarking
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tabular gradient-boosted trees provide high-confidence cross-validation to detect neural drift and anomaly spikes.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-200 text-xs font-mono text-slate-500 flex justify-between">
              <span>Statistical Baseline</span>
              <span className="font-bold text-slate-800">2ms Validation</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-teal-700 uppercase tracking-wider block mb-1">
                Uncertainty Quantification
              </span>
              <h4 className="text-base font-display font-bold text-slate-900 mb-2">
                Conformal Confidence Bounds
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provides clinical operations leaders with rigorous upper and lower bounds to stress-test capacity planning.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-200 text-xs font-mono text-slate-500 flex justify-between">
              <span>Coverage Probability</span>
              <span className="font-bold text-teal-700">95.0% CI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
