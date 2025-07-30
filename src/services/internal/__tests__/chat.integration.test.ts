import { createAssistant } from '@/services/external/openai/assistant';
import { createThread as createOpenAIThread } from '@/services/external/openai/threads';
import { generateThreadTitle as generateOpenAITitle } from '@/services/external/openai/title-generator';
import { createVectorStore } from '@/services/external/openai/vector-store';
import {
  cleanupDatabase,
  createTestPersona,
  createTestThread,
  createTestUser,
  testPrisma,
} from '../../../test/setup';
import {
  deleteThreadService,
  getThreadWithMessages,
  getUserThreads,
  restoreThreadService,
} from '../chat';

// Mock the external OpenAI services
jest.mock('@/services/external/openai/assistant', () => ({
  createAssistant: jest.fn(),
  updateAssistant: jest.fn(),
}));

jest.mock('@/services/external/openai/vector-store', () => ({
  createVectorStore: jest.fn(),
}));

jest.mock('@/services/external/openai/threads', () => ({
  createThread: jest.fn(),
  addMessageToThread: jest.fn(),
  getThreadMessages: jest.fn(),
  runAssistant: jest.fn(),
  streamAssistantResponse: jest.fn(),
  getThread: jest.fn(),
  deleteThread: jest.fn(),
}));

jest.mock('@/services/external/openai/messages', () => ({
  streamAssistantRun: jest.fn(),
}));

jest.mock('@/services/external/openai/title-generator', () => ({
  generateThreadTitle: jest.fn(),
}));

const mockCreateAssistant = createAssistant as jest.MockedFunction<typeof createAssistant>;
const mockCreateVectorStore = createVectorStore as jest.MockedFunction<typeof createVectorStore>;
const mockCreateOpenAIThread = createOpenAIThread as jest.MockedFunction<typeof createOpenAIThread>;
const mockGenerateOpenAITitle = generateOpenAITitle as jest.MockedFunction<
  typeof generateOpenAITitle
>;

describe('Chat Service - End-to-End Tests', () => {
  let testUser: any;
  let testPersona: any;

  beforeEach(async () => {
    await cleanupDatabase();
    testUser = await createTestUser();
    testPersona = await createTestPersona(testUser.id, {
      name: 'Test Assistant',
      description: 'A helpful test assistant',
      instructions: 'You are a helpful test assistant.',
      tags: ['test', 'assistant'],
      openaiAssistantId: 'asst_test123',
    });

    // Setup mocks for external services
    mockCreateVectorStore.mockResolvedValue({
      success: true,
      data: { id: 'vs_test123' },
    });
    mockCreateAssistant.mockResolvedValue({
      success: true,
      data: {
        id: 'asst_test123',
        created_at: new Date().getTime(),
        description: 'Test Description',
        instructions: 'Test Instructions',
        metadata: {},
        model: 'gpt-4',
        name: 'Test Persona',
        object: 'assistant',
        tools: [],
      },
    });
    mockCreateOpenAIThread.mockResolvedValue({
      success: true,
      data: {
        id: 'thread_openai_123',
        created_at: new Date().getTime(),
        metadata: {},
        object: 'thread',
        tool_resources: null,
      },
    });
    mockGenerateOpenAITitle.mockResolvedValue({
      success: true,
      data: 'Test Thread Title',
    });
  });

  describe('Thread Management', () => {
    it('should create a thread and retrieve it successfully', async () => {
      // Create a thread
      const thread = await createTestThread(testUser.id, testPersona.id, {
        title: 'Test Thread',
        openaiThreadId: 'thread_openai_123',
      });

      // Get user threads
      const threadsResult = await getUserThreads(testUser.id, testPrisma);
      expect(threadsResult.success).toBe(true);
      expect(threadsResult.data).toHaveLength(1);
      expect(threadsResult.data![0].id).toBe(thread.id);
      expect(threadsResult.data![0].title).toBe('Test Thread');
      expect(threadsResult.data![0].persona?.id).toBe(testPersona.id);
    });

    it('should return empty array when user has no threads', async () => {
      const result = await getUserThreads(testUser.id, testPrisma);
      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('should not return threads from other users', async () => {
      // Create another user
      const otherUser = await createTestUser();
      const otherPersona = await createTestPersona(otherUser.id, {
        name: 'Other Assistant',
        openaiAssistantId: 'asst_other123',
      });

      // Create thread for other user
      await createTestThread(otherUser.id, otherPersona.id, {
        title: 'Other User Thread',
        openaiThreadId: 'thread_other_123',
      });

      // Get threads for first user
      const result = await getUserThreads(testUser.id, testPrisma);
      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('should get thread with messages successfully', async () => {
      // Create a thread
      const thread = await createTestThread(testUser.id, testPersona.id, {
        title: 'Test Thread',
        openaiThreadId: 'thread_openai_123',
      });

      // Get thread with messages
      const result = await getThreadWithMessages(testUser.id, thread.id, testPrisma);
      expect(result.success).toBe(true);
      expect(result.data?.id).toBe(thread.id);
      expect(result.data?.title).toBe('Test Thread');
      expect(result.data?.persona?.id).toBe(testPersona.id);
      expect(result.data?.messages).toEqual([]);
    });

    it('should return error when thread not found', async () => {
      const result = await getThreadWithMessages(testUser.id, 99999, testPrisma);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });

    it('should return error when user does not own thread', async () => {
      // Create another user
      const otherUser = await createTestUser();
      const otherPersona = await createTestPersona(otherUser.id, {
        name: 'Other Assistant',
        openaiAssistantId: 'asst_other123',
      });

      // Create thread for other user
      const thread = await createTestThread(otherUser.id, otherPersona.id, {
        title: 'Other User Thread',
        openaiThreadId: 'thread_other_123',
      });

      // Try to access thread from first user
      const result = await getThreadWithMessages(testUser.id, thread.id, testPrisma);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });
  });

  describe('Thread Deletion', () => {
    it('should delete thread successfully', async () => {
      // Create a thread
      const thread = await createTestThread(testUser.id, testPersona.id, {
        title: 'Test Thread',
        openaiThreadId: 'thread_openai_123',
      });

      // Verify thread exists
      let threadsResult = await getUserThreads(testUser.id, testPrisma);
      expect(threadsResult.success).toBe(true);
      expect(threadsResult.data).toHaveLength(1);

      // Delete thread
      const deleteResult = await deleteThreadService(testUser.id, thread.id, testPrisma);
      expect(deleteResult.success).toBe(true);
      expect(deleteResult.data).toBe(true);

      // Verify thread is no longer returned
      threadsResult = await getUserThreads(testUser.id, testPrisma);
      expect(threadsResult.success).toBe(true);
      expect(threadsResult.data).toEqual([]);

      // Verify thread cannot be accessed
      const getResult = await getThreadWithMessages(testUser.id, thread.id, testPrisma);
      expect(getResult.success).toBe(false);
      expect(getResult.error).toBe('Thread not found or access denied');
    });

    it('should return error when deleting non-existent thread', async () => {
      const result = await deleteThreadService(testUser.id, 99999, testPrisma);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });

    it('should return error when user does not own thread', async () => {
      // Create another user
      const otherUser = await createTestUser();
      const otherPersona = await createTestPersona(otherUser.id, {
        name: 'Other Assistant',
        openaiAssistantId: 'asst_other123',
      });

      // Create thread for other user
      const thread = await createTestThread(otherUser.id, otherPersona.id, {
        title: 'Other User Thread',
        openaiThreadId: 'thread_other_123',
      });

      // Try to delete thread from first user
      const result = await deleteThreadService(testUser.id, thread.id, testPrisma);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });

    it('should delete thread with messages', async () => {
      // Create a thread
      const thread = await createTestThread(testUser.id, testPersona.id, {
        title: 'Test Thread',
        openaiThreadId: 'thread_openai_123',
      });

      // Add some messages to the thread
      await testPrisma.message.createMany({
        data: [
          {
            threadId: thread.id,
            role: 'user',
            content: 'Hello',
          },
          {
            threadId: thread.id,
            role: 'assistant',
            content: 'Hi there! How can I help you?',
          },
        ],
      });

      // Verify messages exist
      const messagesBefore = await testPrisma.message.findMany({
        where: { threadId: thread.id, deletedAt: null },
      });
      expect(messagesBefore).toHaveLength(2);

      // Delete thread
      const deleteResult = await deleteThreadService(testUser.id, thread.id, testPrisma);
      expect(deleteResult.success).toBe(true);

      // Verify messages are also deleted (soft delete)
      const messagesAfter = await testPrisma.message.findMany({
        where: { threadId: thread.id, deletedAt: null },
      });
      expect(messagesAfter).toHaveLength(0);
    });
  });

  describe('Thread Restoration', () => {
    it('should restore deleted thread successfully', async () => {
      // Create a thread
      const thread = await createTestThread(testUser.id, testPersona.id, {
        title: 'Test Thread',
        openaiThreadId: 'thread_openai_123',
      });

      // Add some messages
      await testPrisma.message.createMany({
        data: [
          {
            threadId: thread.id,
            role: 'user',
            content: 'Hello',
          },
          {
            threadId: thread.id,
            role: 'assistant',
            content: 'Hi there!',
          },
        ],
      });

      // Delete thread
      await deleteThreadService(testUser.id, thread.id, testPrisma);

      // Verify thread is deleted
      let threadsResult = await getUserThreads(testUser.id, testPrisma);
      expect(threadsResult.data).toEqual([]);

      // Restore thread
      const restoreResult = await restoreThreadService(testUser.id, thread.id, testPrisma);
      expect(restoreResult.success).toBe(true);
      expect(restoreResult.data).toBe(true);

      // Verify thread is restored
      threadsResult = await getUserThreads(testUser.id, testPrisma);
      expect(threadsResult.success).toBe(true);
      expect(threadsResult.data).toHaveLength(1);
      expect(threadsResult.data![0].id).toBe(thread.id);

      // Verify messages are also restored
      const messages = await testPrisma.message.findMany({
        where: { threadId: thread.id, deletedAt: null },
      });
      expect(messages).toHaveLength(2);
    });

    it('should return error when restoring non-existent thread', async () => {
      const result = await restoreThreadService(testUser.id, 99999, testPrisma);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });

    it('should return error when user does not own thread', async () => {
      // Create another user
      const otherUser = await createTestUser();
      const otherPersona = await createTestPersona(otherUser.id, {
        name: 'Other Assistant',
        openaiAssistantId: 'asst_other123',
      });

      // Create thread for other user
      const thread = await createTestThread(otherUser.id, otherPersona.id, {
        title: 'Other User Thread',
        openaiThreadId: 'thread_other_123',
      });

      // Try to restore thread from first user
      const result = await restoreThreadService(testUser.id, thread.id, testPrisma);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });
  });

  describe('Multiple Threads Management', () => {
    it('should handle multiple threads per user', async () => {
      // Create multiple threads
      const thread1 = await createTestThread(testUser.id, testPersona.id, {
        title: 'Thread 1',
        openaiThreadId: 'thread_1_123',
      });

      const thread2 = await createTestThread(testUser.id, testPersona.id, {
        title: 'Thread 2',
        openaiThreadId: 'thread_2_123',
      });

      const thread3 = await createTestThread(testUser.id, testPersona.id, {
        title: 'Thread 3',
        openaiThreadId: 'thread_3_123',
      });

      // Get all threads
      const result = await getUserThreads(testUser.id, testPrisma);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(3);

      // Delete one thread
      await deleteThreadService(testUser.id, thread2.id, testPrisma);

      // Verify only 2 threads remain
      const resultAfterDelete = await getUserThreads(testUser.id, testPrisma);
      expect(resultAfterDelete.success).toBe(true);
      expect(resultAfterDelete.data).toHaveLength(2);
      expect(resultAfterDelete.data!.map(t => t.id)).toContain(thread1.id);
      expect(resultAfterDelete.data!.map(t => t.id)).toContain(thread3.id);
      expect(resultAfterDelete.data!.map(t => t.id)).not.toContain(thread2.id);
    });

    it('should maintain thread isolation between users', async () => {
      // Create another user
      const otherUser = await createTestUser();
      const otherPersona = await createTestPersona(otherUser.id, {
        name: 'Other Assistant',
        openaiAssistantId: 'asst_other123',
      });

      // Create threads for both users
      await createTestThread(testUser.id, testPersona.id, {
        title: 'User 1 Thread',
        openaiThreadId: 'thread_user1_123',
      });

      await createTestThread(otherUser.id, otherPersona.id, {
        title: 'User 2 Thread',
        openaiThreadId: 'thread_user2_123',
      });

      // Verify each user only sees their own threads
      const user1Threads = await getUserThreads(testUser.id, testPrisma);
      const user2Threads = await getUserThreads(otherUser.id, testPrisma);

      expect(user1Threads.success).toBe(true);
      expect(user1Threads.data).toHaveLength(1);
      expect(user1Threads.data![0].title).toBe('User 1 Thread');

      expect(user2Threads.success).toBe(true);
      expect(user2Threads.data).toHaveLength(1);
      expect(user2Threads.data![0].title).toBe('User 2 Thread');
    });
  });
});
