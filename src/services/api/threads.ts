import axiosInstance from '@/lib/axios';
import {
  AddMessageRequest,
  CreateThreadRequest,
  PublicCitationFile,
  ThreadWithMessages,
} from '@/types/chat';
import { Thread } from '@prisma/client';

export interface StreamMessageResponse {
  type: 'chunk' | 'completed' | 'error' | 'thread_created';
  content?: string;
  messageId?: string | null;
  fullContent?: string;
  error?: string;
  runId?: string;
  threadId?: number;
  citations?: PublicCitationFile[];
}

export interface ThreadsApiClient {
  getThreadsPaginated(_params: { limit: number; offset: number }): Promise<{
    threads: Thread[];
    pagination: { limit: number; offset: number; hasMore: boolean };
  }>;
  getThread(_id: number): Promise<ThreadWithMessages>;
  createThreadStreaming(_data: CreateThreadRequest): AsyncGenerator<StreamMessageResponse>;
  addMessageStreaming(
    _threadId: number,
    _data: AddMessageRequest
  ): AsyncGenerator<StreamMessageResponse>;
  deleteThread(_id: number): Promise<void>;
}

export const threadsApi: ThreadsApiClient = {
  async getThreadsPaginated(params: { limit: number; offset: number }) {
    const response = await axiosInstance.get('/threads', { params });
    const { threads, pagination } = (response.data as any).data || {};
    return {
      threads: threads || [],
      pagination: pagination || {
        limit: params.limit,
        offset: params.offset,
        hasMore: (threads?.length || 0) === params.limit,
      },
    };
  },

  async getThread(id: number): Promise<ThreadWithMessages> {
    const response = await axiosInstance.get(`/threads/${id}`);
    const { thread } = (response.data as any).data || {};
    return thread;
  },

  async *createThreadStreaming(data: CreateThreadRequest): AsyncGenerator<StreamMessageResponse> {
    try {
      const response = await fetch('/api/threads/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create thread');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              yield data as StreamMessageResponse;

              if (data.type === 'completed' || data.type === 'error') {
                return;
              }
            } catch (e) {
              // Skip malformed JSON
              console.warn('Failed to parse streaming data:', e);
            }
          }
        }
      }
    } catch (error) {
      yield {
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async *addMessageStreaming(
    threadId: number,
    data: AddMessageRequest
  ): AsyncGenerator<StreamMessageResponse> {
    try {
      const response = await fetch(`/api/threads/${threadId}/messages/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              yield data as StreamMessageResponse;

              if (data.type === 'completed' || data.type === 'error') {
                return;
              }
            } catch (e) {
              // Skip malformed JSON
              console.warn('Failed to parse streaming data:', e);
            }
          }
        }
      }
    } catch (error) {
      yield {
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  async deleteThread(id: number): Promise<void> {
    await axiosInstance.delete(`/threads/${id}`);
  },
};
