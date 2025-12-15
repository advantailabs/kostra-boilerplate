import { UserPlan, UserRole } from '@/lib/prisma/generated/client';
import {
  createGoogleOnlyTestUser,
  createInvalidLoginData,
  createLoginRequestData,
  createTestUserWithPassword,
  extractJWTClaims,
  isValidJWTToken,
  makeLoginRequest,
} from '../../helpers/auth';
import { cleanupDatabase, testPrisma } from '../../setup';

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
  })),
}));

describe('POST /api/auth/login - Integration Tests', () => {
  let testUser: any;
  let googleOnlyUser: any;
  const appUrl = process.env.TEST_APP_URL || 'http://localhost:3001';

  beforeAll(async () => {
    // Ensure database is clean before starting tests
    await cleanupDatabase();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await cleanupDatabase();

    // Create test users for each test
    testUser = await createTestUserWithPassword({
      email: 'testuser@example.com',
      password: 'TestPassword123!',
      name: 'Test User',
      role: UserRole.USER,
    });

    googleOnlyUser = await createGoogleOnlyTestUser({
      email: 'googleuser@example.com',
      name: 'Google User',
      role: UserRole.USER,
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

  describe('Successful Login Scenarios', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = createLoginRequestData('testuser@example.com', 'TestPassword123!');

      const response = await makeLoginRequest(appUrl, loginData, 200);
      const responseData = response.body;

      // Validate response content
      expect(responseData.success).toBe(true);
      expect(responseData.data.message).toBe('Login successful!');
      expect(responseData.data).toBeDefined();
      expect(responseData.data.user).toBeDefined();
      expect(responseData.data.token).toBeDefined();

      // Validate user data
      expect(responseData.data.user.id).toBe(testUser.id);
      expect(responseData.data.user.email).toBe('testuser@example.com');
      expect(responseData.data.user.name).toBe('Test User');
      expect(responseData.data.user.role).toBe(UserRole.USER);

      // Validate JWT token
      expect(isValidJWTToken(responseData.data.token)).toBe(true);

      // Verify token contains correct user data
      const tokenClaims = extractJWTClaims(responseData.data.token);
      expect(tokenClaims.userId).toBe(testUser.id);
      expect(tokenClaims.email).toBe('testuser@example.com');
      expect(tokenClaims.role).toBe(UserRole.USER);
    });

    it('should login successfully with admin user', async () => {
      const adminUser = await createTestUserWithPassword({
        email: 'admin@example.com',
        password: 'AdminPassword123!',
        name: 'Admin User',
        role: UserRole.ADMIN,
      });

      const loginData = createLoginRequestData('admin@example.com', 'AdminPassword123!');

      const response = await makeLoginRequest(appUrl, loginData, 200);
      const responseData = response.body;

      expect(responseData.success).toBe(true);
      expect(responseData.data.user.role).toBe(UserRole.ADMIN);
      expect(responseData.data.user.id).toBe(adminUser.id);
    });

    it('should login successfully with user having custom profile data', async () => {
      const customUser = await createTestUserWithPassword({
        email: 'custom@example.com',
        password: 'CustomPassword123!',
        name: 'Custom User',
        role: UserRole.USER,
        credits: 500,
        plan: UserPlan.PRO,
        isOverDue: false,
        profilePicture: 'https://example.com/avatar.jpg',
      });

      const loginData = createLoginRequestData('custom@example.com', 'CustomPassword123!');

      const response = await makeLoginRequest(appUrl, loginData, 200);
      const responseData = response.body;

      expect(responseData.success).toBe(true);
      expect(responseData.data.user.id).toBe(customUser.id);
      expect(responseData.data.user.name).toBe('Custom User');
    });
  });

  describe('Authentication Failure Scenarios', () => {
    it('should fail with invalid email', async () => {
      const loginData = createLoginRequestData('nonexistent@example.com', 'TestPassword123!');

      const response = await makeLoginRequest(appUrl, loginData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Invalid email or password.');
      expect(responseData.data).toBeUndefined();
    });

    it('should fail with invalid password', async () => {
      const loginData = createLoginRequestData('testuser@example.com', 'WrongPassword123!');

      const response = await makeLoginRequest(appUrl, loginData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Invalid email or password.');
      expect(responseData.data).toBeUndefined();
    });

    it('should fail with Google-only user attempting password login', async () => {
      const loginData = createLoginRequestData(googleOnlyUser.email, 'SomePassword123!');

      const response = await makeLoginRequest(appUrl, loginData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Please use Google sign-in for this account.');
      expect(responseData.data).toBeUndefined();
    });

    it('should fail with empty password', async () => {
      const loginData = createLoginRequestData('testuser@example.com', '');

      const response = await makeLoginRequest(appUrl, loginData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Invalid input data');
      expect(responseData.data).toBeUndefined();
    });

    it('should fail with case-sensitive email', async () => {
      const loginData = createLoginRequestData('TESTUSER@EXAMPLE.COM', 'TestPassword123!');

      const response = await makeLoginRequest(appUrl, loginData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Invalid email or password.');
      expect(responseData.data).toBeUndefined();
    });
  });

  describe('Input Validation Scenarios', () => {
    it('should fail with invalid email format', async () => {
      const invalidData = createInvalidLoginData();
      const loginData = createLoginRequestData(invalidData.invalidEmail, 'TestPassword123!');

      const response = await makeLoginRequest(appUrl, loginData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Invalid input data');
      expect(responseData.errors).toBeDefined();
    });

    it('should fail with missing email', async () => {
      const loginData = {
        password: 'TestPassword123!',
      };

      const response = await makeLoginRequest(appUrl, loginData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Invalid input data');
      expect(responseData.errors).toBeDefined();
    });

    it('should fail with missing password', async () => {
      const loginData = {
        email: 'testuser@example.com',
      };

      const response = await makeLoginRequest(appUrl, loginData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Invalid input data');
      expect(responseData.errors).toBeDefined();
    });

    it('should fail with empty email', async () => {
      const invalidData = createInvalidLoginData();
      const loginData = createLoginRequestData(invalidData.emptyEmail, 'TestPassword123!');

      const response = await makeLoginRequest(appUrl, loginData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Invalid input data');
      expect(responseData.errors).toBeDefined();
    });

    it('should fail with null values', async () => {
      const loginData = {
        email: null,
        password: null,
      };

      const response = await makeLoginRequest(appUrl, loginData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Invalid input data');
      expect(responseData.errors).toBeDefined();
    });

    it('should fail with undefined values', async () => {
      const loginData = {
        email: undefined,
        password: undefined,
      };

      const response = await makeLoginRequest(appUrl, loginData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Invalid input data');
      expect(responseData.errors).toBeDefined();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle concurrent login attempts', async () => {
      const loginData = createLoginRequestData('testuser@example.com', 'TestPassword123!');

      // Simulate concurrent requests
      const promises = Array(5)
        .fill(null)
        .map(() => makeLoginRequest(appUrl, loginData, 200));
      const responses = await Promise.all(promises);
      const responseData = responses.map((r: any) => r.body);

      // All requests should succeed
      responseData.forEach((data: any) => {
        expect(data.success).toBe(true);
        expect(data.data.user.id).toBe(testUser.id);
      });
    });

    it('should handle user with special characters in email', async () => {
      const specialUser = await createTestUserWithPassword({
        email: 'test+special@example-domain.co.uk',
        password: 'SpecialPassword123!',
        name: 'Special User',
      });

      const loginData = createLoginRequestData(
        'test+special@example-domain.co.uk',
        'SpecialPassword123!'
      );

      const response = await makeLoginRequest(appUrl, loginData, 200);
      const responseData = response.body;

      expect(responseData.success).toBe(true);
      expect(responseData.data.user.email).toBe('test+special@example-domain.co.uk');
      expect(responseData.data.user.id).toBe(specialUser.id);
    });

    it('should handle user with unicode characters in name', async () => {
      const unicodeUser = await createTestUserWithPassword({
        email: 'unicode@example.com',
        password: 'UnicodePassword123!',
        name: 'José María 中文',
      });

      const loginData = createLoginRequestData('unicode@example.com', 'UnicodePassword123!');

      const response = await makeLoginRequest(appUrl, loginData, 200);
      const responseData = response.body;

      expect(responseData.success).toBe(true);
      expect(responseData.data.user.name).toBe('José María 中文');
      expect(responseData.data.user.id).toBe(unicodeUser.id);
    });
  });

  describe('Response Format Validation', () => {
    it('should return correct HTTP status codes', async () => {
      // Successful login
      const loginData = createLoginRequestData('testuser@example.com', 'TestPassword123!');
      const response = await makeLoginRequest(appUrl, loginData, 200);
      expect(response.status).toBe(200);

      // Failed login
      const failedLoginData = createLoginRequestData('testuser@example.com', 'WrongPassword');
      const failedResponse = await makeLoginRequest(appUrl, failedLoginData, 400);
      expect(failedResponse.status).toBe(400);

      // Validation error
      const invalidData = { email: 'invalid-email', password: 'password' };
      const invalidResponse = await makeLoginRequest(appUrl, invalidData, 400);
      expect(invalidResponse.status).toBe(400);
    });

    it('should return consistent response structure', async () => {
      const loginData = createLoginRequestData('testuser@example.com', 'TestPassword123!');

      const response = await makeLoginRequest(appUrl, loginData, 200);
      const responseData = response.body;

      // Check response structure
      expect(responseData).toHaveProperty('success');
      expect(responseData).toHaveProperty('data');
      expect(responseData.data).toHaveProperty('message');
      expect(typeof responseData.success).toBe('boolean');
      expect(typeof responseData.data.message).toBe('string');
      expect(typeof responseData.data).toBe('object');
    });
  });
});
