export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface OperationalAlert {
  id: string;
  title: string;
  description: string;
  departmentId: string;
  departmentName: string;
  severity: AlertSeverity;
  status: AlertStatus;
  createdAt: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  suggestedAction?: string;
  targetUrl?: string;
  metricTriggered?: string;
  thresholdValue?: string;
  currentValue?: string;
}
