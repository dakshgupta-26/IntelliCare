export type AuditActionType =
  | 'RECOMMENDATION_APPROVED'
  | 'RECOMMENDATION_MODIFIED'
  | 'RECOMMENDATION_REJECTED'
  | 'OPTIMIZATION_EXECUTED'
  | 'SCENARIO_SIMULATED'
  | 'RESOURCE_OVERRIDDEN'
  | 'ALERT_ACKNOWLEDGED'
  | 'ALERT_RESOLVED'
  | 'SOP_DOCUMENT_UPLOADED'
  | 'USER_INVITED'
  | 'ROLE_UPDATED'
  | 'SYSTEM_CONFIG_CHANGED';

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  action: AuditActionType;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  departmentId?: string;
  departmentName?: string;
  targetEntityId: string;
  targetEntityType: string;
  details: string;
  cryptographicHash: string;
  ipAddress: string;
  metadata?: Record<string, any>;
}
