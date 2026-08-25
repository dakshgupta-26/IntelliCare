import React from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useRouterStore } from '../store/useRouterStore';
import { ForecastChart } from '../components/forecasting/ForecastChart';

export const IntelligencePage: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);

  const modelSpecs = [
    {
      name: 'Primary Model: Stacked Multi-Horizon LSTM',
      badge: 'DEEP LEARNING',
      description: 'A 3-layer recurrent architecture featuring forget gates and residual skip connections designed to capture long-term seasonal trends while remaining sensitive to sudden multi-hour trauma spikes.',
      metrics: [
        { label: 'Mean Absolute Error (MAE)', val: '2.9 pts/hr' },
        { label: 'Root Mean Squared Error (RMSE)', val: '3.6 pts/hr' },
        { label: 'Inference Latency (GPU)', val: '12ms' },
        { label: 'Horizon Coverage', val: 'T+2h to T+48h' },
      ],
    },
    {
      name: 'Boosting Engine: Extreme Gradient Boosted Trees (XGBoost)',
      badge: 'GRADIENT BOOSTING',
      description: 'Second-order Taylor series gradient boosted decision trees with regularized objective ($\lambda, \alpha$) providing sub-3ms ultra-fast inference and tabular feature dominance.',
      metrics: [
        { label: 'Baseline MAE', val: '3.1 pts/hr' },
        { label: 'Inference Latency', val: '2.8ms' },
        { label: 'Drift Resilience', val: '91.8%' },
        { label: 'Feature Importance', val: 'Gain & Cover' },
      ],
    },
    {
      name: 'Ensemble Baseline: Random Forest Regressor & Classifier',
      badge: 'BOOTSTRAP BAGGING',
      description: 'De-correlated decision trees trained with bootstrap aggregating (bagging) and random feature subspace selection for zero-overfitting benchmark stability.',
      metrics: [
        { label: 'Validation MAE', val: '3.6 pts/hr' },
        { label: 'OOB Validation Score', val: '0.931' },
        { label: 'Inference Latency', val: '4.1ms' },
        { label: 'Tree Count', val: '200 Estimators' },
      ],
    },
    {
      name: 'Production Stacking: Bayesian Hybrid Super-Ensemble',
      badge: 'DYNAMIC STACKING',
      description: 'Combines LSTM sequence memory with XGBoost and Random Forest residuals using dynamic inverse-variance Bayesian weights for optimal accuracy during operational shocks.',
      metrics: [
        { label: 'Ensemble MAE', val: '2.4 pts/hr' },
        { label: 'Coefficient ($R^2$)', val: '0.968' },
        { label: 'Inference Latency', val: '18ms' },
        { label: 'Drift Resilience', val: '97.4%' },
      ],
    },
  ];

  const features = [
    { category: 'Temporal Seasonality', items: ['Hour-of-day cyclics', 'Day-of-week markers', 'Holiday surge calendars', 'Hospital shift rotation vectors'] },
    { category: 'Clinical Presentation Signals', items: ['Ambulance dispatch velocity', 'Walk-in triage queue counts', 'Bed turnover discharge rates', 'Pediatric viral positivity indices'] },
    { category: 'External Environmental', items: ['Local temperature extremes', 'Precipitation/ice weather alerts', 'Mass gathering regional schedules', 'Public transit disruption feeds'] },
  ];

  return (
    <div className="pt-28 pb-20 bg-section-dark text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-8 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="max-w-4xl mb-14">
          <Badge variant="cyan" size="md" className="mb-4">
            DEEP-DIVE &bull; PREDICTIVE INTELLIGENCE
          </Badge>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Neural Multi-Horizon Demand Forecasting
          </h1>

          <p className="mt-6 text-xl text-slate-300 leading-relaxed font-normal">
            A comprehensive overview of our stacked LSTM architecture, XGBoost validation benchmarks, and conformal uncertainty quantification.
          </p>
        </div>

        {/* Live SVG Time-Series Chart Component */}
        <div className="mb-16">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Interactive Forecast Model Sandbox
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Hover over points to inspect real-time confidence bounds
            </span>
          </div>
          <ForecastChart />
        </div>

        {/* Model Architecture Comparisons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {modelSpecs.map((m, idx) => (
            <div
              key={idx}
              className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="cyan" size="sm">
                    {m.badge}
                  </Badge>
                  <span className="text-xs font-mono text-slate-500">PRODUCTION ENGINE</span>
                </div>

                <h3 className="text-xl font-display font-bold text-white mb-3">
                  {m.name}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {m.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-800">
                {m.metrics.map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-surface-200/50 border border-slate-800/80">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      {item.label}
                    </span>
                    <span className="text-lg font-display font-bold text-cyan-300">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Feature Engineering Pipeline */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 mb-20">
          <div className="max-w-3xl mb-8">
            <Badge variant="indigo" size="sm" className="mb-2">
              FEATURE ENGINEERING PIPELINE
            </Badge>
            <h3 className="text-2xl font-display font-bold text-white">
              Multi-Dimensional Clinical & Environmental Tensors
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              Every 5 minutes, our ingestion service normalizes 40+ dynamic features across hospital operational signals and external environmental streams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-surface-200/50 border border-slate-800">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-4">
                  {f.category}
                </span>
                <ul className="flex flex-col gap-2.5 text-xs text-slate-300">
                  {f.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Next Step CTA */}
        <div className="p-10 rounded-3xl bg-surface-100 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-display font-bold text-white mb-1">
              Interactive Model Laboratory & MILP Solver
            </h3>
            <p className="text-sm text-slate-400">
              Tune Random Forest, XGBoost & LSTM hyperparameters in real time, or explore linear programming bed allocation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              icon={<Sparkles className="w-4 h-4 text-cyan-400" />}
              onClick={() => navigate('/app/models')}
            >
              Launch ML Studio
            </Button>
            <Button
              variant="primary"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/optimization')}
            >
              Explore Optimization
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
