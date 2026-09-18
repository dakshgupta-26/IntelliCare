import React from 'react';
import { useSimStore } from '../../store/useSimStore';
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
    <section id="intelligence" className="relative py-16 sm:py-20 lg:py-24 bg-[#070B17] text-[#F8FAFC] border-t border-white/[0.07] overflow-hidden">
      {/* Background soft ambient glow */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-medium tracking-wide mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              PREDICTIVE TIME-SERIES INTELLIGENCE
            </div>

            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              See what's coming.
            </h2>

            <p className="mt-4 text-xl text-[#A7B4C8] font-normal leading-relaxed">
              LSTM-powered demand forecasting that anticipates future patient volume hours before bottlenecks appear.
            </p>
          </div>

          <button
            onClick={() => navigate('/intelligence')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0D1526] border border-white/10 hover:border-cyan-500/30 hover:bg-[#111B2D] text-white text-xs font-mono font-bold transition-all shadow-lg cursor-pointer shrink-0"
          >
            <span>Explore Intelligence</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Interactive Layer Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0A1020] border border-white/[0.07] mb-8">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-[#A7B4C8] uppercase tracking-wider">
              Interactive Forecast Layers
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => toggleToggle('showLstm')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer border ${
                showLstm
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(25,199,243,0.25)]'
                  : 'bg-[#0D1526] text-[#A7B4C8] border-white/[0.07] hover:text-white hover:bg-[#111B2D]'
              }`}
            >
              LSTM Neural Forecast
            </button>

            <button
              onClick={() => toggleToggle('showXgboost')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer border ${
                showXgboost
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-[0_0_12px_rgba(99,102,241,0.25)]'
                  : 'bg-[#0D1526] text-[#A7B4C8] border-white/[0.07] hover:text-white hover:bg-[#111B2D]'
              }`}
            >
              XGBoost Baseline
            </button>

            <button
              onClick={() => toggleToggle('showConfidenceIntervals')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer border ${
                showConfidenceIntervals
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-[0_0_12px_rgba(45,212,191,0.25)]'
                  : 'bg-[#0D1526] text-[#A7B4C8] border-white/[0.07] hover:text-white hover:bg-[#111B2D]'
              }`}
            >
              95% Confidence Bounds
            </button>

            <button
              onClick={() => toggleToggle('simulateSpike')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer border flex items-center gap-1.5 ${
                simulateSpike
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-[0_0_16px_rgba(251,113,133,0.3)] animate-pulse'
                  : 'bg-[#0D1526] text-rose-400 border-rose-500/30 hover:bg-rose-950/30'
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
          <div className="p-6 rounded-2xl bg-[#0A1020] border border-white/[0.07] flex flex-col justify-between hover:border-cyan-500/20 transition-colors">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                Multi-Horizon Forecasting
              </span>
              <h4 className="text-base font-display font-bold text-white mb-2">
                T+2h to T+48h Lookahead
              </h4>
              <p className="text-xs text-[#A7B4C8] leading-relaxed">
                Learns non-linear temporal dependencies across historical presentations, regional calendars, and weather vectors.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-white/[0.07] text-xs font-mono text-[#64748B] flex justify-between">
              <span>Recurrent Architecture</span>
              <span className="font-bold text-slate-300">PyTorch GPU</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0A1020] border border-white/[0.07] flex flex-col justify-between hover:border-indigo-500/20 transition-colors">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                Ensemble Validation
              </span>
              <h4 className="text-base font-display font-bold text-white mb-2">
                XGBoost Benchmarking
              </h4>
              <p className="text-xs text-[#A7B4C8] leading-relaxed">
                Tabular gradient-boosted trees provide high-confidence cross-validation to detect neural drift and anomaly spikes.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-white/[0.07] text-xs font-mono text-[#64748B] flex justify-between">
              <span>Statistical Baseline</span>
              <span className="font-bold text-slate-300">2ms Validation</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0A1020] border border-white/[0.07] flex flex-col justify-between hover:border-teal-500/20 transition-colors">
            <div>
              <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider block mb-1">
                Uncertainty Quantification
              </span>
              <h4 className="text-base font-display font-bold text-white mb-2">
                Conformal Confidence Bounds
              </h4>
              <p className="text-xs text-[#A7B4C8] leading-relaxed">
                Provides clinical operations leaders with rigorous upper and lower bounds to stress-test capacity planning.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-white/[0.07] text-xs font-mono text-[#64748B] flex justify-between">
              <span>Coverage Probability</span>
              <span className="font-bold text-teal-400">95.0% CI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
