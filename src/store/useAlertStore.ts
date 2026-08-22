import { create } from 'zustand';
import { OperationalAlert, AlertSeverity, AlertStatus } from '../types/alerts';
import { INITIAL_ALERTS } from '../data/mockDatabase';
import { useAuthStore } from './useAuthStore';

interface AlertState {
  alerts: OperationalAlert[];
  severityFilter: AlertSeverity | 'ALL';
  statusFilter: AlertStatus | 'ALL';
  departmentFilter: string; // 'all' or department ID
  
  // Actions
  setSeverityFilter: (severity: AlertSeverity | 'ALL') => void;
  setStatusFilter: (status: AlertStatus | 'ALL') => void;
  setDepartmentFilter: (deptId: string) => void;
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  getUnresolvedCount: () => number;
  getCriticalCount: () => number;
}

export const useAlertStore = create<AlertState>((set, get) => ({
  alerts: INITIAL_ALERTS,
  severityFilter: 'ALL',
  statusFilter: 'ALL',
  departmentFilter: 'all',

  setSeverityFilter: (severity) => set({ severityFilter: severity }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setDepartmentFilter: (deptId) => set({ departmentFilter: deptId }),

  acknowledgeAlert: (id) => {
    const user = useAuthStore.getState().currentUser;
    const actorName = user ? user.name : 'Operations Coordinator';
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'ACKNOWLEDGED' as AlertStatus,
              acknowledgedBy: actorName,
              acknowledgedAt: 'Just now'
            }
          : a
      )
    }));
  },

  resolveAlert: (id) => {
    const user = useAuthStore.getState().currentUser;
    const actorName = user ? user.name : 'Operations Coordinator';
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'RESOLVED' as AlertStatus,
              resolvedBy: actorName,
              resolvedAt: 'Just now'
            }
          : a
      )
    }));
  },

  getUnresolvedCount: () => {
    return get().alerts.filter((a) => a.status !== 'RESOLVED').length;
  },

  getCriticalCount: () => {
    return get().alerts.filter((a) => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length;
  }
}));
