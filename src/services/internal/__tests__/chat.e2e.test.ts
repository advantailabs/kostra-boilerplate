import { cleanupDatabase, createTestUser, testPrisma } from '../../../test/setup';
import {
  deleteThreadService,
  generateThreadTitle,
  getThreadWithMessages,
  getUserThreads,
} from '../chat';

describe('Chat Service - End-to-End Tests', () => {
  let testUser: any;

  beforeEach(async () => {
    await cleanupDatabase();
    testUser = await createTestUser();
  });

  describe('generateThreadTitle', () => {
    it('should return message as title if short enough', () => {
      const shortMessage = 'Hello world';
      const title = generateThreadTitle(shortMessage);
      expect(title).toBe('Hello world');
    });

    it('should truncate long messages', () => {
      const longMessage =
        'This is a very long message that should be truncated to fit within the title length limit';
      const title = generateThreadTitle(longMessage);
      expect(title).toBe('This is a very long message that should be trun...');
      expect(title.length).toBe(50);
    });

    it('should handle empty messages', () => {
      const title = generateThreadTitle('');
      expect(title).toBe('New Conversation');
    });

    it('should handle whitespace-only messages', () => {
      const title = generateThreadTitle('   \n\t  ');
      expect(title).toBe('New Conversation');
    });
  });

  describe('getUserThreads', () => {
    it('should return empty array when user has no threads', async () => {
      const result = await getUserThreads(testUser.id, testPrisma);
      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });
  });

  describe('getThreadWithMessages', () => {
    it('should return error when thread not found', async () => {
      const result = await getThreadWithMessages(testUser.id, 99999, testPrisma);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });
  });

  describe('deleteThreadService', () => {
    it('should return error when thread not found', async () => {
      const result = await deleteThreadService(testUser.id, 99999, testPrisma);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Thread not found or access denied');
    });
  });
});
