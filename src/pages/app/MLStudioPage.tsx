import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  GitBranch,
  Layers,
  Activity,
  CheckCircle2,
  Info,
  Sliders,
  BarChart3,
  Award,
  Plus,
  Minus
} from 'lucide-react';
import { useMLStudioStore } from '../../store/useMLStudioStore';
import { useRouterStore } from '../../store/useRouterStore';
import { ModelFamily } from '../../types/mlStudio';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const MLStudioPage: React.FC = () => {
  const navigate = useRouterStore((state) => state.navigate);
  const activeModel = useMLStudioStore((state) => state.activeModel);
  const setActiveModel = useMLStudioStore((state) => state.setActiveModel);
  const hyperparams = useMLStudioStore((state) => state.hyperparams);
  const updateHyperparam = useMLStudioStore((state) => state.updateHyperparam);
  const resetHyperparams = useMLStudioStore((state) => state.resetHyperparams);
  const benchmarks = useMLStudioStore((state) => state.benchmarks);
  const shapFeatures = useMLStudioStore((state) => state.shapFeatures);
  const tweakFeatureShap = useMLStudioStore((state) => state.tweakFeatureShap);
  const confusionMatrix = useMLStudioStore((state) => state.confusionMatrix);

  const isTraining = useMLStudioStore((state) => state.isTraining);
  const trainingProgress = useMLStudioStore((state) => state.trainingProgress);
  const currentEpoch = useMLStudioStore((state) => state.currentEpoch);
  const totalEpochs = useMLStudioStore((state) => state.totalEpochs);
  const currentTrainLoss = useMLStudioStore((state) => state.currentTrainLoss);
  const currentValLoss = useMLStudioStore((state) => state.currentValLoss);
  const trainingHistory = useMLStudioStore((state) => state.trainingHistory);
  const startTrainingSimulation = useMLStudioStore((state) => state.startTrainingSimulation);
  const cancelTraining = useMLStudioStore((state) => state.cancelTraining);

  const [activeTab, setActiveTab] = useState<'architecture' | 'training' | 'xai' | 'arena'>('architecture');

  const modelTabs: { id: ModelFamily; label: string; tag: string; icon: React.ReactNode }[] = [
    { id: 'RANDOM_FOREST', label: 'Random Forest', tag: 'Bagged Trees (RF)', icon: <GitBranch className="w-4 h-4 text-emerald-400" /> },
    { id: 'XGBOOST', label: 'XGBoost', tag: 'Gradient Boosted Trees', icon: <Zap className="w-4 h-4 text-amber-400" /> },
    { id: 'LSTM', label: 'Multi-Horizon LSTM', tag: 'Deep Recurrent Network', icon: <Layers className="w-4 h-4 text-cyan-400" /> },
    { id: 'TRANSFORMER', label: 'Temporal Transformer', tag: 'PatchTST Attention', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
    { id: 'ENSEMBLE', label: 'Hybrid Super-Ensemble', tag: 'Bayesian Stacking', icon: <Award className="w-4 h-4 text-indigo-400" /> }
  ];

  const currentConfig = hyperparams[activeModel];
  const activeBenchmark = benchmarks.find((b) => b.family === activeModel) || benchmarks[0];

  // Total calculated SHAP base shift
  const totalShapShift = shapFeatures.reduce((acc, f) => acc + f.shapValue, 0);
  const baselinePatientArrivals = 72.0;
  const finalProjectedDemand = Math.round(baselinePatientArrivals + totalShapShift);

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* 1. Header with Model Family Tabs & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-surface-100 dark:bg-[#0c182c] border border-slate-700/80 dark:border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
              AI / ML Intelligence Laboratory
            </span>
            <span className="text-slate-600">•</span>
            <Badge variant="cyan" size="sm" dot>
              PRODUCTION INFERENCE V3.4
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Machine Learning Model Studio
          </h1>
          <p className="mt-1 text-sm text-slate-300 max-w-3xl leading-relaxed">
            Inspect, tune, train, and benchmark multi-horizon time series and clinical risk models (Random Forest, XGBoost, LSTM, and Hybrid Ensembles).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            icon={<Activity className="w-4 h-4 text-emerald-400" />}
            onClick={() => navigate('/app/clinical-ai')}
          >
            Clinical Risk AI →
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Cpu className="w-4 h-4" />}
            onClick={() => navigate('/app/forecasting')}
          >
            Inference Forecasting →
          </Button>
        </div>
      </div>

      {/* 2. Model Family Ribbon Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {modelTabs.map((tab) => {
          const isSelected = activeModel === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveModel(tab.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-500/50 shadow-lg shadow-cyan-500/10 text-white'
                  : 'bg-surface-100 dark:bg-[#0a1628] border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-cyan-500/20' : 'bg-surface-200/60'}`}>
                  {tab.icon}
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>
              <div>
                <span className="text-xs font-mono font-bold block truncate text-slate-100">
                  {tab.label}
                </span>
                <span className="text-[10px] font-mono text-cyan-400/90 truncate block mt-0.5">
                  {tab.tag}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Studio Section Navigation Tabs */}
      <div className="flex items-center border-b border-slate-800 space-x-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`pb-3 px-3 transition-colors cursor-pointer border-b-2 font-bold flex items-center gap-2 ${
            activeTab === 'architecture'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>1. Architecture & Math Blueprint</span>
        </button>

        <button
          onClick={() => setActiveTab('training')}
          className={`pb-3 px-3 transition-colors cursor-pointer border-b-2 font-bold flex items-center gap-2 ${
            activeTab === 'training'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>2. Live Training & Tuning Sandbox</span>
          {isTraining && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-1" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('xai')}
          className={`pb-3 px-3 transition-colors cursor-pointer border-b-2 font-bold flex items-center gap-2 ${
            activeTab === 'xai'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3. Explainable AI & SHAP</span>
        </button>

        <button
          onClick={() => setActiveTab('arena')}
          className={`pb-3 px-3 transition-colors cursor-pointer border-b-2 font-bold flex items-center gap-2 ${
            activeTab === 'arena'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>4. Multi-Model Battle Arena</span>
        </button>
      </div>

      {/* 4. TAB CONTENT 1: Architecture & Math Blueprint */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Architecture Specifications */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="cyan" size="sm" className="mb-2">
                    {activeBenchmark.status}
                  </Badge>
                  <h3 className="text-xl font-display font-bold text-white">
                    {activeBenchmark.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    {activeBenchmark.architectureType}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Validation $R^2$</span>
                  <span className="text-2xl font-bold font-mono text-cyan-400">
                    {(activeBenchmark.r2Score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Mathematical Blueprint Box */}
              <div className="p-4 rounded-2xl bg-surface-200/60 dark:bg-[#07111f] border border-slate-800 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between text-[11px] text-cyan-400 font-bold uppercase tracking-wider">
                  <span>Mathematical Core Formulation</span>
                  <span className="text-slate-500">IEEE Trans Pattern Anal</span>
                </div>

                {activeModel === 'RANDOM_FOREST' && (
                  <div className="space-y-2 text-slate-300 leading-relaxed">
                    <p className="text-indigo-300 font-bold">
                      {"f_rf(x) = (1/B) * Σ T_b(x; Θ_b)"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      • <strong>Bagging & Feature Sub-sampling:</strong> At each split node, selects a random subset of {"m = √p"} features from p total clinical covariates.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      • <strong>Gini Impurity Minimization:</strong> {"I_G(t) = 1 - Σ p(i|t)²"}, maximizing impurity reduction {"ΔI_G(s, t)"}.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      • <strong>Out-of-Bag (OOB) Generalization:</strong> Evaluates unselected samples per bootstrap iteration for unbiased error tracking without data leakage.
                    </p>
                  </div>
                )}

                {activeModel === 'XGBOOST' && (
                  <div className="space-y-2 text-slate-300 leading-relaxed">
                    <p className="text-amber-300 font-bold">
                      {"L^(t) ≈ Σ [ l(y_i, ŷ_i^(t-1)) + g_i * f_t(x_i) + 0.5 * h_i * f_t(x_i)² ] + Ω(f_t)"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      • <strong>Second-Order Taylor Expansion:</strong> {"g_i = ∂l/∂ŷ"} (first gradient) and {"h_i = ∂²l/∂ŷ²"} (second Hessian).
                    </p>
                    <p className="text-[11px] text-slate-400">
                      • <strong>Regularization Penalty:</strong> {"Ω(f_t) = γT + 0.5 * λ Σ w_j² + α Σ |w_j|"}.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      • <strong>Optimal Leaf Weight Score:</strong> {"w_j* = - (Σ g_i) / (Σ h_i + λ)"}, with shrinkage factor η = {currentConfig.learningRate}.
                    </p>
                  </div>
                )}

                {activeModel === 'LSTM' && (
                  <div className="space-y-2 text-slate-300 leading-relaxed">
                    <p className="text-cyan-300 font-bold">
                      {"f_t = σ(W_f * x_t + U_f * h_(t-1) + b_f),  C_t = f_t ⊙ C_(t-1) + i_t ⊙ C̃_t"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      • <strong>Forget Gate f_t:</strong> Controls historical seasonal memory retention across 48-hour hospital shift sequences.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      • <strong>Input Gate i_t & Candidate C̃_t:</strong> Ingests high-frequency vitals and ambulance dispatch surges.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      • <strong>Output Gate o_t & Hidden State h_t:</strong> {"h_t = o_t ⊙ tanh(C_t)"}, emitting multi-horizon tensor predictions.
                    </p>
                  </div>
                )}

                {activeModel === 'TRANSFORMER' && (
                  <div className="space-y-2 text-slate-300 leading-relaxed">
                    <p className="text-purple-300 font-bold">
                      {"Attention(Q, K, V) = softmax( (Q * K^T) / √d_k ) * V"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      • <strong>Sub-Series Patching:</strong> Groups 16-hour continuous time chunks into unified semantic tokens to reduce quadratic attention complexity.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      • <strong>Cross-Department Spatial Attention:</strong> Discovers non-obvious coupling between triage queue depth and ICU transfer delays.
                    </p>
                  </div>
                )}

                {activeModel === 'ENSEMBLE' && (
                  <div className="space-y-2 text-slate-300 leading-relaxed">
                    <p className="text-indigo-300 font-bold">
                      {"Ŷ_ensemble = Σ w_m(t) * Ŷ_m(t),  where w_m(t) ∝ 1 / σ_m²(t)"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      • <strong>Dynamic Bayesian Variance Weighting:</strong> When sudden trauma shocks occur, LSTM attention is elevated; during normal periods, XGBoost efficiency takes precedence.
                    </p>
                  </div>
                )}
              </div>

              {/* Strengths and Trade-offs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-surface-200/40 border border-slate-800">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Architectural Strengths
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {activeBenchmark.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-surface-200/40 border border-slate-800">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5 mb-2">
                    <Info className="w-3.5 h-3.5" /> Operational Considerations
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {activeBenchmark.cons.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: Key Performance Telemetry Card */}
            <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                  Model Health & Latency Profile
                </span>
                <h4 className="text-lg font-display font-bold text-white">
                  Runtime Benchmarks
                </h4>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Mean Absolute Error (MAE)</span>
                  <span className="text-cyan-300 font-bold">{activeBenchmark.mae} pts/hr</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Root Mean Squared Error</span>
                  <span className="text-teal-300 font-bold">{activeBenchmark.rmse} pts/hr</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Inference Latency</span>
                  <span className="text-emerald-300 font-bold">{activeBenchmark.inferenceLatencyMs} ms</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Memory Footprint</span>
                  <span className="text-indigo-300 font-bold">{activeBenchmark.memoryUsageMb} MB</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Drift Resilience</span>
                  <span className="text-purple-300 font-bold">{activeBenchmark.driftResilienceScore}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Training Time (150K rows)</span>
                  <span className="text-amber-300 font-bold">{activeBenchmark.trainingTimeSec} s</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                icon={<Sliders className="w-4 h-4" />}
                onClick={() => setActiveTab('training')}
                className="w-full"
              >
                Tune Hyperparameters & Train →
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT 2: Live Training & Tuning Sandbox */}
      {activeTab === 'training' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hyperparameter Controls Panel */}
            <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-bold text-white">
                    Hyperparameter Controls
                  </h3>
                  <span className="text-xs font-mono text-cyan-400">
                    {activeModel.replace('_', ' ')} Configuration
                  </span>
                </div>

                <button
                  onClick={() => resetHyperparams(activeModel)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-200 transition-colors cursor-pointer"
                  title="Reset to optimal defaults"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {/* Estimators / Trees */}
                {(activeModel === 'RANDOM_FOREST' || activeModel === 'XGBOOST' || activeModel === 'ENSEMBLE') && (
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Estimators (Trees / Boosting Rounds):</span>
                      <span className="text-cyan-400 font-bold">{currentConfig.nEstimators}</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={500}
                      step={25}
                      value={currentConfig.nEstimators}
                      onChange={(e) => updateHyperparam(activeModel, 'nEstimators', Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                      disabled={isTraining}
                    />
                  </div>
                )}

                {/* Max Depth */}
                {(activeModel === 'RANDOM_FOREST' || activeModel === 'XGBOOST') && (
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Max Tree Depth:</span>
                      <span className="text-cyan-400 font-bold">{currentConfig.maxDepth}</span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={24}
                      step={1}
                      value={currentConfig.maxDepth}
                      onChange={(e) => updateHyperparam(activeModel, 'maxDepth', Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                      disabled={isTraining}
                    />
                  </div>
                )}

                {/* Learning Rate */}
                {(activeModel === 'XGBOOST' || activeModel === 'LSTM' || activeModel === 'TRANSFORMER') && (
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Learning Rate ($\eta$):</span>
                      <span className="text-amber-400 font-bold">{currentConfig.learningRate}</span>
                    </div>
                    <input
                      type="range"
                      min={0.0005}
                      max={0.1}
                      step={0.001}
                      value={currentConfig.learningRate}
                      onChange={(e) => updateHyperparam(activeModel, 'learningRate', Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                      disabled={isTraining}
                    />
                  </div>
                )}

                {/* LSTM Hidden Units */}
                {(activeModel === 'LSTM' || activeModel === 'TRANSFORMER' || activeModel === 'ENSEMBLE') && (
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Recurrent Hidden Units:</span>
                      <span className="text-purple-400 font-bold">{currentConfig.hiddenUnits}</span>
                    </div>
                    <input
                      type="range"
                      min={32}
                      max={512}
                      step={32}
                      value={currentConfig.hiddenUnits}
                      onChange={(e) => updateHyperparam(activeModel, 'hiddenUnits', Number(e.target.value))}
                      className="w-full accent-purple-400 cursor-pointer"
                      disabled={isTraining}
                    />
                  </div>
                )}

                {/* Dropout Rate */}
                {(activeModel === 'LSTM' || activeModel === 'TRANSFORMER') && (
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Dropout Regularization:</span>
                      <span className="text-rose-400 font-bold">{(currentConfig.dropoutRate * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.05}
                      max={0.5}
                      step={0.05}
                      value={currentConfig.dropoutRate}
                      onChange={(e) => updateHyperparam(activeModel, 'dropoutRate', Number(e.target.value))}
                      className="w-full accent-rose-400 cursor-pointer"
                      disabled={isTraining}
                    />
                  </div>
                )}

                {/* Total Epochs */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Training Epochs:</span>
                    <span className="text-emerald-400 font-bold">{currentConfig.epochs}</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={10}
                    value={currentConfig.epochs}
                    onChange={(e) => updateHyperparam(activeModel, 'epochs', Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                    disabled={isTraining}
                  />
                </div>
              </div>

              {/* Training Trigger CTA */}
              <div className="pt-2">
                {isTraining ? (
                  <Button
                    variant="danger"
                    size="md"
                    icon={<Pause className="w-4 h-4" />}
                    onClick={cancelTraining}
                    className="w-full"
                  >
                    Halt Training
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    icon={<Play className="w-4 h-4" />}
                    onClick={startTrainingSimulation}
                    className="w-full"
                  >
                    Train on 150K EHR Steps
                  </Button>
                )}
              </div>
            </div>

            {/* Right: Live Loss Convergence & Epoch Telemetry Graph */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                      Optimization Loss Curve
                    </span>
                    {isTraining && (
                      <span className="text-xs font-mono text-amber-400 animate-pulse">
                        • LIVE BACKPROPAGATION ({trainingProgress}%)
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-display font-bold text-white">
                    Training vs. Validation Loss (MSE / Huber)
                  </h3>
                </div>

                {/* Current Live Stats */}
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-surface-200/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Current Train Loss</span>
                    <span className="text-cyan-400 font-bold">{currentTrainLoss.toFixed(4)}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-200/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Current Val Loss</span>
                    <span className="text-indigo-400 font-bold">{currentValLoss.toFixed(4)}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-surface-200/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Epoch</span>
                    <span className="text-emerald-400 font-bold">{currentEpoch} / {totalEpochs}</span>
                  </div>
                </div>
              </div>

              {/* SVG Loss Curve Canvas */}
              <div className="relative h-64 w-full bg-surface-200/40 dark:bg-[#07111f] rounded-2xl border border-slate-800 p-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                  {/* Horizontal Grid */}
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map((v) => (
                    <g key={v}>
                      <line
                        x1="30"
                        y1={180 - v * 160}
                        x2="690"
                        y2={180 - v * 160}
                        stroke="#1e293b"
                        strokeDasharray="4 4"
                      />
                      <text x="5" y={184 - v * 160} className="text-[9px] font-mono fill-slate-500">
                        {v.toFixed(1)}
                      </text>
                    </g>
                  ))}

                  {/* Render Loss Lines */}
                  {trainingHistory.length > 1 && (
                    <>
                      {/* Train Loss Polyline */}
                      <polyline
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2.5"
                        points={trainingHistory
                          .map((rec, i) => {
                            const x = 30 + (i / Math.max(1, totalEpochs - 1)) * 650;
                            const y = Math.max(10, Math.min(180, 180 - rec.trainLoss * 160));
                            return `${x},${y}`;
                          })
                          .join(' ')}
                      />

                      {/* Val Loss Polyline */}
                      <polyline
                        fill="none"
                        stroke="#818cf8"
                        strokeWidth="2"
                        strokeDasharray="4 3"
                        points={trainingHistory
                          .map((rec, i) => {
                            const x = 30 + (i / Math.max(1, totalEpochs - 1)) * 650;
                            const y = Math.max(10, Math.min(180, 180 - rec.valLoss * 160));
                            return `${x},${y}`;
                          })
                          .join(' ')}
                      />
                    </>
                  )}
                </svg>

                {/* Legend in corner */}
                <div className="absolute top-6 right-6 flex items-center gap-4 text-[11px] font-mono bg-navy-950/80 p-2 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-cyan-400 rounded-full" />
                    <span className="text-cyan-300">Train Loss</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-indigo-400 rounded-full border-dashed" />
                    <span className="text-indigo-300">Validation Loss</span>
                  </div>
                </div>
              </div>

              {/* Training Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
                  <span>Batch Gradient Descent & Regularization Convergence</span>
                  <span>{trainingProgress}% Complete</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-150"
                    style={{ width: `${trainingProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT 3: Explainable AI & SHAP */}
      {activeTab === 'xai' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Badge variant="indigo" size="sm" className="mb-2">
                  XAI &bull; SHAPLEY ADDITIVE EXPLANATIONS
                </Badge>
                <h3 className="text-xl font-display font-bold text-white">
                  Surge Demand Attribution & Feature Force Plot
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Inspect how clinical signals, operational latency, weather, and calendar factors push the patient arrival forecast.
                </p>
              </div>

              {/* Final Prediction Summary Badge */}
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-right">
                <span className="text-[10px] font-mono text-slate-400 block">Baseline Base Value: {baselinePatientArrivals} pts/hr</span>
                <span className="text-2xl font-bold font-mono text-cyan-300">
                  {finalProjectedDemand} <span className="text-xs text-slate-400">pts/hr Predicted</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400 block">
                  Net SHAP Delta: {totalShapShift >= 0 ? `+${totalShapShift.toFixed(1)}` : totalShapShift.toFixed(1)} pts
                </span>
              </div>
            </div>

            {/* Interactive SHAP Feature List */}
            <div className="space-y-3">
              {shapFeatures.map((feat) => {
                const isPositive = feat.shapValue >= 0;
                return (
                  <div
                    key={feat.id}
                    className="p-4 rounded-2xl bg-surface-200/50 dark:bg-[#07111f] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-700"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-white truncate">
                          {feat.name}
                        </span>
                        <span
                          className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full ${
                            feat.category === 'Clinical'
                              ? 'bg-rose-500/20 text-rose-300'
                              : feat.category === 'Operational'
                              ? 'bg-amber-500/20 text-amber-300'
                              : feat.category === 'Environmental'
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-purple-500/20 text-purple-300'
                          }`}
                        >
                          {feat.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {feat.description} &bull; <strong className="text-slate-300">Observed: {feat.currentValue}</strong>
                      </p>
                    </div>

                    {/* SHAP Bar & Tweak Controls */}
                    <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                      <div className="w-36 hidden sm:block">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>Importance</span>
                          <span>{(feat.importanceScore * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-cyan-400"
                            style={{ width: `${feat.importanceScore * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* SHAP Value Callout */}
                      <div
                        className={`px-3 py-1.5 rounded-xl border font-bold min-w-[90px] text-center ${
                          isPositive
                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {isPositive ? `+${feat.shapValue.toFixed(1)}` : feat.shapValue.toFixed(1)} pts
                      </div>

                      {/* Perturbation Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => tweakFeatureShap(feat.id, -2.5)}
                          className="p-1.5 rounded-lg bg-surface-300/60 hover:bg-surface-300 text-slate-300 cursor-pointer"
                          title="Simulate feature reduction"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => tweakFeatureShap(feat.id, +2.5)}
                          className="p-1.5 rounded-lg bg-surface-300/60 hover:bg-surface-300 text-slate-300 cursor-pointer"
                          title="Simulate feature surge"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB CONTENT 4: Multi-Model Battle Arena */}
      {activeTab === 'arena' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-surface-100 dark:bg-[#0a1628] border border-slate-700/80 dark:border-slate-800 space-y-6">
            <div>
              <Badge variant="cyan" size="sm" className="mb-2">
                HEAD-TO-HEAD BENCHMARK MATRIX
              </Badge>
              <h3 className="text-xl font-display font-bold text-white">
                Multi-Model Performance Comparison
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Rigorous evaluation across 142,800 historical hospital admission time steps.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Architecture</th>
                    <th className="py-3 px-4">MAE (pts)</th>
                    <th className="py-3 px-4">RMSE (pts)</th>
                    <th className="py-3 px-4">MAPE (%)</th>
                    <th className="py-3 px-4">$R^2$ Score</th>
                    <th className="py-3 px-4">Latency</th>
                    <th className="py-3 px-4">Drift Resilience</th>
                    <th className="py-3 px-4">Deployment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {benchmarks.map((b) => {
                    const isCurrent = b.family === activeModel;
                    return (
                      <tr
                        key={b.family}
                        className={`transition-colors cursor-pointer ${
                          isCurrent ? 'bg-cyan-500/10 text-white font-bold' : 'text-slate-300 hover:bg-surface-200/40'
                        }`}
                        onClick={() => setActiveModel(b.family)}
                      >
                        <td className="py-3.5 px-4 flex items-center gap-2">
                          <span className="truncate">{b.name}</span>
                          {isCurrent && <span className="text-[10px] text-cyan-400 font-bold">• ACTIVE</span>}
                        </td>
                        <td className="py-3.5 px-4 text-cyan-300">{b.mae.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-teal-300">{b.rmse.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-indigo-300">{b.mape.toFixed(1)}%</td>
                        <td className="py-3.5 px-4 text-emerald-300">{(b.r2Score * 100).toFixed(1)}%</td>
                        <td className="py-3.5 px-4 text-amber-300">{b.inferenceLatencyMs} ms</td>
                        <td className="py-3.5 px-4 text-purple-300">{b.driftResilienceScore}%</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              b.status === 'PRODUCTION'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : b.status === 'CHALLENGER'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'bg-slate-700/60 text-slate-300'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Confusion Matrix & Classification Metrics */}
            <div className="pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-surface-200/50 dark:bg-[#07111f] border border-slate-800">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-3">
                  Surge Event Confusion Matrix (Threshold &gt; 120 pts/hr)
                </span>
                <div className="grid grid-cols-2 gap-3 font-mono text-center text-xs">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <span className="text-[10px] text-slate-400 block">True Positives (TP)</span>
                    <span className="text-lg font-bold text-emerald-300">{confusionMatrix.truePositive}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                    <span className="text-[10px] text-slate-400 block">False Positives (FP)</span>
                    <span className="text-lg font-bold text-rose-300">{confusionMatrix.falsePositive}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                    <span className="text-[10px] text-slate-400 block">False Negatives (FN)</span>
                    <span className="text-lg font-bold text-rose-300">{confusionMatrix.falseNegative}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <span className="text-[10px] text-slate-400 block">True Negatives (TN)</span>
                    <span className="text-lg font-bold text-emerald-300">{confusionMatrix.trueNegative}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-surface-200/50 dark:bg-[#07111f] border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider block mb-3">
                    ROC-AUC & F1-Score Precision Dynamics
                  </span>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Precision (PPV):</span>
                      <span className="text-cyan-300 font-bold">{confusionMatrix.precision}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Recall / Sensitivity:</span>
                      <span className="text-teal-300 font-bold">{confusionMatrix.recall}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Harmonic F1-Score:</span>
                      <span className="text-indigo-300 font-bold">{confusionMatrix.f1Score}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Area Under ROC Curve:</span>
                      <span className="text-emerald-300 font-bold">{confusionMatrix.aucRoc.toFixed(3)}</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 mt-4">
                  *Conformal prediction interval guarantees &ge;95% empirical coverage across seasonal swings.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
