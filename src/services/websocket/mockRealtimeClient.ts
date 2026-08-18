import { LiveTelemetryEvent } from '../../types/telemetry';

export type TelemetryListener = (event: LiveTelemetryEvent) => void;

class MockRealtimeClient {
  private listeners: Set<TelemetryListener> = new Set();
  private intervalId: number | null = null;
  private isConnected: boolean = false;

  private sampleEventPool: Omit<LiveTelemetryEvent, 'id' | 'timestamp'>[] = [
    {
      type: 'RESOURCE_UPDATED',
      department: 'Emergency & Trauma',
      title: 'Triage Acuity Re-evaluation',
      description: '3 triage category 2 patients triaged. Bed allocation updated to Bay 12-14.',
      severity: 'info'
    },
    {
      type: 'FORECAST_READY',
      department: 'Predictive Inference Engine',
      title: 'LSTM 4-Hour Roll-Forward Updated',
      description: 'ED presentation forecast adjusted to 134 pts/hr based on regional incident dispatch.',
      severity: 'warning'
    },
    {
      type: 'OPTIMIZATION_COMPLETED',
      department: 'OR-Tools Engine',
      title: 'PACU to Ward Transfer Scheduled',
      description: 'Automated bed clearance scheduled for 4 post-op patients into General Ward 3.',
      severity: 'success'
    },
    {
      type: 'ALERT_CREATED',
      department: 'ICU-MED',
      title: 'Nurse-to-Patient Ratio Alert',
      description: 'ICU Bed 8 requires 1:1 dedicated nursing support due to continuous dialysis.',
      severity: 'warning'
    },
    {
      type: 'RESOURCE_UPDATED',
      department: 'General Ward 2',
      title: 'Discharge Order Completed',
      description: 'Patient discharge finalized. Housekeeping notified for 15-minute bed sanitization cycle.',
      severity: 'info'
    }
  ];

  public connect() {
    if (this.isConnected) return;
    this.isConnected = true;

    this.intervalId = window.setInterval(() => {
      if (this.listeners.size === 0) return;

      const randomTemplate = this.sampleEventPool[Math.floor(Math.random() * this.sampleEventPool.length)];
      const now = new Date();
      const timestamp = now.toTimeString().split(' ')[0];

      const event: LiveTelemetryEvent = {
        id: `evt-${Date.now()}`,
        timestamp,
        ...randomTemplate
      };

      this.listeners.forEach((listener) => listener(event));
    }, 6500);
  }

  public disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isConnected = false;
  }

  public subscribe(listener: TelemetryListener): () => void {
    this.listeners.add(listener);
    if (!this.isConnected) {
      this.connect();
    }
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) {
        this.disconnect();
      }
    };
  }
}

export const realtimeClient = new MockRealtimeClient();
