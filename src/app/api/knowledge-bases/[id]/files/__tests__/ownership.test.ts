import { addFileToKnowledgeBaseService, getFileByIdService } from '@/services/internal/file';
import { getKnowledgeBaseByIdPublicService } from '@/services/internal/knowledge-base';
import { getUserByClerkId } from '@/services/repositories/user';
import { auth } from '@clerk/nextjs/server';
import { POST } from '../route';

jest.mock('@clerk/nextjs/server');
jest.mock('@/services/repositories/user');
jest.mock('@/services/internal/knowledge-base');
jest.mock('@/services/internal/file', () => ({
  getFileByIdService: jest.fn(),
  addFileToKnowledgeBaseService: jest.fn(),
  removeFileFromKnowledgeBaseService: jest.fn(),
}));

const mockGetKb = getKnowledgeBaseByIdPublicService as jest.MockedFunction<
  typeof getKnowledgeBaseByIdPublicService
>;
const mockGetFile = getFileByIdService as jest.MockedFunction<typeof getFileByIdService>;
const mockAddFile = addFileToKnowledgeBaseService as jest.MockedFunction<
  typeof addFileToKnowledgeBaseService
>;

describe('KB files endpoints - ownership checks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 404 when adding file to foreign KB due to ownership check', async () => {
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

    // Mock getKnowledgeBaseByIdPublicService to return a KB owned by user ID 2 (different user)
    mockGetKb.mockResolvedValue({
      success: true,
      data: { id: 1, userId: 2 } as any,
    });

    // Create a fake request with json method returning file ID
    const req = {
      json: async () => ({ fileId: 123 }),
    } as any;

    // Set params with KB ID
    const params = { id: '1' };

    // Call the actual POST handler
    const res = await POST(req, { params });

    // Assert the response status is 404 (not found) due to ownership check
    expect(res.status).toBe(404);

    // Assert that addFileToKnowledgeBaseService was never called due to early return
    expect(mockAddFile).not.toHaveBeenCalled();
  });

  it('returns 404 when adding file to KB due to file ownership check', async () => {
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

    // Mock getKnowledgeBaseByIdPublicService to return a KB owned by the same user
    mockGetKb.mockResolvedValue({
      success: true,
      data: { id: 1, userId: 1 } as any,
    });

    // Mock getFileByIdService to return a file owned by user ID 2 (different user)
    mockGetFile.mockResolvedValue({
      success: true,
      data: { id: 123, userId: 2 } as any,
    });

    // Create a fake request with json method returning file ID
    const req = {
      json: async () => ({ fileId: 123 }),
    } as any;

    // Set params with KB ID
    const params = { id: '1' };

    // Call the actual POST handler
    const res = await POST(req, { params });

    // Assert the response status is 404 (not found) due to file ownership check
    expect(res.status).toBe(404);

    // Assert that addFileToKnowledgeBaseService was never called due to early return
    expect(mockAddFile).not.toHaveBeenCalled();
  });
});
