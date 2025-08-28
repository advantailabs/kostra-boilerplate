import { PrismaClient } from '@prisma/client';

/* eslint-disable no-var, vars-on-top, no-underscore-dangle */
// Global test setup
declare global {
  var __PRISMA_TEST__: PrismaClient | undefined;
}
/* eslint-enable no-var, vars-on-top, no-underscore-dangle */

// Test database client
export const testPrisma =
  // eslint-disable-next-line no-underscore-dangle
  global.__PRISMA_TEST__ ??
  new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://postgres:postgres@127.0.0.1:5432/test',
      },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-underscore-dangle
  global.__PRISMA_TEST__ = testPrisma;
}

// Test cleanup utilities
export async function cleanupDatabase() {
  try {
    // Clean up in reverse order of dependencies with explicit transaction
    await testPrisma.$transaction(async tx => {
      await tx.message.deleteMany({});
      await tx.fileKnowledgeBase.deleteMany({});
      await tx.file.deleteMany({});
      await tx.thread.deleteMany({});
      await tx.persona.deleteMany({});
      await tx.knowledgeBase.deleteMany({});
      await tx.user.deleteMany({});
    });

    // Ensure all operations are completed
    await testPrisma.$executeRaw`SELECT 1`;
  } catch (error) {
    console.error('Database cleanup failed:', error);
    throw error;
  }
}

export async function disconnectTestDatabase() {
  await testPrisma.$disconnect();
}

// Test data factories
export async function createTestUser(overrides: Partial<any> = {}) {
  const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  return testPrisma.user.create({
    data: {
      googleId: `google_${uniqueId}`,
      email: `test${uniqueId}@example.com`,
      name: 'Test User',
      isOnboarded: true,
      credits: 100,
      plan: 'FREE',
      isOverDue: false,
      ...overrides,
    },
  });
}

export async function createTestKnowledgeBase(userId: number, overrides: Partial<any> = {}) {
  return testPrisma.knowledgeBase.create({
    data: {
      userId,
      title: 'Test Knowledge Base',
      description: 'A test knowledge base',
      metadata: {},
      vectorStoreId: 'vs_test123',
      ...overrides,
    },
  });
}

export async function createTestPersona(userId: number, overrides: Partial<any> = {}) {
  return testPrisma.persona.create({
    data: {
      user: { connect: { id: userId } },
      name: 'Test Assistant',
      description: 'A helpful test assistant',
      instructions: 'You are a helpful test assistant.',
      tags: ['test', 'assistant'],
      logo: null,
      openaiAssistantId: 'asst_test123',
      ...overrides,
    },
  });
}

export async function createTestThread(
  userId: number,
  personaId: number,
  overrides: Partial<any> = {}
) {
  return testPrisma.thread.create({
    data: {
      user: { connect: { id: userId } },
      persona: { connect: { id: personaId } },
      title: 'Test Thread',
      ...overrides,
    },
  });
}

export async function createTestMessage(threadId: number, overrides: Partial<any> = {}) {
  return testPrisma.message.create({
    data: {
      thread: { connect: { id: threadId } },
      role: 'user',
      content: 'Test message content',
      ...overrides,
    },
  });
}

export async function createTestFile(userId: number, overrides: Partial<any> = {}) {
  return testPrisma.file.create({
    data: {
      user: { connect: { id: userId } },
      filename: 'test-file.pdf',
      originalName: 'test-file.pdf',
      mimeType: 'application/pdf',
      size: 1024,
      url: 'https://example.com/test-file.pdf',
      ...overrides,
    },
  });
}

// Mock Google Auth with JWT for testing
export function mockGoogleAuth(userId: number, googleId: string) {
  const mockAuthUser = jest.fn().mockResolvedValue({
    userId,
    email: 'test@example.com',
    role: 'USER',
    name: 'Test User',
    profilePicture: undefined,
    isOnboarded: true,
    credits: 100,
    plan: 'FREE',
    isOverdue: false,
    planExpiringAt: undefined,
    googleId,
  });
  return mockAuthUser;
}

// Mock next request/response
export function createMockRequest(body: any = {}, params: any = {}, headers: any = {}) {
  return {
    json: jest.fn().mockResolvedValue(body),
    params,
    headers: new Map(Object.entries(headers)),
    cookies: {
      get: jest.fn().mockImplementation((name: string) => {
        if (name === 'auth-token') {
          return { value: 'mock-jwt-token' };
        }
        return undefined;
      }),
    },
  } as any;
}

export function createMockResponse() {
  const mockResponse = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  };
  return mockResponse as any;
}

// Helper to create authenticated mock requests
export function createAuthenticatedMockRequest(userId: number, body: any = {}, params: any = {}) {
  return createMockRequest(body, params, {
    authorization: `Bearer mock-jwt-token-for-user-${userId}`,
  });
}
