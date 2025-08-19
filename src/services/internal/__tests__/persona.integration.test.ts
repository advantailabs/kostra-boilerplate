import { createAssistant, updateAssistant } from '@/services/external/openai/assistant';
import { createVectorStore } from '@/services/external/openai/vector-store';

import {
  cleanupDatabase,
  createTestPersona,
  createTestUser,
  testPrisma,
} from '../../../test/setup';
import {
  createPersonaService,
  deactivatePersonaService,
  getPersonaByIdService,
  getUserPersonasService,
  updatePersonaService,
} from '../persona';

// Mock the external OpenAI services
jest.mock('@/services/external/openai/assistant', () => ({
  createAssistant: jest.fn(),
  updateAssistant: jest.fn(),
}));

jest.mock('@/services/external/openai/vector-store', () => ({
  createVectorStore: jest.fn(),
}));

// Mock the KnowledgeBase repository functions
jest.mock('@/services/repositories/knowledge-base', () => ({
  createKnowledgeBase: jest.fn().mockImplementation(async data => {
    // Actually create a knowledge base record in the test database
    const knowledgeBase = await testPrisma.knowledgeBase.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description,
        metadata: data.metadata || {},
        vectorStoreId: data.vectorStoreId,
      },
    });
    return {
      success: true,
      data: knowledgeBase,
    };
  }),
  findKnowledgeBaseById: jest.fn(),
  findKnowledgeBasesByUserId: jest.fn(),
  updateKnowledgeBase: jest.fn(),
  deleteKnowledgeBase: jest.fn(),
  addFileToKnowledgeBase: jest.fn(),
  removeFileFromKnowledgeBase: jest.fn(),
  getKnowledgeBaseFiles: jest.fn(),
}));

const mockCreateAssistant = createAssistant as jest.MockedFunction<typeof createAssistant>;
const mockCreateVectorStore = createVectorStore as jest.MockedFunction<typeof createVectorStore>;
const mockUpdateAssistant = updateAssistant as jest.MockedFunction<typeof updateAssistant>;

const maybeDescribe = process.env.SKIP_DB_SETUP === '1' ? describe.skip : describe;

maybeDescribe('Persona Service - End-to-End Tests', () => {
  let testUser: any;

  beforeEach(async () => {
    await cleanupDatabase();
    testUser = await createTestUser();

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
    mockUpdateAssistant.mockResolvedValue({
      success: true,
      data: {
        id: 'asst_test123',
        created_at: new Date().getTime(),
        description: 'Updated Description',
        instructions: 'Updated Instructions',
        metadata: {},
        model: 'gpt-4',
        name: 'Updated Name',
        object: 'assistant',
        tools: [],
      },
    });
  });

  describe('createPersonaService', () => {
    it('should create a new persona successfully', async () => {
      const personaData = {
        userId: testUser.id,
        name: 'Test Assistant',
        description: 'A helpful test assistant',
        instructions: 'You are a helpful test assistant.',
        tags: ['test', 'assistant'],
      };

      const result = await createPersonaService(testUser.id, personaData, testPrisma);

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        name: personaData.name,
        description: personaData.description,
        instructions: personaData.instructions,
        tags: personaData.tags,
        userId: testUser.id,
      });

      // Verify in database
      const dbPersona = await testPrisma.persona.findUnique({
        where: { id: result.data?.id },
      });
      expect(dbPersona).toBeTruthy();
      expect(dbPersona?.name).toBe(personaData.name);
    });

    it('should trim whitespace from fields', async () => {
      const personaData = {
        userId: testUser.id,
        name: '  Test Assistant  ',
        description: '  A helpful test assistant  ',
        instructions: '  You are a helpful test assistant.  ',
        tags: ['  test  ', '  assistant  '],
      };

      const result = await createPersonaService(testUser.id, personaData, testPrisma);

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe('Test Assistant');
      expect(result.data?.description).toBe('A helpful test assistant');
      expect(result.data?.instructions).toBe('You are a helpful test assistant.');
      expect(result.data?.tags).toEqual(['test', 'assistant']);
    });

    it('should handle creation without tags', async () => {
      const personaData = {
        userId: testUser.id,
        name: 'No Tags Assistant',
        description: 'An assistant with no tags',
        instructions: 'You are an assistant with no tags.',
        tags: [],
      };

      const result = await createPersonaService(testUser.id, personaData, testPrisma);

      expect(result.success).toBe(true);
      expect(result.data?.tags).toEqual([]);
    });
  });

  describe('getUserPersonasService', () => {
    it('should return all active personas for a user', async () => {
      // Create multiple personas
      const persona1 = await createTestPersona(testUser.id, {
        name: 'Assistant 1',
        description: 'First assistant',
        instructions: 'You are the first assistant.',
        tags: ['first'],
      });

      const persona2 = await createTestPersona(testUser.id, {
        name: 'Assistant 2',
        description: 'Second assistant',
        instructions: 'You are the second assistant.',
        tags: ['second'],
      });

      // Create a soft-deleted persona (should not be returned)
      await createTestPersona(testUser.id, {
        name: 'Deleted Assistant',
        description: 'A deleted assistant',
        instructions: 'You are deleted.',
        tags: ['deleted'],
        deletedAt: new Date(),
      });

      const result = await getUserPersonasService(testUser.id, testPrisma);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: persona1.id,
            name: 'Assistant 1',
          }),
          expect.objectContaining({
            id: persona2.id,
            name: 'Assistant 2',
          }),
        ])
      );
    });

    it('should return empty array when user has no personas', async () => {
      const result = await getUserPersonasService(testUser.id, testPrisma);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('should not return personas from other users', async () => {
      // Create another user
      const otherUser = await createTestUser({
        clerkUserId: 'other_clerk_user_456',
        email: 'other@example.com',
        name: 'Other User',
      });

      // Create persona for other user
      await createTestPersona(otherUser.id, {
        name: 'Other User Assistant',
      });

      // Create persona for test user
      await createTestPersona(testUser.id, {
        name: 'Test User Assistant',
      });

      const result = await getUserPersonasService(testUser.id, testPrisma);

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0].name).toBe('Test User Assistant');
    });
  });

  describe('getPersonaByIdService', () => {
    it('should return persona by ID', async () => {
      const persona = await createTestPersona(testUser.id, {
        name: 'Test Assistant',
        description: 'A test assistant',
        instructions: 'You are a test assistant.',
        tags: ['test'],
      });

      const result = await getPersonaByIdService(persona.id, testPrisma);

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        id: persona.id,
        name: 'Test Assistant',
        description: 'A test assistant',
        instructions: 'You are a test assistant.',
        tags: ['test'],
      });
    });

    it('should return error for non-existent persona', async () => {
      const result = await getPersonaByIdService(99999, testPrisma);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Persona not found');
    });

    it('should return error for soft-deleted persona', async () => {
      const persona = await createTestPersona(testUser.id, {
        name: 'Deleted Assistant',
        deletedAt: new Date(),
      });

      const result = await getPersonaByIdService(persona.id, testPrisma);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Persona not found');
    });
  });

  describe('updatePersonaService', () => {
    let testPersona: any;

    beforeEach(async () => {
      testPersona = await createTestPersona(testUser.id, {
        name: 'Original Assistant',
        description: 'Original description',
        instructions: 'Original instructions.',
        tags: ['original'],
      });
    });

    it('should update persona successfully', async () => {
      const updateData = {
        name: 'Updated Assistant',
        description: 'Updated description',
        instructions: 'Updated instructions.',
        tags: ['updated', 'modified'],
      };

      const result = await updatePersonaService(
        testUser.id,
        testPersona.id,
        updateData,
        testPrisma
      );

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        id: testPersona.id,
        name: 'Updated Assistant',
        description: 'Updated description',
        instructions: 'Updated instructions.',
        tags: ['updated', 'modified'],
      });

      // Verify in database
      const dbPersona = await testPrisma.persona.findUnique({
        where: { id: testPersona.id },
      });
      expect(dbPersona?.name).toBe('Updated Assistant');
    });

    it('should update only provided fields', async () => {
      const partialUpdate = {
        name: 'Partially Updated Assistant',
      };

      const result = await updatePersonaService(
        testUser.id,
        testPersona.id,
        partialUpdate,
        testPrisma
      );

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe('Partially Updated Assistant');
      expect(result.data?.description).toBe('Original description');
      expect(result.data?.instructions).toBe('Original instructions.');
      expect(result.data?.tags).toEqual(['original']);
    });

    it('should trim whitespace from updated fields', async () => {
      const updateData = {
        name: '  Trimmed Name  ',
        description: '  Trimmed description  ',
      };

      const result = await updatePersonaService(
        testUser.id,
        testPersona.id,
        updateData,
        testPrisma
      );

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe('Trimmed Name');
      expect(result.data?.description).toBe('Trimmed description');
    });

    it('should return error when persona not found', async () => {
      const result = await updatePersonaService(
        testUser.id,
        99999,
        { name: 'Updated' },
        testPrisma
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Persona not found or access denied');
    });

    it('should return error when user does not own persona', async () => {
      const otherUser = await createTestUser({
        clerkUserId: 'other_user',
        email: 'other@example.com',
        name: 'Other User',
      });

      const result = await updatePersonaService(
        otherUser.id,
        testPersona.id,
        { name: 'Hacked' },
        testPrisma
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Persona not found or access denied');
    });
  });

  describe('deactivatePersonaService', () => {
    let testPersona: any;

    beforeEach(async () => {
      testPersona = await createTestPersona(testUser.id, {
        name: 'To Be Deleted',
        description: 'This persona will be deleted',
        instructions: 'You will be deleted.',
        tags: ['delete-me'],
      });
    });

    it('should soft delete persona successfully', async () => {
      const result = await deactivatePersonaService(testUser.id, testPersona.id, testPrisma);

      expect(result.success).toBe(true);

      // Verify persona is soft deleted
      const dbPersona = await testPrisma.persona.findUnique({
        where: { id: testPersona.id },
      });
      expect(dbPersona?.deletedAt).toBeTruthy();

      // Verify persona is not returned in active personas
      const activePersonas = await getUserPersonasService(testUser.id, testPrisma);
      expect(activePersonas.data).toHaveLength(0);
    });

    it('should return error when persona not found', async () => {
      const result = await deactivatePersonaService(testUser.id, 99999, testPrisma);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Persona not found or access denied');
    });

    it('should return error when user does not own persona', async () => {
      const otherUser = await createTestUser({
        clerkUserId: 'other_user',
        email: 'other@example.com',
        name: 'Other User',
      });

      const result = await deactivatePersonaService(otherUser.id, testPersona.id, testPrisma);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Persona not found or access denied');
    });

    it('should handle already deleted persona gracefully', async () => {
      // First deletion
      await deactivatePersonaService(testUser.id, testPersona.id, testPrisma);

      // Second deletion attempt
      const result = await deactivatePersonaService(testUser.id, testPersona.id, testPrisma);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Persona not found or access denied');
    });
  });
});
