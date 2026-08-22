export type ResourceCategory =
  | 'BED'
  | 'ICU_BED'
  | 'PHYSICIAN'
  | 'NURSE'
  | 'EQUIPMENT'
  | 'OPERATING_THEATRE';

export type ResourceStatus =
  | 'OPTIMAL'
  | 'HIGH_UTILIZATION'
  | 'CRITICAL'
  | 'MAINTENANCE'
  | 'OFFLINE';

export interface ResourceMetric {
  id: string;
  code: string;
  name: string;
  category: ResourceCategory;
  departmentId: string;
  departmentName: string;
  totalCapacity: number;
  allocated: number;
  available: number;
  reserved: number;
  utilizationRate: number; // 0 to 100
  status: ResourceStatus;
  location: string;
  lastUpdated: string;
  unit: string;
  targetRatio?: string; // e.g. "1:2 Nurse to Patient"
  specifications?: Record<string, string | number>;
  historicalUsage: { time: string; value: number }[];
  projectedDemandNext6h: number;
  maintenanceSchedule?: string;
}

export interface DepartmentSummary {
  id: string;
  code: string;
  name: string;
  leadPhysician: string;
  chargeNurse: string;
  totalBeds: number;
  occupiedBeds: number;
  activeStaff: number;
  requiredStaff: number;
  utilizationRate: number;
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
  surgeDelta: number; // percentage change vs baseline
  acuityScore: number; // 1 to 5
}
