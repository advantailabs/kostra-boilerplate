import { OtpPurpose, UserRole } from '@/lib/prisma/generated/client';
import {
  createInvalidVerifySignupData,
  createVerifySignupRequestData,
  extractJWTClaims,
  initiateSignupAndGetOTP,
  isValidJWTToken,
  makeVerifySignupRequest,
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

describe('POST /api/auth/verify-signup - Integration Tests', () => {
  const appUrl = process.env.TEST_APP_URL || 'http://localhost:3001';

  // Helper function to create EmailOTP entry for testing
  async function createEmailOTP(
    email: string,
    otp: string,
    purpose: OtpPurpose = OtpPurpose.SIGNUP
  ) {
    const expiringAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    return testPrisma.emailOTP.create({
      data: {
        email,
        otp,
        purpose,
        expiringAt,
      },
    });
  }

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

  describe('Successful Verify Signup Scenarios', () => {
    it('should complete signup successfully with valid data', async () => {
      // Initiate signup to create OTP in database
      const otp = await initiateSignupAndGetOTP('newuser@example.com', appUrl);

      const verifySignupData = createVerifySignupRequestData(
        'newuser@example.com',
        'New User',
        'ValidPassword123!',
        otp
      );

      const response = await makeVerifySignupRequest(appUrl, verifySignupData, 200);
      const responseData = response.body;

      expect(responseData.success).toBe(true);
      expect(responseData.data.message).toContain('successfully');
      expect(responseData.data.user).toBeDefined();
      expect(responseData.data.token).toBeDefined();

      // Validate user data
      expect(responseData.data.user.email).toBe('newuser@example.com');
      expect(responseData.data.user.name).toBe('New User');
      expect(responseData.data.user.role).toBe(UserRole.USER);

      // Validate JWT token
      expect(isValidJWTToken(responseData.data.token)).toBe(true);

      // Verify token contains correct user data
      const tokenClaims = extractJWTClaims(responseData.data.token);
      expect(tokenClaims.email).toBe('newuser@example.com');
      expect(tokenClaims.role).toBe(UserRole.USER);
    });

    it('should handle signup with special characters in email and name', async () => {
      // Initiate signup to create OTP in database
      const otp = await initiateSignupAndGetOTP('test+special@example-domain.co.uk', appUrl);

      const verifySignupData = createVerifySignupRequestData(
        'test+special@example-domain.co.uk',
        'José María 中文',
        'SpecialPassword123!',
        otp
      );

      const response = await makeVerifySignupRequest(appUrl, verifySignupData, 200);
      const responseData = response.body;

      expect(responseData.success).toBe(true);
      expect(responseData.data.user.email).toBe('test+special@example-domain.co.uk');
      expect(responseData.data.user.name).toBe('José María 中文');
    });
  });

  describe('Input Validation Scenarios', () => {
    it('should fail with invalid email format', async () => {
      const invalidData = createInvalidVerifySignupData();
      const verifySignupData = createVerifySignupRequestData(
        invalidData.invalidEmail,
        'Test User',
        'ValidPassword123!',
        '1234'
      );

      const response = await makeVerifySignupRequest(appUrl, verifySignupData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Invalid input data');
      expect(responseData.errors).toBeDefined();
    });

    it('should fail with empty name', async () => {
      const invalidData = createInvalidVerifySignupData();
      const verifySignupData = createVerifySignupRequestData(
        'test@example.com',
        invalidData.emptyName,
        'ValidPassword123!',
        '1234'
      );

      const response = await makeVerifySignupRequest(appUrl, verifySignupData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Invalid input data');
      expect(responseData.errors).toBeDefined();
    });

    it('should fail with short password', async () => {
      const invalidData = createInvalidVerifySignupData();
      const verifySignupData = createVerifySignupRequestData(
        'test@example.com',
        'Test User',
        invalidData.shortPassword,
        '1234'
      );

      const response = await makeVerifySignupRequest(appUrl, verifySignupData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Invalid input data');
      expect(responseData.errors).toBeDefined();
    });

    it('should fail with invalid OTP length', async () => {
      const invalidData = createInvalidVerifySignupData();
      const verifySignupData = createVerifySignupRequestData(
        'test@example.com',
        'Test User',
        'ValidPassword123!',
        invalidData.invalidOtp
      );

      const response = await makeVerifySignupRequest(appUrl, verifySignupData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Invalid input data');
      expect(responseData.errors).toBeDefined();
    });

    it('should fail with long OTP', async () => {
      const invalidData = createInvalidVerifySignupData();
      const verifySignupData = createVerifySignupRequestData(
        'test@example.com',
        'Test User',
        'ValidPassword123!',
        invalidData.longOtp
      );

      const response = await makeVerifySignupRequest(appUrl, verifySignupData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Invalid input data');
      expect(responseData.errors).toBeDefined();
    });

    it('should fail with missing required fields', async () => {
      const verifySignupData = {
        email: 'test@example.com',
        // Missing name, password, otp
      };

      const response = await makeVerifySignupRequest(appUrl, verifySignupData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Invalid input data');
      expect(responseData.errors).toBeDefined();
    });

    it('should fail with null values', async () => {
      const verifySignupData = {
        email: null,
        name: null,
        password: null,
        otp: null,
      };

      const response = await makeVerifySignupRequest(appUrl, verifySignupData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Invalid input data');
      expect(responseData.errors).toBeDefined();
    });
  });

  describe('Business Logic Scenarios', () => {
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

      // Create EmailOTP entry for the test
      await createEmailOTP('existing@example.com', '1234');

      // Try to verify signup with the same email
      const verifySignupData = createVerifySignupRequestData(
        'existing@example.com',
        'New User',
        'ValidPassword123!',
        '1234'
      );

      const response = await makeVerifySignupRequest(appUrl, verifySignupData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Failed to create account');
    });

    it('should fail with invalid OTP', async () => {
      // Create EmailOTP entry with a different OTP
      await createEmailOTP('test@example.com', '1234');

      const verifySignupData = createVerifySignupRequestData(
        'test@example.com',
        'Test User',
        'ValidPassword123!',
        '9999' // Wrong OTP
      );

      const response = await makeVerifySignupRequest(appUrl, verifySignupData, 400);
      const responseData = response.body;

      expect(responseData.success).toBe(false);
      expect(responseData.message).toContain('Invalid or expired OTP');
    });

    it('should handle concurrent verify signup attempts', async () => {
      // Initiate signup for multiple emails to create OTPs in database
      const otp1 = await initiateSignupAndGetOTP('concurrent1@example.com', appUrl);
      const otp2 = await initiateSignupAndGetOTP('concurrent2@example.com', appUrl);
      const otp3 = await initiateSignupAndGetOTP('concurrent3@example.com', appUrl);

      const verifySignupData1 = createVerifySignupRequestData(
        'concurrent1@example.com',
        'Concurrent User 1',
        'ValidPassword123!',
        otp1
      );

      const verifySignupData2 = createVerifySignupRequestData(
        'concurrent2@example.com',
        'Concurrent User 2',
        'ValidPassword123!',
        otp2
      );

      const verifySignupData3 = createVerifySignupRequestData(
        'concurrent3@example.com',
        'Concurrent User 3',
        'ValidPassword123!',
        otp3
      );

      // Simulate concurrent requests
      const promises = [
        makeVerifySignupRequest(appUrl, verifySignupData1, 200),
        makeVerifySignupRequest(appUrl, verifySignupData2, 200),
        makeVerifySignupRequest(appUrl, verifySignupData3, 200),
      ];
      const responses = await Promise.all(promises);
      const responseData = responses.map((r: any) => r.body);

      // All requests should succeed
      responseData.forEach((data: any) => {
        expect(data.success).toBe(true);
        expect(data.data.user.email).toMatch(/concurrent\d@example\.com/);
      });
    });
  });

  describe('Response Format Validation', () => {
    it('should return correct HTTP status codes', async () => {
      // Successful verify signup
      const otp = await initiateSignupAndGetOTP('status@example.com', appUrl);
      const verifySignupData = createVerifySignupRequestData(
        'status@example.com',
        'Status User',
        'ValidPassword123!',
        otp
      );
      const response = await makeVerifySignupRequest(appUrl, verifySignupData, 200);
      expect(response.status).toBe(200);

      // Failed verify signup
      const failedVerifySignupData = createVerifySignupRequestData(
        'invalid-email',
        'Test User',
        'ValidPassword123!',
        '1234'
      );
      const failedResponse = await makeVerifySignupRequest(appUrl, failedVerifySignupData, 400);
      expect(failedResponse.status).toBe(400);
    });

    it('should return consistent response structure', async () => {
      const otp = await initiateSignupAndGetOTP('structure@example.com', appUrl);
      const verifySignupData = createVerifySignupRequestData(
        'structure@example.com',
        'Structure User',
        'ValidPassword123!',
        otp
      );

      const response = await makeVerifySignupRequest(appUrl, verifySignupData, 200);
      const responseData = response.body;

      // Check response structure
      expect(responseData).toHaveProperty('success');
      expect(responseData).toHaveProperty('data');
      expect(responseData.data).toHaveProperty('message');
      expect(responseData.data).toHaveProperty('user');
      expect(responseData.data).toHaveProperty('token');
      expect(typeof responseData.success).toBe('boolean');
      expect(typeof responseData.data.message).toBe('string');
      expect(typeof responseData.data.user).toBe('object');
      expect(typeof responseData.data.token).toBe('string');
    });
  });
});
