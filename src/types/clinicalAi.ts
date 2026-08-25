export type RiskTier = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL_ALERT';

export interface PatientVitals {
  heartRate: number; // 30 - 200 bpm
  systolicBp: number; // 60 - 220 mmHg
  diastolicBp: number; // 30 - 140 mmHg
  meanArterialPressure: number; // calculated or 40 - 150 mmHg
  respiratoryRate: number; // 8 - 50 breaths/min
  spo2Oxygen: number; // 70 - 100%
  temperatureCelsius: number; // 34.0 - 41.5 C
  serumLactate: number; // 0.4 - 15.0 mmol/L
  wbcCount: number; // 1.0 - 40.0 x10^9/L
  glasgowComaScale: number; // 3 - 15
  age: number; // years
  supplementalOxygen: boolean;
}

export interface PatientPreset {
  id: string;
  name: string;
  bedCode: string;
  department: string;
  admissionReason: string;
  vitals: PatientVitals;
  clinicalNote: string;
}

export interface MultiModelRiskAssessment {
  randomForestSepsisRisk: number; // 0 - 100%
  xgboostIcuDeteriorationRisk: number; // 0 - 100%
  lstmCardiacArrestRisk: number; // 0 - 100%
  ensembleOverallRisk: number; // 0 - 100%
  riskTier: RiskTier;
  news2Score: number; // 0 - 20
  sofaScore: number; // 0 - 24
  riskTrajectoryNext12Hours: { hourOffset: number; hourLabel: string; projectedRiskScore: number; ciLower: number; ciUpper: number }[];
  primaryDeteriorationDrivers: { factor: string; contribution: number; status: 'ALARM' | 'WARNING' | 'NORMAL' }[];
  clinicalDirectives: {
    id: string;
    priority: 'EMERGENT' | 'URGENT' | 'ROUTINE';
    action: string;
    targetWindow: string;
    guidelineRef: string;
  }[];
}

export interface DrugItem {
  id: string;
  brandName: string;
  genericName: string;
  category: string;
  route: string;
  cypPathways: string[];
}

export interface DrugInteractionResult {
  pair: [string, string];
  drugA: string;
  drugB: string;
  severity: 'CONTRAINDICATED' | 'MAJOR' | 'MODERATE' | 'MINOR' | 'SAFE';
  interactionMechanism: string;
  clinicalImpact: string;
  mlConfidence: number; // %
  actionRecommendation: string;
}
