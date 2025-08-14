import { useCallback } from 'react';

import { CREDIT_THRESHOLDS } from '@/data/config/plans';
import { CREDIT_COSTS } from '@/lib/constants/credits';
import { type SmartSearchRequest } from '@/services/api/search';
import { deductCreditsValue, getCredits, setCreditsValue, syncCreditsValue } from '@/store/credits';
import { openCreditPurchase } from '@/store/ui/modals';

import { useSmartSearch } from './useSearch';

export function useSmartSearchWithCredits() {
  const searchHook = useSmartSearch();
  // Use non-hook helpers for imperative access

  const searchWithCredits = useCallback(
    async (data: SmartSearchRequest) => {
      // Guard: require minimum credits to run search
      const currentCredits = getCredits();
      if (currentCredits < CREDIT_THRESHOLDS.searchChatMin) {
        openCreditPurchase();
        throw new Error('Insufficient credits to search.');
      }
      // Determine credit cost based on mode
      const isQA = data.mode === 'smart-qa';
      const creditCost = isQA ? CREDIT_COSTS.SMART_QA : CREDIT_COSTS.SMART_SEARCH;

      // Optimistically deduct credits
      const previousCredits = getCredits();
      deductCreditsValue(creditCost);

      try {
        const result = await searchHook.search(data);

        // Sync credits from server after successful operation
        setTimeout(() => {
          syncCreditsValue();
        }, 1000);

        return result;
      } catch (error) {
        // Revert optimistic update on error
        // Restore to exact previous credits to avoid drift
        setCreditsValue(previousCredits);
        throw error;
      }
    },
    [searchHook.search]
  );

  return {
    search: searchWithCredits,
    isPending: searchHook.isPending,
  };
}
