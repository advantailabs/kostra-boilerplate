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
      `Continuing our conversation, I remember we were discussing similar topics. As ${persona.name}, let me build on our previous exchange...`,
      `Given our conversation history and my role as ${persona.name}, I can provide more context to your latest message...`,
      `This connects well with what we discussed earlier. As outlined in my persona instructions, I can help expand on this...`,
    ];

    if (Math.random() > 0.5) {
      responses.push(...historyResponses);
    }
  }

  // Select random response
  const selectedResponse = responses[Math.floor(Math.random() * responses.length)];

  return selectedResponse;
};

const createThreadWithMessage = async (
  userId: number,
  personaId: number,
  content: string
): Promise<ChatServiceResult<ThreadWithMessages>> => {
  try {
    // Verify persona belongs to user
    const persona = await findPersonaByUserAndId(userId, personaId);
    if (!persona) {
      return {
        success: false,
        error: 'Persona not found or access denied',
      };
    }

    // Generate thread title from first message
    const title = generateThreadTitle(content);

    // Create thread
    const thread = await createThread({
      userId,
      personaId,
      title,
    });

    // Create user message
    await createMessage({
      threadId: thread.id,
      role: 'user',
      content,
    });

    // Generate mock response
    const mockContext: MockResponseContext = {
      persona,
      userMessage: content,
    };

    const responseContent = await generateMockResponse(mockContext);

    // Create assistant message
    await createMessage({
      threadId: thread.id,
      role: 'assistant',
      content: responseContent,
    });

    // Get complete thread with messages
    const threadWithMessages = await findByIdWithMessages(thread.id);

    if (!threadWithMessages) {
      throw new Error('Failed to retrieve created thread');
    }

    return {
      success: true,
      data: threadWithMessages,
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
  content: string
): Promise<ChatServiceResult<ThreadWithMessages>> => {
  try {
    // Verify thread belongs to user
    const thread = await findByUserAndId(userId, threadId);
    if (!thread) {
      return {
        success: false,
        error: 'Thread not found or access denied',
      };
    }

    // Get thread with persona for mock response
    const threadWithMessages = await findByIdWithMessages(threadId);
    if (!threadWithMessages || !threadWithMessages.persona) {
      return {
        success: false,
        error: 'Thread or persona not found',
      };
    }

    // Create user message
    await createMessage({
      threadId,
      role: 'user',
      content,
    });

    // Generate mock response with conversation history
    const mockContext: MockResponseContext = {
      persona: threadWithMessages.persona,
      userMessage: content,
      conversationHistory: threadWithMessages.messages,
    };

    const responseContent = await generateMockResponse(mockContext);

    // Create assistant message
    await createMessage({
      threadId,
      role: 'assistant',
      content: responseContent,
    });

    // Update thread timestamp
    await updateThreadTimestamp(threadId);

    // Get updated thread with messages
    const updatedThread = await findByIdWithMessages(threadId);

    if (!updatedThread) {
      throw new Error('Failed to retrieve updated thread');
    }

    return {
      success: true,
      data: updatedThread,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to add message to thread',
    };
  }
};

const getUserThreads = async (userId: number): Promise<ChatServiceResult<ThreadWithPersona[]>> => {
  try {
    const threads = await findByUserId(userId);
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
  threadId: number
): Promise<ChatServiceResult<ThreadWithMessages>> => {
  try {
    // Verify thread belongs to user
    const thread = await findByUserAndId(userId, threadId);
    if (!thread) {
      return {
        success: false,
        error: 'Thread not found or access denied',
      };
    }

    const threadWithMessages = await findByIdWithMessages(threadId);
    if (!threadWithMessages) {
      return {
        success: false,
        error: 'Thread not found',
      };
    }

    return {
      success: true,
      data: threadWithMessages,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to fetch thread with messages',
    };
  }
};

const deleteThreadService = async (
  userId: number,
  threadId: number
): Promise<ChatServiceResult<void>> => {
  try {
    // Verify thread belongs to user
    const thread = await findByUserAndId(userId, threadId);
    if (!thread) {
      return {
        success: false,
        error: 'Thread not found or access denied',
      };
    }

    // Delete all messages in thread first
    await deleteMessagesByThreadId(threadId);

    // Delete thread
    await deleteThread(threadId);

    return {
      success: true,
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
