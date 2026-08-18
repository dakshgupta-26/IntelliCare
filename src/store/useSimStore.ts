import { create } from 'zustand';
import { DepartmentMetric, LiveTelemetryEvent } from '../types/telemetry';
import { OptimizationParameters, OptimizationResult, ScenarioPreset, RagQueryPreset } from '../types/simulation';
import { INITIAL_DEPARTMENTS, INITIAL_REALTIME_LOGS, RAG_PRESETS } from '../data/demoData';
import { SCENARIO_PRESETS } from '../data/scenarios';

interface SimState {
  // Optimization Simulator State
  optParams: OptimizationParameters;
  optResult: OptimizationResult;
  setOptParam: <K extends keyof OptimizationParameters>(key: K, value: OptimizationParameters[K]) => void;
  resetOptParams: () => void;

  // Forecast Chart State
  showLstm: boolean;
  showXgboost: boolean;
  showConfidenceIntervals: boolean;
  simulateSpike: boolean;
  toggleForecastToggle: (key: 'showLstm' | 'showXgboost' | 'showConfidenceIntervals' | 'simulateSpike') => void;

  // Pipeline State
  activePipelineIndex: number;
  setActivePipelineIndex: (index: number) => void;

  // Scenario Simulator State
  activeScenario: ScenarioPreset;
  setActiveScenario: (scenario: ScenarioPreset) => void;

  // RAG QA State
  activeRagQuery: RagQueryPreset;
  setActiveRagQuery: (query: RagQueryPreset) => void;

  // Human-in-the-Loop Decision State
  hitlStatus: 'pending' | 'approved' | 'modified' | 'rejected';
  hitlActionNote: string;
  setHitlAction: (status: 'approved' | 'modified' | 'rejected', note?: string) => void;
  resetHitl: () => void;

  // Real-Time Telemetry & Telemetry Feed
  departments: DepartmentMetric[];
  telemetryLogs: LiveTelemetryEvent[];
  isRealtimeStreaming: boolean;
  toggleRealtimeStream: () => void;
  addTelemetryLog: (event: LiveTelemetryEvent) => void;
  updateDepartmentMetric: (deptId: string, updates: Partial<DepartmentMetric>) => void;
}

const DEFAULT_OPT_PARAMS: OptimizationParameters = {
  emergencyDemandMultiplier: 1.2, // +20%
  icuBedCapacity: 32,
  nurseStaffingLevel: 0.9, // -10%
};

function calculateOptimization(params: OptimizationParameters): OptimizationResult {
  const { emergencyDemandMultiplier, icuBedCapacity, nurseStaffingLevel } = params;

  // Calculate projected demand index
  const baseEDDemand = 100 * emergencyDemandMultiplier;
  const icuDemandRatio = (baseEDDemand * 0.28) / icuBedCapacity;
  const icuLoadPercent = Math.min(100, Math.round(icuDemandRatio * 100));

  // Staff utilization
  const baseStaffRequired = 100 * emergencyDemandMultiplier;
  const availableStaff = 100 * nurseStaffingLevel;
  const utilizationRatio = baseStaffRequired / availableStaff;
  const overallStaffUtilization = Math.min(100, Math.round(utilizationRatio * 82));

  // Wait time calculation
  let waitTime = 22;
  if (emergencyDemandMultiplier > 1.0) {
    waitTime += Math.round((emergencyDemandMultiplier - 1.0) * 85);
  }
  if (nurseStaffingLevel < 1.0) {
    waitTime += Math.round((1.0 - nurseStaffingLevel) * 60);
  }
  if (icuBedCapacity < 32) {
    waitTime += (32 - icuBedCapacity) * 4;
  }

  // Risk Score (0-100)
  let risk = 20;
  if (icuLoadPercent > 85) risk += (icuLoadPercent - 85) * 3.5;
  if (overallStaffUtilization > 85) risk += (overallStaffUtilization - 85) * 2.5;
  if (emergencyDemandMultiplier > 1.3) risk += 15;
  const overloadRiskScore = Math.min(99, Math.max(12, Math.round(risk)));

  // Calculate doctor/nurse reallocations
  const doctorED = emergencyDemandMultiplier > 1.1 ? Math.min(6, Math.round((emergencyDemandMultiplier - 1) * 12)) : 0;
  const nurseED = emergencyDemandMultiplier > 1.0 ? Math.min(10, Math.round((emergencyDemandMultiplier - 1) * 20)) : 0;
  const nurseICU = icuLoadPercent > 80 ? Math.min(6, Math.round((icuLoadPercent - 75) / 5)) : 0;

  return {
    recommendedDoctorReallocation: {
      'Emergency': +doctorED,
      'ICU': +Math.round(doctorED / 2),
      'General Medicine': -Math.round(doctorED / 2),
      'Surgical PACU': 0
    },
    recommendedNurseReallocation: {
      'Emergency': +nurseED,
      'ICU': +nurseICU,
      'General Medicine': -Math.round((nurseED + nurseICU) * 0.6),
      'Outpatient': -Math.round((nurseED + nurseICU) * 0.4)
    },
    expectedIcuLoadPercent: icuLoadPercent,
    overallStaffUtilizationPercent: overallStaffUtilization,
    projectedWaitTimeMinutes: Math.max(15, waitTime),
    overloadRiskScore,
    milpSolveTimeMs: Math.floor(65 + Math.random() * 30),
    objectiveValue: +(142.8 + emergencyDemandMultiplier * 18.2).toFixed(2),
    isFeasible: overloadRiskScore < 95
  };
}

export const useSimStore = create<SimState>((set) => ({
  // Optimization Simulator
  optParams: DEFAULT_OPT_PARAMS,
  optResult: calculateOptimization(DEFAULT_OPT_PARAMS),
  setOptParam: (key, value) => {
    set((state) => {
      const newParams = { ...state.optParams, [key]: value };
      return {
        optParams: newParams,
        optResult: calculateOptimization(newParams)
      };
    });
  },
  resetOptParams: () => {
    set({
      optParams: DEFAULT_OPT_PARAMS,
      optResult: calculateOptimization(DEFAULT_OPT_PARAMS)
    });
  },

  // Forecast Chart
  showLstm: true,
  showXgboost: true,
  showConfidenceIntervals: true,
  simulateSpike: false,
  toggleForecastToggle: (key) => {
    set((state) => ({ [key]: !state[key] }));
  },

  // Pipeline
  activePipelineIndex: 1, // default PREDICT
  setActivePipelineIndex: (index) => set({ activePipelineIndex: index }),

  // Scenarios
  activeScenario: SCENARIO_PRESETS[0],
  setActiveScenario: (scenario) => set({ activeScenario: scenario }),

  // RAG
  activeRagQuery: RAG_PRESETS[0],
  setActiveRagQuery: (query) => set({ activeRagQuery: query }),

  // HITL
  hitlStatus: 'pending',
  hitlActionNote: '',
  setHitlAction: (status, note = '') => set({ hitlStatus: status, hitlActionNote: note }),
  resetHitl: () => set({ hitlStatus: 'pending', hitlActionNote: '' }),

  // Real-time Telemetry
  departments: INITIAL_DEPARTMENTS,
  telemetryLogs: INITIAL_REALTIME_LOGS,
  isRealtimeStreaming: true,
  toggleRealtimeStream: () => set((state) => ({ isRealtimeStreaming: !state.isRealtimeStreaming })),
  addTelemetryLog: (event) => {
    set((state) => ({
      telemetryLogs: [event, ...state.telemetryLogs.slice(0, 19)]
    }));
  },
  updateDepartmentMetric: (deptId, updates) => {
    set((state) => ({
      departments: state.departments.map((d) => (d.id === deptId ? { ...d, ...updates } : d))
    }));
  }
}));
