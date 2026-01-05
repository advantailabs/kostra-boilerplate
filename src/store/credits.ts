import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getUserCredits } from '@/services/api/credits';
import { useAuthStore } from './auth';

interface CreditState {
  credits: number;
  initialized: boolean;
  setCredits: (_credits: number) => void;
  deductCredits: (_amount: number) => void;
  addCredits: (_mount: number) => void;
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
      deductCredits: (_amount: number) => {
        const currentCredits = get().credits;
        const newCredits = Math.max(0, currentCredits - _amount);
        set(() => ({ credits: newCredits }));
      },
      addCredits: (_amount: number) => {
        const currentCredits = get().credits;
        set(() => ({ credits: currentCredits + _amount }));
      },
      clearCredits: () => set(() => ({ credits: 0, initialized: false })),
      syncCredits: async () => {
        try {
          const creditsResponse = await getUserCredits();
          set({ credits: creditsResponse.data.credits, initialized: true });
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

// Convenience, non-hook helpers for imperative access
export const getCredits = () => useCreditStore.getState().credits;
export const setCreditsValue = (value: number) => useCreditStore.getState().setCredits(value);
export const addCreditsValue = (value: number) => useCreditStore.getState().addCredits(value);
export const deductCreditsValue = (value: number) => useCreditStore.getState().deductCredits(value);
export const clearCreditsValue = () => useCreditStore.getState().clearCredits();
export const syncCreditsValue = () => useCreditStore.getState().syncCredits();
