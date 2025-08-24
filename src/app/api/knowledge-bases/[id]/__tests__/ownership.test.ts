import { getAuthUser } from '@/lib/auth/jwt';
import { getKnowledgeBaseByIdPublicService } from '@/services/internal/knowledge-base';
import { getUserByGoogleId } from '@/services/repositories/user';
import { DELETE, PUT } from '../route';

jest.mock('@/lib/auth/jwt');
jest.mock('@/services/repositories/user');
jest.mock('@/services/internal/knowledge-base', () => ({
  getKnowledgeBaseByIdPublicService: jest.fn(),
  updateKnowledgeBaseService: jest.fn(),
  deleteKnowledgeBaseService: jest.fn(),
}));

const mockGetAuthUser = getAuthUser as jest.MockedFunction<typeof getAuthUser>;
const mockGetUserByGoogleId = getUserByGoogleId as jest.MockedFunction<typeof getUserByGoogleId>;
const mockGetKb = getKnowledgeBaseByIdPublicService as jest.MockedFunction<
  typeof getKnowledgeBaseByIdPublicService
>;

describe('KB ownership enforcement (route guards)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 404 when updating foreign KB', async () => {
    // Mock getAuthUser to return a JWT payload
    mockGetAuthUser.mockResolvedValue({
      userId: 1,
      email: 'test@example.com',
      role: 'USER',
      name: 'Test User',
      profilePicture: undefined,
      isOnboarded: true,
      credits: 100,
      plan: 'FREE',
      isOverdue: false,
      planExpiringAt: undefined,
      googleId: 'google_123',
    });

    // Mock getUserByGoogleId to return a user with ID 1
    mockGetUserByGoogleId.mockResolvedValue({
      id: 1,
      role: 'USER',
      googleId: 'google_123',
      name: 'Test User',
      email: 'test@example.com',
      profilePicture: null,
      isOnboarded: true,
      credits: 100,
      stripeCustomerId: null,
      plan: 'FREE',
      planExpiringAt: null,
      isOverDue: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    } as any);

    // Mock getKnowledgeBaseByIdPublicService to return a KB owned by user ID 2
    mockGetKb.mockResolvedValue({ success: true, data: { id: 1, userId: 2 } as any });

    // Create a fake request with json method returning update body
    const req = {
      json: async () => ({ title: 'Updated' }),
    } as any;

    // Set params with KB ID
    const params = { id: '1' };

    // Call the actual PUT handler
    const res = await PUT(req, { params });

    // Assert the response status is 404 (not found) due to ownership check
    expect(res.status).toBe(404);
  });

  it('returns 404 when deleting foreign KB', async () => {
    // Mock getAuthUser to return a JWT payload
    mockGetAuthUser.mockResolvedValue({
      userId: 1,
      email: 'test@example.com',
      role: 'USER',
      name: 'Test User',
      profilePicture: undefined,
      isOnboarded: true,
      credits: 100,
      plan: 'FREE',
      isOverdue: false,
      planExpiringAt: undefined,
      googleId: 'google_123',
    });

    // Mock getUserByGoogleId to return a user with ID 1
    mockGetUserByGoogleId.mockResolvedValue({
      id: 1,
      role: 'USER',
      googleId: 'google_123',
      name: 'Test User',
      email: 'test@example.com',
      profilePicture: null,
      isOnboarded: true,
      credits: 100,
      stripeCustomerId: null,
      plan: 'FREE',
      planExpiringAt: null,
      isOverDue: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    } as any);

    // Mock getKnowledgeBaseByIdPublicService to return a KB owned by user ID 2
    mockGetKb.mockResolvedValue({ success: true, data: { id: 1, userId: 2 } as any });

    // Create a fake request with URL for query params
    const req = {
      url: 'http://localhost:3000/api/knowledge-bases/1?deleteFiles=false',
    } as any;

    // Set params with KB ID
    const params = { id: '1' };

    // Call the actual DELETE handler
    const res = await DELETE(req, { params });

    // Assert the response status is 404 (not found) due to ownership check
    expect(res.status).toBe(404);
  });
});
