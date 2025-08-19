import { addFileToKnowledgeBaseService, removeFileFromKnowledgeBaseService } from '../file';

import {
  findFileByIdInternal,
  addFileToKnowledgeBase as repoAddFileToKnowledgeBase,
  removeFileFromKnowledgeBase as repoRemoveFileFromKnowledgeBase,
} from '@/services/repositories/file';
import { findKnowledgeBaseById } from '@/services/repositories/knowledge-base';

// Mock repositories used by the file service
jest.mock('@/services/repositories/file', () => ({
  findFileByIdInternal: jest.fn(),
  addFileToKnowledgeBase: jest.fn(),
  removeFileFromKnowledgeBase: jest.fn(),
}));

jest.mock('@/services/repositories/knowledge-base', () => ({
  findKnowledgeBaseById: jest.fn(),
}));

jest.mock('@/services/external/openai/vector-store', () => ({
  addFileToVectorStore: jest.fn().mockResolvedValue({ success: true }),
  deleteFileFromVectorStore: jest.fn().mockResolvedValue({ success: true }),
}));

const mockFindFileByIdInternal = findFileByIdInternal as jest.MockedFunction<
  typeof findFileByIdInternal
>;
const mockFindKnowledgeBaseById = findKnowledgeBaseById as jest.MockedFunction<
  typeof findKnowledgeBaseById
>;
const mockRepoAddFileToKnowledgeBase = repoAddFileToKnowledgeBase as jest.MockedFunction<
  typeof repoAddFileToKnowledgeBase
>;
const mockRepoRemoveFileFromKnowledgeBase = repoRemoveFileFromKnowledgeBase as jest.MockedFunction<
  typeof repoRemoveFileFromKnowledgeBase
>;

describe('File Service Security - Ownership Enforcement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('prevents linking a file to a foreign knowledge base', async () => {
    mockFindFileByIdInternal.mockResolvedValue({
      success: true,
      data: { id: 10, userId: 1, openaiFileId: null, fileKnowledgeBases: [] } as any,
    });
    mockFindKnowledgeBaseById.mockResolvedValue({
      success: true,
      data: { id: 20, userId: 2, vectorStoreId: null, fileKnowledgeBases: [], personas: [] } as any,
    });

    const result = await addFileToKnowledgeBaseService(10, 20, 1);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Not found');
    expect(mockRepoAddFileToKnowledgeBase).not.toHaveBeenCalled();
  });

  it('allows linking when both file and KB belong to the same user', async () => {
    mockFindFileByIdInternal.mockResolvedValue({
      success: true,
      data: { id: 10, userId: 1, openaiFileId: null, fileKnowledgeBases: [] } as any,
    });
    mockFindKnowledgeBaseById.mockResolvedValue({
      success: true,
      data: { id: 20, userId: 1, vectorStoreId: null, fileKnowledgeBases: [], personas: [] } as any,
    });
    mockRepoAddFileToKnowledgeBase.mockResolvedValue({ success: true } as any);

    const result = await addFileToKnowledgeBaseService(10, 20, 1);
    expect(result.success).toBe(true);
    expect(mockRepoAddFileToKnowledgeBase).toHaveBeenCalledWith(10, 20);
  });

  it('prevents unlinking a file from a foreign knowledge base', async () => {
    mockFindFileByIdInternal.mockResolvedValue({
      success: true,
      data: { id: 10, userId: 1, openaiFileId: null, fileKnowledgeBases: [] } as any,
    });
    mockFindKnowledgeBaseById.mockResolvedValue({
      success: true,
      data: { id: 20, userId: 2, vectorStoreId: null, fileKnowledgeBases: [], personas: [] } as any,
    });

    const result = await removeFileFromKnowledgeBaseService(10, 20, 1);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Not found');
    expect(mockRepoRemoveFileFromKnowledgeBase).not.toHaveBeenCalled();
  });
});
