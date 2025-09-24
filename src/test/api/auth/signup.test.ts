import {
  createInvalidSignupData,
  createSignupRequestData,
  makeSignupRequest,
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

describe('POST /api/auth/signup - Integration Tests', () => {
  const appUrl = process.env.TEST_APP_URL || 'http://localhost:3001';

  beforeAll(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await cleanupDatabase();
    await testPrisma.$disconnect();
  });

  describe('Successful Signup Scenarios', () => {
    it('should initiate signup successfully with valid email', async () => {
      const signupData = createSignupRequestData('newuser@example.com');

      const response = await makeSignupRequest(appUrl, signupData, 200);
      const responseData = response.body;

      expect(responseData.success).toBe(true);
      expect(responseData.data.message).toContain('OTP sent');
    });

    it('should handle signup with special characters in email', async () => {
      const signupData = createSignupRequestData('test+special@example-domain.co.uk');

      const response = await makeSignupRequest(appUrl, signupData, 200);
      const responseData = response.body;

      expect(responseData.success).toBe(true);
      expect(responseData.data.message).toContain('OTP sent');
    });
  });

  describe('Input Validation Scenarios', () => {
    it('should fail with invalid email format', async () => {
      const invalidData = createInvalidSignupData();
      const signupData = createSignupRequestData(invalidData.invalidEmail);

      const response = await makeSignupRequest(appUrl, signupData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Invalid input data');
      expect(responseData.errors).toBeDefined();
    });

    it('should fail with empty email', async () => {
      const invalidData = createInvalidSignupData();
      const signupData = createSignupRequestData(invalidData.emptyEmail);

      const response = await makeSignupRequest(appUrl, signupData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Invalid input data');
      expect(responseData.errors).toBeDefined();
    });

    it('should fail with missing email field', async () => {
      const signupData = {};

      const response = await makeSignupRequest(appUrl, signupData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Invalid input data');
      expect(responseData.errors).toBeDefined();
    });

    it('should fail with null email', async () => {
      const signupData = { email: null };

      const response = await makeSignupRequest(appUrl, signupData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Invalid input data');
      expect(responseData.errors).toBeDefined();
    });

    it('should fail with undefined email', async () => {
      const signupData = { email: undefined };

      const response = await makeSignupRequest(appUrl, signupData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Invalid input data');
      expect(responseData.errors).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should fail when user already exists', async () => {
      // First, create a user
      await testPrisma.user.create({
        data: {
          email: 'existing@example.com',
          name: 'Existing User',
          isOnboarded: true,
          credits: 100,
          plan: 'FREE',
          isOverDue: false,
        },
      });

      // Try to signup with the same email
      const signupData = createSignupRequestData('existing@example.com');

      const response = await makeSignupRequest(appUrl, signupData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('already exists');
    });

    it('should handle concurrent signup attempts', async () => {
      const signupData = createSignupRequestData('concurrent@example.com');

      // Simulate concurrent requests
      const promises = Array(3)
        .fill(null)
        .map(() => makeSignupRequest(appUrl, signupData, 200));
      const responses = await Promise.all(promises);
      const responseData = responses.map((r: any) => r.body);

      // All requests should succeed
      responseData.forEach((data: any) => {
        expect(data.success).toBe(true);
        expect(data.data.message).toContain('OTP sent');
      });
    });
  });

  describe('Response Format Validation', () => {
    it('should return correct HTTP status codes', async () => {
      // Successful signup
      const signupData = createSignupRequestData('status@example.com');
      const response = await makeSignupRequest(appUrl, signupData, 200);
      expect(response.status).toBe(200);

      // Failed signup
      const failedSignupData = createSignupRequestData('invalid-email');
      const failedResponse = await makeSignupRequest(appUrl, failedSignupData, 400);
      expect(failedResponse.status).toBe(400);
    });

    it('should return consistent response structure', async () => {
      const signupData = createSignupRequestData('structure@example.com');

      const response = await makeSignupRequest(appUrl, signupData, 200);
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
