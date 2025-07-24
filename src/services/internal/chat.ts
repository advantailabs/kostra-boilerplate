import { PrismaClient } from '@prisma/client';

import { createMessage, deleteMessagesByThreadId } from '@/services/repositories/message';
import { findPersonaByUserAndId } from '@/services/repositories/persona';
import {
  createThread,
  deleteThread,
  findByIdWithMessages,
  findByUserAndId,
  findByUserId,
  updateThreadTimestamp,
} from '@/services/repositories/thread';
import { MockResponseContext, ThreadWithMessages, ThreadWithPersona } from '@/types/chat';

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

const generateMockResponse = async (context: MockResponseContext): Promise<string> => {
  const { persona, userMessage, conversationHistory } = context;

  // Simulate API delay (1-2 seconds)
  await new Promise<void>(resolve => {
    setTimeout(() => resolve(), 1000 + Math.random() * 1000);
  });

  // Generate contextual mock response based on persona
  const responses = [
    `Based on my role as "${persona.name}", I understand you're asking about: "${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}". ${persona.instructions.substring(0, 100)}${persona.instructions.length > 100 ? '...' : ''}`,

    `As ${persona.name}, I'd like to help with your question. ${persona.description} Let me address your message about "${userMessage.substring(0, 30)}${userMessage.length > 30 ? '...' : ''}"...`,

    `Thank you for your message. As described in my persona: "${persona.description.substring(0, 80)}${persona.description.length > 80 ? '...' : ''}" I can help you with this topic.`,

    `I see you mentioned "${userMessage.substring(0, 40)}${userMessage.length > 40 ? '...' : ''}". Given my instructions to ${persona.instructions.substring(0, 60)}${persona.instructions.length > 60 ? '...' : ''}, here's my response...`,

    `${persona.name} here! Your message is interesting. Based on my guidance to "${persona.instructions.substring(0, 80)}${persona.instructions.length > 80 ? '...' : ''}", I think this relates to what you're asking.`,
  ];

  // Add conversation history context if available
  if (conversationHistory && conversationHistory.length > 0) {
    const historyResponses = [
      `Continuing our conversation, ${persona.name} noting your previous message. ${persona.description.substring(0, 50)}${persona.description.length > 50 ? '...' : ''}`,
      `Building on what we discussed earlier, and considering your latest question about "${userMessage.substring(0, 30)}${userMessage.length > 30 ? '...' : ''}".`,
    ];
    responses.push(...historyResponses);
  }

  return responses[Math.floor(Math.random() * responses.length)];
};

const createThreadWithMessage = async (
  userId: number,
  personaId: number,
  initialMessage: string,
  prisma?: PrismaClient
): Promise<ChatServiceResult<ThreadWithMessages>> => {
  try {
    // Verify persona exists and belongs to user
    const persona = await findPersonaByUserAndId(userId, personaId, prisma);

    if (!persona) {
      return {
        success: false,
        error: 'Persona not found',
      };
    }

    // Generate title from message
    const title = generateThreadTitle(initialMessage);

    // Create thread
    const thread = await createThread(
      {
        userId,
        personaId,
        title,
      },
      prisma
    );

    // Create initial user message
    await createMessage(
      {
        threadId: thread.id,
        role: 'user',
        content: initialMessage,
      },
      prisma
    );

    // Generate and create assistant response
    const assistantResponse = await generateMockResponse({
      persona,
      userMessage: initialMessage,
      conversationHistory: [],
    });

    await createMessage(
      {
        threadId: thread.id,
        role: 'assistant',
        content: assistantResponse,
      },
      prisma
    );

    // Return thread with messages
    const threadWithMessages = await findByIdWithMessages(thread.id, prisma);

    return {
      success: true,
      data: threadWithMessages!,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create thread with message',
    };
  }
};

const addMessageToThread = async (
  userId: number,
  threadId: number,
  messageContent: string,
  prisma?: PrismaClient
): Promise<ChatServiceResult<ThreadWithMessages>> => {
  try {
    // Verify thread exists and belongs to user
    const thread = await findByUserAndId(userId, threadId, prisma);

    if (!thread) {
      return {
        success: false,
        error: 'Thread not found or access denied',
      };
    }

    // Get thread with messages to access persona and conversation history
    const threadWithMessages = await findByIdWithMessages(threadId, prisma);

    if (!threadWithMessages) {
      return {
        success: false,
        error: 'Thread not found or access denied',
      };
    }

    // Create user message
    await createMessage(
      {
        threadId,
        role: 'user',
        content: messageContent,
      },
      prisma
    );

    // Generate assistant response
    const assistantResponse = await generateMockResponse({
      persona: threadWithMessages.persona!,
      userMessage: messageContent,
      conversationHistory: threadWithMessages.messages,
    });

    // Create assistant message
    await createMessage(
      {
        threadId,
        role: 'assistant',
        content: assistantResponse,
      },
      prisma
    );

    // Update thread timestamp
    await updateThreadTimestamp(threadId, prisma);

    // Return updated thread with messages
    const updatedThread = await findByIdWithMessages(threadId, prisma);

    return {
      success: true,
      data: updatedThread!,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to add message to thread',
    };
  }
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

    // Delete all messages in the thread first
    await deleteMessagesByThreadId(threadId, prisma);

    // Delete the thread
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

export {
  addMessageToThread,
  createThreadWithMessage,
  deleteThreadService,
  generateMockResponse,
  generateThreadTitle,
  getThreadWithMessages,
  getUserThreads,
};
