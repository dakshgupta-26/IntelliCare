import { create } from 'zustand';
import {
  ModelFamily,
  HyperparameterConfig,
  TrainingEpochRecord,
  FeatureImportanceItem,
  ModelBenchmarkScore,
  ConfusionMatrixData
} from '../types/mlStudio';

const INITIAL_HYPERPARAMS: Record<ModelFamily, HyperparameterConfig> = {
  RANDOM_FOREST: {
    nEstimators: 200,
    maxDepth: 12,
    minSamplesSplit: 4,
    learningRate: 0.01,
    subsampleRatio: 0.8,
    l2Regularization: 1.0,
    hiddenUnits: 64,
    numLayers: 2,
    lookbackWindow: 24,
    dropoutRate: 0.1,
    batchSize: 64,
    epochs: 40,
    optimizer: 'ADAMW'
  },
  XGBOOST: {
    nEstimators: 300,
    maxDepth: 6,
    minSamplesSplit: 2,
    learningRate: 0.045,
    subsampleRatio: 0.85,
    l2Regularization: 2.2,
    hiddenUnits: 64,
    numLayers: 2,
    lookbackWindow: 24,
    dropoutRate: 0.1,
    batchSize: 64,
    epochs: 60,
    optimizer: 'ADAMW'
  },
  LSTM: {
    nEstimators: 100,
    maxDepth: 8,
    minSamplesSplit: 2,
    learningRate: 0.0015,
    subsampleRatio: 0.9,
    l2Regularization: 0.5,
    hiddenUnits: 128,
    numLayers: 3,
    lookbackWindow: 48,
    dropoutRate: 0.25,
    batchSize: 32,
    epochs: 50,
    optimizer: 'ADAMW'
  },
  TRANSFORMER: {
    nEstimators: 150,
    maxDepth: 8,
    minSamplesSplit: 2,
    learningRate: 0.0008,
    subsampleRatio: 0.95,
    l2Regularization: 0.1,
    hiddenUnits: 256,
    numLayers: 4,
    lookbackWindow: 72,
    dropoutRate: 0.15,
    batchSize: 64,
    epochs: 75,
    optimizer: 'ADAMW'
  },
  ENSEMBLE: {
    nEstimators: 250,
    maxDepth: 10,
    minSamplesSplit: 3,
    learningRate: 0.02,
    subsampleRatio: 0.88,
    l2Regularization: 1.2,
    hiddenUnits: 128,
    numLayers: 3,
    lookbackWindow: 48,
    dropoutRate: 0.2,
    batchSize: 48,
    epochs: 60,
    optimizer: 'ADAMW'
  }
};

const INITIAL_BENCHMARKS: ModelBenchmarkScore[] = [
  {
    family: 'ENSEMBLE',
    name: 'Bayesian Hybrid Super-Ensemble',
    architectureType: 'Variance-Weighted Stacking (RF + XGB + LSTM)',
    mae: 2.45,
    rmse: 3.12,
    mape: 3.8,
    r2Score: 0.968,
    inferenceLatencyMs: 18.5,
    memoryUsageMb: 142,
    trainingTimeSec: 84.2,
    driftResilienceScore: 97.4,
    oobOrValScore: 0.972,
    pros: ['Highest overall accuracy', 'Resistant to single-model overfitting', 'Robust during sudden trauma shocks'],
    cons: ['Slightly higher compute latency', 'Requires joint feature preparation'],
    status: 'PRODUCTION'
  },
  {
    family: 'LSTM',
    name: 'Multi-Horizon Stacked Bi-LSTM',
    architectureType: '3-Layer Bidirectional Recurrent with Attention Skip',
    mae: 2.92,
    rmse: 3.65,
    mape: 4.4,
    r2Score: 0.951,
    inferenceLatencyMs: 12.4,
    memoryUsageMb: 86,
    trainingTimeSec: 62.0,
    driftResilienceScore: 94.1,
    oobOrValScore: 0.954,
    pros: ['Captures long-range diurnal seasonality', 'Continuous autoregressive roll-forward', 'Smooth confidence intervals'],
    cons: ['GPU memory intensive', 'Sensitive to sudden point anomalies without calibration'],
    status: 'PRODUCTION'
  },
  {
    family: 'XGBOOST',
    name: 'Extreme Gradient Boosted Trees (XGBoost)',
    architectureType: 'Tree Boosting with 2nd-Order Hessian Approximation',
    mae: 3.18,
    rmse: 4.02,
    mape: 4.9,
    r2Score: 0.942,
    inferenceLatencyMs: 2.8,
    memoryUsageMb: 34,
    trainingTimeSec: 18.4,
    driftResilienceScore: 91.8,
    oobOrValScore: 0.946,
    pros: ['Ultra-fast CPU inference (< 3ms)', 'Excellent feature importance interpretability', 'Handles tabular missing data natively'],
    cons: ['Cannot extrapolate past historical bounds', 'Requires explicit lag feature engineering'],
    status: 'CHALLENGER'
  },
  {
    family: 'RANDOM_FOREST',
    name: 'Random Forest Regressor & Classifier',
    architectureType: 'Bootstrap Aggregated De-correlated Decision Trees',
    mae: 3.64,
    rmse: 4.58,
    mape: 5.6,
    r2Score: 0.928,
    inferenceLatencyMs: 4.1,
    memoryUsageMb: 48,
    trainingTimeSec: 14.8,
    driftResilienceScore: 89.5,
    oobOrValScore: 0.931,
    pros: ['Zero risk of hyperparameter explosion', 'Native Out-of-Bag (OOB) error validation', 'Stable non-linear boundaries'],
    cons: ['Higher inference footprint at high tree depth', 'Step-wise prediction output'],
    status: 'BENCHMARK'
  },
  {
    family: 'TRANSFORMER',
    name: 'Temporal PatchTST Attention Model',
    architectureType: 'Patch Time-Series Transformer with Multi-Head Self-Attention',
    mae: 2.78,
    rmse: 3.48,
    mape: 4.1,
    r2Score: 0.959,
    inferenceLatencyMs: 21.0,
    memoryUsageMb: 180,
    trainingTimeSec: 110.5,
    driftResilienceScore: 95.8,
    oobOrValScore: 0.962,
    pros: ['Global cross-variable attention correlation', 'Superior 72-hour horizon consistency', 'Unsupervised pre-training support'],
    cons: ['High memory requirements', 'Requires large training token count'],
    status: 'EXPERIMENTAL'
  }
];

const INITIAL_SHAP_FEATURES: FeatureImportanceItem[] = [
  {
    id: 'feat-1',
    name: 'Ambulance Dispatch Velocity',
    category: 'Clinical',
    importanceScore: 0.28,
    shapValue: +28.4,
    currentValue: '14 arrivals / hr',
    unit: 'arrivals/hr',
    description: 'Real-time telemetry from regional EMS 911 dispatch tracking inbound critical ambulances.'
  },
  {
    id: 'feat-2',
    name: 'Emergency Room Triage Acuity Ratio (ESI 1-2)',
    category: 'Clinical',
    importanceScore: 0.22,
    shapValue: +19.7,
    currentValue: '41.2%',
    unit: '%',
    description: 'Proportion of patients categorized as Resuscitation or Emergent on the Emergency Severity Index.'
  },
  {
    id: 'feat-3',
    name: 'Shift Handover Disruption Gap',
    category: 'Operational',
    importanceScore: 0.16,
    shapValue: +14.8,
    currentValue: 'T-30 min to Shift Change',
    unit: 'min',
    description: 'Systemic operational latency occurring during nurse/physician clinical shift handovers.'
  },
  {
    id: 'feat-4',
    name: 'Local Temperature Drop & Freeze Alert',
    category: 'Environmental',
    importanceScore: 0.12,
    shapValue: +11.3,
    currentValue: '-4.2 °C (Ice Warning)',
    unit: '°C',
    description: 'Freezing conditions and black ice warnings strongly correlate with motor vehicle trauma & orthopedic admissions.'
  },
  {
    id: 'feat-5',
    name: 'Pediatric Respiratory Viral Index (RSV / Flu)',
    category: 'Environmental',
    importanceScore: 0.10,
    shapValue: +8.6,
    currentValue: 'High Activity (78/100)',
    unit: 'index',
    description: 'Weekly regional PCR viral swab positivity rates predicting inpatient bed pressure.'
  },
  {
    id: 'feat-6',
    name: 'Discharge Velocity & Bed Turnover Time',
    category: 'Operational',
    importanceScore: 0.08,
    shapValue: -12.4,
    currentValue: '38 min / bed clean',
    unit: 'min',
    description: 'Rapid environmental services sanitization accelerates bed availability and relieves bottleneck pressure.'
  },
  {
    id: 'feat-7',
    name: 'Day of Week & Holiday Seasonality (Monday Peak)',
    category: 'Temporal',
    importanceScore: 0.04,
    shapValue: +6.2,
    currentValue: 'Monday Morning Window',
    unit: 'cyclical',
    description: 'Predictable cyclical outpatient surges following weekend delayed presentations.'
  }
];

const INITIAL_CONFUSION_MATRIX: ConfusionMatrixData = {
  truePositive: 1420,
  falsePositive: 68,
  trueNegative: 5890,
  falseNegative: 112,
  precision: 95.4,
  recall: 92.7,
  f1Score: 94.0,
  aucRoc: 0.978
};

interface MLStudioState {
  activeModel: ModelFamily;
  hyperparams: Record<ModelFamily, HyperparameterConfig>;
  benchmarks: ModelBenchmarkScore[];
  shapFeatures: FeatureImportanceItem[];
  confusionMatrix: ConfusionMatrixData;
  
  // Training Simulator State
  isTraining: boolean;
  trainingProgress: number; // 0 to 100
  currentEpoch: number;
  totalEpochs: number;
  currentTrainLoss: number;
  currentValLoss: number;
  trainingHistory: TrainingEpochRecord[];
  
  // Actions
  setActiveModel: (model: ModelFamily) => void;
  updateHyperparam: (model: ModelFamily, param: keyof HyperparameterConfig, value: number | string) => void;
  resetHyperparams: (model: ModelFamily) => void;
  startTrainingSimulation: () => Promise<void>;
  cancelTraining: () => void;
  tweakFeatureShap: (id: string, delta: number) => void;
}

export const useMLStudioStore = create<MLStudioState>((set, get) => ({
  activeModel: 'RANDOM_FOREST',
  hyperparams: INITIAL_HYPERPARAMS,
  benchmarks: INITIAL_BENCHMARKS,
  shapFeatures: INITIAL_SHAP_FEATURES,
  confusionMatrix: INITIAL_CONFUSION_MATRIX,

  isTraining: false,
  trainingProgress: 0,
  currentEpoch: 0,
  totalEpochs: 40,
  currentTrainLoss: 0.425,
  currentValLoss: 0.468,
  trainingHistory: Array.from({ length: 20 }).map((_, i) => {
    const epoch = i + 1;
    const trainLoss = +(0.85 * Math.exp(-epoch / 8) + 0.12 + Math.random() * 0.02).toFixed(4);
    const valLoss = +(0.88 * Math.exp(-epoch / 8.5) + 0.15 + Math.random() * 0.03).toFixed(4);
    return {
      epoch,
      trainLoss,
      valLoss,
      trainMae: +(trainLoss * 8.2).toFixed(2),
      valMae: +(valLoss * 8.8).toFixed(2),
      learningRate: 0.001
    };
  }),

  setActiveModel: (model) => set({ activeModel: model }),

  updateHyperparam: (model, param, value) => {
    set((state) => ({
      hyperparams: {
        ...state.hyperparams,
        [model]: {
          ...state.hyperparams[model],
          [param]: value
        }
      }
    }));
  },

  resetHyperparams: (model) => {
    set((state) => ({
      hyperparams: {
        ...state.hyperparams,
        [model]: { ...INITIAL_HYPERPARAMS[model] }
      }
    }));
  },

  tweakFeatureShap: (id, delta) => {
    set((state) => ({
      shapFeatures: state.shapFeatures.map((f) => {
        if (f.id === id) {
          const newShap = +(f.shapValue + delta).toFixed(1);
          return { ...f, shapValue: newShap };
        }
        return f;
      })
    }));
  },

  cancelTraining: () => {
    set({ isTraining: false });
  },

  startTrainingSimulation: async () => {
    const { activeModel, hyperparams } = get();
    const config = hyperparams[activeModel];
    const totalEpochs = config.epochs || 40;
    
    set({
      isTraining: true,
      trainingProgress: 0,
      currentEpoch: 0,
      totalEpochs,
      trainingHistory: []
    });

    let currentTrainLoss = 0.95;
    let currentValLoss = 1.02;
    const history: TrainingEpochRecord[] = [];

    for (let ep = 1; ep <= totalEpochs; ep++) {
      if (!get().isTraining) break;

      // Realistic non-linear convergence curve
      const decayFactor = activeModel === 'XGBOOST' ? 0.88 : activeModel === 'RANDOM_FOREST' ? 0.91 : 0.93;
      const noise = (Math.random() - 0.5) * 0.015;
      currentTrainLoss = +(currentTrainLoss * decayFactor + 0.008 + noise).toFixed(4);
      currentValLoss = +(currentValLoss * (decayFactor + 0.015) + 0.012 + noise * 1.2).toFixed(4);

      if (currentTrainLoss < 0.045) currentTrainLoss = +(0.045 + Math.random() * 0.005).toFixed(4);
      if (currentValLoss < 0.062) currentValLoss = +(0.062 + Math.random() * 0.008).toFixed(4);

      const record: TrainingEpochRecord = {
        epoch: ep,
        trainLoss: currentTrainLoss,
        valLoss: currentValLoss,
        trainMae: +(currentTrainLoss * 7.5).toFixed(2),
        valMae: +(currentValLoss * 8.1).toFixed(2),
        learningRate: config.learningRate * Math.pow(0.97, ep)
      };

      history.push(record);

      set({
        currentEpoch: ep,
        trainingProgress: Math.round((ep / totalEpochs) * 100),
        currentTrainLoss,
        currentValLoss,
        trainingHistory: [...history]
      });

      // Small delay for smooth training visualization
      await new Promise((res) => setTimeout(res, 65));
    }

    set({ isTraining: false, trainingProgress: 100 });
  }
}));
