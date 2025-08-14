import { useCallback } from 'react';

import { CREDIT_COSTS } from '@/lib/constants/credits';
import { type SmartSearchRequest } from '@/services/api/search';
import { useCreditStore } from '@/store/credits';

import { useSmartSearch } from './useSearch';

export function useSmartSearchWithCredits() {
  const searchHook = useSmartSearch();
  const { deductCredits, addCredits, syncCredits } = useCreditStore();

  const searchWithCredits = useCallback(
    async (data: SmartSearchRequest) => {
      // Determine credit cost based on mode
      const isQA = data.mode === 'smart-qa';
      const creditCost = isQA ? CREDIT_COSTS.SMART_QA : CREDIT_COSTS.SMART_SEARCH;

      // Optimistically deduct credits
      deductCredits(creditCost);

      try {
        const result = await searchHook.search(data);

        // Sync credits from server after successful operation
        setTimeout(() => {
          syncCredits();
        }, 1000);

        return result;
      } catch (error) {
        // Revert optimistic update on error
        addCredits(creditCost);
        throw error;
      }
    },
    [searchHook.search, deductCredits, addCredits, syncCredits]
  );

  return {
    search: searchWithCredits,
    isPending: searchHook.isPending,
  };
}
