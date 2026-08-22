export interface ScenarioParameters {
  emergencyDemandDeltaPercent: number; // e.g. +35%
  icuBedDelta: number; // e.g. -4 beds
  nurseAvailabilityDeltaPercent: number; // e.g. -15%
  generalBedDelta: number; // e.g. -10 beds
  physicianAvailabilityDeltaPercent: number; // e.g. -10%
  equipmentOutageCount: number; // e.g. 3 ventilators down
  rapidDischargeAcceleration: boolean;
  electiveSurgeryHold: boolean;
}

export interface DepartmentImpactMetric {
  departmentId: string;
  departmentName: string;
  baselineUtilization: number;
  scenarioUtilization: number;
  utilizationDelta: number;
  unmetDemandPatients: number;
  staffShortfall: number;
  estimatedWaitTimeMinutesDelta: number;
  riskStatus: 'STABLE' | 'MODERATE' | 'CRITICAL';
}

export interface ScenarioSimulationResult {
  id: string;
  scenarioName: string;
  executedAt: string;
  parameters: ScenarioParameters;
  departments: DepartmentImpactMetric[];
  hospitalSummary: {
    overallOccupancyDelta: number;
    totalUnmetDemand: number;
    criticalStaffDeficit: number;
    capacityPressureIndex: number; // 0 to 100
    riskTier: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  };
  automatedMitigations: string[];
  recommendedSolverAction: string;
}

export interface SavedScenarioRecord {
  id: string;
  name: string;
  description: string;
  category: 'Mass Casualty' | 'Epidemic Surge' | 'Severe Weather' | 'Staff Shortage' | 'Custom';
  createdAt: string;
  createdBy: string;
  parameters: ScenarioParameters;
  lastResult?: ScenarioSimulationResult;
}
