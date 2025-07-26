import { PrismaClient } from '@prisma/client';

import {
  deleteMessagesByThreadId,
  restoreMessagesByThreadId,
} from '@/services/repositories/message';
import {
  deleteThread,
  findByIdWithMessages,
  findByUserAndId,
  findByUserId,
  restoreThread,
} from '@/services/repositories/thread';
import { ThreadWithMessages, ThreadWithPersona } from '@/types/chat';

export interface ChatServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const generateThreadTitle = (firstMessage: string): string => {
  const cleanMessage = firstMessage.trim();

  if (!cleanMessage) {
    return 'New Conversation';
  }

  if (cleanMessage.length <= 50) {
    return cleanMessage;
  }
  return `${cleanMessage.substring(0, 47)}...`;
};

const getUserThreads = async (
  userId: number,
  prisma?: PrismaClient
): Promise<ChatServiceResult<ThreadWithPersona[]>> => {
  try {
    const threads = await findByUserId(userId, prisma);
    return {
      success: true,
      data: threads,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch user threads',
    };
  }
};

const getThreadWithMessages = async (
  userId: number,
  threadId: number,
  prisma?: PrismaClient
): Promise<ChatServiceResult<ThreadWithMessages>> => {
  try {
    // Verify thread belongs to user
    const thread = await findByUserAndId(userId, threadId, prisma);

    if (!thread) {
      return {
        success: false,
        error: 'Thread not found or access denied',
      };
    }

    const threadWithMessages = await findByIdWithMessages(threadId, prisma);

    return {
      success: true,
      data: threadWithMessages!,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch thread',
    };
  }
};

const deleteThreadService = async (
  userId: number,
  threadId: number,
  prisma?: PrismaClient
): Promise<ChatServiceResult<boolean>> => {
  try {
    // Verify thread exists and belongs to user
    const thread = await findByUserAndId(userId, threadId, prisma);

    if (!thread) {
      return {
        success: false,
        error: 'Thread not found or access denied',
      };
    }

    // Soft delete all messages in the thread first
    await deleteMessagesByThreadId(threadId, prisma);

    // Soft delete the thread
    await deleteThread(threadId, prisma);

    return {
      success: true,
      data: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to delete thread',
    };
  }
};

const restoreThreadService = async (
  userId: number,
  threadId: number,
  prisma?: PrismaClient
): Promise<ChatServiceResult<boolean>> => {
  try {
    // Verify thread exists and belongs to user (check even deleted threads)
    const thread = await findByUserAndId(userId, threadId, prisma);

    if (!thread) {
      return {
        success: false,
        error: 'Thread not found or access denied',
      };
    }

    // Restore all messages in the thread first
    await restoreMessagesByThreadId(threadId, prisma);

    // Restore the thread
    await restoreThread(threadId, prisma);

    return {
      success: true,
      data: true,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to restore thread',
    };
  }
};

export {
  deleteThreadService,
  generateThreadTitle,
  getThreadWithMessages,
  getUserThreads,
  restoreThreadService,
};
