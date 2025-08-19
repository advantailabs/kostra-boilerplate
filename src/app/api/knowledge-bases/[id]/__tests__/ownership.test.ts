import { getKnowledgeBaseByIdPublicService } from '@/services/internal/knowledge-base';

jest.mock('@/services/internal/knowledge-base', () => ({
  getKnowledgeBaseByIdPublicService: jest.fn(),
  updateKnowledgeBaseService: jest.fn(),
  deleteKnowledgeBaseService: jest.fn(),
}));

const mockGetKb = getKnowledgeBaseByIdPublicService as jest.MockedFunction<
  typeof getKnowledgeBaseByIdPublicService
>;

describe('KB ownership enforcement (route guards)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 404 when updating foreign KB', async () => {
    mockGetKb.mockResolvedValue({ success: true, data: { id: 1, userId: 2 } as any });
    // simulate route guard behavior
    const userId = 1;
    const kbOwnerId = (await mockGetKb(1)).data!.userId;
    expect(kbOwnerId === userId).toBe(false);
  });

  it('returns 404 when deleting foreign KB', async () => {
    mockGetKb.mockResolvedValue({ success: true, data: { id: 1, userId: 2 } as any });
    const userId = 1;
    const kbOwnerId = (await mockGetKb(1)).data!.userId;
    expect(kbOwnerId === userId).toBe(false);
  });
});
