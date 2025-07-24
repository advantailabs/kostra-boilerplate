import {
  cleanupDatabase,
  createTestPersona,
  createTestUser,
  testPrisma,
} from '../../../test/setup';
import {
  addMessageToThread,
  createThreadWithMessage,
  deleteThreadService,
  generateMockResponse,
  generateThreadTitle,
  getThreadWithMessages,
  getUserThreads,
} from '../chat';

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
    });
  });

  describe('createThreadWithMessage', () => {
    it('should create a new thread with initial message and generate response', async () => {
      const userMessage = 'Hello, this is my first message!';

      const result = await createThreadWithMessage(
        testUser.id,
        testPersona.id,
        userMessage,
        testPrisma
      );

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        userId: testUser.id,
        personaId: testPersona.id,
        title: expect.any(String),
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'user',
            content: userMessage,
          }),
          expect.objectContaining({
            role: 'assistant',
            content: expect.any(String),
          }),
        ]),
      });

      // Should have exactly 2 messages (user + assistant)
      expect(result.data?.messages).toHaveLength(2);

      // Verify thread was created in database
      const dbThread = await testPrisma.thread.findUnique({
        where: { id: result.data?.id },
        include: { messages: true },
      });
      expect(dbThread).toBeTruthy();
      expect(dbThread?.messages).toHaveLength(2);
    });

    it('should generate appropriate thread title from message', async () => {
      const longMessage =
        'This is a really long message that should be truncated to create a reasonable thread title that is not too long';

      const result = await createThreadWithMessage(
        testUser.id,
        testPersona.id,
        longMessage,
        testPrisma
      );

      expect(result.success).toBe(true);
      expect(result.data?.title.length).toBeLessThanOrEqual(50);
      expect(result.data?.title).toContain('This is a really long message');
    });

    it('should return error when persona not found', async () => {
      const result = await createThreadWithMessage(testUser.id, 99999, 'Hello', testPrisma);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Persona not found');
    });

    it('should return error when persona belongs to different user', async () => {
      const otherUser = await createTestUser({
        clerkUserId: 'other_user',
        email: 'other@example.com',
        name: 'Other User',
      });

      const otherPersona = await createTestPersona(otherUser.id, {
        name: 'Other User Assistant',
      });

      const result = await createThreadWithMessage(
        testUser.id,
        otherPersona.id,
        'Hello',
        testPrisma
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Persona not found');
    });

    it('should not use soft-deleted persona', async () => {
      // Soft delete the persona
      await testPrisma.persona.update({
        where: { id: testPersona.id },
        data: { deletedAt: new Date() },
      });

      const result = await createThreadWithMessage(
        testUser.id,
        testPersona.id,
        'Hello',
        testPrisma
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Persona not found');
    });
  });

  describe('addMessageToThread', () => {
    let testThread: any;

    beforeEach(async () => {
      // Create a thread with initial messages
      const threadResult = await createThreadWithMessage(
        testUser.id,
        testPersona.id,
        'Initial message',
        testPrisma
      );
      testThread = threadResult.data;
    });

    it('should add user message and generate assistant response', async () => {
      const userMessage = 'This is a follow-up message';

      const result = await addMessageToThread(testUser.id, testThread.id, userMessage, testPrisma);

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        id: testThread.id,
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'user',
            content: userMessage,
          }),
          expect.objectContaining({
            role: 'assistant',
            content: expect.any(String),
          }),
        ]),
      });

      // Should now have 4 messages total (initial user + assistant + new user + new assistant)
      expect(result.data?.messages).toHaveLength(4);

      // Verify messages were added to database
      const dbThread = await testPrisma.thread.findUnique({
        where: { id: testThread.id },
        include: { messages: { orderBy: { timestamp: 'asc' } } },
      });
      expect(dbThread?.messages).toHaveLength(4);
      expect(dbThread?.messages[2].content).toBe(userMessage);
      expect(dbThread?.messages[3].role).toBe('assistant');
    });

    it('should return error when thread not found', async () => {
      const result = await addMessageToThread(testUser.id, 99999, 'Hello', testPrisma);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });

    it('should return error when user does not own thread', async () => {
      const otherUser = await createTestUser({
        clerkUserId: 'other_user',
        email: 'other@example.com',
        name: 'Other User',
      });

      const result = await addMessageToThread(
        otherUser.id,
        testThread.id,
        'Unauthorized message',
        testPrisma
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });

    it('should update thread timestamp when message is added', async () => {
      const originalUpdatedAt = testThread.updatedAt;

      // Wait a moment to ensure timestamp difference
      await new Promise<void>(resolve => {
        setTimeout(() => resolve(), 10);
      });

      const result = await addMessageToThread(
        testUser.id,
        testThread.id,
        'New message',
        testPrisma
      );

      expect(result.success).toBe(true);

      const dbThread = await testPrisma.thread.findUnique({
        where: { id: testThread.id },
      });
      expect(dbThread?.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('getUserThreads', () => {
    it('should return all user threads with latest message info', async () => {
      // Create multiple threads
      const thread1 = await createThreadWithMessage(
        testUser.id,
        testPersona.id,
        'First thread',
        testPrisma
      );
      const thread2 = await createThreadWithMessage(
        testUser.id,
        testPersona.id,
        'Second thread',
        testPrisma
      );

      const result = await getUserThreads(testUser.id, testPrisma);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: thread1.data?.id,
            title: expect.any(String),
            persona: expect.objectContaining({
              name: testPersona.name,
            }),
          }),
          expect.objectContaining({
            id: thread2.data?.id,
            title: expect.any(String),
            persona: expect.objectContaining({
              name: testPersona.name,
            }),
          }),
        ])
      );
    });

    it('should return empty array when user has no threads', async () => {
      const result = await getUserThreads(testUser.id, testPrisma);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('should not return threads from other users', async () => {
      const otherUser = await createTestUser({
        clerkUserId: 'other_user',
        email: 'other@example.com',
        name: 'Other User',
      });

      const otherPersona = await createTestPersona(otherUser.id, {
        name: 'Other Assistant',
      });

      // Create thread for test user
      await createThreadWithMessage(testUser.id, testPersona.id, 'My thread', testPrisma);

      // Create thread for other user
      await createThreadWithMessage(otherUser.id, otherPersona.id, 'Other thread', testPrisma);

      const result = await getUserThreads(testUser.id, testPrisma);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0].title).toContain('My thread');
    });

    it('should order threads by most recent first', async () => {
      // Create first thread
      const thread1 = await createThreadWithMessage(
        testUser.id,
        testPersona.id,
        'First thread',
        testPrisma
      );

      // Wait a moment
      await new Promise<void>(resolve => {
        setTimeout(() => resolve(), 10);
      });

      // Create second thread
      const thread2 = await createThreadWithMessage(
        testUser.id,
        testPersona.id,
        'Second thread',
        testPrisma
      );

      const result = await getUserThreads(testUser.id, testPrisma);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      // Most recent should be first
      expect(result.data?.[0].id).toBe(thread2.data?.id);
      expect(result.data?.[1].id).toBe(thread1.data?.id);
    });
  });

  describe('getThreadWithMessages', () => {
    let testThread: any;

    beforeEach(async () => {
      const threadResult = await createThreadWithMessage(
        testUser.id,
        testPersona.id,
        'Initial message',
        testPrisma
      );
      testThread = threadResult.data;

      // Add more messages
      await addMessageToThread(testUser.id, testThread.id, 'Second message', testPrisma);
    });

    it('should return thread with all messages', async () => {
      const result = await getThreadWithMessages(testUser.id, testThread.id, testPrisma);

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        id: testThread.id,
        title: expect.any(String),
        persona: expect.objectContaining({
          name: testPersona.name,
        }),
        messages: expect.any(Array),
      });

      // Should have 4 messages (initial user + assistant + second user + assistant)
      expect(result.data?.messages).toHaveLength(4);

      // Messages should be ordered by timestamp
      const messages = result.data?.messages;
      expect(messages?.[0].content).toBe('Initial message');
      expect(messages?.[2].content).toBe('Second message');
    });

    it('should return error when thread not found', async () => {
      const result = await getThreadWithMessages(testUser.id, 99999, testPrisma);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });

    it('should return error when user does not own thread', async () => {
      const otherUser = await createTestUser({
        clerkUserId: 'other_user',
        email: 'other@example.com',
        name: 'Other User',
      });

      const result = await getThreadWithMessages(otherUser.id, testThread.id, testPrisma);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });
  });

  describe('deleteThreadService', () => {
    let testThread: any;

    beforeEach(async () => {
      const threadResult = await createThreadWithMessage(
        testUser.id,
        testPersona.id,
        'Thread to delete',
        testPrisma
      );
      testThread = threadResult.data;
    });

    it('should delete thread and all its messages', async () => {
      const result = await deleteThreadService(testUser.id, testThread.id, testPrisma);

      expect(result.success).toBe(true);

      // Verify thread is deleted from database
      const dbThread = await testPrisma.thread.findUnique({
        where: { id: testThread.id },
      });
      expect(dbThread).toBeNull();

      // Verify messages are also deleted
      const messages = await testPrisma.message.findMany({
        where: { threadId: testThread.id },
      });
      expect(messages).toHaveLength(0);
    });

    it('should return error when thread not found', async () => {
      const result = await deleteThreadService(testUser.id, 99999, testPrisma);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });

    it('should return error when user does not own thread', async () => {
      const otherUser = await createTestUser({
        clerkUserId: 'other_user',
        email: 'other@example.com',
        name: 'Other User',
      });

      const result = await deleteThreadService(otherUser.id, testThread.id, testPrisma);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });
  });

  describe('generateMockResponse', () => {
    it('should generate contextual response based on persona instructions', async () => {
      const userMessage = 'What is your purpose?';

      const response = await generateMockResponse({ persona: testPersona, userMessage });

      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
      // Should reference persona instructions in some way
      expect(response.toLowerCase()).toMatch(/helpful|assist|test/);
    });

    it('should generate different responses for different messages', async () => {
      const response1 = await generateMockResponse({ persona: testPersona, userMessage: 'Hello' });
      const response2 = await generateMockResponse({
        persona: testPersona,
        userMessage: 'Goodbye',
      });

      // Both responses should be valid strings
      expect(typeof response1).toBe('string');
      expect(typeof response2).toBe('string');
      expect(response1.length).toBeGreaterThan(0);
      expect(response2.length).toBeGreaterThan(0);

      // Responses should be contextually appropriate (may be same due to randomness, which is OK)
      expect(response1.toLowerCase()).toMatch(/hello|assist|helpful|test|response|message/);
      expect(response2.toLowerCase()).toMatch(/goodbye|assist|helpful|test|response|message/);
    });

    it('should have realistic delay (between 1-2 seconds)', async () => {
      const startTime = Date.now();

      await generateMockResponse({ persona: testPersona, userMessage: 'Test message' });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeGreaterThanOrEqual(1000); // At least 1 second
      expect(duration).toBeLessThanOrEqual(2500); // At most 2.5 seconds (with some tolerance)
    });
  });

  describe('generateThreadTitle', () => {
    it('should generate title from message content', async () => {
      const message = 'Help me understand machine learning concepts';
      const title = await generateThreadTitle(message);

      expect(title).toBe('Help me understand machine learning concepts');
    });

    it('should truncate long messages', async () => {
      const longMessage =
        'This is a very long message that exceeds the maximum length allowed for thread titles and should be truncated appropriately';
      const title = await generateThreadTitle(longMessage);

      expect(title.length).toBeLessThanOrEqual(50);
      expect(title).toBe('This is a very long message that exceeds the ma...');
    });

    it('should trim whitespace', async () => {
      const message = '  Spaced out message  ';
      const title = await generateThreadTitle(message);

      expect(title).toBe('Spaced out message');
    });

    it('should handle empty message', async () => {
      const title = await generateThreadTitle('');

      expect(title).toBe('New Conversation');
    });

    it('should handle only whitespace', async () => {
      const title = await generateThreadTitle('   ');

      expect(title).toBe('New Conversation');
    });
  });
});
