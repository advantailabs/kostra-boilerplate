import { createAssistant, createVectorStore } from '@/services/external/openai/assistant';

import {
  createPersonaService,
  deactivatePersonaService,
  getUserPersonasService,
  updatePersonaService,
} from '../persona';

import {
  createPersona,
  findActiveByUserId,
  findPersonaByUserAndId,
  softDeletePersona,
  updatePersona,
} from '../../repositories/persona';

// Mock the repository functions
jest.mock('../../repositories/persona', () => ({
  createPersona: jest.fn(),
  findActiveByUserId: jest.fn(),
  findPersonaByUserAndId: jest.fn(),
  updatePersona: jest.fn(),
  softDeletePersona: jest.fn(),
}));

// Mock the external OpenAI services
jest.mock('@/services/external/openai/assistant', () => ({
  createAssistant: jest.fn(),
  createVectorStore: jest.fn(),
  updateAssistant: jest.fn(),
}));

// Mock the KnowledgeBase repository functions
jest.mock('../../repositories/knowledge-base', () => ({
  createKnowledgeBase: jest.fn(),
  findKnowledgeBaseById: jest.fn(),
  findKnowledgeBasesByUserId: jest.fn(),
  updateKnowledgeBase: jest.fn(),
  deleteKnowledgeBase: jest.fn(),
  addFileToKnowledgeBase: jest.fn(),
  removeFileFromKnowledgeBase: jest.fn(),
  getKnowledgeBaseFiles: jest.fn(),
}));

const mockCreatePersona = createPersona as jest.MockedFunction<typeof createPersona>;
const mockFindActiveByUserId = findActiveByUserId as jest.MockedFunction<typeof findActiveByUserId>;
const mockFindPersonaByUserAndId = findPersonaByUserAndId as jest.MockedFunction<
  typeof findPersonaByUserAndId
>;
const mockUpdatePersona = updatePersona as jest.MockedFunction<typeof updatePersona>;
const mockSoftDeletePersona = softDeletePersona as jest.MockedFunction<typeof softDeletePersona>;

const mockCreateAssistant = createAssistant as jest.MockedFunction<typeof createAssistant>;
const mockCreateVectorStore = createVectorStore as jest.MockedFunction<typeof createVectorStore>;

describe('Persona Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPersonaService', () => {
    it('should create a persona successfully with trimmed data', async () => {
      const mockInputData = {
        userId: 1,
        name: '  Test Persona  ',
        description: '  Test Description  ',
        instructions: '  Test Instructions  ',
        tags: ['  tag1  ', '  tag2  '],
      };

      const mockCreatedPersona = {
        id: 1,
        userId: 1,
        openaiAssistantId: 'asst_test123',
        knowledgeBaseId: 1,
        name: 'Test Persona',
        description: 'Test Description',
        instructions: 'Test Instructions',
        tags: ['tag1', 'tag2'],
        logo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      // Mock external services
      mockCreateVectorStore.mockResolvedValue({
        success: true,
        data: { id: 'vs_test123' },
      });

      // Mock knowledge base creation
      const { createKnowledgeBase } = require('../../repositories/knowledge-base');
      createKnowledgeBase.mockResolvedValue({
        success: true,
        data: { id: 1 },
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
      mockCreatePersona.mockResolvedValue(mockCreatedPersona);

      const result = await createPersonaService(1, mockInputData);

      expect(mockCreateVectorStore).toHaveBeenCalledWith('Test Persona Knowledge Base');
      expect(mockCreateAssistant).toHaveBeenCalledWith({
        name: 'Test Persona',
        description: 'Test Description',
        instructions: 'Test Instructions',
        temperature: 0.3,
        tools: [{ type: 'code_interpreter' }, { type: 'file_search' }],
        tool_resources: {
          file_search: {
            vector_store_ids: ['vs_test123'],
          },
        },
      });
      expect(mockCreatePersona).toHaveBeenCalledWith(
        {
          userId: 1,
          name: 'Test Persona',
          description: 'Test Description',
          instructions: 'Test Instructions',
          tags: ['tag1', 'tag2'],
          logo: undefined,
          openaiAssistantId: 'asst_test123',
          knowledgeBaseId: 1, // This will be set by the service
        },
        undefined
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCreatedPersona);
    });

    it('should handle creation failure', async () => {
      const mockInputData = {
        userId: 1,
        name: 'Test Persona',
        description: 'Test Description',
        instructions: 'Test Instructions',
        tags: [],
      };

      // Mock external services to fail
      mockCreateVectorStore.mockResolvedValue({
        success: false,
        error: '401 Incorrect API key provided: sk-proj-**********************',
      });

      const result = await createPersonaService(1, mockInputData);

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        'Failed to create vector store: 401 Incorrect API key provided: sk-proj-**********************'
      );
    });
  });

  describe('getUserPersonasService', () => {
    it('should return user personas successfully', async () => {
      const mockPersonas = [
        {
          id: 1,
          userId: 1,
          name: 'Persona 1',
          description: 'Description 1',
          instructions: 'Instructions 1',
          tags: [],
          logo: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      mockFindActiveByUserId.mockResolvedValue(mockPersonas as any);

      const result = await getUserPersonasService(1);

      expect(mockFindActiveByUserId).toHaveBeenCalledWith(1, undefined);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockPersonas);
    });

    it('should handle fetch failure', async () => {
      mockFindActiveByUserId.mockRejectedValue(new Error('Database error'));

      const result = await getUserPersonasService(1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to fetch personas');
    });
  });

  describe('updatePersonaService', () => {
    it('should update persona successfully when user owns it', async () => {
      const mockExistingPersona = {
        id: 1,
        userId: 1,
        name: 'Original Name',
        description: 'Original Description',
        instructions: 'Original Instructions',
        tags: [],
        logo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const mockUpdateData = {
        name: '  Updated Name  ',
        description: '  Updated Description  ',
      };

      const mockUpdatedPersona = {
        ...mockExistingPersona,
        name: 'Updated Name',
        description: 'Updated Description',
      };

      mockFindPersonaByUserAndId.mockResolvedValue(mockExistingPersona as any);
      mockUpdatePersona.mockResolvedValue(mockUpdatedPersona as any);

      const result = await updatePersonaService(1, 1, mockUpdateData);

      expect(mockFindPersonaByUserAndId).toHaveBeenCalledWith(1, 1, undefined);
      expect(mockUpdatePersona).toHaveBeenCalledWith(
        1,
        {
          name: 'Updated Name',
          description: 'Updated Description',
        },
        undefined
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUpdatedPersona);
    });

    it('should fail when user does not own persona', async () => {
      mockFindPersonaByUserAndId.mockResolvedValue(null);

      const result = await updatePersonaService(1, 999, { name: 'Updated' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Persona not found or access denied');
    });
  });

  describe('deactivatePersonaService', () => {
    it('should deactivate persona successfully when user owns it', async () => {
      const mockExistingPersona = {
        id: 1,
        userId: 1,
        name: 'Test Persona',
        description: 'Test Description',
        instructions: 'Test Instructions',
        tags: [],
        logo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockFindPersonaByUserAndId.mockResolvedValue(mockExistingPersona as any);
      mockSoftDeletePersona.mockResolvedValue({
        ...mockExistingPersona,
        deletedAt: new Date(),
      } as any);

      const result = await deactivatePersonaService(1, 1);

      expect(mockFindPersonaByUserAndId).toHaveBeenCalledWith(1, 1, undefined);
      expect(mockSoftDeletePersona).toHaveBeenCalledWith(1, undefined);
      expect(result.success).toBe(true);
    });

    it('should fail when user does not own persona', async () => {
      mockFindPersonaByUserAndId.mockResolvedValue(null);

      const result = await deactivatePersonaService(1, 999);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Persona not found or access denied');
    });
  });
});
