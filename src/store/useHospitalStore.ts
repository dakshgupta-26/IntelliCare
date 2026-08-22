import { create } from 'zustand';
import { DepartmentSummary } from '../types/resources';
import { DEPARTMENTS_DATA } from '../data/mockDatabase';

export type OperationalHealthStatus = 'OPTIMAL' | 'SURGE_WARNING' | 'HIGH_ACUITY' | 'CODE_ORANGE';

interface HospitalState {
  selectedHospital: string;
  availableHospitals: { id: string; name: string; city: string; activeBeds: number }[];
  selectedDepartmentId: string; // 'all' or specific department ID
  operationalStatus: OperationalHealthStatus;
  departments: DepartmentSummary[];
  
  // Actions
  setSelectedHospital: (id: string) => void;
  setSelectedDepartmentId: (id: string) => void;
  setOperationalStatus: (status: OperationalHealthStatus) => void;
  updateDepartment: (deptId: string, updates: Partial<DepartmentSummary>) => void;
}

export const useHospitalStore = create<HospitalState>((set) => ({
  selectedHospital: 'org-metro-01',
  availableHospitals: [
    { id: 'org-metro-01', name: 'IntelliCare Metropolitan Medical Center', city: 'Metropolis', activeBeds: 240 },
    { id: 'org-stjude-02', name: 'St. Jude Regional Trauma Center', city: 'Riverside', activeBeds: 180 },
    { id: 'org-univ-03', name: 'University Health Memorial Hospital', city: 'Northbridge', activeBeds: 320 }
  ],
  selectedDepartmentId: 'all',
  operationalStatus: 'HIGH_ACUITY',
  departments: DEPARTMENTS_DATA,

  setSelectedHospital: (id: string) => set({ selectedHospital: id }),
  setSelectedDepartmentId: (id: string) => set({ selectedDepartmentId: id }),
  setOperationalStatus: (status: OperationalHealthStatus) => set({ operationalStatus: status }),
  updateDepartment: (deptId: string, updates: Partial<DepartmentSummary>) => {
    set((state) => ({
      departments: state.departments.map((d) => (d.id === deptId ? { ...d, ...updates } : d))
    }));
  }
}));
