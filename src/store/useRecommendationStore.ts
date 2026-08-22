import { create } from 'zustand';
import { RecommendationItem, RecommendationStatus } from '../types/recommendations';
import { INITIAL_RECOMMENDATIONS } from '../data/mockDatabase';
import { useAuthStore } from './useAuthStore';

interface RecommendationState {
  recommendations: RecommendationItem[];
  selectedRecommendation: RecommendationItem | null;
  isReviewModalOpen: boolean;
  statusFilter: RecommendationStatus | 'ALL';
  
  // Actions
  setStatusFilter: (status: RecommendationStatus | 'ALL') => void;
  openReviewModal: (rec: RecommendationItem) => void;
  closeReviewModal: () => void;
  approveRecommendation: (id: string, notes?: string) => void;
  modifyRecommendation: (id: string, customQuantity: number, notes: string) => void;
  rejectRecommendation: (id: string, reason: string) => void;
  dismissRecommendation: (id: string) => void;
  getPendingCount: () => number;
}

export const useRecommendationStore = create<RecommendationState>((set, get) => ({
  recommendations: INITIAL_RECOMMENDATIONS,
  selectedRecommendation: null,
  isReviewModalOpen: false,
  statusFilter: 'ALL',

  setStatusFilter: (status) => set({ statusFilter: status }),

  openReviewModal: (rec) => {
    set({ selectedRecommendation: rec, isReviewModalOpen: true });
  },

  closeReviewModal: () => {
    set({ selectedRecommendation: null, isReviewModalOpen: false });
  },

  approveRecommendation: (id, notes) => {
    const currentUser = useAuthStore.getState().currentUser;
    const actorName = currentUser ? currentUser.name : 'Clinical Supervisor';
    const actorRole = currentUser ? currentUser.role : 'HOSPITAL_ADMIN';

    set((state) => ({
      recommendations: state.recommendations.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'APPROVED' as RecommendationStatus,
              reviewedBy: actorName,
              reviewedAt: 'Just now',
              reviewerRole: actorRole,
              reviewNotes: notes || 'Approved without modifications.',
              auditTrailId: `aud-${id}-appr`
            }
          : r
      ),
      isReviewModalOpen: false,
      selectedRecommendation: null
    }));
  },

  modifyRecommendation: (id, customQuantity, notes) => {
    const currentUser = useAuthStore.getState().currentUser;
    const actorName = currentUser ? currentUser.name : 'Clinical Supervisor';
    const actorRole = currentUser ? currentUser.role : 'HOSPITAL_ADMIN';

    set((state) => ({
      recommendations: state.recommendations.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'MODIFIED' as RecommendationStatus,
              reviewedBy: actorName,
              reviewedAt: 'Just now',
              reviewerRole: actorRole,
              reviewNotes: notes,
              modifiedParameters: {
                approvedQuantity: customQuantity,
                customNote: notes
              },
              auditTrailId: `aud-${id}-mod`
            }
          : r
      ),
      isReviewModalOpen: false,
      selectedRecommendation: null
    }));
  },

  rejectRecommendation: (id, reason) => {
    const currentUser = useAuthStore.getState().currentUser;
    const actorName = currentUser ? currentUser.name : 'Clinical Supervisor';
    const actorRole = currentUser ? currentUser.role : 'HOSPITAL_ADMIN';

    set((state) => ({
      recommendations: state.recommendations.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'REJECTED' as RecommendationStatus,
              reviewedBy: actorName,
              reviewedAt: 'Just now',
              reviewerRole: actorRole,
              reviewNotes: `Rejected: ${reason}`,
              auditTrailId: `aud-${id}-rej`
            }
          : r
      ),
      isReviewModalOpen: false,
      selectedRecommendation: null
    }));
  },

  dismissRecommendation: (id) => {
    set((state) => ({
      recommendations: state.recommendations.map((r) =>
        r.id === id ? { ...r, status: 'EXPIRED' as RecommendationStatus } : r
      )
    }));
  },

  getPendingCount: () => {
    return get().recommendations.filter((r) => r.status === 'PENDING').length;
  }
}));
