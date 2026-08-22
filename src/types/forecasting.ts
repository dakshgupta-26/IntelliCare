export type ForecastModelType = 'LSTM' | 'XGBOOST' | 'ENSEMBLE' | 'SEASONAL_ARIMA';

export type ForecastHorizon = '6H' | '12H' | '24H' | '48H' | '72H';

export interface ForecastPoint {
  timestamp: string;
  hourLabel: string;
  actualDemand?: number;
  lstmPredicted: number;
  xgboostPredicted: number;
  ciLower95: number;
  ciUpper95: number;
  ciLower90: number;
  ciUpper90: number;
  surgeAnomalyDemand?: number;
  isPeakArrivalWindow?: boolean;
}

export interface ModelPerformanceMetrics {
  modelType: ForecastModelType;
  datasetName: string;
  mae: number; // Mean Absolute Error (e.g. 2.4 pts)
  rmse: number; // Root Mean Squared Error (e.g. 3.1 pts)
  mape: number; // Mean Absolute Percentage Error (e.g. 4.2%)
  r2Score: number;
  inferenceLatencyMs: number;
  lastTrainedAt: string;
  sampleCount: number;
  isDemoDataset: boolean;
}

export interface DepartmentForecastSeries {
  departmentId: string;
  departmentName: string;
  resourceCategory: string;
  horizon: ForecastHorizon;
  points: ForecastPoint[];
  metrics: ModelPerformanceMetrics;
  peakHour: string;
  peakProjectedDemand: number;
  historicalMean: number;
}
