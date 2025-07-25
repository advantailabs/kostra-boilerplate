import { generateThreadTitle } from '../chat';

describe('Chat Service - Utility Functions', () => {
  describe('generateThreadTitle', () => {
    it('should generate a title from a simple message', () => {
      const message = 'How do I learn JavaScript?';
      const title = generateThreadTitle(message);

      expect(typeof title).toBe('string');
      expect(title.length).toBeGreaterThan(0);
      expect(title.length).toBeLessThanOrEqual(50); // Should be reasonably short
    });

    it('should truncate very long messages', () => {
      const longMessage =
        'This is a very long message that should be truncated when generating a title because it exceeds the reasonable length for a thread title and contains way too much information that would not be useful in a title format';
      const title = generateThreadTitle(longMessage);

      expect(title.length).toBeLessThanOrEqual(50);
      expect(title).toMatch(/\.\.\./); // Should contain ellipsis
    });

    it('should handle empty messages gracefully', () => {
      const title = generateThreadTitle('');

      expect(typeof title).toBe('string');
      expect(title.length).toBeGreaterThan(0);
    });

    it('should handle single word messages', () => {
      const title = generateThreadTitle('Hello');

      expect(typeof title).toBe('string');
      expect(title.toLowerCase()).toContain('hello');
    });

    it('should generate consistent titles for the same input', () => {
      const message = 'What is React?';
      const title1 = generateThreadTitle(message);
      const title2 = generateThreadTitle(message);

      expect(title1).toBe(title2);
    });

    it('should extract meaningful words from the message', () => {
      const message = 'I need help with my JavaScript async/await code';
      const title = generateThreadTitle(message);

      // Should contain meaningful words and not just articles/prepositions
      expect(title.toLowerCase()).toMatch(/javascript|async|await|code|help/);
    });

    it('should handle special characters and numbers', () => {
      const message = 'Error 404: API endpoint /users/123 not found!';
      const title = generateThreadTitle(message);

      expect(typeof title).toBe('string');
      expect(title.length).toBeGreaterThan(0);
    });

    it('should create different titles for different messages', () => {
      const title1 = generateThreadTitle('How to use React hooks?');
      const title2 = generateThreadTitle('What is Node.js?');

      expect(title1).not.toBe(title2);
      expect(title1.toLowerCase()).toMatch(/react|hooks/);
      expect(title2.toLowerCase()).toMatch(/node/);
    });
  });
});
