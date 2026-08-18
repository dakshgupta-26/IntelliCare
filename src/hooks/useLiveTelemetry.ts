import { useEffect } from 'react';
import { useSimStore } from '../store/useSimStore';
import { realtimeClient } from '../services/websocket/mockRealtimeClient';

export function useLiveTelemetry() {
  const isStreaming = useSimStore((state) => state.isRealtimeStreaming);
  const addTelemetryLog = useSimStore((state) => state.addTelemetryLog);
  const updateDepartmentMetric = useSimStore((state) => state.updateDepartmentMetric);
  const departments = useSimStore((state) => state.departments);

  useEffect(() => {
    if (!isStreaming) {
      realtimeClient.disconnect();
      return;
    }

    const unsubscribe = realtimeClient.subscribe((event) => {
      addTelemetryLog(event);

      // Micro-fluctuate random department metrics gently
      if (departments.length > 0) {
        const randomDept = departments[Math.floor(Math.random() * departments.length)];
        const deltaOccupancy = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
        const newOccupied = Math.max(5, Math.min(randomDept.bedCapacity, randomDept.bedsOccupied + deltaOccupancy));
        const newUtil = Math.round((newOccupied / randomDept.bedCapacity) * 100);

        updateDepartmentMetric(randomDept.id, {
          bedsOccupied: newOccupied,
          utilization: newUtil,
          status: newUtil > 90 ? 'critical' : newUtil > 80 ? 'warning' : 'optimal'
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isStreaming, addTelemetryLog, updateDepartmentMetric, departments]);
}
