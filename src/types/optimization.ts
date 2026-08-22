export type OptimizationObjective =
  | 'MINIMIZE_UNMET_DEMAND'
  | 'MINIMIZE_WAIT_TIME'
  | 'BALANCE_UTILIZATION'
  | 'MINIMIZE_STAFF_OVERTIME'
  | 'MAXIMIZE_THROUGHPUT';

export type SolverJobStatus =
  | 'QUEUED'
  | 'EVALUATING_CONSTRAINTS'
  | 'BUILDING_MATRIX'
  | 'SOLVING'
  | 'FEASIBILITY_CHECK'
  | 'COMPLETED'
  | 'FAILED';

export interface ConstraintItem {
  id: string;
  name: string;
  category: 'STATUTORY_RATIO' | 'PHYSICAL_CAPACITY' | 'EQUIPMENT_LIMIT' | 'SPECIALTY_BOUND';
  description: string;
  isHardConstraint: boolean;
  status: 'SATISFIED' | 'ACTIVE_BINDING' | 'RELAXED_SOFT';
  slackValue?: number;
  formulaDisplay: string;
}

export interface AllocationShift {
  resourceId: string;
  resourceName: string;
  departmentId: string;
  departmentName: string;
  currentAllocated: number;
  recommendedAllocated: number;
  delta: number;
  unit: string;
  rationale: string;
  confidenceScore: number;
}

export interface OptimizationResult {
  jobId: string;
  timestamp: string;
  solverEngine: 'Google OR-Tools MILP (SCIP/CBC)' | 'Simplex Engine';
  status: 'OPTIMAL' | 'FEASIBLE' | 'INFEASIBLE';
  objectiveValue: number;
  solveDurationMs: number;
  variablesCount: number;
  constraintsCount: number;
  primaryObjective: OptimizationObjective;
  objectiveWeights: Record<OptimizationObjective, number>;
  shifts: AllocationShift[];
  constraintsEvaluated: ConstraintItem[];
  projectedBottlenecksPrevented: string[];
  explanationSummary: string;
}

export interface OptimizationJobProgress {
  jobId: string;
  status: SolverJobStatus;
  progressPercent: number;
  currentStepMessage: string;
  startedAt: string;
  estimatedCompletionMs?: number;
  result?: OptimizationResult;
  errorMessage?: string;
}
