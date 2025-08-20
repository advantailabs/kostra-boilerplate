import { getKnowledgeBaseByIdPublicService } from '@/services/internal/knowledge-base';
import { getUserByClerkId } from '@/services/repositories/user';
import { auth } from '@clerk/nextjs/server';
import { DELETE, PUT } from '../route';

jest.mock('@clerk/nextjs/server');
jest.mock('@/services/repositories/user');
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
    // Mock auth to return a clerk user ID
    (auth as jest.MockedFunction<typeof auth>).mockResolvedValue({
      userId: 'clerk_1',
      sessionClaims: {},
      sessionId: 'session_1',
      actor: null,
      orgId: null,
      orgRole: null,
      orgSlug: null,
      redirectToSignIn: jest.fn(),
    } as any);

    // Mock getUserByClerkId to return a user with ID 1
    (getUserByClerkId as jest.MockedFunction<typeof getUserByClerkId>).mockResolvedValue({
      id: 1,
      role: 'USER',
      clerkUserId: 'clerk_1',
      name: 'Test User',
      email: 'test@example.com',
      profilePicture: null,
      isOnboarded: true,
      credits: 100,
      stripeCustomerId: null,
      plan: 'FREE',
      planExpiringAt: null,
      overdue: false,
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
    // Mock auth to return a clerk user ID
    (auth as jest.MockedFunction<typeof auth>).mockResolvedValue({
      userId: 'clerk_1',
      sessionClaims: {},
      sessionId: 'session_1',
      actor: null,
      orgId: null,
      orgRole: null,
      orgSlug: null,
      redirectToSignIn: jest.fn(),
    } as any);

    // Mock getUserByClerkId to return a user with ID 1
    (getUserByClerkId as jest.MockedFunction<typeof getUserByClerkId>).mockResolvedValue({
      id: 1,
      role: 'USER',
      clerkUserId: 'clerk_1',
      name: 'Test User',
      email: 'test@example.com',
      profilePicture: null,
      isOnboarded: true,
      credits: 100,
      stripeCustomerId: null,
      plan: 'FREE',
      planExpiringAt: null,
      overdue: false,
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
