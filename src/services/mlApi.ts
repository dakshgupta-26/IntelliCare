import type {
  AllocationResult, Appointment, AuditEntry, ClinicEvent, ClinicMetrics, DoctorStatus, ModelMetrics,
  NoShowPrediction, RagAnswer, Recommendation, ScenarioPreset, ScenarioResult, UnitForecast, UnitId,
} from '../types/ml';

export const ML_API_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000';

export class MLApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}

async function request<T>(path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${ML_API_URL}${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new MLApiError(`Cannot reach the ML service at ${ML_API_URL}. Start it with: cd ml-service && uv run uvicorn app.main:app --port 8000`);
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const detail = typeof data.detail === 'string' ? data.detail : res.statusText;
    throw new MLApiError(detail, res.status);
  }
  return res.json() as Promise<T>;
}

export interface PatientInput {
  department: string;
  age: number;
  gender: string;
  lead_days: number;
  sms_reminder: boolean;
  first_visit: boolean;
  prior_appointments: number;
  prior_no_shows: number;
  distance_km: number;
  chronic_conditions: number;
  weekday: number;
  slot_hour: number;
  insurance: boolean;
}

export const mlApi = {
  health: () => request<{ status: string; llm_enabled: boolean; horizons: number[] }>('/health'),
  metrics: () => request<ModelMetrics>('/metrics'),

  forecasts: () => request<Record<UnitId, UnitForecast>>('/forecast'),

  optimize: (body: { horizon_h: number; conservative: boolean; weights?: Record<string, number>; use_solver?: boolean }) =>
    request<AllocationResult>('/optimize', body),
  recommendations: (status?: string) =>
    request<Recommendation[]>(`/recommendations${status ? `?status=${status}` : ''}`),
  decide: (id: string, body: { decision: 'APPROVE' | 'REJECT' | 'MODIFY'; actor: string; note?: string; quantity?: number }) =>
    request<Recommendation>(`/recommendations/${id}/decision`, body),
  audit: () => request<AuditEntry[]>('/audit'),

  scenarioPresets: () => request<Record<string, ScenarioPreset>>('/scenario/presets'),
  scenario: (body: { preset?: string; arrival_increase_pct?: Record<string, number> | number; icu_beds_offline?: number; nurse_shortage_pct?: number }) =>
    request<ScenarioResult>('/scenario', body),

  predictPatient: (p: PatientInput) => request<NoShowPrediction>('/appointments/predict', p),
  schedule: () => request<{ clock: string; appointments: Appointment[]; events: ClinicEvent[] }>('/appointments/schedule'),
  clinicMetrics: () => request<ClinicMetrics>('/appointments/metrics'),
  doctors: () => request<DoctorStatus[]>('/appointments/doctors'),
  setClock: (time: string) => request<{ clock: string }>('/appointments/clock', { time }),
  cancelAppointment: (appointment_id: string) =>
    request<{ event: ClinicEvent; metrics: ClinicMetrics }>('/appointments/cancel', { appointment_id }),
  emergency: (department: string) =>
    request<{ event: ClinicEvent; metrics: ClinicMetrics }>('/appointments/emergency', { department }),
  doctorUnavailable: (doctor: string) =>
    request<{ event: ClinicEvent; metrics: ClinicMetrics }>('/appointments/doctor-unavailable', { doctor }),
  resetClinic: () => request<ClinicMetrics>('/appointments/reset', {}),

  ask: (question: string) => request<RagAnswer>('/rag/query', { question }),
  documents: () => request<{ sop_id: string; title: string; sections: { section: string; text: string }[] }[]>('/rag/documents'),
};
