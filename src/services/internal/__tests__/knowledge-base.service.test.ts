import { createVectorStore } from '@/services/external/openai/vector-store';
import { createKnowledgeBase } from '@/services/repositories/knowledge-base';
import { createKnowledgeBaseService } from '../knowledge-base';

// Mock external dependencies
jest.mock('@/services/external/openai/vector-store');
jest.mock('@/services/repositories/knowledge-base');

const mockCreateVectorStore = createVectorStore as jest.MockedFunction<typeof createVectorStore>;
const mockCreateKnowledgeBase = createKnowledgeBase as jest.MockedFunction<
  typeof createKnowledgeBase
>;

describe('Knowledge Base Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createKnowledgeBaseService', () => {
    it('should create knowledge base with vector store when vectorStoreId is not provided', async () => {
      const mockInputData = {
        userId: 1,
        title: 'Test Knowledge Base',
        description: 'Test Description',
        metadata: { test: 'data' },
      };

      const mockVectorStore = {
        id: 'vs_test123',
        name: 'Test Knowledge Base Knowledge Base',
        created_at: new Date().getTime(),
        object: 'vector_store',
      };

      const mockKnowledgeBase = {
        id: 1,
        userId: 1,
        title: 'Test Knowledge Base',
        description: 'Test Description',
        metadata: { test: 'data' },
        vectorStoreId: 'vs_test123',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      // Mock vector store creation
      mockCreateVectorStore.mockResolvedValue({
        success: true,
        data: mockVectorStore,
      });

      // Mock knowledge base creation
      mockCreateKnowledgeBase.mockResolvedValue({
        success: true,
        data: mockKnowledgeBase,
      });

      const result = await createKnowledgeBaseService(1, mockInputData);

      expect(mockCreateVectorStore).toHaveBeenCalledWith({
        name: 'Test Knowledge Base Knowledge Base',
      });

      expect(mockCreateKnowledgeBase).toHaveBeenCalledWith({
        ...mockInputData,
        vectorStoreId: 'vs_test123',
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockKnowledgeBase);
    });

    it('should use provided vectorStoreId when available', async () => {
      const mockInputData = {
        userId: 1,
        title: 'Test Knowledge Base',
        description: 'Test Description',
        metadata: { test: 'data' },
        vectorStoreId: 'existing_vs_id',
      };

      const mockKnowledgeBase = {
        id: 1,
        userId: 1,
        title: 'Test Knowledge Base',
        description: 'Test Description',
        metadata: { test: 'data' },
        vectorStoreId: 'existing_vs_id',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      // Mock knowledge base creation
      mockCreateKnowledgeBase.mockResolvedValue({
        success: true,
        data: mockKnowledgeBase,
      });

      const result = await createKnowledgeBaseService(1, mockInputData);

      expect(mockCreateVectorStore).not.toHaveBeenCalled();

      expect(mockCreateKnowledgeBase).toHaveBeenCalledWith(mockInputData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockKnowledgeBase);
    });

    it('should handle vector store creation failure', async () => {
      const mockInputData = {
        userId: 1,
        title: 'Test Knowledge Base',
        description: 'Test Description',
        metadata: { test: 'data' },
      };

      // Mock vector store creation to fail
      mockCreateVectorStore.mockResolvedValue({
        success: false,
        error: 'Failed to create vector store',
      });

      const result = await createKnowledgeBaseService(1, mockInputData);

      expect(mockCreateVectorStore).toHaveBeenCalledWith({
        name: 'Test Knowledge Base Knowledge Base',
      });

      expect(mockCreateKnowledgeBase).not.toHaveBeenCalled();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to create vector store: Failed to create vector store');
    });

    it('should handle knowledge base creation failure', async () => {
      const mockInputData = {
        userId: 1,
        title: 'Test Knowledge Base',
        description: 'Test Description',
        metadata: { test: 'data' },
      };

      const mockVectorStore = {
        id: 'vs_test123',
        name: 'Test Knowledge Base Knowledge Base',
        created_at: new Date().getTime(),
        object: 'vector_store',
      };

      // Mock vector store creation
      mockCreateVectorStore.mockResolvedValue({
        success: true,
        data: mockVectorStore,
      });

      // Mock knowledge base creation to fail
      mockCreateKnowledgeBase.mockResolvedValue({
        success: false,
        error: 'Failed to create knowledge base',
      });

      const result = await createKnowledgeBaseService(1, mockInputData);

      expect(mockCreateVectorStore).toHaveBeenCalledWith({
        name: 'Test Knowledge Base Knowledge Base',
      });

      expect(mockCreateKnowledgeBase).toHaveBeenCalledWith({
        ...mockInputData,
        vectorStoreId: 'vs_test123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to create knowledge base');
    });
  });
});
