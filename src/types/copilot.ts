import { UserRole } from './auth';

export type ThinkingStage = 
  | 'TELEMETRY'
  | 'RAG_RETRIEVAL'
  | 'OPTIMIZATION'
  | 'SYNTHESIS'
  | null;

export interface DocumentCitation {
  documentId: string;
  documentTitle: string;
  documentCode: string;
  section: string;
  confidenceScore: number;
  retrievalMethod: string;
  matchedSnippet: string;
}

export type CardType = 
  | 'forecast' 
  | 'optimization' 
  | 'architecture' 
  | 'algorithm' 
  | 'recommendation' 
  | 'kpi';

export interface CardData {
  type: CardType;
  title: string;
  subtitle?: string;
  meta?: Record<string, any>;
  data?: any;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  thinkingStage?: ThinkingStage;
  cards?: CardData[];
  citations?: DocumentCitation[];
  suggestedFollowUps?: string[];
  isStreaming?: boolean;
  liked?: boolean | null;
  bookmarked?: boolean;
}

export interface CopilotThread {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
  messages: CopilotMessage[];
}

export interface ContextScope {
  page: string;
  pageTitle: string;
  department: string;
  resource: string;
  hospital: string;
  userRole: UserRole;
}

export interface SlashCommand {
  command: string;
  label: string;
  description: string;
  icon: string;
  category: 'Intelligence' | 'Operations' | 'System' | 'Navigation';
  prompt: string;
}

export interface CopilotToast {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  actionLabel?: string;
  actionPayload?: string;
  timestamp: string;
}

export interface CopilotBookmark {
  id: string;
  messageId: string;
  title: string;
  text: string;
  timestamp: string;
  tags?: string[];
}

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  route?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  badge?: string;
}
