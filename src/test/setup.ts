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
      await tx.thread.deleteMany({});
      await tx.persona.deleteMany({});
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
      clerkUserId: `test_user_${uniqueId}`,
      email: `test${uniqueId}@example.com`,
      name: 'Test User',
      ...overrides,
    },
  });
}

export async function createTestPersona(userId: number, overrides: Partial<any> = {}) {
  return testPrisma.persona.create({
    data: {
      userId,
      name: 'Test Assistant',
      description: 'A helpful test assistant',
      instructions: 'You are a helpful test assistant.',
      tags: ['test', 'assistant'],
      logo: null,
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
      userId,
      personaId,
      title: 'Test Thread',
      ...overrides,
    },
  });
}

export async function createTestMessage(threadId: number, overrides: Partial<any> = {}) {
  return testPrisma.message.create({
    data: {
      threadId,
      role: 'user',
      content: 'Test message content',
      ...overrides,
    },
  });
}

// Mock Clerk auth for testing
export function mockClerkAuth(userId: string) {
  const mockAuth = jest.fn().mockResolvedValue({ userId });
  return mockAuth;
}

// Mock next request/response
export function createMockRequest(body: any = {}, params: any = {}) {
  return {
    json: jest.fn().mockResolvedValue(body),
    params,
  } as any;
}

export function createMockResponse() {
  const mockResponse = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  };
  return mockResponse as any;
}
