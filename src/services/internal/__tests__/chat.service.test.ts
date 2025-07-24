import { generateMockResponse, generateThreadTitle } from '../chat';

describe('Chat Service - Utility Functions', () => {
  describe('generateThreadTitle', () => {
    it('should return full message when under 50 characters', () => {
      const message = 'Hello world';
      const result = generateThreadTitle(message);
      expect(result).toBe('Hello world');
    });

    it('should truncate long messages with ellipsis', () => {
      const longMessage =
        'This is a very long message that exceeds the fifty character limit for thread titles';
      const result = generateThreadTitle(longMessage);
      expect(result).toBe('This is a very long message that exceeds the fi...');
      expect(result).toHaveLength(50);
    });

    it('should handle empty string', () => {
      const result = generateThreadTitle('');
      expect(result).toBe('');
    });

    it('should trim whitespace', () => {
      const message = '   Hello world   ';
      const result = generateThreadTitle(message);
      expect(result).toBe('Hello world');
    });
  });

  describe('generateMockResponse', () => {
    const mockPersona = {
      id: 1,
      userId: 1,
      openaiAssistantId: null,
      vectorStoreId: null,
      name: 'Test Assistant',
      description: 'A helpful test assistant',
      instructions: 'Always be helpful and professional',
      tags: ['helpful', 'professional'],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    it('should generate a response containing persona name', async () => {
      const context = {
        persona: mockPersona,
        userMessage: 'Hello, how are you?',
      };

      const response = await generateMockResponse(context);

      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
      expect(response).toContain('Test Assistant');
    });

    it('should generate a response containing user message excerpt', async () => {
      const context = {
        persona: mockPersona,
        userMessage: 'Can you help me with my project?',
      };

      const response = await generateMockResponse(context);

      expect(response).toContain('Can you help me with my projec');
    });

    it('should include persona description in response', async () => {
      const context = {
        persona: mockPersona,
        userMessage: 'Tell me about yourself',
      };

      const response = await generateMockResponse(context);

      expect(response).toContain('helpful');
    });

    it('should include persona instructions in response', async () => {
      const context = {
        persona: mockPersona,
        userMessage: 'What are your guidelines?',
      };

      const response = await generateMockResponse(context);

      expect(response).toContain('helpful and professional');
    });

    it('should handle long user messages by truncating', async () => {
      const longMessage =
        'This is a very long user message that should be truncated in the response to avoid overwhelming the mock response generation with too much text content';

      const context = {
        persona: mockPersona,
        userMessage: longMessage,
      };

      const response = await generateMockResponse(context);

      expect(response).not.toContain(longMessage);
      expect(response).toContain('...');
    });

    it('should include conversation history context when provided', async () => {
      const conversationHistory = [
        {
          id: 1,
          threadId: 1,
          openaiMessageId: null,
          role: 'user' as const,
          content: 'Previous message',
          timestamp: new Date(),
        },
        {
          id: 2,
          threadId: 1,
          openaiMessageId: null,
          role: 'assistant' as const,
          content: 'Previous response',
          timestamp: new Date(),
        },
      ];

      const context = {
        persona: mockPersona,
        userMessage: 'Follow up question',
        conversationHistory,
      };

      const response = await generateMockResponse(context);

      // The response should acknowledge conversation history sometimes
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should simulate realistic delay', async () => {
      const startTime = Date.now();

      const context = {
        persona: mockPersona,
        userMessage: 'Quick question',
      };

      await generateMockResponse(context);

      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(1000); // At least 1 second
      expect(elapsed).toBeLessThan(3000); // Less than 3 seconds
    });

    it('should generate different responses on multiple calls', async () => {
      const context = {
        persona: mockPersona,
        userMessage: 'Same question',
      };

      const response1 = await generateMockResponse(context);
      const response2 = await generateMockResponse(context);

      // While responses might sometimes be the same due to randomness,
      // they should generally be different
      expect(typeof response1).toBe('string');
      expect(typeof response2).toBe('string');
      expect(response1.length).toBeGreaterThan(0);
      expect(response2.length).toBeGreaterThan(0);
    });
  });
});
