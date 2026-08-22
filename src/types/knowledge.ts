export type DocumentCategory =
  | 'SOP_STAFFING'
  | 'ESCALATION_PROTOCOL'
  | 'DISCHARGE_CRITERIA'
  | 'BED_ALLOCATION'
  | 'EQUIPMENT_MAINTENANCE'
  | 'SURGE_PLAN';

export interface OperationalDocument {
  id: string;
  code: string;
  title: string;
  category: DocumentCategory;
  departmentId: string;
  departmentName: string;
  version: string;
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'ARCHIVED';
  uploadedBy: string;
  lastUpdated: string;
  summary: string;
  fullText: string;
  chunkCount: number;
  tags: string[];
}

export interface DocumentCitation {
  documentId: string;
  documentTitle: string;
  documentCode: string;
  section: string;
  confidenceScore: number;
  retrievalMethod: 'Dense Vector (Cosine)' | 'Sparse BM25' | 'Hybrid Rerank';
  matchedSnippet: string;
}

export interface RagChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  question?: string;
  answer?: string;
  reasoningSummary?: string;
  sources?: DocumentCitation[];
  groundedMetrics?: {
    currentDepartmentLoad?: string;
    forecastedDemand?: string;
    recommendedResourceDelta?: string;
  };
  suggestedFollowUps?: string[];
  isStreaming?: boolean;
}
