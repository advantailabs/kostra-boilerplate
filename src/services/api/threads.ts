import axiosInstance from '@/lib/axios';
import { AddMessageRequest, CreateThreadRequest, ThreadWithMessages } from '@/types/chat';
import { Message, Thread } from '@prisma/client';

export interface ThreadsApiClient {
  getThreads(): Promise<Thread[]>;
  getThread(_id: number): Promise<ThreadWithMessages>;
  createThread(_data: CreateThreadRequest): Promise<Thread>;
  addMessage(_threadId: number, _data: AddMessageRequest): Promise<Message>;
  deleteThread(_id: number): Promise<void>;
}

export const threadsApi: ThreadsApiClient = {
  async getThreads(): Promise<Thread[]> {
    const response = await axiosInstance.get('/threads');
    const { threads } = response.data;
    return threads || [];
  },

  async getThread(id: number): Promise<ThreadWithMessages> {
    const response = await axiosInstance.get(`/threads/${id}`);
    const { thread } = response.data;
    return thread;
  },

  async createThread(data: CreateThreadRequest): Promise<Thread> {
    const response = await axiosInstance.post('/threads', data);
    const { thread } = response.data;
    return thread;
  },

  async addMessage(threadId: number, data: AddMessageRequest): Promise<Message> {
    const response = await axiosInstance.post(`/threads/${threadId}/messages`, data);
    const { message } = response.data;
    return message;
  },

  async deleteThread(id: number): Promise<void> {
    await axiosInstance.delete(`/threads/${id}`);
  },
};
