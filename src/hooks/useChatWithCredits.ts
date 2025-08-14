import { useCallback } from 'react';

import { CREDIT_THRESHOLDS } from '@/data/config/plans';
import { CREDIT_COSTS } from '@/lib/constants/credits';
import { deductCreditsValue, getCredits, setCreditsValue, syncCreditsValue } from '@/store/credits';
import { openCreditPurchase } from '@/store/ui/modals';
import { AddMessageRequest, CreateThreadRequest } from '@/types/chat';

import { useChat } from './useChat';

export function useChatWithCredits(threadId?: number) {
  const chatHook = useChat(threadId);
  // Using non-hook helpers for imperative access

  const createThreadStreamingWithCredits = useCallback(
    async (data: CreateThreadRequest) => {
      // Guard: require minimum credits to start chat
      const currentCredits = getCredits();
      if (currentCredits < CREDIT_THRESHOLDS.searchChatMin) {
        openCreditPurchase();
        throw new Error('Insufficient credits to chat.');
      }
      // Optimistically deduct credits, but save previous to restore on error
      const previousCredits = getCredits();
      deductCreditsValue(CREDIT_COSTS.CHAT);

      try {
        const result = await chatHook.createThreadStreaming(data);

        // Sync credits from server after successful operation
        setTimeout(() => {
          syncCreditsValue();
        }, 1000);

        return result;
      } catch (error) {
        // Revert to exact previous balance to avoid drift
        setCreditsValue(previousCredits);
        throw error;
      }
    },
    [chatHook.createThreadStreaming]
  );

  const addMessageStreamingWithCredits = useCallback(
    async (data: AddMessageRequest) => {
      // Guard: require minimum credits to send message
      const currentCredits = getCredits();
      if (currentCredits < CREDIT_THRESHOLDS.searchChatMin) {
        openCreditPurchase();
        throw new Error('Insufficient credits to chat.');
      }
      // Optimistically deduct credits, but save previous to restore on error
      const previousCredits = getCredits();
      deductCreditsValue(CREDIT_COSTS.CHAT);

      try {
        const result = await chatHook.addMessageStreaming(data);

        // Sync credits from server after successful operation
        setTimeout(() => {
          syncCreditsValue();
        }, 1000);

        return result;
      } catch (error) {
        // Revert to exact previous balance to avoid drift
        setCreditsValue(previousCredits);
        throw error;
      }
    },
    [chatHook.addMessageStreaming]
  );

  return {
    ...chatHook,
    createThreadStreaming: createThreadStreamingWithCredits,
    addMessageStreaming: addMessageStreamingWithCredits,
  };
}
