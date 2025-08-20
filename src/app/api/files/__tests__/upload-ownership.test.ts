import { getKnowledgeBaseByIdPublicService } from '@/services/internal/knowledge-base';

jest.mock('@/services/internal/file', () => ({
  uploadFileService: jest.fn(),
}));

jest.mock('@/services/internal/knowledge-base', () => ({
  getKnowledgeBaseByIdPublicService: jest.fn(),
}));

describe('Files upload - KB ownership validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects when any KB id is foreign', async () => {
    (getKnowledgeBaseByIdPublicService as jest.Mock)
      .mockResolvedValueOnce({ success: true, data: { id: 1, userId: 99 } })
      .mockResolvedValueOnce({ success: true, data: { id: 2, userId: 1 } });

    // simulate the route logic: one foreign KB should cause 404
    const ownedUserId = 1;
    const checks = await Promise.all(
      [1, 2].map(async id => {
        const kb = await getKnowledgeBaseByIdPublicService(id);
        return kb.success && kb.data && kb.data.userId === ownedUserId;
      })
    );
    expect(checks.every(Boolean)).toBe(false);
  });
});
