import { UserRole } from '@/lib/prisma/generated/client';
import {
  createTestUserWithPassword,
  extractJWTClaims,
  isValidJWTToken,
  makeLoginRequest,
  makeLogoutRequest,
  makeLogoutRequestWithCookies,
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
    delete: jest.fn(),
  })),
}));

describe('POST /api/auth/logout - Integration Tests', () => {
  const appUrl = process.env.TEST_APP_URL || 'http://localhost:3001';

  beforeAll(async () => {
    // Ensure database is clean before starting tests
    await cleanupDatabase();
  });

  beforeEach(async () => {
    // Clean up database before each test
    await cleanupDatabase();

    // Create test users for each test
    await createTestUserWithPassword({
      email: 'testuser@example.com',
      password: 'TestPassword123!',
      name: 'Test User',
      role: UserRole.USER,
    });

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

  describe('Successful Logout Scenarios', () => {
    it('should logout successfully without authentication', async () => {
      const response = await makeLogoutRequest(appUrl, undefined, 200);
      const responseData = response.body;

      // Validate response content
      expect(responseData.success).toBe(true);
      expect(responseData.data.success).toBe(true);
      expect(responseData.data.message).toBe('Logged out successfully');
    });

    it('should logout successfully with valid auth token', async () => {
      // First login to get a token
      const loginData = {
        email: 'testuser@example.com',
        password: 'TestPassword123!',
      };

      const loginResponse = await makeLoginRequest(appUrl, loginData, 200);
      const loginData_response = loginResponse.body;
      const authToken = loginData_response.data.token;

      // Validate the token
      expect(isValidJWTToken(authToken)).toBe(true);

      // Now logout with the token
      const response = await makeLogoutRequest(appUrl, authToken, 200);
      const responseData = response.body;

      // Validate response content
      expect(responseData.success).toBe(true);
      expect(responseData.data.success).toBe(true);
      expect(responseData.data.message).toBe('Logged out successfully');
    });

    it('should logout successfully with admin user token', async () => {
      // First login as admin to get a token
      const loginData = {
        email: 'admin@example.com',
        password: 'AdminPassword123!',
      };

      const loginResponse = await makeLoginRequest(appUrl, loginData, 200);
      const loginData_response = loginResponse.body;
      const authToken = loginData_response.data.token;

      // Validate the token contains admin role
      const tokenClaims = extractJWTClaims(authToken);
      expect(tokenClaims.role).toBe(UserRole.ADMIN);

      // Now logout with the admin token
      const response = await makeLogoutRequest(appUrl, authToken, 200);
      const responseData = response.body;

      // Validate response content
      expect(responseData.success).toBe(true);
      expect(responseData.data.success).toBe(true);
      expect(responseData.data.message).toBe('Logged out successfully');
    });

    it('should logout successfully with cookies', async () => {
      // Simulate logout with auth cookie
      const authCookie = 'auth-token=mock-jwt-token; Path=/; HttpOnly; SameSite=Strict';
      const response = await makeLogoutRequestWithCookies(appUrl, [authCookie], 200);
      const responseData = response.body;

      // Validate response content
      expect(responseData.success).toBe(true);
      expect(responseData.data.success).toBe(true);
      expect(responseData.data.message).toBe('Logged out successfully');
    });

    it('should logout successfully with multiple cookies', async () => {
      // Simulate logout with multiple cookies
      const cookies = [
        'auth-token=mock-jwt-token; Path=/; HttpOnly; SameSite=Strict',
        'session-id=abc123; Path=/; HttpOnly',
        'preferences=dark-mode; Path=/',
      ];
      const response = await makeLogoutRequestWithCookies(appUrl, cookies, 200);
      const responseData = response.body;

      // Validate response content
      expect(responseData.success).toBe(true);
      expect(responseData.data.success).toBe(true);
      expect(responseData.data.message).toBe('Logged out successfully');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle concurrent logout attempts', async () => {
      // First login to get a token
      const loginData = {
        email: 'testuser@example.com',
        password: 'TestPassword123!',
      };

      const loginResponse = await makeLoginRequest(appUrl, loginData, 200);
      const loginData_response = loginResponse.body;
      const authToken = loginData_response.data.token;

      // Simulate concurrent logout requests
      const promises = Array(5)
        .fill(null)
        .map(() => makeLogoutRequest(appUrl, authToken, 200));
      const responses = await Promise.all(promises);
      const responseData = responses.map((r: any) => r.body);

      // All requests should succeed
      responseData.forEach((data: any) => {
        expect(data.success).toBe(true);
        expect(data.data.message).toBe('Logged out successfully');
      });
    });

    it('should handle logout with very long auth token', async () => {
      const longToken = 'a'.repeat(10000) + '.b'.repeat(10000) + '.c'.repeat(10000);
      const response = await makeLogoutRequest(appUrl, longToken, 431);

      // For 431 status, the response body is typically empty or contains an error page
      // We should expect the status code to be 431 (Request Header Fields Too Large)
      expect(response.status).toBe(431);
      expect(response.body).toBeDefined();
    });

    it('should handle logout with special characters in token', async () => {
      const specialToken = 'token-with-special-chars!@#$%^&*()_+-=[]{}|;:,.<>?';
      const response = await makeLogoutRequest(appUrl, specialToken, 200);
      const responseData = response.body;

      expect(responseData.success).toBe(true);
      expect(responseData.data.message).toBe('Logged out successfully');
    });
  });

  describe('Response Format Validation', () => {
    it('should return correct HTTP status codes', async () => {
      // Successful logout without auth
      const response = await makeLogoutRequest(appUrl, undefined, 200);
      expect(response.status).toBe(200);

      // Successful logout with auth token
      const loginData = {
        email: 'testuser@example.com',
        password: 'TestPassword123!',
      };

      const loginResponse = await makeLoginRequest(appUrl, loginData, 200);
      const loginData_response = loginResponse.body;
      const authToken = loginData_response.data.token;

      const logoutResponse = await makeLogoutRequest(appUrl, authToken, 200);
      expect(logoutResponse.status).toBe(200);
    });

    it('should return consistent response structure', async () => {
      const response = await makeLogoutRequest(appUrl, undefined, 200);
      const responseData = response.body;

      // Check response structure
      expect(responseData).toHaveProperty('success');
      expect(responseData).toHaveProperty('data');
      expect(responseData.data).toHaveProperty('success');
      expect(responseData.data).toHaveProperty('message');
      expect(typeof responseData.success).toBe('boolean');
      expect(typeof responseData.data.success).toBe('boolean');
      expect(typeof responseData.data.message).toBe('string');
      expect(typeof responseData.data).toBe('object');
    });
  });

  describe('Cookie Handling', () => {
    it('should handle logout with no cookies', async () => {
      const response = await makeLogoutRequestWithCookies(appUrl, [], 200);
      const responseData = response.body;

      expect(responseData.success).toBe(true);
      expect(responseData.data.message).toBe('Logged out successfully');
    });

    it('should handle logout with invalid cookie format', async () => {
      const invalidCookies = ['invalid-cookie-format', 'another=invalid'];
      const response = await makeLogoutRequestWithCookies(appUrl, invalidCookies, 200);
      const responseData = response.body;

      expect(responseData.success).toBe(true);
      expect(responseData.data.message).toBe('Logged out successfully');
    });

    it('should handle logout with empty cookie values', async () => {
      const emptyCookies = ['auth-token=; Path=/', 'session-id=; Path=/'];
      const response = await makeLogoutRequestWithCookies(appUrl, emptyCookies, 200);
      const responseData = response.body;

      expect(responseData.success).toBe(true);
      expect(responseData.data.message).toBe('Logged out successfully');
    });
  });
});
