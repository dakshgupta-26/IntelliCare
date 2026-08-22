import { create } from 'zustand';
import { OperationalDocument, DocumentCategory, RagChatMessage, DocumentCitation } from '../types/knowledge';
import { KNOWLEDGE_DOCUMENTS } from '../data/mockDatabase';

interface KnowledgeState {
  documents: OperationalDocument[];
  selectedCategory: DocumentCategory | 'ALL';
  searchQuery: string;
  selectedDocumentId: string | null;
  
  // AI Assistant State
  messages: RagChatMessage[];
  isAskingAssistant: boolean;
  
  // Actions
  setSelectedCategory: (category: DocumentCategory | 'ALL') => void;
  setSearchQuery: (query: string) => void;
  setSelectedDocumentId: (id: string | null) => void;
  askAssistant: (question: string) => Promise<void>;
  clearConversation: () => void;
  getFilteredDocuments: () => OperationalDocument[];
}

const INITIAL_MESSAGES: RagChatMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'assistant',
    timestamp: 'Today at 08:00 AM',
    answer: 'Welcome to the IntelliCare Operational Knowledge & Decision Grounding Core. You can ask operational questions regarding hospital SOPs, nurse-to-patient staffing ratio mandates, emergency overflow escalations, or specific mathematical solver decisions.',
    suggestedFollowUps: [
      'Why is ICU nurse staffing being increased for the 18:00 shift?',
      'What is the step-down protocol if Emergency reaches 92% capacity?',
      'How does the MILP solver balance elective surgery cancellations?'
    ]
  }
];

export const useKnowledgeStore = create<KnowledgeState>((set, get) => ({
  documents: KNOWLEDGE_DOCUMENTS,
  selectedCategory: 'ALL',
  searchQuery: '',
  selectedDocumentId: null,
  messages: INITIAL_MESSAGES,
  isAskingAssistant: false,

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedDocumentId: (id) => set({ selectedDocumentId: id }),

  getFilteredDocuments: () => {
    const { documents, selectedCategory, searchQuery } = get();
    return documents.filter((doc) => {
      const matchesCategory = selectedCategory === 'ALL' || doc.category === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  },

  askAssistant: async (question: string) => {
    const userMessage: RagChatMessage = {
      id: `usr-msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      question
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      isAskingAssistant: true
    }));

    // Simulate Hybrid RAG (Dense Vector + BM25) latency
    await new Promise((resolve) => setTimeout(resolve, 1100));

    let answer = 'Based on hospital operational SOPs and current telemetry, the recommended resource reallocation ensures all departments remain within statutory safety bounds.';
    let reasoningSummary = 'Formulation satisfies: min(unmet_demand) s.t. Staff_ICU(t) >= 0.5 * Demand_ICU(t).';
    let sources: DocumentCitation[] = [
      {
        documentId: 'doc-sop-icu-01',
        documentTitle: 'Intensive Care Unit Clinical Staffing & Acuity Protocol',
        documentCode: 'SOP-ICU-2024.3',
        section: 'Section 2.1: Mechanical Ventilation & 1:1 Mandatory Ratio',
        confidenceScore: 0.95,
        retrievalMethod: 'Dense Vector (Cosine)',
        matchedSnippet: 'Any patient receiving invasive mechanical ventilation requires a minimum 1:1 dedicated Registered Nurse (CCRN certified).'
      },
      {
        documentId: 'doc-sop-er-02',
        documentTitle: 'Emergency Department Overflow Escalation SOP',
        documentCode: 'ED-ESC-09',
        section: 'Section 2.1: Level 2 Action Matrix & Fast-Track Discharge',
        confidenceScore: 0.89,
        retrievalMethod: 'Hybrid Rerank',
        matchedSnippet: 'Floor coordinators must expedite discharge paperwork for all general ward inpatients with NEWS2 score <= 2.'
      }
    ];

    const qLower = question.toLowerCase();
    if (qLower.includes('icu') || qLower.includes('nurse')) {
      answer = 'Projected ICU occupancy between 18:00 and 22:00 reaches 29 occupied beds (90.6% capacity) with 3 incoming high-acuity surgical step-downs. Under SOP-ICU-2024.3 Section 2.1, ventilated patients strictly mandate a 1:1 ratio, requiring an additional 4 registered nurses. To avoid expensive agency overtime, the system leverages available floater pool nurses from General Ward 4.';
      reasoningSummary = 'Constraint formulation: min(cost) s.t. Staff_{ICU}(t) >= ceil(Demand_{ICU}(t) / 2.0). Solved feasible in 84ms with 0 statutory violations.';
    } else if (qLower.includes('emergency') || qLower.includes('overflow') || qLower.includes('triage')) {
      answer = 'Under Emergency Department Escalation Policy ED-ESC-09 Level 2 (triggered when occupancy >= 92% or offload wait > 30 mins), the operational system recommends: 1) Accelerating rapid discharge for stable inpatients (NEWS2 score <= 2); 2) Converting 6 Zone Blue chairs into acute exam bays; and 3) Mobilizing 4 floater nurses to Zone Yellow triage.';
      reasoningSummary = 'Trigger condition satisfied: ED_Occupancy = 93.8% (> 92% threshold). Generated Level 2 action bundle.';
    } else if (qLower.includes('milp') || qLower.includes('elective') || qLower.includes('fairness') || qLower.includes('optimization')) {
      answer = 'The Mixed-Integer Linear Programming (MILP) solver in OR-Tools assigns a weighted cost matrix that prioritizes emergent life-safety admissions (weight 0.45) while minimizing elective surgery postponements (weight 0.25) and staff overtime (weight 0.15). This guarantees statutory ratios are strictly maintained without arbitrary cancellations.';
      reasoningSummary = 'Objective: min sum(w_emergent * WaitTime) + sum(w_elective * PostponementRisk) + sum(w_staff * OvertimePenalty).';
    }

    const assistantMessage: RagChatMessage = {
      id: `asst-msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      answer,
      reasoningSummary,
      sources,
      suggestedFollowUps: [
        'What is the discharge criteria for stable general ward patients?',
        'How many floater nurses are currently available across all wards?',
        'Show me the latest MILP optimization shifts.'
      ]
    };

    set((state) => ({
      messages: [...state.messages, assistantMessage],
      isAskingAssistant: false
    }));
  },

  clearConversation: () => set({ messages: INITIAL_MESSAGES })
}));
