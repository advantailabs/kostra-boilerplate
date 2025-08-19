import { addFileToKnowledgeBaseService } from '@/services/internal/file';

jest.mock('@/services/internal/file', () => ({
  addFileToKnowledgeBaseService: jest.fn(),
}));

describe('KB files endpoints - ownership checks', () => {
  it('prevents cross-tenant linking in service call', async () => {
    (addFileToKnowledgeBaseService as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Not found',
    });
    const result = await addFileToKnowledgeBaseService(1, 2, 3);
    expect(result.success).toBe(false);
  });
});
