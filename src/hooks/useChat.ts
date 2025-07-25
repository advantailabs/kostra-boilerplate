import { threadsApi } from '@/services/api/threads';
import { AddMessageRequest, CreateThreadRequest } from '@/types/chat';
import { Message } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';

export function useChat(threadId?: number) {
  const queryClient = useQueryClient();
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [createdThreadId, setCreatedThreadId] = useState<number | null>(null);
  const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
  const streamAbortRef = useRef<AbortController | null>(null);

  const {
    data: thread,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['thread', threadId],
    queryFn: () => threadsApi.getThread(threadId!),
    enabled: !!threadId,
  });

  // Combine actual thread messages with pending messages
  const messagesWithPending = thread ? [...thread.messages, ...pendingMessages] : [];

  const createThreadStreaming = async (data: CreateThreadRequest) => {
    setIsStreaming(true);
    setStreamingMessage('');
    setCreatedThreadId(null);

    // Create abort controller for this stream
    streamAbortRef.current = new AbortController();

    let newThreadId: number | null = null;

    try {
      const streamGenerator = threadsApi.createThreadStreaming(data);

      for await (const response of streamGenerator) {
        // Check if streaming was aborted
        if (streamAbortRef.current?.signal.aborted) {
          break;
        }

        switch (response.type) {
          case 'thread_created':
            if ('threadId' in response) {
              const threadId = response.threadId as number;
              setCreatedThreadId(threadId);
              newThreadId = threadId;
            }
            break;

          case 'chunk':
            if (response.content) {
              setStreamingMessage(prev => prev + response.content);
            }
            break;

          case 'completed':
            // Stream completed successfully
            setStreamingMessage('');
            setIsStreaming(false);
            setPendingMessages([]); // Clear pending messages

            // Refresh the threads list and set active thread
            queryClient.invalidateQueries({ queryKey: ['threads'] });
            if (newThreadId) {
              queryClient.invalidateQueries({ queryKey: ['thread', newThreadId] });
            }

            return newThreadId;

          case 'error':
            console.error('Streaming error:', response.error);
            setStreamingMessage('');
            setIsStreaming(false);
            setPendingMessages([]); // Clear pending messages on error
            throw new Error(response.error || 'Streaming failed');
        }
      }
    } catch (error) {
      setStreamingMessage('');
      setIsStreaming(false);
      setPendingMessages([]); // Clear pending messages on error
      throw error;
    }

    // Fallback: return whatever newThreadId was set to (could be null)
    return newThreadId;
  };

  const addMessageStreaming = async (data: AddMessageRequest) => {
    if (!threadId) throw new Error('No thread selected');

    // Create optimistic user message
    const optimisticMessage: Message = {
      id: Date.now(), // Temporary ID
      content: data.content,
      role: 'user',
      threadId,
      timestamp: new Date(),
      openaiMessageId: null,
    };

    // Add optimistic message to pending messages
    setPendingMessages(prev => [...prev, optimisticMessage]);

    setIsStreaming(true);
    setStreamingMessage('');

    // Create abort controller for this stream
    streamAbortRef.current = new AbortController();

    try {
      const streamGenerator = threadsApi.addMessageStreaming(threadId, data);

      for await (const response of streamGenerator) {
        // Check if streaming was aborted
        if (streamAbortRef.current?.signal.aborted) {
          break;
        }

        switch (response.type) {
          case 'chunk':
            if (response.content) {
              setStreamingMessage(prev => prev + response.content);
            }
            break;

          case 'completed':
            // Stream completed successfully
            setStreamingMessage('');
            setIsStreaming(false);
            setPendingMessages([]); // Clear pending messages

            // Refresh the thread to get the complete message
            queryClient.invalidateQueries({ queryKey: ['thread', threadId] });
            queryClient.invalidateQueries({ queryKey: ['threads'] });
            break;

          case 'error':
            console.error('Streaming error:', response.error);
            setStreamingMessage('');
            setIsStreaming(false);
            setPendingMessages([]); // Clear pending messages on error
            throw new Error(response.error || 'Streaming failed');
        }
      }
    } catch (error) {
      setStreamingMessage('');
      setIsStreaming(false);
      setPendingMessages([]); // Clear pending messages on error
      throw error;
    }
  };

  const stopStreaming = () => {
    if (streamAbortRef.current) {
      streamAbortRef.current.abort();
      setIsStreaming(false);
      setStreamingMessage('');
      setPendingMessages([]); // Clear pending messages
    }
  };

  return {
    thread: thread ? { ...thread, messages: messagesWithPending } : null,
    isLoading,
    error,
    refetch,
    addMessageStreaming,
    createThreadStreaming,
    isStreaming,
    streamingMessage,
    createdThreadId,
    stopStreaming,
  };
}
