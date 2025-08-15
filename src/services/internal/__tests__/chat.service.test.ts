import {
  deleteThreadService,
  generateThreadTitle,
  getThreadWithMessages,
  getUserThreads,
  restoreThreadService,
} from '@/services/internal/chat';

import {
  deleteThread,
  findByIdWithMessages,
  findByUserAndId,
  findByUserAndIdIncludingDeleted,
  findByUserId,
  restoreThread,
} from '@/services/repositories/thread';

import {
  deleteMessagesByThreadId,
  restoreMessagesByThreadId,
} from '@/services/repositories/message';

// Mock the repository functions
jest.mock('@/services/repositories/thread', () => ({
  deleteThread: jest.fn(),
  findByIdWithMessages: jest.fn(),
  findByUserAndId: jest.fn(),
  findByUserAndIdIncludingDeleted: jest.fn(),
  findByUserId: jest.fn(),
  restoreThread: jest.fn(),
}));

jest.mock('@/services/repositories/message', () => ({
  deleteMessagesByThreadId: jest.fn(),
  restoreMessagesByThreadId: jest.fn(),
}));

const mockDeleteMessagesByThreadId = deleteMessagesByThreadId as jest.MockedFunction<
  typeof deleteMessagesByThreadId
>;
const mockDeleteThread = deleteThread as jest.MockedFunction<typeof deleteThread>;
const mockFindByIdWithMessages = findByIdWithMessages as jest.MockedFunction<
  typeof findByIdWithMessages
>;
const mockFindByUserAndId = findByUserAndId as jest.MockedFunction<typeof findByUserAndId>;
const mockFindByUserAndIdIncludingDeleted = findByUserAndIdIncludingDeleted as jest.MockedFunction<
  typeof findByUserAndIdIncludingDeleted
>;
const mockFindByUserId = findByUserId as jest.MockedFunction<typeof findByUserId>;
const mockRestoreMessagesByThreadId = restoreMessagesByThreadId as jest.MockedFunction<
  typeof restoreMessagesByThreadId
>;
const mockRestoreThread = restoreThread as jest.MockedFunction<typeof restoreThread>;

describe('Chat Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateThreadTitle', () => {
    it('should generate a title from a simple message', () => {
      const title = generateThreadTitle('Hello, how are you?');
      expect(title).toBe('Hello, how are you?');
    });

    it('should truncate very long messages', () => {
      const longMessage =
        'This is a very long message that should be truncated because it exceeds the maximum length of 50 characters';
      const title = generateThreadTitle(longMessage);
      expect(title).toBe('This is a very long message that should be trun...');
      expect(title.length).toBe(50);
    });

    it('should handle empty messages gracefully', () => {
      const title = generateThreadTitle('');
      expect(title).toBe('New Conversation');
    });

    it('should handle single word messages', () => {
      const title = generateThreadTitle('Hi');
      expect(title).toBe('Hi');
    });

    it('should generate consistent titles for the same input', () => {
      const message = 'Test message';
      const title1 = generateThreadTitle(message);
      const title2 = generateThreadTitle(message);
      expect(title1).toBe(title2);
    });

    it('should extract meaningful words from the message', () => {
      const title = generateThreadTitle('What is the weather like today?');
      expect(title).toBe('What is the weather like today?');
    });

    it('should handle special characters and numbers', () => {
      const title = generateThreadTitle('Hello! How are you doing? 123');
      expect(title).toBe('Hello! How are you doing? 123');
    });

    it('should create different titles for different messages', () => {
      const title1 = generateThreadTitle('Hello');
      const title2 = generateThreadTitle('Goodbye');
      expect(title1).not.toBe(title2);
    });
  });

  describe('getUserThreads', () => {
    it('should return user threads successfully', async () => {
      const mockThreads = [
        {
          id: 1,
          userId: 1,
          personaId: 1,
          title: 'Test Thread 1',
          openaiThreadId: 'thread_123',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          persona: {
            id: 1,
            name: 'Test Persona',
            description: 'Test Description',
            instructions: 'Test Instructions',
            tags: [],
            logo: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            userId: 1,
            openaiAssistantId: 'asst_123',
            vectorStoreId: 'vs_123',
            knowledgeBaseId: null,
          },
        },
      ];

      mockFindByUserId.mockResolvedValue(mockThreads);

      const result = await getUserThreads(1);

      expect(mockFindByUserId).toHaveBeenCalledWith(1, undefined);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockThreads);
    });

    it('should handle fetch failure', async () => {
      mockFindByUserId.mockRejectedValue(new Error('Database error'));

      const result = await getUserThreads(1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to fetch user threads');
    });

    it('should return empty array when user has no threads', async () => {
      mockFindByUserId.mockResolvedValue([]);

      const result = await getUserThreads(1);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });
  });

  describe('getThreadWithMessages', () => {
    it('should return thread with messages when user owns it', async () => {
      const mockThread = {
        id: 1,
        userId: 1,
        personaId: 1,
        title: 'Test Thread',
        openaiThreadId: 'thread_123',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        messages: [
          {
            id: 1,
            threadId: 1,
            role: 'user',
            content: 'Hello',
            timestamp: new Date(),
            deletedAt: null,
            openaiMessageId: 'msg_123',
            citations: null,
          },
        ],
        persona: {
          id: 1,
          name: 'Test Persona',
          description: 'Test Description',
          instructions: 'Test Instructions',
          tags: [],
          logo: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          userId: 1,
          openaiAssistantId: 'asst_123',
          vectorStoreId: 'vs_123',
          knowledgeBaseId: null,
        },
      };

      mockFindByUserAndId.mockResolvedValue(mockThread);
      mockFindByIdWithMessages.mockResolvedValue(mockThread);

      const result = await getThreadWithMessages(1, 1);

      expect(mockFindByUserAndId).toHaveBeenCalledWith(1, 1, undefined);
      expect(mockFindByIdWithMessages).toHaveBeenCalledWith(1, undefined);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockThread);
    });

    it('should return error when thread not found', async () => {
      mockFindByUserAndId.mockResolvedValue(null);

      const result = await getThreadWithMessages(1, 999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });

    it('should return error when user does not own thread', async () => {
      mockFindByUserAndId.mockResolvedValue(null);

      const result = await getThreadWithMessages(1, 1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });

    it('should handle fetch failure', async () => {
      mockFindByUserAndId.mockRejectedValue(new Error('Database error'));

      const result = await getThreadWithMessages(1, 1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to fetch thread');
    });
  });

  describe('deleteThreadService', () => {
    it('should delete thread successfully when user owns it', async () => {
      const mockThread = {
        id: 1,
        userId: 1,
        personaId: 1,
        title: 'Test Thread',
        openaiThreadId: 'thread_123',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockFindByUserAndId.mockResolvedValue(mockThread);
      mockDeleteMessagesByThreadId.mockResolvedValue();
      mockDeleteThread.mockResolvedValue();

      const result = await deleteThreadService(1, 1);

      expect(mockFindByUserAndId).toHaveBeenCalledWith(1, 1, undefined);
      expect(mockDeleteMessagesByThreadId).toHaveBeenCalledWith(1, undefined);
      expect(mockDeleteThread).toHaveBeenCalledWith(1, undefined);
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    });

    it('should return error when thread not found', async () => {
      mockFindByUserAndId.mockResolvedValue(null);

      const result = await deleteThreadService(1, 999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });

    it('should return error when user does not own thread', async () => {
      mockFindByUserAndId.mockResolvedValue(null);

      const result = await deleteThreadService(1, 1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });

    it('should handle deletion failure', async () => {
      const mockThread = {
        id: 1,
        userId: 1,
        personaId: 1,
        title: 'Test Thread',
        openaiThreadId: 'thread_123',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockFindByUserAndId.mockResolvedValue(mockThread);
      mockDeleteMessagesByThreadId.mockRejectedValue(new Error('Database error'));

      const result = await deleteThreadService(1, 1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to delete thread');
    });
  });

  describe('restoreThreadService', () => {
    it('should restore thread successfully when user owns it', async () => {
      const mockThread = {
        id: 1,
        userId: 1,
        personaId: 1,
        title: 'Test Thread',
        openaiThreadId: 'thread_123',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(), // Thread is currently deleted
      };

      mockFindByUserAndIdIncludingDeleted.mockResolvedValue(mockThread);
      mockRestoreMessagesByThreadId.mockResolvedValue();
      mockRestoreThread.mockResolvedValue(mockThread);

      const result = await restoreThreadService(1, 1);

      expect(mockFindByUserAndIdIncludingDeleted).toHaveBeenCalledWith(1, 1, undefined);
      expect(mockRestoreMessagesByThreadId).toHaveBeenCalledWith(1, undefined);
      expect(mockRestoreThread).toHaveBeenCalledWith(1, undefined);
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    });

    it('should return error when thread not found', async () => {
      mockFindByUserAndIdIncludingDeleted.mockResolvedValue(null);

      const result = await restoreThreadService(1, 999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });

    it('should return error when user does not own thread', async () => {
      mockFindByUserAndIdIncludingDeleted.mockResolvedValue(null);

      const result = await restoreThreadService(1, 1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });

    it('should handle restoration failure', async () => {
      const mockThread = {
        id: 1,
        userId: 1,
        personaId: 1,
        title: 'Test Thread',
        openaiThreadId: 'thread_123',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      mockFindByUserAndIdIncludingDeleted.mockResolvedValue(mockThread);
      mockRestoreMessagesByThreadId.mockRejectedValue(new Error('Database error'));

      const result = await restoreThreadService(1, 1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to restore thread');
    });
  });
});
