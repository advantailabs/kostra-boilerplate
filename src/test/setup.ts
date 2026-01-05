import { JWT_KEY } from '@/lib/auth/jwt';
import { PrismaClient } from '@/lib/prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

 
// Global test setup
declare global {
  var __PRISMA_TEST__: PrismaClient | undefined;
}
 

const adapter = new PrismaPg({ connectionString: process.env.POSTGRES_URL });

// Test database client
export const testPrisma =
   
  global.__PRISMA_TEST__ ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') {
   
  global.__PRISMA_TEST__ = testPrisma;
}

// Test cleanup utilities
export async function cleanupDatabase() {
  try {
    // Clean up in reverse order of dependencies with explicit transaction
    await testPrisma.$transaction(async tx => {
      await tx.creditHistory.deleteMany({});
      await tx.file.deleteMany({});
      await tx.package.deleteMany({});
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

export async function createTestPackage(overrides: Partial<any> = {}) {
  return testPrisma.package.create({
    data: {
      title: 'Test Package',
      description: 'A test package for testing',
      isFeatured: false,
      price: 9.99,
      currencySymbol: '$',
      features: ['Feature 1', 'Feature 2'],
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
    role: 'USER' as const,
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
        if (name === (JWT_KEY || 'auth-token')) {
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
