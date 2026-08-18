import { DepartmentMetric, LiveTelemetryEvent, TimeSeriesPoint } from '../types/telemetry';
import { RagQueryPreset } from '../types/simulation';

export const INITIAL_DEPARTMENTS: DepartmentMetric[] = [
  {
    id: 'dept-er',
    name: 'Emergency Department',
    code: 'ED-TRAUMA',
    utilization: 94,
    surgeDelta: +18.4,
    bedCapacity: 48,
    bedsOccupied: 45,
    activeStaff: 28,
    staffRequired: 34,
    status: 'critical',
    trend: 'increasing'
  },
  {
    id: 'dept-icu',
    name: 'Intensive Care Unit',
    code: 'ICU-MED',
    utilization: 92,
    surgeDelta: +12.1,
    bedCapacity: 32,
    bedsOccupied: 29,
    activeStaff: 22,
    staffRequired: 26,
    status: 'critical',
    trend: 'increasing'
  },
  {
    id: 'dept-ot',
    name: 'Surgical Theatres & PACU',
    code: 'OT-SUITE',
    utilization: 78,
    surgeDelta: -2.3,
    bedCapacity: 16,
    bedsOccupied: 12,
    activeStaff: 18,
    staffRequired: 18,
    status: 'optimal',
    trend: 'stable'
  },
  {
    id: 'dept-ward',
    name: 'Inpatient General Medicine',
    code: 'GEN-WARD',
    utilization: 84,
    surgeDelta: +5.0,
    bedCapacity: 120,
    bedsOccupied: 101,
    activeStaff: 42,
    staffRequired: 44,
    status: 'warning',
    trend: 'stable'
  },
  {
    id: 'dept-peds',
    name: 'Pediatric Care Unit',
    code: 'PED-CRIT',
    utilization: 68,
    surgeDelta: -4.1,
    bedCapacity: 24,
    bedsOccupied: 16,
    activeStaff: 14,
    staffRequired: 14,
    status: 'optimal',
    trend: 'decreasing'
  }
];

export const FORECAST_SERIES_DATA: TimeSeriesPoint[] = [
  { hour: '00:00', historical: 42, lstmPredicted: 42, xgboostBaseline: 41, ciUpper: 46, ciLower: 38 },
  { hour: '02:00', historical: 36, lstmPredicted: 35, xgboostBaseline: 34, ciUpper: 39, ciLower: 31 },
  { hour: '04:00', historical: 31, lstmPredicted: 30, xgboostBaseline: 30, ciUpper: 34, ciLower: 26 },
  { hour: '06:00', historical: 48, lstmPredicted: 46, xgboostBaseline: 43, ciUpper: 51, ciLower: 41 },
  { hour: '08:00', historical: 74, lstmPredicted: 76, xgboostBaseline: 71, ciUpper: 82, ciLower: 70 },
  { hour: '10:00', historical: 92, lstmPredicted: 95, xgboostBaseline: 88, ciUpper: 102, ciLower: 88 },
  { hour: '12:00', historical: 108, lstmPredicted: 112, xgboostBaseline: 102, ciUpper: 120, ciLower: 104 },
  { hour: '14:00', historical: 115, lstmPredicted: 118, xgboostBaseline: 109, ciUpper: 127, ciLower: 109 },
  // Horizon cutoff (T = 16:00 current time, rest are future forecasts)
  { hour: '16:00 (Now)', historical: 124, lstmPredicted: 126, xgboostBaseline: 114, ciUpper: 135, ciLower: 117, spikeAnomaly: 142 },
  { hour: '18:00 (T+2h)', lstmPredicted: 138, xgboostBaseline: 122, ciUpper: 149, ciLower: 127, spikeAnomaly: 168 },
  { hour: '20:00 (T+4h)', lstmPredicted: 146, xgboostBaseline: 128, ciUpper: 159, ciLower: 133, spikeAnomaly: 182 },
  { hour: '22:00 (T+6h)', lstmPredicted: 129, xgboostBaseline: 118, ciUpper: 142, ciLower: 116, spikeAnomaly: 155 },
  { hour: '00:00 (T+8h)', lstmPredicted: 98, xgboostBaseline: 90, ciUpper: 109, ciLower: 87, spikeAnomaly: 112 },
  { hour: '02:00 (T+10h)', lstmPredicted: 68, xgboostBaseline: 64, ciUpper: 78, ciLower: 58, spikeAnomaly: 75 },
  { hour: '04:00 (T+12h)', lstmPredicted: 45, xgboostBaseline: 44, ciUpper: 53, ciLower: 37, spikeAnomaly: 49 },
  { hour: '06:00 (T+14h)', lstmPredicted: 62, xgboostBaseline: 58, ciUpper: 71, ciLower: 53, spikeAnomaly: 66 },
];

export const INITIAL_REALTIME_LOGS: LiveTelemetryEvent[] = [
  {
    id: 'evt-101',
    timestamp: '15:42:04',
    type: 'FORECAST_READY',
    department: 'Emergency & Trauma',
    title: 'LSTM Horizon Inference Completed',
    description: 'Demand spike projected for 18:00–22:00 (+18.4% above seasonal baseline). Confidence 94.2%.',
    severity: 'warning'
  },
  {
    id: 'evt-102',
    timestamp: '15:42:18',
    type: 'OPTIMIZATION_STARTED',
    department: 'Resource Allocation Engine',
    title: 'MILP Solver Execution Initiated',
    description: 'Evaluating 1,480 binary assignment variables across 5 clinical departments under nurse-to-patient ratio constraints.',
    severity: 'info'
  },
  {
    id: 'evt-103',
    timestamp: '15:42:21',
    type: 'OPTIMIZATION_COMPLETED',
    department: 'OR-Tools Engine',
    title: 'Optimal Resource Plan Generated',
    description: 'Optimal solution found in 84ms. Recommended reallocating +4 Floater Nurses to ED and +2 Intensivists to ICU.',
    severity: 'success'
  },
  {
    id: 'evt-104',
    timestamp: '15:42:35',
    type: 'ALERT_CREATED',
    department: 'ICU-MED',
    title: 'Capacity Threshold Proximity Alert',
    description: 'ICU projected at 94.5% bed capacity at 20:00 without step-down discharge acceleration.',
    severity: 'critical'
  }
];

export const RAG_PRESETS: RagQueryPreset[] = [
  {
    id: 'rag-1',
    question: 'Why is ICU nurse staffing being increased for Shift B?',
    answer: 'Projected ICU demand between 18:00 and 22:00 reaches 29 occupied beds (92% capacity) with 3 incoming high-acuity surgical step-downs. Based on hospital policy, a 1:2 nurse-to-patient ratio is mandatory for ventilated beds, requiring an additional 4 registered nurses. Available floater pool from Ward 4 is utilized to prevent clinical overtime burn.',
    sources: [
      {
        title: 'Intensive Care Unit Clinical Staffing Protocol (SOP-ICU-2024.3)',
        section: 'Section 4.2: High-Acuity Acuity Scaling & Mandatory Ratio Enforcement',
        confidence: 0.94,
        retrievalMethod: 'Dense Vector (Cosine 0.91)'
      },
      {
        title: 'Hospital Operational Surge Playbook',
        section: 'Protocol 11.B: Floater Pool Redistribution Guidelines',
        confidence: 0.88,
        retrievalMethod: 'BM25 Sparse (Score 14.8)'
      }
    ],
    reasoningSnippet: 'Constraint formulation: min(cost) s.t. Staff_{ICU}(t) >= ceil(Demand_{ICU}(t) / 2.0) for t in [18:00, 22:00]. Feasible with 0 overtime penalties.'
  },
  {
    id: 'rag-2',
    question: 'What is the step-down protocol if Emergency reaches 95% capacity?',
    answer: 'Under Emergency Department Surge Level 2, the operational system recommends accelerating discharge evaluations for stable general ward patients (NEWS2 score <= 2), converting 6 observation beds into active intake bays, and paging on-call triage coordinators.',
    sources: [
      {
        title: 'Emergency Department Overflow & Escalation Policy (ED-ESC-09)',
        section: 'Level 2 Escalation: Bed Conversion & Expedited Step-Down',
        confidence: 0.96,
        retrievalMethod: 'Dense Vector (Cosine 0.91)'
      },
      {
        title: 'Clinical Patient Flow & Discharge Coordination SOP',
        section: 'Section 6: Early Discharge Criteria & Ward Bed Decongestion',
        confidence: 0.89,
        retrievalMethod: 'Hybrid Rerank'
      }
    ],
    reasoningSnippet: 'Trigger: ED_Occupancy > 0.92 for consecutive 90 mins. Action: Dispatch step-down advisory to Charge Nurse and Bed Manager.'
  },
  {
    id: 'rag-3',
    question: 'How does MILP ensure fairness between surgical suites and emergency admissions?',
    answer: 'The objective function assigns a weighted penalty to elective surgery cancellations while prioritizing emergent life-safety admissions. OR-Tools minimizes total weighted operational disruption while strictly satisfying minimum statutory bed and staffing bounds.',
    sources: [
      {
        title: 'Perioperative Resource Allocation & Elective Scheduling Standard',
        section: 'Section 3.1: Elective vs. Emergent Priority Balancing Matrix',
        confidence: 0.92,
        retrievalMethod: 'Dense Vector (Cosine 0.91)'
      }
    ],
    reasoningSnippet: 'Objective = sum(w_emergent * WaitTime) + sum(w_elective * CancellationRisk) + sum(w_staff * OvertimePenalty).'
  }
];
