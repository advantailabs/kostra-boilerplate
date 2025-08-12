import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface TitleGeneratorResult {
  success: boolean;
  data?: string;
  error?: string;
}

/**
 * Fallback title generation when OpenAI API fails
 * Extracts key words from the message and creates a title
 */
const generateFallbackTitle = (message: string): string => {
  // Clean and normalize the message
  const cleanMessage = message
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  // Split into words and filter out common words
  const words = cleanMessage.split(' ');
  const stopWords = new Set([
    'i',
    'me',
    'my',
    'myself',
    'we',
    'our',
    'ours',
    'ourselves',
    'you',
    'your',
    'yours',
    'yourself',
    'yourselves',
    'he',
    'him',
    'his',
    'himself',
    'she',
    'her',
    'hers',
    'herself',
    'it',
    'its',
    'itself',
    'they',
    'them',
    'their',
    'theirs',
    'themselves',
    'what',
    'which',
    'who',
    'whom',
    'this',
    'that',
    'these',
    'those',
    'am',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'having',
    'do',
    'does',
    'did',
    'doing',
    'a',
    'an',
    'the',
    'and',
    'but',
    'if',
    'or',
    'because',
    'as',
    'until',
    'while',
    'of',
    'at',
    'by',
    'for',
    'with',
    'through',
    'during',
    'before',
    'after',
    'above',
    'below',
    'up',
    'down',
    'in',
    'out',
    'on',
    'off',
    'over',
    'under',
    'again',
    'further',
    'then',
    'once',
    'can',
    'could',
    'should',
    'would',
    'will',
    'shall',
  ]);

  // Filter meaningful words
  const meaningfulWords = words.filter(word => word.length > 2 && !stopWords.has(word)).slice(0, 4); // Take first 4 meaningful words

  if (meaningfulWords.length === 0) {
    return 'New Conversation';
  }

  // Create title from meaningful words
  let title = meaningfulWords.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Ensure it fits within 30 characters
  if (title.length > 30) {
    title = `${title.substring(0, 27)}...`;
  }

  return title;
};

/**
 * Generates a concise thread title from a user message using OpenAI
 * Maximum 30 characters as specified
 */
export const generateThreadTitle = async (userMessage: string): Promise<TitleGeneratorResult> => {
  try {
    // Use Responses API for simple one-shot generation
    const response = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: `Generate a concise, descriptive title for a conversation thread based on the user's first message.

Requirements:
- Maximum 30 characters (STRICT LIMIT)
- Capture the main topic/intent
- Use title case
- No quotation marks
- Be specific and clear

Examples:
"How to cook pasta" → "Cooking Pasta Guide"
"I need help with my JavaScript code that handles user authentication" → "JS Auth Code Help"
"Can you explain quantum physics?" → "Quantum Physics Basics"

User message:
${userMessage}`,
      temperature: 0.3,
      max_output_tokens: 20,
    });

    const title = response.output_text?.trim();

    if (!title) {
      return {
        success: false,
        error: 'Failed to generate title from OpenAI response',
      };
    }

    // Ensure title doesn't exceed 30 characters
    const truncatedTitle = title.length > 30 ? `${title.substring(0, 27)}...` : title;

    return {
      success: true,
      data: truncatedTitle,
    };
  } catch (error) {
    console.error('Error generating thread title:', error);

    // Fallback: Generate a simple title from the message
    const fallbackTitle = generateFallbackTitle(userMessage);

    return {
      success: true,
      data: fallbackTitle,
    };
  }
};
