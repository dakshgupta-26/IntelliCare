// Response shapes of the Python ML & optimization service (ml-service/app/main.py).
export type UnitId = 'ICU' | 'GENERAL' | 'EMERGENCY';

export const UNIT_LABEL: Record<UnitId, string> = {
  ICU: 'ICU',
  GENERAL: 'General Ward',
  EMERGENCY: 'Emergency',
};

export interface ForecastPoint {
  horizon_h: number;
  timestamp: string;
  xgboost: number;
  lstm: number;
  ensemble: number;
  lower: number;
  upper: number;
}

export interface UnitForecast {
  unit: UnitId;
  capacity: number;
  current: number;
  as_of: string;
  history: { timestamp: string; value: number }[];
  forecast: ForecastPoint[];
}

export interface Citation {
  sop_id: string;
  title: string;
  section: string;
  excerpt?: string;
  score?: number;
}

export interface Recommendation {
  id?: string;
  run_id?: string;
  unit: UnitId;
  type: 'BEDS' | 'NURSES' | 'OVERTIME' | 'EQUIPMENT' | 'ESCALATION';
  quantity: number;
  action: string;
  reason: string;
  justification?: string;
  citations?: Citation[];
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MODIFIED' | 'EXPIRED';
  created_at?: string;
  horizon_h?: number;
  decided_by?: string;
  decided_at?: string;
  note?: string;
}

export interface UnitAllocation {
  demand: number;
  beds: number;
  nurses: number;
  ratio: number;
  surge_beds: number;
  float_nurses: number;
  overtime_nurses: number;
  ventilators: number;
  beds_after: number;
  nurses_after: number;
  unmet_beds: number;
  required_nurses: number;
  ratio_compliant: boolean;
  occupancy_before: number;
  occupancy_after: number;
  ventilators_needed: number;
  ventilator_shortfall: number;
}

export interface AllocationResult {
  method: string;
  status: string;
  solve_ms: number;
  objective?: number;
  units: Record<UnitId, UnitAllocation>;
  recommendations: Recommendation[];
  pools: Record<string, number>;
  pool_usage: Record<string, number>;
  run_id?: string;
  horizon_h?: number;
  demand_used?: Record<UnitId, number>;
}

export interface ScenarioPreset {
  label: string;
  arrival_increase_pct: Record<UnitId, number>;
  icu_beds_offline: number;
  nurse_shortage_pct: number;
}

export interface ScenarioResult {
  horizons: number[];
  trajectory: Record<UnitId, {
    staffed_beds_baseline: number;
    staffed_beds_scenario: number;
    points: { horizon_h: number; baseline: number; scenario: number }[];
  }>;
  bottlenecks: Record<UnitId, { breaches_capacity: boolean; first_breach_in_h: number | null }>;
  baseline: AllocationResult;
  scenario: AllocationResult;
  delta: Record<UnitId, { extra_surge_beds: number; extra_nurses: number; unmet_beds: number; ratio_compliant: boolean }>;
}

export interface Appointment {
  id: string;
  patient: string;
  department: string;
  priority: 'ROUTINE' | 'URGENT' | 'EMERGENCY';
  requested_time: string;
  doctor: string | null;
  start: string | null;
  start_min: number | null;
  slot_min: number | null;
  predicted_duration: number;
  no_show_prob: number;
  high_risk: boolean;
  status: 'SCHEDULED' | 'WAITLISTED' | 'CANCELLED';
}

export interface ScheduleChange {
  id: string;
  change: 'ADDED' | 'MOVED' | 'REMOVED' | 'UNSCHEDULED';
  from?: string;
  to?: string;
}

export interface ClinicEvent {
  type: 'CANCELLATION' | 'EMERGENCY_OVERRIDE' | 'DOCTOR_UNAVAILABLE';
  detail: string;
  at: string;
  solve_ms: number;
  method: string;
  changes: ScheduleChange[];
}

export interface ClinicSimMetrics {
  patients_seen: number;
  no_shows: number;
  avg_wait_min: number;
  p90_wait_min: number;
  max_wait_min: number;
  doctor_utilization_pct: number;
  doctor_overtime_min: number;
  waitlisted: number;
}

export interface ClinicMetrics {
  static_fixed_slots: ClinicSimMetrics;
  optimized: ClinicSimMetrics;
  solver: { method: string; status: string; solve_ms: number };
  predicted_high_risk: number;
  clock: string;
}

export interface DoctorStatus {
  doctor: string;
  department: string;
  available: boolean;
  appointments: number;
  booked_min: number;
}

export interface NoShowPrediction {
  no_show_prob: number;
  high_risk: boolean;
  predicted_duration_min: number;
  recommended_slot_min: number;
}

export interface RagAnswer {
  question: string;
  answer: string;
  mode: 'LLM' | 'EXTRACTIVE_FALLBACK';
  citations: Citation[];
}

export interface AuditEntry {
  at: string;
  actor: string;
  action: 'APPROVE' | 'REJECT' | 'MODIFY';
  recommendation: string;
  detail: string;
  quantity_before: number;
  quantity_after: number;
  note: string;
}

type ErrorMetrics = { MAE: number; RMSE: number; MAPE: number };
type ClassifierMetrics = { ROC_AUC: number; accuracy: number; precision: number; recall: number; F1: number };
type FairnessGroup = { n: number; flag_rate: number; actual_no_show_rate: number; true_positive_rate: number | null };
type FairnessAttr = { groups: Record<string, FairnessGroup>; demographic_parity_gap: number; equal_opportunity_gap: number };

export interface ModelMetrics {
  generated_at: string;
  forecasting: Record<UnitId, Record<'XGBoost' | 'LSTM' | 'Persistence', Record<string, ErrorMetrics>>>;
  appointments: {
    no_show: { RandomForest: ClassifierMetrics; XGBoost: ClassifierMetrics; selected: string; top_features: Record<string, number> };
    duration: Record<'RandomForest' | 'XGBoost' | 'FixedSlotBaseline', { MAE_min: number; R2: number }> & { selected: string };
    fairness: { gender: FairnessAttr; age_band: FairnessAttr; max_allowed_parity_gap: number; passed: boolean };
    age_ablation: { ROC_AUC_without_age: number; ROC_AUC_with_age: number; age_parity_gap_with_age: number };
  };
}
