export interface OptimizationParameters {
  emergencyDemandMultiplier: number; // 0.8 - 2.0 (e.g., 1.2 is +20%)
  icuBedCapacity: number; // 20 - 60
  nurseStaffingLevel: number; // 0.7 - 1.3 (e.g. 0.9 is -10%)
}

export interface OptimizationResult {
  recommendedDoctorReallocation: { [dept: string]: number };
  recommendedNurseReallocation: { [dept: string]: number };
  expectedIcuLoadPercent: number;
  overallStaffUtilizationPercent: number;
  projectedWaitTimeMinutes: number;
  overloadRiskScore: number; // 0 - 100
  milpSolveTimeMs: number;
  objectiveValue: number;
  isFeasible: boolean;
}

export interface ScenarioPreset {
  id: string;
  name: string;
  category: 'Mass Casualty' | 'Epidemic Surge' | 'Severe Weather' | 'Staff Shortage';
  description: string;
  parameters: {
    emergencyDemandChangePercent: number;
    icuBedChange: number;
    nurseAvailabilityChangePercent: number;
  };
  projectedImpact: {
    icuLoadDelta: string;
    staffShortfall: string;
    waitTimeChange: string;
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    automatedMitigation: string;
  };
}

export interface RagQueryPreset {
  id: string;
  question: string;
  answer: string;
  sources: {
    title: string;
    section: string;
    confidence: number;
    retrievalMethod: 'Dense Vector (Cosine 0.91)' | 'BM25 Sparse (Score 14.8)' | 'Hybrid Rerank';
  }[];
  reasoningSnippet: string;
}
