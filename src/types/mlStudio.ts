export type ModelFamily = 'RANDOM_FOREST' | 'XGBOOST' | 'LSTM' | 'TRANSFORMER' | 'ENSEMBLE';

export interface HyperparameterConfig {
  // Random Forest & XGBoost Tree params
  nEstimators: number; // e.g., 150
  maxDepth: number; // e.g., 8
  minSamplesSplit: number; // e.g., 4
  learningRate: number; // e.g., 0.05 (for XGBoost)
  subsampleRatio: number; // e.g., 0.85 (for XGBoost)
  l2Regularization: number; // e.g., 1.5 (lambda for XGBoost)
  
  // LSTM & Transformer Deep Learning params
  hiddenUnits: number; // e.g., 128
  numLayers: number; // e.g., 3
  lookbackWindow: number; // e.g., 48 (hours)
  dropoutRate: number; // e.g., 0.20
  batchSize: number; // e.g., 64
  epochs: number; // e.g., 50
  optimizer: 'ADAMW' | 'RMSPROP' | 'SGD_MOMENTUM';
}

export interface TrainingEpochRecord {
  epoch: number;
  trainLoss: number;
  valLoss: number;
  trainMae: number;
  valMae: number;
  learningRate: number;
}

export interface FeatureImportanceItem {
  id: string;
  name: string;
  category: 'Clinical' | 'Temporal' | 'Environmental' | 'Operational';
  importanceScore: number; // 0.0 to 1.0 (gain or gini)
  shapValue: number; // e.g., +14.2 or -8.5
  currentValue: string;
  unit: string;
  description: string;
}

export interface ModelBenchmarkScore {
  family: ModelFamily;
  name: string;
  architectureType: string;
  mae: number; // Mean Absolute Error
  rmse: number; // Root Mean Squared Error
  mape: number; // Mean Absolute Percentage Error (%)
  r2Score: number; // Coefficient of Determination (0-1)
  inferenceLatencyMs: number;
  memoryUsageMb: number;
  trainingTimeSec: number;
  driftResilienceScore: number; // 0-100%
  oobOrValScore: number; // Out of Bag / Val ROC-AUC
  pros: string[];
  cons: string[];
  status: 'PRODUCTION' | 'CHALLENGER' | 'BENCHMARK' | 'EXPERIMENTAL';
}

export interface ConfusionMatrixData {
  truePositive: number;
  falsePositive: number;
  trueNegative: number;
  falseNegative: number;
  precision: number;
  recall: number;
  f1Score: number;
  aucRoc: number;
}
