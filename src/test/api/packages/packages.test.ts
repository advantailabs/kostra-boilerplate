import { UserRole } from '@/lib/prisma/generated/enums';
import { createTestUserWithPassword, makeLoginRequest } from '@/test/helpers/auth';
import { cleanupDatabase, testPrisma } from '@/test/setup';
import request from 'supertest';

// Mock JWT functions to avoid actual token generation in tests
jest.mock('@/lib/auth/jwt', () => ({
  generateJWT: jest.fn().mockImplementation(async payload => {
    // Create a mock JWT token for testing
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64');
    const signature = 'mock-signature';
    return `${header}.${body}.${signature}`;
  }),
  setAuthCookie: jest.fn(),
  JWT_KEY: 'auth-token',
}));

// Mock Next.js cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    set: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  })),
}));

describe('POST /api/packages - Integration Tests', () => {
  const appUrl = process.env.TEST_APP_URL || 'http://localhost:3001';

  beforeAll(async () => {
    // Ensure database is clean before starting tests
    await cleanupDatabase();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await cleanupDatabase();

    // Create Admin User
    await createTestUserWithPassword({
      email: 'admin@example.com',
      password: 'AdminPassword123!',
      name: 'Admin User',
      role: UserRole.ADMIN,
    });
  });

  afterEach(async () => {
    // Clean up after each test
    await cleanupDatabase();
  });

  afterAll(async () => {
    // Final cleanup
    await cleanupDatabase();
    await testPrisma.$disconnect();
  });

  it('should create package successfully with title, description, price and currency symbol', async () => {
    // Only Admin has access to Packages API
    const loginData = {
      email: 'admin@example.com',
      password: 'AdminPassword123!',
    };

    const loginResponse = await makeLoginRequest(appUrl, loginData, 200);

    // Extract Cookie from headers
    const authCookie = loginResponse.headers['set-cookie'][0];

    const packageData = {
      title: 'Test Title',
      description: 'Test Description',
      price: 8.99,
      currencySymbol: '$',
    };

    const response = await request(appUrl)
      .post('/api/packages')
      .set('Cookie', authCookie)
      .send(packageData)
      .expect(200);

    const responseData = response.body;

    // Validate response content
    expect(responseData.success).toBe(true);
    expect(responseData.data.title).toBe(packageData.title);
    expect(responseData.data.description).toBe(packageData.description);
    expect(responseData.data.price).toBe(String(packageData.price));
    expect(responseData.data.currencySymbol).toBe('$');
  });
});
