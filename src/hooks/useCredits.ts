import { useCallback } from 'react';

import { CREDIT_COSTS } from '@/lib/constants/credits';
import { useAuthStore } from '@/store/auth';
import { useCreditStore } from '@/store/credits';

export function useCredits() {
  const authUser = useAuthStore(state => state.user);
  const { credits, deductCredits, addCredits, syncCredits } = useCreditStore();

  const deductCreditOptimistic = useCallback(
    async (operation: 'CHAT' | 'SMART_SEARCH' | 'SMART_QA', onComplete?: () => void) => {
      const cost = CREDIT_COSTS[operation];

      // Optimistic update
      deductCredits(cost);

      try {
        // Call the operation
        if (onComplete) {
          await onComplete();
        }

        // Sync credits from server after successful operation
        setTimeout(() => {
          syncCredits();
        }, 1000);
      } catch (error) {
        // Revert optimistic update on error
        addCredits(cost);
        throw error;
      }
    },
    [deductCredits, addCredits, syncCredits]
  );

  const hasInsufficientCredits = useCallback(
    (operation: 'CHAT' | 'SMART_SEARCH' | 'SMART_QA') => {
      const cost = CREDIT_COSTS[operation];
      const currentCredits = authUser?.credits ?? credits;
      return currentCredits < cost;
    },
    [authUser?.credits, credits]
  );

  return {
    credits: authUser?.credits ?? credits,
    deductCreditOptimistic,
    hasInsufficientCredits,
    syncCredits,
  };
}
