import { useCallback } from 'react';

import { CREDIT_COSTS } from '@/lib/constants/credits';
import { useCreditStore } from '@/store/credits';
import { AddMessageRequest, CreateThreadRequest } from '@/types/chat';

import { useChat } from './useChat';

export function useChatWithCredits(threadId?: number) {
  const chatHook = useChat(threadId);
  const { deductCredits, addCredits, syncCredits } = useCreditStore();

  const createThreadStreamingWithCredits = useCallback(
    async (data: CreateThreadRequest) => {
      // Optimistically deduct credits
      deductCredits(CREDIT_COSTS.CHAT);

      try {
        const result = await chatHook.createThreadStreaming(data);

        // Sync credits from server after successful operation
        setTimeout(() => {
          syncCredits();
        }, 1000);

        return result;
      } catch (error) {
        // Revert optimistic update on error
        addCredits(CREDIT_COSTS.CHAT);
        throw error;
      }
    },
    [chatHook.createThreadStreaming, deductCredits, addCredits, syncCredits]
  );

  const addMessageStreamingWithCredits = useCallback(
    async (data: AddMessageRequest) => {
      // Optimistically deduct credits
      deductCredits(CREDIT_COSTS.CHAT);

      try {
        const result = await chatHook.addMessageStreaming(data);

        // Sync credits from server after successful operation
        setTimeout(() => {
          syncCredits();
        }, 1000);

        return result;
      } catch (error) {
        // Revert optimistic update on error
        addCredits(CREDIT_COSTS.CHAT);
        throw error;
      }
    },
    [chatHook.addMessageStreaming, deductCredits, addCredits, syncCredits]
  );

  return {
    ...chatHook,
    createThreadStreaming: createThreadStreamingWithCredits,
    addMessageStreaming: addMessageStreamingWithCredits,
  };
}
