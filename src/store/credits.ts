import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getUserCredits } from '@/services/api/credits';
import { useAuthStore } from './auth';

interface CreditState {
  credits: number;
  initialized: boolean;
  setCredits: (credits: number) => void;
  deductCredits: (amount: number) => void;
  addCredits: (amount: number) => void;
  clearCredits: () => void;
  syncCredits: () => Promise<void>;
  initializeFromAuth: () => void;
}

export const useCreditStore = create<CreditState>()(
  persist(
    (set, get) => ({
      credits: 0,
      initialized: false,
      setCredits: (credits: number) => set(() => ({ credits, initialized: true })),
      deductCredits: (amount: number) => {
        const currentCredits = get().credits;
        const newCredits = Math.max(0, currentCredits - amount);
        set(() => ({ credits: newCredits }));
      },
      addCredits: (amount: number) => {
        const currentCredits = get().credits;
        set(() => ({ credits: currentCredits + amount }));
      },
      clearCredits: () => set(() => ({ credits: 0, initialized: false })),
      syncCredits: async () => {
        try {
          const credits = await getUserCredits();
          set(() => ({ credits, initialized: true }));
        } catch (error) {
          console.error('Failed to sync credits:', error);
        }
      },
      initializeFromAuth: () => {
        // This will be called by auth store to sync credits
        const { initialized } = get();
        if (!initialized) {
          // Try to get credits from auth store
          const authUser = useAuthStore.getState().user;
          if (authUser?.credits !== undefined) {
            set(() => ({ credits: authUser.credits, initialized: true }));
          }
        }
      },
    }),
    {
      name: 'credit-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
