import { create } from 'zustand';
import { OptimizationObjective, OptimizationResult, OptimizationJobProgress } from '../types/optimization';
import { LATEST_OPTIMIZATION_RESULT } from '../data/mockDatabase';

interface OptimizationState {
  currentResult: OptimizationResult;
  objectiveWeights: Record<OptimizationObjective, number>;
  activeJob: OptimizationJobProgress | null;
  isMathDrawerOpen: boolean;
  
  // Actions
  setObjectiveWeight: (objective: OptimizationObjective, weight: number) => void;
  runOptimizationSolver: () => Promise<void>;
  setMathDrawerOpen: (open: boolean) => void;
}

export const useOptimizationStore = create<OptimizationState>((set, get) => ({
  currentResult: LATEST_OPTIMIZATION_RESULT,
  objectiveWeights: {
    MINIMIZE_UNMET_DEMAND: 45,
    MINIMIZE_WAIT_TIME: 25,
    BALANCE_UTILIZATION: 15,
    MINIMIZE_STAFF_OVERTIME: 15,
    MAXIMIZE_THROUGHPUT: 0
  },
  activeJob: null,
  isMathDrawerOpen: false,

  setObjectiveWeight: (objective, weight) => {
    set((state) => ({
      objectiveWeights: { ...state.objectiveWeights, [objective]: weight }
    }));
  },

  setMathDrawerOpen: (open) => set({ isMathDrawerOpen: open }),

  runOptimizationSolver: async () => {
    const jobId = `opt-job-${Date.now().toString().slice(-5)}`;
    
    // Step 1: Queued
    set({
      activeJob: {
        jobId,
        status: 'QUEUED',
        progressPercent: 10,
        currentStepMessage: 'Ingesting 4-hour multi-department arrival tensors...',
        startedAt: new Date().toLocaleTimeString()
      }
    });

    await new Promise((r) => setTimeout(r, 600));

    // Step 2: Evaluating Constraints
    set({
      activeJob: {
        jobId,
        status: 'EVALUATING_CONSTRAINTS',
        progressPercent: 35,
        currentStepMessage: 'Formulating statutory nurse-to-patient ratio bounds & bed capacity constraints...',
        startedAt: new Date().toLocaleTimeString()
      }
    });

    await new Promise((r) => setTimeout(r, 700));

    // Step 3: Solving Simplex Matrix
    set({
      activeJob: {
        jobId,
        status: 'SOLVING',
        progressPercent: 75,
        currentStepMessage: 'Google OR-Tools MILP branch-and-bound integer relaxation running...',
        startedAt: new Date().toLocaleTimeString()
      }
    });

    await new Promise((r) => setTimeout(r, 800));

    // Step 4: Feasibility & Completed
    const completedResult: OptimizationResult = {
      ...LATEST_OPTIMIZATION_RESULT,
      jobId,
      timestamp: 'Just now',
      solveDurationMs: 92,
      objectiveWeights: {
        MINIMIZE_UNMET_DEMAND: get().objectiveWeights.MINIMIZE_UNMET_DEMAND / 100,
        MINIMIZE_WAIT_TIME: get().objectiveWeights.MINIMIZE_WAIT_TIME / 100,
        BALANCE_UTILIZATION: get().objectiveWeights.BALANCE_UTILIZATION / 100,
        MINIMIZE_STAFF_OVERTIME: get().objectiveWeights.MINIMIZE_STAFF_OVERTIME / 100,
        MAXIMIZE_THROUGHPUT: get().objectiveWeights.MAXIMIZE_THROUGHPUT / 100
      }
    };

    set({
      activeJob: {
        jobId,
        status: 'COMPLETED',
        progressPercent: 100,
        currentStepMessage: 'Global optimal feasible allocation vector verified.',
        startedAt: new Date().toLocaleTimeString(),
        result: completedResult
      },
      currentResult: completedResult
    });

    setTimeout(() => {
      set({ activeJob: null });
    }, 2500);
  }
}));
