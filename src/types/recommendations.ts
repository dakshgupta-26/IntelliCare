export type RecommendationStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'MODIFIED'
  | 'REJECTED'
  | 'EXPIRED';

export type RecommendationUrgency = 'ROUTINE' | 'HIGH' | 'CRITICAL_IMMEDIATE';

export interface ActionImpactMetric {
  metricName: string;
  before: string;
  projectedAfter: string;
  change: string;
  positive: boolean;
}

export interface RecommendationItem {
  id: string;
  title: string;
  departmentId: string;
  departmentName: string;
  urgency: RecommendationUrgency;
  status: RecommendationStatus;
  issueDescription: string;
  empiricalEvidence: string;
  recommendedAction: string;
  suggestedResourceDelta: {
    resourceType: string;
    fromDepartment?: string;
    toDepartment: string;
    quantity: number;
    unit: string;
  };
  impacts: ActionImpactMetric[];
  confidenceScore: number;
  createdAt: string;
  expiresAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewerRole?: string;
  reviewNotes?: string;
  modifiedParameters?: {
    approvedQuantity: number;
    customNote: string;
  };
  relatedSopCode?: string;
  relatedSopTitle?: string;
  auditTrailId?: string;
}
