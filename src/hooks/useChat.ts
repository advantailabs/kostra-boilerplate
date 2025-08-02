import { threadsApi } from '@/services/api/threads';
import {
  AddMessageRequest,
  CreateThreadRequest,
  PublicCitationFile,
  ThreadWithMessages,
} from '@/types/chat';
import { Message } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

export function useChat(threadId?: number) {
  const queryClient = useQueryClient();
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [createdThreadId, setCreatedThreadId] = useState<number | null>(null);
  const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
  const [currentCitations, setCurrentCitations] = useState<PublicCitationFile[]>([]);
  const [localThread, setLocalThread] = useState<ThreadWithMessages | null>(null);
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

  // Update local thread state when data is fetched
  useEffect(() => {
    if (thread) {
      setLocalThread(thread);
    }
  }, [thread]);

  // Use local thread state if available, otherwise use fetched thread
  const activeThread = localThread || thread;

  // Combine actual thread messages with pending messages
  const messagesWithPending = activeThread ? [...activeThread.messages, ...pendingMessages] : [];

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
    const optimisticMessage = {
      id: Date.now(), // Temporary ID
      content: data.content,
      role: 'user',
      threadId,
      timestamp: new Date(),
      openaiMessageId: null,
      deletedAt: null,
      citations: null,
    } as any;

    // Add optimistic message to pending messages
    setPendingMessages(prev => [...prev, optimisticMessage]);

    setIsStreaming(true);
    setStreamingMessage('');
    setCurrentCitations([]);

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

            // Store citations for the completed message
            if (response.citations) {
              setCurrentCitations(response.citations);
            }

            // Create the completed assistant message
            const completedAssistantMessage = {
              id: Date.now() + 1, // Temporary ID
              content: response.fullContent || '',
              role: 'assistant',
              threadId,
              timestamp: new Date(),
              openaiMessageId: response.messageId || null,
              deletedAt: null,
              citations: response.citations ? JSON.stringify(response.citations) : null,
            } as any;

            // Update local thread state by adding the new messages
            setLocalThread(prevThread => {
              if (!prevThread) return prevThread;

              return {
                ...prevThread,
                messages: [...prevThread.messages, optimisticMessage, completedAssistantMessage],
              };
            });

            // Clear citations after adding to thread
            setCurrentCitations([]);

            // Invalidate threads list to update thread list
            queryClient.invalidateQueries({ queryKey: ['threads'] });
            break;

          case 'error':
            console.error('Streaming error:', response.error);
            setStreamingMessage('');
            setIsStreaming(false);
            setPendingMessages([]); // Clear pending messages on error
            setCurrentCitations([]);
            throw new Error(response.error || 'Streaming failed');
        }
      }
    } catch (error) {
      console.error('Error in streaming:', error);
      setStreamingMessage('');
      setIsStreaming(false);
      setPendingMessages([]);
      setCurrentCitations([]);
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
    thread: activeThread ? { ...activeThread, messages: messagesWithPending } : null,
    isLoading,
    error,
    refetch,
    addMessageStreaming,
    createThreadStreaming,
    isStreaming,
    streamingMessage,
    createdThreadId,
    stopStreaming,
    currentCitations,
  };
}
