import { create } from 'zustand';
import { ScenarioParameters, ScenarioSimulationResult, SavedScenarioRecord } from '../types/scenarios';
import { SAVED_SCENARIOS } from '../data/mockDatabase';

interface ScenarioState {
  currentParameters: ScenarioParameters;
  currentResult: ScenarioSimulationResult | null;
  savedScenarios: SavedScenarioRecord[];
  isSimulating: boolean;
  activePresetId: string | null;
  
  // Actions
  setParameter: <K extends keyof ScenarioParameters>(key: K, value: ScenarioParameters[K]) => void;
  resetParameters: () => void;
  loadPreset: (presetId: string) => void;
  runSimulation: () => Promise<void>;
  saveCurrentScenario: (name: string, description: string, category: SavedScenarioRecord['category']) => void;
  deleteSavedScenario: (id: string) => void;
}

const DEFAULT_PARAMETERS: ScenarioParameters = {
  emergencyDemandDeltaPercent: 25,
  icuBedDelta: -2,
  nurseAvailabilityDeltaPercent: -10,
  generalBedDelta: 0,
  physicianAvailabilityDeltaPercent: 0,
  equipmentOutageCount: 0,
  rapidDischargeAcceleration: false,
  electiveSurgeryHold: false
};

export const useScenarioStore = create<ScenarioState>((set, get) => ({
  currentParameters: DEFAULT_PARAMETERS,
  currentResult: SAVED_SCENARIOS[0].lastResult || null,
  savedScenarios: SAVED_SCENARIOS,
  isSimulating: false,
  activePresetId: 'sc-01',

  setParameter: (key, value) => {
    set((state) => ({
      currentParameters: { ...state.currentParameters, [key]: value },
      activePresetId: null
    }));
  },

  resetParameters: () => {
    set({ currentParameters: DEFAULT_PARAMETERS, activePresetId: null });
  },

  loadPreset: (presetId) => {
    const found = get().savedScenarios.find((s) => s.id === presetId);
    if (found) {
      set({
        currentParameters: { ...found.parameters },
        currentResult: found.lastResult || null,
        activePresetId: presetId
      });
    }
  },

  runSimulation: async () => {
    set({ isSimulating: true });
    await new Promise((resolve) => setTimeout(resolve, 900));

    const params = get().currentParameters;
    const edSurge = params.emergencyDemandDeltaPercent;
    const icuShift = params.icuBedDelta;
    const nurseShift = params.nurseAvailabilityDeltaPercent;

    const erUtilization = Math.min(150, Math.max(40, 93.8 + edSurge * 0.95 - (params.rapidDischargeAcceleration ? 12 : 0)));
    const icuUtilization = Math.min(140, Math.max(40, 90.6 + Math.abs(icuShift) * 4.5 + edSurge * 0.35 - (params.electiveSurgeryHold ? 10 : 0)));
    const otUtilization = Math.min(100, Math.max(30, 75.0 - (params.electiveSurgeryHold ? 35 : 0) + edSurge * 0.2));
    const wardUtilization = Math.min(120, Math.max(40, 84.2 + (params.rapidDischargeAcceleration ? -14 : 6)));

    const unmetPatients = Math.max(0, Math.round((edSurge * 0.25) + Math.abs(icuShift) * 0.8 + (nurseShift < 0 ? Math.abs(nurseShift) * 0.4 : 0)));
    const pressureIndex = Math.min(100, Math.round(55 + edSurge * 0.4 + Math.abs(icuShift) * 2.5 + Math.abs(nurseShift) * 0.5));

    const simulatedResult: ScenarioSimulationResult = {
      id: `sim-${Date.now()}`,
      scenarioName: 'Dynamic Sandbox Simulation',
      executedAt: new Date().toLocaleTimeString(),
      parameters: { ...params },
      departments: [
        {
          departmentId: 'dept-er',
          departmentName: 'Emergency & Trauma',
          baselineUtilization: 93.8,
          scenarioUtilization: Number(erUtilization.toFixed(1)),
          utilizationDelta: Number((erUtilization - 93.8).toFixed(1)),
          unmetDemandPatients: Math.max(0, Math.round(unmetPatients * 0.6)),
          staffShortfall: nurseShift < 0 ? Math.round(Math.abs(nurseShift) * 0.3) : 0,
          estimatedWaitTimeMinutesDelta: Math.round(edSurge * 1.6),
          riskStatus: erUtilization > 100 ? 'CRITICAL' : erUtilization > 88 ? 'MODERATE' : 'STABLE'
        },
        {
          departmentId: 'dept-icu',
          departmentName: 'Intensive Care Unit',
          baselineUtilization: 90.6,
          scenarioUtilization: Number(icuUtilization.toFixed(1)),
          utilizationDelta: Number((icuUtilization - 90.6).toFixed(1)),
          unmetDemandPatients: Math.max(0, Math.round(unmetPatients * 0.3)),
          staffShortfall: Math.max(0, Math.abs(icuShift) + (nurseShift < 0 ? 2 : 0)),
          estimatedWaitTimeMinutesDelta: Math.round(Math.abs(icuShift) * 8),
          riskStatus: icuUtilization > 95 ? 'CRITICAL' : icuUtilization > 85 ? 'MODERATE' : 'STABLE'
        },
        {
          departmentId: 'dept-ot',
          departmentName: 'Surgical Theatres & PACU',
          baselineUtilization: 75.0,
          scenarioUtilization: Number(otUtilization.toFixed(1)),
          utilizationDelta: Number((otUtilization - 75.0).toFixed(1)),
          unmetDemandPatients: params.electiveSurgeryHold ? 6 : 0,
          staffShortfall: 0,
          estimatedWaitTimeMinutesDelta: params.electiveSurgeryHold ? -10 : 15,
          riskStatus: otUtilization > 90 ? 'CRITICAL' : 'STABLE'
        },
        {
          departmentId: 'dept-ward',
          departmentName: 'Inpatient General Medicine',
          baselineUtilization: 84.2,
          scenarioUtilization: Number(wardUtilization.toFixed(1)),
          utilizationDelta: Number((wardUtilization - 84.2).toFixed(1)),
          unmetDemandPatients: Math.max(0, Math.round(unmetPatients * 0.1)),
          staffShortfall: nurseShift < 0 ? Math.round(Math.abs(nurseShift) * 0.4) : 0,
          estimatedWaitTimeMinutesDelta: 20,
          riskStatus: wardUtilization > 92 ? 'MODERATE' : 'STABLE'
        }
      ],
      hospitalSummary: {
        overallOccupancyDelta: Number(((erUtilization + icuUtilization + wardUtilization) / 3 - 89.5).toFixed(1)),
        totalUnmetDemand: unmetPatients,
        criticalStaffDeficit: nurseShift < 0 ? Math.round(Math.abs(nurseShift) * 0.8) : 0,
        capacityPressureIndex: pressureIndex,
        riskTier: pressureIndex > 85 ? 'CRITICAL' : pressureIndex > 70 ? 'HIGH' : pressureIndex > 50 ? 'MODERATE' : 'LOW'
      },
      automatedMitigations: [
        params.rapidDischargeAcceleration ? 'Active: Rapid discharge protocols de-escalating general ward load' : 'Recommendation: Enable rapid discharge protocol (NEWS2 <= 2)',
        params.electiveSurgeryHold ? 'Active: Elective surgical hold preserving PACU & ICU beds' : 'Recommendation: Consider pausing Category C non-urgent elective surgeries',
        'Deploy central hospital floater pool to high-acuity zone buffers',
        'Notify on-call clinical nurse leaders and department heads'
      ],
      recommendedSolverAction: `Execute surge reallocation: Transfer floater nurses and stage ${Math.max(1, Math.abs(icuShift))} auxiliary beds.`
    };

    set({
      isSimulating: false,
      currentResult: simulatedResult
    });
  },

  saveCurrentScenario: (name, description, category) => {
    const newRecord: SavedScenarioRecord = {
      id: `sc-custom-${Date.now()}`,
      name,
      description,
      category,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      createdBy: 'Current User',
      parameters: { ...get().currentParameters },
      lastResult: get().currentResult || undefined
    };
    set((state) => ({
      savedScenarios: [newRecord, ...state.savedScenarios],
      activePresetId: newRecord.id
    }));
  },

  deleteSavedScenario: (id) => {
    set((state) => ({
      savedScenarios: state.savedScenarios.filter((s) => s.id !== id),
      activePresetId: state.activePresetId === id ? null : state.activePresetId
    }));
  }
}));
