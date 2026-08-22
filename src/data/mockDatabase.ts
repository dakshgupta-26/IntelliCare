import { User, ROLE_PERMISSIONS } from '../types/auth';
import { ResourceMetric, DepartmentSummary } from '../types/resources';
import { DepartmentForecastSeries } from '../types/forecasting';
import { OptimizationResult } from '../types/optimization';
import { SavedScenarioRecord } from '../types/scenarios';
import { OperationalDocument } from '../types/knowledge';
import { RecommendationItem } from '../types/recommendations';
import { OperationalAlert } from '../types/alerts';
import { AuditLogRecord } from '../types/activity';

// --------------------------------------------------------------------------
// Sample Users & RBAC Data
// --------------------------------------------------------------------------
export const SAMPLE_USERS: User[] = [
  {
    id: 'usr-admin-01',
    email: 'sarah.chen@intellicare.health',
    name: 'Dr. Sarah Chen, MD',
    title: 'Chief Medical Operations Officer',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256',
    role: 'HOSPITAL_ADMIN',
    departmentId: 'dept-all',
    departmentName: 'Executive Operations',
    organizationId: 'org-metro-01',
    organizationName: 'IntelliCare Metropolitan Medical Center',
    permissions: ROLE_PERMISSIONS['HOSPITAL_ADMIN'],
    lastLoginAt: 'Today at 07:15 AM',
    createdAt: '2025-01-15'
  },
  {
    id: 'usr-super-01',
    email: 'alex.ross@intellicare.health',
    name: 'Alex Ross, MS CPHIMS',
    title: 'Principal Systems Architect',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    role: 'SUPER_ADMIN',
    departmentId: 'dept-all',
    departmentName: 'Health Informatics & AI Core',
    organizationId: 'org-metro-01',
    organizationName: 'IntelliCare Metropolitan Medical Center',
    permissions: ROLE_PERMISSIONS['SUPER_ADMIN'],
    lastLoginAt: 'Just now',
    createdAt: '2024-11-01'
  },
  {
    id: 'usr-dept-01',
    email: 'marcus.vance@intellicare.health',
    name: 'Dr. Marcus Vance, DO',
    title: 'ICU Clinical Director',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256',
    role: 'DEPARTMENT_MANAGER',
    departmentId: 'dept-icu',
    departmentName: 'Intensive Care Unit',
    organizationId: 'org-metro-01',
    organizationName: 'IntelliCare Metropolitan Medical Center',
    permissions: ROLE_PERMISSIONS['DEPARTMENT_MANAGER'],
    lastLoginAt: 'Yesterday at 05:40 PM',
    createdAt: '2025-02-10'
  },
  {
    id: 'usr-coord-01',
    email: 'elena.rostova@intellicare.health',
    name: 'Elena Rostova, RN BSN',
    title: 'Hospital Patient Flow Coordinator',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813583-0545f4705593?auto=format&fit=crop&q=80&w=256',
    role: 'OPERATIONS_COORDINATOR',
    departmentId: 'dept-er',
    departmentName: 'Emergency & Trauma',
    organizationId: 'org-metro-01',
    organizationName: 'IntelliCare Metropolitan Medical Center',
    permissions: ROLE_PERMISSIONS['OPERATIONS_COORDINATOR'],
    lastLoginAt: 'Today at 06:12 AM',
    createdAt: '2025-03-01'
  },
  {
    id: 'usr-staff-01',
    email: 'david.kim@intellicare.health',
    name: 'David Kim, BSN',
    title: 'Charge Nurse — General Ward 3',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    role: 'AUTHORIZED_STAFF',
    departmentId: 'dept-ward',
    departmentName: 'Inpatient General Medicine',
    organizationId: 'org-metro-01',
    organizationName: 'IntelliCare Metropolitan Medical Center',
    permissions: ROLE_PERMISSIONS['AUTHORIZED_STAFF'],
    lastLoginAt: '2 hours ago',
    createdAt: '2025-03-14'
  }
];

// --------------------------------------------------------------------------
// Departments
// --------------------------------------------------------------------------
export const DEPARTMENTS_DATA: DepartmentSummary[] = [
  {
    id: 'dept-er',
    code: 'ED-TRAUMA',
    name: 'Emergency & Trauma',
    leadPhysician: 'Dr. Katherine Rivera, MD',
    chargeNurse: 'Elena Rostova, RN',
    totalBeds: 48,
    occupiedBeds: 45,
    activeStaff: 28,
    requiredStaff: 34,
    utilizationRate: 93.8,
    status: 'CRITICAL',
    surgeDelta: +18.4,
    acuityScore: 4.8
  },
  {
    id: 'dept-icu',
    code: 'ICU-MED',
    name: 'Intensive Care Unit',
    leadPhysician: 'Dr. Marcus Vance, DO',
    chargeNurse: 'Gillian Thorne, RN CCRN',
    totalBeds: 32,
    occupiedBeds: 29,
    activeStaff: 22,
    requiredStaff: 26,
    utilizationRate: 90.6,
    status: 'CRITICAL',
    surgeDelta: +12.1,
    acuityScore: 4.9
  },
  {
    id: 'dept-ot',
    code: 'OT-SUITE',
    name: 'Surgical Theatres & PACU',
    leadPhysician: 'Dr. Arthur Pendelton, MD FACS',
    chargeNurse: 'Tanya Sterling, RN CNOR',
    totalBeds: 16,
    occupiedBeds: 12,
    activeStaff: 18,
    requiredStaff: 18,
    utilizationRate: 75.0,
    status: 'OPTIMAL',
    surgeDelta: -2.3,
    acuityScore: 3.8
  },
  {
    id: 'dept-ward',
    code: 'GEN-WARD',
    name: 'Inpatient General Medicine',
    leadPhysician: 'Dr. Hannah Schmidt, MD',
    chargeNurse: 'David Kim, BSN',
    totalBeds: 120,
    occupiedBeds: 101,
    activeStaff: 42,
    requiredStaff: 44,
    utilizationRate: 84.2,
    status: 'WARNING',
    surgeDelta: +5.0,
    acuityScore: 2.7
  },
  {
    id: 'dept-peds',
    code: 'PED-CRIT',
    name: 'Pediatric Care Unit',
    leadPhysician: 'Dr. Maya Lin, MD FAAP',
    chargeNurse: 'Chloe Adams, RN CPN',
    totalBeds: 24,
    occupiedBeds: 16,
    activeStaff: 14,
    requiredStaff: 14,
    utilizationRate: 66.7,
    status: 'OPTIMAL',
    surgeDelta: -4.1,
    acuityScore: 3.1
  }
];

// --------------------------------------------------------------------------
// Resources Dataset
// --------------------------------------------------------------------------
export const RESOURCES_DATA: ResourceMetric[] = [
  {
    id: 'res-icu-bed-01',
    code: 'BED-ICU-POD-A',
    name: 'ICU Negative Pressure Beds',
    category: 'ICU_BED',
    departmentId: 'dept-icu',
    departmentName: 'Intensive Care Unit',
    totalCapacity: 16,
    allocated: 15,
    available: 1,
    reserved: 1,
    utilizationRate: 93.8,
    status: 'CRITICAL',
    location: 'Tower 2, Floor 4 (Pod A)',
    lastUpdated: '1 min ago',
    unit: 'Beds',
    targetRatio: '1:1 to 1:2 Nursing Support',
    specifications: { IsolationRating: 'Negative Pressure HEPA', GasHookups: 'Dual O2/Vac', MonitorType: 'Philips IntelliVue MX800' },
    historicalUsage: [
      { time: '08:00', value: 12 }, { time: '10:00', value: 14 }, { time: '12:00', value: 15 },
      { time: '14:00', value: 15 }, { time: '16:00', value: 15 }
    ],
    projectedDemandNext6h: 18,
    maintenanceSchedule: 'Quarterly sanitization scheduled in 14 days'
  },
  {
    id: 'res-icu-bed-02',
    code: 'BED-ICU-POD-B',
    name: 'ICU Cardiovascular Step-Down Beds',
    category: 'ICU_BED',
    departmentId: 'dept-icu',
    departmentName: 'Intensive Care Unit',
    totalCapacity: 16,
    allocated: 14,
    available: 2,
    reserved: 1,
    utilizationRate: 87.5,
    status: 'HIGH_UTILIZATION',
    location: 'Tower 2, Floor 4 (Pod B)',
    lastUpdated: '3 mins ago',
    unit: 'Beds',
    targetRatio: '1:2 Nursing Support',
    specifications: { Telemetry: 'Continuous 12-lead', DefibrillatorReady: 'Yes' },
    historicalUsage: [
      { time: '08:00', value: 10 }, { time: '10:00', value: 12 }, { time: '12:00', value: 13 },
      { time: '14:00', value: 14 }, { time: '16:00', value: 14 }
    ],
    projectedDemandNext6h: 16
  },
  {
    id: 'res-er-bed-01',
    code: 'BED-ED-RESUS',
    name: 'ED Major Trauma Resuscitation Bays',
    category: 'BED',
    departmentId: 'dept-er',
    departmentName: 'Emergency & Trauma',
    totalCapacity: 12,
    allocated: 11,
    available: 1,
    reserved: 1,
    utilizationRate: 91.7,
    status: 'CRITICAL',
    location: 'Ground Floor, Zone Red',
    lastUpdated: 'Just now',
    unit: 'Bays',
    targetRatio: '1:1 Critical Nurse + Trauma Team',
    specifications: { OverheadImaging: 'Direct CT Rail', RapidInfuser: 'Belmont RI-2 Installed' },
    historicalUsage: [
      { time: '08:00', value: 6 }, { time: '10:00', value: 9 }, { time: '12:00', value: 10 },
      { time: '14:00', value: 11 }, { time: '16:00', value: 11 }
    ],
    projectedDemandNext6h: 15
  },
  {
    id: 'res-er-bed-02',
    code: 'BED-ED-ACUTE',
    name: 'ED Acute Triage Treatment Beds',
    category: 'BED',
    departmentId: 'dept-er',
    departmentName: 'Emergency & Trauma',
    totalCapacity: 36,
    allocated: 34,
    available: 2,
    reserved: 2,
    utilizationRate: 94.4,
    status: 'CRITICAL',
    location: 'Ground Floor, Zones Yellow & Blue',
    lastUpdated: '2 mins ago',
    unit: 'Beds',
    targetRatio: '1:3 Nursing Support',
    historicalUsage: [
      { time: '08:00', value: 24 }, { time: '10:00', value: 29 }, { time: '12:00', value: 32 },
      { time: '14:00', value: 34 }, { time: '16:00', value: 34 }
    ],
    projectedDemandNext6h: 41
  },
  {
    id: 'res-staff-nurse-icu',
    code: 'STAFF-RN-ICU',
    name: 'ICU Certified Critical Care Nurses (CCRN)',
    category: 'NURSE',
    departmentId: 'dept-icu',
    departmentName: 'Intensive Care Unit',
    totalCapacity: 26,
    allocated: 22,
    available: 0,
    reserved: 4, // 4 on mandatory rest/break
    utilizationRate: 100.0,
    status: 'CRITICAL',
    location: 'Tower 2, Floor 4',
    lastUpdated: 'Just now',
    unit: 'Registered Nurses',
    targetRatio: 'Mandatory 1:2 by SOP-ICU-2024.3',
    historicalUsage: [
      { time: '08:00', value: 20 }, { time: '10:00', value: 21 }, { time: '12:00', value: 22 },
      { time: '14:00', value: 22 }, { time: '16:00', value: 22 }
    ],
    projectedDemandNext6h: 26
  },
  {
    id: 'res-staff-nurse-float',
    code: 'STAFF-RN-FLOAT',
    name: 'Central Hospital Floater Pool Nurses',
    category: 'NURSE',
    departmentId: 'dept-ward',
    departmentName: 'Inpatient General Medicine',
    totalCapacity: 16,
    allocated: 10,
    available: 6,
    reserved: 0,
    utilizationRate: 62.5,
    status: 'OPTIMAL',
    location: 'Central Staffing Office / Mobile',
    lastUpdated: '5 mins ago',
    unit: 'Registered Nurses',
    historicalUsage: [
      { time: '08:00', value: 6 }, { time: '10:00', value: 8 }, { time: '12:00', value: 10 },
      { time: '14:00', value: 10 }, { time: '16:00', value: 10 }
    ],
    projectedDemandNext6h: 14
  },
  {
    id: 'res-staff-doc-trauma',
    code: 'STAFF-MD-TRAUMA',
    name: 'Attending Trauma Surgeons & Intensivists',
    category: 'PHYSICIAN',
    departmentId: 'dept-er',
    departmentName: 'Emergency & Trauma',
    totalCapacity: 8,
    allocated: 7,
    available: 1,
    reserved: 1,
    utilizationRate: 87.5,
    status: 'HIGH_UTILIZATION',
    location: 'Ground Floor & Trauma OR Suite',
    lastUpdated: '10 mins ago',
    unit: 'Physicians',
    historicalUsage: [
      { time: '08:00', value: 5 }, { time: '10:00', value: 6 }, { time: '12:00', value: 7 },
      { time: '14:00', value: 7 }, { time: '16:00', value: 7 }
    ],
    projectedDemandNext6h: 9
  },
  {
    id: 'res-eq-vent-01',
    code: 'EQ-VENT-HAMILTON',
    name: 'Hamilton-G5 High-End Mechanical Ventilators',
    category: 'EQUIPMENT',
    departmentId: 'dept-icu',
    departmentName: 'Intensive Care Unit',
    totalCapacity: 24,
    allocated: 21,
    available: 3,
    reserved: 1,
    utilizationRate: 87.5,
    status: 'HIGH_UTILIZATION',
    location: 'ICU Equipment Staging & Central Supply',
    lastUpdated: '4 mins ago',
    unit: 'Devices',
    specifications: { CalibrationStatus: 'Certified Valid', BatteryHealth: '98%' },
    historicalUsage: [
      { time: '08:00', value: 16 }, { time: '10:00', value: 18 }, { time: '12:00', value: 20 },
      { time: '14:00', value: 21 }, { time: '16:00', value: 21 }
    ],
    projectedDemandNext6h: 24
  },
  {
    id: 'res-eq-pump-01',
    code: 'EQ-PUMP-ALARIS',
    name: 'BD Alaris Smart Infusion Pump Channels',
    category: 'EQUIPMENT',
    departmentId: 'dept-all',
    departmentName: 'Hospital-Wide Supply',
    totalCapacity: 150,
    allocated: 128,
    available: 22,
    reserved: 8,
    utilizationRate: 85.3,
    status: 'HIGH_UTILIZATION',
    location: 'Floor Depots 1–5',
    lastUpdated: '8 mins ago',
    unit: 'Channels',
    historicalUsage: [
      { time: '08:00', value: 110 }, { time: '10:00', value: 118 }, { time: '12:00', value: 124 },
      { time: '14:00', value: 128 }, { time: '16:00', value: 128 }
    ],
    projectedDemandNext6h: 138
  },
  {
    id: 'res-ot-theatre-01',
    code: 'OT-SUITE-MAIN',
    name: 'Hybrid Robotic Surgical Theatres',
    category: 'OPERATING_THEATRE',
    departmentId: 'dept-ot',
    departmentName: 'Surgical Theatres & PACU',
    totalCapacity: 10,
    allocated: 8,
    available: 2,
    reserved: 1, // Emergency reserve
    utilizationRate: 80.0,
    status: 'OPTIMAL',
    location: 'Wing B, Floor 3',
    lastUpdated: '12 mins ago',
    unit: 'Suites',
    specifications: { DaVinciXi: 'OR 3 & 4', LaminarAirflow: 'ISO Class 5' },
    historicalUsage: [
      { time: '08:00', value: 7 }, { time: '10:00', value: 9 }, { time: '12:00', value: 8 },
      { time: '14:00', value: 8 }, { time: '16:00', value: 8 }
    ],
    projectedDemandNext6h: 8
  },
  {
    id: 'res-ward-bed-01',
    code: 'BED-WARD-MED',
    name: 'Telemetry Inpatient Ward Beds',
    category: 'BED',
    departmentId: 'dept-ward',
    departmentName: 'Inpatient General Medicine',
    totalCapacity: 120,
    allocated: 101,
    available: 19,
    reserved: 5,
    utilizationRate: 84.2,
    status: 'HIGH_UTILIZATION',
    location: 'Floors 2 & 3',
    lastUpdated: '6 mins ago',
    unit: 'Beds',
    historicalUsage: [
      { time: '08:00', value: 92 }, { time: '10:00', value: 96 }, { time: '12:00', value: 99 },
      { time: '14:00', value: 101 }, { time: '16:00', value: 101 }
    ],
    projectedDemandNext6h: 112
  }
];

// --------------------------------------------------------------------------
// Multi-Horizon Forecast Series
// --------------------------------------------------------------------------
export const FORECAST_DATA: DepartmentForecastSeries = {
  departmentId: 'dept-er',
  departmentName: 'Emergency & Trauma',
  resourceCategory: 'Patient Arrival Load & Bed Occupancy',
  horizon: '24H',
  peakHour: '20:00 (T+4h)',
  peakProjectedDemand: 146,
  historicalMean: 88,
  metrics: {
    modelType: 'LSTM',
    datasetName: 'Hospital Operations Telemetry (2024–2026 Evaluation Set)',
    mae: 2.38,
    rmse: 3.12,
    mape: 4.15,
    r2Score: 0.948,
    inferenceLatencyMs: 42,
    lastTrainedAt: '2026-08-20 02:00 UTC',
    sampleCount: 142800,
    isDemoDataset: true
  },
  points: [
    { timestamp: '00:00', hourLabel: '00:00', actualDemand: 42, lstmPredicted: 42, xgboostPredicted: 41, ciLower95: 38, ciUpper95: 46, ciLower90: 39, ciUpper90: 45 },
    { timestamp: '02:00', hourLabel: '02:00', actualDemand: 36, lstmPredicted: 35, xgboostPredicted: 34, ciLower95: 31, ciUpper95: 39, ciLower90: 32, ciUpper90: 38 },
    { timestamp: '04:00', hourLabel: '04:00', actualDemand: 31, lstmPredicted: 30, xgboostPredicted: 30, ciLower95: 26, ciUpper95: 34, ciLower90: 27, ciUpper90: 33 },
    { timestamp: '06:00', hourLabel: '06:00', actualDemand: 48, lstmPredicted: 46, xgboostPredicted: 43, ciLower95: 41, ciUpper95: 51, ciLower90: 42, ciUpper90: 50 },
    { timestamp: '08:00', hourLabel: '08:00', actualDemand: 74, lstmPredicted: 76, xgboostPredicted: 71, ciLower95: 70, ciUpper95: 82, ciLower90: 71, ciUpper90: 81 },
    { timestamp: '10:00', hourLabel: '10:00', actualDemand: 92, lstmPredicted: 95, xgboostPredicted: 88, ciLower95: 88, ciUpper95: 102, ciLower90: 90, ciUpper90: 100 },
    { timestamp: '12:00', hourLabel: '12:00', actualDemand: 108, lstmPredicted: 112, xgboostPredicted: 102, ciLower95: 104, ciUpper95: 120, ciLower90: 106, ciUpper90: 118 },
    { timestamp: '14:00', hourLabel: '14:00', actualDemand: 115, lstmPredicted: 118, xgboostPredicted: 109, ciLower95: 109, ciUpper95: 127, ciLower90: 111, ciUpper90: 125 },
    // Current Horizon Cutoff (Now = 16:00)
    { timestamp: '16:00', hourLabel: '16:00 (Now)', actualDemand: 124, lstmPredicted: 126, xgboostPredicted: 114, ciLower95: 117, ciUpper95: 135, ciLower90: 119, ciUpper90: 133, surgeAnomalyDemand: 142, isPeakArrivalWindow: true },
    { timestamp: '18:00', hourLabel: '18:00 (T+2h)', lstmPredicted: 138, xgboostPredicted: 122, ciLower95: 127, ciUpper95: 149, ciLower90: 130, ciUpper90: 146, surgeAnomalyDemand: 168, isPeakArrivalWindow: true },
    { timestamp: '20:00', hourLabel: '20:00 (T+4h)', lstmPredicted: 146, xgboostPredicted: 128, ciLower95: 133, ciUpper95: 159, ciLower90: 136, ciUpper90: 156, surgeAnomalyDemand: 182, isPeakArrivalWindow: true },
    { timestamp: '22:00', hourLabel: '22:00 (T+6h)', lstmPredicted: 129, xgboostPredicted: 118, ciLower95: 116, ciUpper95: 142, ciLower90: 120, ciUpper90: 138, surgeAnomalyDemand: 155, isPeakArrivalWindow: true },
    { timestamp: '00:00', hourLabel: '00:00 (T+8h)', lstmPredicted: 98, xgboostPredicted: 90, ciLower95: 87, ciUpper95: 109, ciLower90: 90, ciUpper90: 106, surgeAnomalyDemand: 112 },
    { timestamp: '02:00', hourLabel: '02:00 (T+10h)', lstmPredicted: 68, xgboostPredicted: 64, ciLower95: 58, ciUpper95: 78, ciLower90: 61, ciUpper90: 75, surgeAnomalyDemand: 75 },
    { timestamp: '04:00', hourLabel: '04:00 (T+12h)', lstmPredicted: 45, xgboostPredicted: 44, ciLower95: 37, ciUpper95: 53, ciLower90: 39, ciUpper90: 51, surgeAnomalyDemand: 49 },
    { timestamp: '06:00', hourLabel: '06:00 (T+14h)', lstmPredicted: 62, xgboostPredicted: 58, ciLower95: 53, ciUpper95: 71, ciLower90: 55, ciUpper90: 69, surgeAnomalyDemand: 66 }
  ]
};

// --------------------------------------------------------------------------
// Optimization Solver Results (Google OR-Tools MILP)
// --------------------------------------------------------------------------
export const LATEST_OPTIMIZATION_RESULT: OptimizationResult = {
  jobId: 'opt-job-94821',
  timestamp: 'Just now (15:42:21)',
  solverEngine: 'Google OR-Tools MILP (SCIP/CBC)',
  status: 'OPTIMAL',
  objectiveValue: 42.18,
  solveDurationMs: 84,
  variablesCount: 1480,
  constraintsCount: 842,
  primaryObjective: 'MINIMIZE_UNMET_DEMAND',
  objectiveWeights: {
    MINIMIZE_UNMET_DEMAND: 0.45,
    MINIMIZE_WAIT_TIME: 0.25,
    BALANCE_UTILIZATION: 0.15,
    MINIMIZE_STAFF_OVERTIME: 0.15,
    MAXIMIZE_THROUGHPUT: 0.00
  },
  shifts: [
    {
      resourceId: 'res-staff-nurse-float',
      resourceName: 'Central Floater Pool Nurses',
      departmentId: 'dept-ward',
      departmentName: 'General Ward Floater Pool',
      currentAllocated: 10,
      recommendedAllocated: 6,
      delta: -4,
      unit: 'Registered Nurses',
      rationale: 'Low acuity demand in Ward 4 allows safe loaning to acute emergency bays without violating statutory 1:5 ward ratios.',
      confidenceScore: 0.96
    },
    {
      resourceId: 'res-staff-nurse-icu',
      resourceName: 'Emergency & Trauma Surge RNs',
      departmentId: 'dept-er',
      departmentName: 'Emergency & Trauma',
      currentAllocated: 28,
      recommendedAllocated: 32,
      delta: +4,
      unit: 'Registered Nurses',
      rationale: 'Absorbs projected 146 pts/hr triage peak between 18:00 and 22:00, preventing triage queue overflow.',
      confidenceScore: 0.94
    },
    {
      resourceId: 'res-staff-doc-trauma',
      resourceName: 'Attending Intensivist Coverage',
      departmentId: 'dept-icu',
      departmentName: 'Intensive Care Unit',
      currentAllocated: 4,
      recommendedAllocated: 6,
      delta: +2,
      unit: 'Intensivists',
      rationale: 'Mandatory 1:12 physician coverage for anticipated high-acuity step-downs from surgical recovery.',
      confidenceScore: 0.92
    },
    {
      resourceId: 'res-ot-theatre-01',
      resourceName: 'PACU Recovery Beds Decongestion',
      departmentId: 'dept-ot',
      departmentName: 'Surgical Theatres & PACU',
      currentAllocated: 12,
      recommendedAllocated: 8,
      delta: -4,
      unit: 'Step-Down Transfers',
      rationale: 'Expedited transfer of 4 stable post-op patients into General Ward 3 clears recovery bays for trauma intake.',
      confidenceScore: 0.95
    }
  ],
  constraintsEvaluated: [
    {
      id: 'c-01',
      name: 'Mandatory ICU Nurse-to-Patient Ratio',
      category: 'STATUTORY_RATIO',
      description: 'Minimum 1:2 nurse-to-patient ratio for non-ventilated ICU beds and 1:1 for ventilated patients.',
      isHardConstraint: true,
      status: 'ACTIVE_BINDING',
      formulaDisplay: 'Staff_ICU(t) >= 0.5 * Demand_ICU(t) + 0.5 * Vent_ICU(t)'
    },
    {
      id: 'c-02',
      name: 'General Ward Safe Staffing Lower Bound',
      category: 'STATUTORY_RATIO',
      description: 'Maximum 1:5 ratio for standard medical-surgical inpatient wards.',
      isHardConstraint: true,
      status: 'SATISFIED',
      slackValue: 6,
      formulaDisplay: 'Staff_Ward(t) >= 0.2 * Inpatients_Ward(t)'
    },
    {
      id: 'c-03',
      name: 'Physical Bed Space Upper Bound',
      category: 'PHYSICAL_CAPACITY',
      description: 'Allocated patients cannot exceed physical installed bed capacity in any clinical zone.',
      isHardConstraint: true,
      status: 'ACTIVE_BINDING',
      formulaDisplay: 'Allocated_Beds(d, t) <= Physical_Capacity(d)'
    },
    {
      id: 'c-04',
      name: 'Trauma Team Surge Capacity Reserve',
      category: 'SPECIALTY_BOUND',
      description: 'At least 1 dedicated trauma team must remain unassigned for mass casualty readiness.',
      isHardConstraint: true,
      status: 'SATISFIED',
      slackValue: 1,
      formulaDisplay: 'Available_Trauma_Teams(t) >= 1'
    }
  ],
  projectedBottlenecksPrevented: [
    'Avoided 4-hour ED triage ambulance offload delay at 19:30',
    'Prevented statutory ratio breach in ICU Pod A',
    'Maintained 100% scheduled emergency surgery readiness'
  ],
  explanationSummary: 'The MILP solver optimized 1,480 decision variables across 5 clinical departments. By shifting 4 floater nurses from General Ward to Emergency and transferring 4 post-op PACU patients to Inpatient Ward 3, the hospital eliminates projected triage bottlenecking with 0 overtime penalties.'
};

// --------------------------------------------------------------------------
// Saved Scenarios
// --------------------------------------------------------------------------
export const SAVED_SCENARIOS: SavedScenarioRecord[] = [
  {
    id: 'sc-01',
    name: 'Regional Highway 101 Mass Casualty Incident (MCI)',
    description: 'Sudden influx of 25 multi-trauma presentations within 90 minutes requiring urgent resuscitation and surgical step-in.',
    category: 'Mass Casualty',
    createdAt: '2026-08-21 14:30',
    createdBy: 'Dr. Sarah Chen, MD',
    parameters: {
      emergencyDemandDeltaPercent: 45,
      icuBedDelta: -4,
      nurseAvailabilityDeltaPercent: 0,
      generalBedDelta: 0,
      physicianAvailabilityDeltaPercent: 0,
      equipmentOutageCount: 0,
      rapidDischargeAcceleration: true,
      electiveSurgeryHold: true
    },
    lastResult: {
      id: 'res-sc-01',
      scenarioName: 'Regional Highway 101 Mass Casualty Incident (MCI)',
      executedAt: '2026-08-21 14:32',
      parameters: {
        emergencyDemandDeltaPercent: 45,
        icuBedDelta: -4,
        nurseAvailabilityDeltaPercent: 0,
        generalBedDelta: 0,
        physicianAvailabilityDeltaPercent: 0,
        equipmentOutageCount: 0,
        rapidDischargeAcceleration: true,
        electiveSurgeryHold: true
      },
      departments: [
        {
          departmentId: 'dept-er',
          departmentName: 'Emergency & Trauma',
          baselineUtilization: 93.8,
          scenarioUtilization: 138.4,
          utilizationDelta: +44.6,
          unmetDemandPatients: 8,
          staffShortfall: 6,
          estimatedWaitTimeMinutesDelta: +64,
          riskStatus: 'CRITICAL'
        },
        {
          departmentId: 'dept-icu',
          departmentName: 'Intensive Care Unit',
          baselineUtilization: 90.6,
          scenarioUtilization: 118.2,
          utilizationDelta: +27.6,
          unmetDemandPatients: 4,
          staffShortfall: 4,
          estimatedWaitTimeMinutesDelta: +35,
          riskStatus: 'CRITICAL'
        },
        {
          departmentId: 'dept-ot',
          departmentName: 'Surgical Theatres & PACU',
          baselineUtilization: 75.0,
          scenarioUtilization: 100.0,
          utilizationDelta: +25.0,
          unmetDemandPatients: 2,
          staffShortfall: 2,
          estimatedWaitTimeMinutesDelta: +18,
          riskStatus: 'CRITICAL'
        }
      ],
      hospitalSummary: {
        overallOccupancyDelta: +22.4,
        totalUnmetDemand: 14,
        criticalStaffDeficit: 12,
        capacityPressureIndex: 94.5,
        riskTier: 'CRITICAL'
      },
      automatedMitigations: [
        'Trigger Code Orange Incident Command Protocol',
        'Hold all elective surgical admissions for 24 hours',
        'Mobilize On-Call Trauma Teams A and B',
        'Convert PACU Recovery Bay 2 into ventilated critical overflow'
      ],
      recommendedSolverAction: 'Execute Surge Staffing Plan B: Reallocate 8 floater nurses and 4 ward physicians to trauma reception.'
    }
  },
  {
    id: 'sc-02',
    name: 'Winter Viral Respiratory Surge (RSV / Influenza A)',
    description: 'Sustained 72-hour increase in high-dependency respiratory admissions concurrent with 15% nurse absenteeism due to illness.',
    category: 'Epidemic Surge',
    createdAt: '2026-08-19 09:15',
    createdBy: 'Elena Rostova, RN',
    parameters: {
      emergencyDemandDeltaPercent: 25,
      icuBedDelta: -2,
      nurseAvailabilityDeltaPercent: -15,
      generalBedDelta: -5,
      physicianAvailabilityDeltaPercent: -5,
      equipmentOutageCount: 2,
      rapidDischargeAcceleration: true,
      electiveSurgeryHold: false
    }
  },
  {
    id: 'sc-03',
    name: 'HVAC Negative Pressure Pod Maintenance (ICU Pod A)',
    description: 'Scheduled physical closure of 6 ICU isolation beds for mandatory HEPA ventilation maintenance over 24 hours.',
    category: 'Severe Weather',
    createdAt: '2026-08-18 11:00',
    createdBy: 'Alex Ross, MS',
    parameters: {
      emergencyDemandDeltaPercent: 5,
      icuBedDelta: -6,
      nurseAvailabilityDeltaPercent: 0,
      generalBedDelta: 0,
      physicianAvailabilityDeltaPercent: 0,
      equipmentOutageCount: 0,
      rapidDischargeAcceleration: false,
      electiveSurgeryHold: false
    }
  }
];

// --------------------------------------------------------------------------
// Operational SOPs and Policy Knowledge Documents
// --------------------------------------------------------------------------
export const KNOWLEDGE_DOCUMENTS: OperationalDocument[] = [
  {
    id: 'doc-sop-icu-01',
    code: 'SOP-ICU-2024.3',
    title: 'Intensive Care Unit Clinical Staffing & Acuity Protocol',
    category: 'SOP_STAFFING',
    departmentId: 'dept-icu',
    departmentName: 'Intensive Care Unit',
    version: '3.2.0',
    status: 'ACTIVE',
    uploadedBy: 'Dr. Marcus Vance, DO',
    lastUpdated: '2026-05-12',
    summary: 'Governs statutory nurse-to-patient ratios, ventilator-assisted patient coverage (1:1), and high-acuity step-down transfers.',
    chunkCount: 14,
    tags: ['Staffing Ratios', 'Ventilator Protocols', 'Critical Care', 'Statutory Compliance'],
    fullText: `1. PURPOSE & SCOPE
This Standard Operating Procedure defines clinical staffing ratios for adult intensive care units at IntelliCare Medical Center.

2. MANDATORY NURSE-TO-PATIENT RATIOS
2.1 Mechanical Ventilation: Any patient receiving invasive mechanical ventilation or continuous renal replacement therapy (CRRT) requires a minimum 1:1 dedicated Registered Nurse (CCRN certified).
2.2 Non-Ventilated Critical Care: Stable step-down patients within the ICU environment shall maintain a maximum ratio of 1:2 nurse-to-patient.
2.3 Ratio Enforcement: Under no circumstances may an ICU nurse be assigned more than 2 patients simultaneously without formal activation of Crisis Surge Level 3.

3. FLOATER NURSE INTEGRATION
When ICU occupancy exceeds 88%, the Charge Nurse shall request up to 4 experienced floater pool nurses from Central Staffing to perform telemetry monitoring and medication verification.`
  },
  {
    id: 'doc-sop-er-02',
    code: 'ED-ESC-09',
    title: 'Emergency Department Overflow Escalation & Rapid Decongestion SOP',
    category: 'ESCALATION_PROTOCOL',
    departmentId: 'dept-er',
    departmentName: 'Emergency & Trauma',
    version: '4.1.0',
    status: 'ACTIVE',
    uploadedBy: 'Elena Rostova, RN',
    lastUpdated: '2026-06-20',
    summary: 'Step-by-step procedures when ED triage capacity exceeds 90%, including fast-track discharges and observation bay conversion.',
    chunkCount: 18,
    tags: ['Emergency Escalation', 'Triage Level 2', 'Observation Conversion', 'Code Orange'],
    fullText: `1. TRIGGER THRESHOLDS
1.1 Level 1 Escalation (Yellow): ED Bed Occupancy >= 85% for 60 consecutive minutes.
1.2 Level 2 Escalation (Orange): ED Bed Occupancy >= 92% OR ambulance offload wait time > 30 minutes.
1.3 Level 3 Code Orange (Red): Impending total bed saturation or regional mass casualty event.

2. LEVEL 2 ACTION MATRIX
2.1 Fast-Track Discharge: Floor coordinators must expedite discharge paperwork for all general ward inpatients with NEWS2 score <= 2.
2.2 Bay Conversion: 6 ambulatory chairs in Zone Blue shall be converted to active acute examination bays.
2.3 On-Call Mobilization: Central dispatch pages trauma backup team and 2 secondary triage nurses.`
  },
  {
    id: 'doc-sop-surg-03',
    code: 'OR-ALLOC-14',
    title: 'Perioperative Resource Allocation & Elective Cancellation Protocol',
    category: 'BED_ALLOCATION',
    departmentId: 'dept-ot',
    departmentName: 'Surgical Theatres & PACU',
    version: '2.0.4',
    status: 'ACTIVE',
    uploadedBy: 'Dr. Arthur Pendelton, MD',
    lastUpdated: '2026-04-18',
    summary: 'Defines surgical case prioritization matrix balancing elective schedule integrity with emergency trauma guarantees.',
    chunkCount: 12,
    tags: ['Surgical Suites', 'Elective Postponement', 'PACU Capacity', 'Trauma Priority'],
    fullText: `1. ELECTIVE VS. EMERGENT BALANCING
1.1 Category A (Emergency): Immediate life-threat; OR access within 15 minutes guaranteed.
1.2 Category B (Urgent): Access required within 6 hours.
1.3 Category C (Elective): Scheduled admissions. If hospital ICU capacity is projected < 5% available within next 12 hours, Category C surgeries requiring post-op ICU step-down shall be rescheduled.`
  }
];

// --------------------------------------------------------------------------
// Human-in-the-Loop Recommendations
// --------------------------------------------------------------------------
export const INITIAL_RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: 'rec-101',
    title: 'Reallocate 4 Floater Nurses to Emergency Department for 18:00 Peak',
    departmentId: 'dept-er',
    departmentName: 'Emergency & Trauma',
    urgency: 'HIGH',
    status: 'PENDING',
    issueDescription: 'Forecasted patient arrival surge of 146 pts/hr between 18:00 and 22:00 will cause acute triage nurse-to-patient ratio to exceed statutory bounds (projected 1:4.8 vs 1:3 standard).',
    empiricalEvidence: 'Multi-horizon LSTM model projects 146 pts/hr (94.8% confidence). Historical triage backlog index rises +48% without staffing adjustment.',
    recommendedAction: 'Transfer 4 available RNs from Inpatient General Medicine Floater Pool to ED Acute Triage Zone Yellow.',
    suggestedResourceDelta: {
      resourceType: 'Registered Nurses',
      fromDepartment: 'Inpatient General Medicine (Ward 4 Floater Pool)',
      toDepartment: 'Emergency & Trauma',
      quantity: 4,
      unit: 'Nurses'
    },
    impacts: [
      { metricName: 'ED Triage Wait Time', before: '78 mins', projectedAfter: '26 mins', change: '-52 mins', positive: true },
      { metricName: 'Ambulance Offload Delay', before: '34 mins', projectedAfter: '8 mins', change: '-26 mins', positive: true },
      { metricName: 'Ward Safe Staffing Margin', before: '1:3.8', projectedAfter: '1:4.2', change: 'Safe (Bounds <= 1:5.0)', positive: true }
    ],
    confidenceScore: 0.94,
    createdAt: 'Today at 15:42',
    expiresAt: 'Today at 17:30 (Action needed before shift change)',
    relatedSopCode: 'ED-ESC-09',
    relatedSopTitle: 'Emergency Department Overflow Escalation Protocol',
    auditTrailId: 'aud-rec-101-init'
  },
  {
    id: 'rec-102',
    title: 'Accelerate 4 Post-Operative PACU Transfers to General Ward 3',
    departmentId: 'dept-ot',
    departmentName: 'Surgical Theatres & PACU',
    urgency: 'ROUTINE',
    status: 'APPROVED',
    issueDescription: 'Surgical PACU recovery beds currently at 75% capacity with 4 stable post-op cases awaiting ward bed confirmation.',
    empiricalEvidence: 'All 4 patients have Aldrete scores >= 9 and pain scores <= 2. Ward 3 has 19 available telemetry beds.',
    recommendedAction: 'Finalize electronic discharge transfer orders and alert housekeeping for immediate bed turnover in Ward 3.',
    suggestedResourceDelta: {
      resourceType: 'Patient Bed Placement',
      fromDepartment: 'Surgical Theatres & PACU',
      toDepartment: 'Inpatient General Medicine (Ward 3)',
      quantity: 4,
      unit: 'Patients'
    },
    impacts: [
      { metricName: 'PACU Recovery Reserve', before: '4 beds open', projectedAfter: '8 beds open', change: '+100% capacity', positive: true },
      { metricName: 'OR Turnaround Downtime', before: '28 mins', projectedAfter: '11 mins', change: '-17 mins', positive: true }
    ],
    confidenceScore: 0.96,
    createdAt: 'Today at 14:15',
    expiresAt: 'Today at 16:00',
    reviewedBy: 'Dr. Sarah Chen, MD',
    reviewedAt: 'Today at 14:28',
    reviewerRole: 'HOSPITAL_ADMIN',
    reviewNotes: 'Approved. Charge Nurse Ward 3 alerted for arrival.',
    relatedSopCode: 'OR-ALLOC-14',
    relatedSopTitle: 'Perioperative Resource Allocation Protocol',
    auditTrailId: 'aud-rec-102-appr'
  },
  {
    id: 'rec-103',
    title: 'Provision 2 Additional Ventilator Units to ICU Pod A Reserve',
    departmentId: 'dept-icu',
    departmentName: 'Intensive Care Unit',
    urgency: 'HIGH',
    status: 'PENDING',
    issueDescription: 'ICU ventilators currently at 21/24 active utilization (87.5%). Incoming acute trauma transfer from St. Jude may require 2 guaranteed dual-circuit units.',
    empiricalEvidence: 'Central supply currently holds 3 calibrated Hamilton-G5 units on standby.',
    recommendedAction: 'Dispatch biomedical transport to move 2 ventilators from Central Supply to ICU Pod A Staging.',
    suggestedResourceDelta: {
      resourceType: 'Mechanical Ventilators',
      fromDepartment: 'Central Supply Depot',
      toDepartment: 'Intensive Care Unit',
      quantity: 2,
      unit: 'Units'
    },
    impacts: [
      { metricName: 'ICU Ventilator Free Buffer', before: '3 units', projectedAfter: '5 units', change: '+66%', positive: true }
    ],
    confidenceScore: 0.91,
    createdAt: 'Today at 15:10',
    expiresAt: 'Today at 16:45',
    relatedSopCode: 'SOP-ICU-2024.3',
    relatedSopTitle: 'Intensive Care Unit Clinical Staffing Protocol',
    auditTrailId: 'aud-rec-103-init'
  }
];

// --------------------------------------------------------------------------
// Operational Alerts
// --------------------------------------------------------------------------
export const INITIAL_ALERTS: OperationalAlert[] = [
  {
    id: 'alt-01',
    title: 'High ICU Bed Utilization Warning',
    description: 'ICU Pod A occupancy at 93.8% (15/16 beds). Only 1 reserve bed remaining for incoming surgical transfers.',
    departmentId: 'dept-icu',
    departmentName: 'Intensive Care Unit',
    severity: 'CRITICAL',
    status: 'ACTIVE',
    createdAt: '12 mins ago',
    suggestedAction: 'Review step-down discharge candidates or open PACU overflow pod.',
    targetUrl: '/app/resources/res-icu-bed-01',
    metricTriggered: 'ICU_OCCUPANCY',
    thresholdValue: '90%',
    currentValue: '93.8%'
  },
  {
    id: 'alt-02',
    title: 'Emergency Arrival Surge Forecasted for 18:00',
    description: 'LSTM neural model detects impending arrival spike reaching 146 presentations/hr (+18.4% above baseline).',
    departmentId: 'dept-er',
    departmentName: 'Emergency & Trauma',
    severity: 'WARNING',
    status: 'ACTIVE',
    createdAt: '24 mins ago',
    suggestedAction: 'Review AI Recommendation #rec-101 for floater nurse allocation.',
    targetUrl: '/app/recommendations',
    metricTriggered: 'PREDICTED_SURGE_DELTA',
    thresholdValue: '+15%',
    currentValue: '+18.4%'
  },
  {
    id: 'alt-03',
    title: 'Scheduled Biomedical Maintenance: Infusion Pumps',
    description: '12 BD Alaris pump channels due for annual preventative calibration at 20:00.',
    departmentId: 'dept-all',
    departmentName: 'Central Supply Depot',
    severity: 'INFO',
    status: 'ACKNOWLEDGED',
    createdAt: '1 hour ago',
    acknowledgedBy: 'Alex Ross, MS',
    acknowledgedAt: '45 mins ago',
    suggestedAction: 'Ensure backup pumps staged on Floors 2 & 3.',
    targetUrl: '/app/resources',
    metricTriggered: 'MAINTENANCE_DUE',
    thresholdValue: '20:00',
    currentValue: 'Pending'
  }
];

// --------------------------------------------------------------------------
// Activity & Cryptographic Audit Logs
// --------------------------------------------------------------------------
export const INITIAL_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: 'aud-001',
    timestamp: '2026-08-22 15:42:21',
    action: 'OPTIMIZATION_EXECUTED',
    actorName: 'OR-Tools Automated Engine',
    actorEmail: 'system.solver@intellicare.health',
    actorRole: 'SYSTEM_SOLVER',
    departmentId: 'dept-all',
    departmentName: 'Hospital-Wide Operations',
    targetEntityId: 'opt-job-94821',
    targetEntityType: 'OptimizationRun',
    details: 'MILP solver executed with 1,480 decision variables. Optimal feasible allocation found in 84ms.',
    cryptographicHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    ipAddress: '10.0.4.12'
  },
  {
    id: 'aud-002',
    timestamp: '2026-08-22 14:28:44',
    action: 'RECOMMENDATION_APPROVED',
    actorName: 'Dr. Sarah Chen, MD',
    actorEmail: 'sarah.chen@intellicare.health',
    actorRole: 'HOSPITAL_ADMIN',
    departmentId: 'dept-ot',
    departmentName: 'Surgical Theatres & PACU',
    targetEntityId: 'rec-102',
    targetEntityType: 'Recommendation',
    details: 'Approved expedited transfer of 4 stable post-op patients from PACU into General Ward 3.',
    cryptographicHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    ipAddress: '192.168.1.104'
  },
  {
    id: 'aud-003',
    timestamp: '2026-08-22 14:02:11',
    action: 'SCENARIO_SIMULATED',
    actorName: 'Elena Rostova, RN',
    actorEmail: 'elena.rostova@intellicare.health',
    actorRole: 'OPERATIONS_COORDINATOR',
    departmentId: 'dept-er',
    departmentName: 'Emergency & Trauma',
    targetEntityId: 'sc-01',
    targetEntityType: 'Scenario',
    details: 'Simulated 45% emergency surge scenario (Regional Highway 101 MCI). Predicted capacity pressure index 94.5%.',
    cryptographicHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    ipAddress: '192.168.1.112'
  },
  {
    id: 'aud-004',
    timestamp: '2026-08-22 13:15:00',
    action: 'RESOURCE_OVERRIDDEN',
    actorName: 'Dr. Marcus Vance, DO',
    actorEmail: 'marcus.vance@intellicare.health',
    actorRole: 'DEPARTMENT_MANAGER',
    departmentId: 'dept-icu',
    departmentName: 'Intensive Care Unit',
    targetEntityId: 'res-icu-bed-01',
    targetEntityType: 'Resource',
    details: 'Manually marked ICU Bed 16 as reserved for emergency post-cardiac arrest transfer.',
    cryptographicHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    ipAddress: '192.168.1.88'
  }
];
