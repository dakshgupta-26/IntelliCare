import { create } from 'zustand';
import { mlApi } from '../services/mlApi';

/** Cross-page state from the ML service (currently: pending recommendation count for the sidebar badge). */
interface MLState {
  pendingCount: number;
  refreshPending: () => Promise<void>;
}

export const useMLStore = create<MLState>((set) => ({
  pendingCount: 0,
  refreshPending: async () => {
    try {
      const pending = await mlApi.recommendations('PENDING');
      set({ pendingCount: pending.length });
    } catch {
      set({ pendingCount: 0 });
    }
  },
}));
