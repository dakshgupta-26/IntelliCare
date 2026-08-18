export interface DepartmentMetric {
  id: string;
  name: string;
  code: string;
  utilization: number; // percentage
  surgeDelta: number; // percentage vs baseline (+/-)
  bedCapacity: number;
  bedsOccupied: number;
  activeStaff: number;
  staffRequired: number;
  status: 'optimal' | 'warning' | 'critical';
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface LiveTelemetryEvent {
  id: string;
  timestamp: string;
  type: 'FORECAST_READY' | 'RESOURCE_UPDATED' | 'OPTIMIZATION_STARTED' | 'OPTIMIZATION_COMPLETED' | 'ALERT_CREATED' | 'SCENARIO_COMPLETED';
  department: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
}

export interface TimeSeriesPoint {
  hour: string;
  historical?: number;
  lstmPredicted?: number;
  xgboostBaseline?: number;
  ciUpper?: number;
  ciLower?: number;
  spikeAnomaly?: number;
}
