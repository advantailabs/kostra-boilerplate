import { OtpPurpose, UserPlan, UserRole } from '@/lib/prisma/generated/client';
import request from 'supertest';
import { hashPassword } from '../../lib/utils/password/password';
import { createTestUser, testPrisma } from '../setup';

/**
 * Test helper functions for authentication-related tests
 */

export interface CreateTestUserOptions {
  email?: string;
  password?: string;
  name?: string;
  role?: UserRole;
  isOnboarded?: boolean;
  credits?: number;
  plan?: UserPlan;
  isOverDue?: boolean;
  googleId?: string;
  stripeCustomerId?: string;
  profilePicture?: string;
}

/**
 * Creates a test user with hashed password for authentication tests
 */
export async function createTestUserWithPassword(options: CreateTestUserOptions = {}) {
  const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  const hashedPassword = await hashPassword(options.password || 'TestPassword123!');

  return createTestUser({
    email: options.email || `test${uniqueId}@example.com`,
    password: hashedPassword,
    name: options.name || 'Test User',
    role: options.role || UserRole.USER,
    isOnboarded: options.isOnboarded ?? true,
    credits: options.credits ?? 100,
    plan: options.plan || UserPlan.FREE,
    isOverDue: options.isOverDue ?? false,
    googleId: options.googleId || null,
    stripeCustomerId: options.stripeCustomerId || null,
    profilePicture: options.profilePicture || null,
  });
}

/**
 * Creates a test user without password (Google-only user)
 */
export async function createGoogleOnlyTestUser(options: CreateTestUserOptions = {}) {
  const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

  return createTestUser({
    email: options.email || `google${uniqueId}@example.com`,
    password: null, // No password for Google-only users
    name: options.name || 'Google User',
    role: options.role || UserRole.USER,
    isOnboarded: options.isOnboarded ?? true,
    credits: options.credits ?? 100,
    plan: options.plan || UserPlan.FREE,
    isOverDue: options.isOverDue ?? false,
    googleId: options.googleId || `google_${uniqueId}`,
    stripeCustomerId: options.stripeCustomerId || null,
    profilePicture: options.profilePicture || null,
  });
}

/**
 * Creates multiple test users for bulk operations
 */
export async function createMultipleTestUsers(count: number, options: CreateTestUserOptions = {}) {
  const users = [];
  for (let i = 0; i < count; i += 1) {
    const user = await createTestUserWithPassword({
      ...options,
      email: options.email ? `${i}_${options.email}` : undefined,
    });
    users.push(user);
  }
  return users;
}

/**
 * Validates that a user exists in the database
 */
export async function userExists(email: string) {
  const user = await testPrisma.user.findUnique({
    where: { email },
  });
  return !!user;
}

/**
 * Gets user by email for verification
 */
export async function getUserByEmail(email: string) {
  return testPrisma.user.findUnique({
    where: { email },
  });
}

/**
 * Validates JWT token structure (basic validation)
 */
export function isValidJWTToken(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }

  // JWT tokens have 3 parts separated by dots
  const parts = token.split('.');
  return parts.length === 3;
}

/**
 * Extracts user data from JWT token payload (for testing purposes)
 * Note: This is a simplified version for testing, not for production use
 */
export function extractJWTClaims(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to extract JWT claims');
  }
}

/**
 * Creates test data for login requests
 */
export function createLoginRequestData(email: string, password: string) {
  return {
    email,
    password,
  };
}

/**
 * Creates invalid test data for validation testing
 */
export function createInvalidLoginData() {
  return {
    invalidEmail: 'not-an-email',
    emptyEmail: '',
    emptyPassword: '',
    shortPassword: '123',
    nullEmail: null,
    nullPassword: null,
    undefinedEmail: undefined,
    undefinedPassword: undefined,
  };
}

/**
 * Helper function to make login requests using supertest
 */
export async function makeLoginRequest(
  appUrl: string,
  loginData: any,
  expectedStatus: number = 200
) {
  return request(appUrl)
    .post('/api/auth/login')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(loginData)
    .expect(expectedStatus);
}

/**
 * Helper function to make logout requests using supertest
 */
export async function makeLogoutRequest(
  appUrl: string,
  authToken?: string,
  expectedStatus: number = 200
) {
  const req = request(appUrl)
    .post('/api/auth/logout')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');

  // Add auth token if provided
  if (authToken) {
    req.set('Authorization', `Bearer ${authToken}`);
  }

  return req.expect(expectedStatus);
}

/**
 * Helper function to make logout requests with cookies using supertest
 */
export async function makeLogoutRequestWithCookies(
  appUrl: string,
  cookies: string[] = [],
  expectedStatus: number = 200
) {
  const req = request(appUrl)
    .post('/api/auth/logout')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');

  // Add cookies if provided
  if (cookies.length > 0) {
    req.set('Cookie', cookies.join('; '));
  }

  return req.expect(expectedStatus);
}

/**
 * Creates test data for signup requests
 */
export function createSignupRequestData(email: string) {
  return {
    email,
  };
}

/**
 * Creates test data for verify signup requests
 */
export function createVerifySignupRequestData(
  email: string,
  name: string,
  password: string,
  otp: string
) {
  return {
    email,
    name,
    password,
    otp,
  };
}

/**
 * Creates invalid test data for signup validation testing
 */
export function createInvalidSignupData() {
  return {
    invalidEmail: 'not-an-email',
    emptyEmail: '',
    nullEmail: null,
    undefinedEmail: undefined,
  };
}

/**
 * Creates invalid test data for verify signup validation testing
 */
export function createInvalidVerifySignupData() {
  return {
    invalidEmail: 'not-an-email',
    emptyEmail: '',
    emptyName: '',
    shortPassword: '123',
    invalidOtp: '12',
    longOtp: '12345',
    nullEmail: null,
    nullName: null,
    nullPassword: null,
    nullOtp: null,
  };
}

/**
 * Helper function to make signup requests using supertest
 */
export async function makeSignupRequest(
  appUrl: string,
  signupData: any,
  expectedStatus: number = 200
) {
  return request(appUrl)
    .post('/api/auth/signup')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(signupData)
    .expect(expectedStatus);
}

/**
 * Helper function to make verify signup requests using supertest
 */
export async function makeVerifySignupRequest(
  appUrl: string,
  verifySignupData: any,
  expectedStatus: number = 200
) {
  return request(appUrl)
    .post('/api/auth/verify-signup')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(verifySignupData)
    .expect(expectedStatus);
}

/**
 * Initiates signup and retrieves the generated OTP from the database
 * This helper function simulates the real signup flow by calling the signup endpoint
 * and then extracting the OTP that was created in the database
 */
export async function initiateSignupAndGetOTP(email: string, appUrl: string): Promise<string> {
  // First, initiate signup to create OTP in database
  const signupData = { email };
  await makeSignupRequest(appUrl, signupData, 200);

  // Get the OTP from database
  const otpEntry = await testPrisma.emailOTP.findFirst({
    where: { email, purpose: OtpPurpose.SIGNUP },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpEntry) {
    throw new Error('No OTP found in database after signup');
  }

  return otpEntry.otp;
}

export async function getAdminUserCookie(appUrl: string): Promise<string> {
  const loginData = {
    email: 'admin@example.com',
    password: 'AdminPassword123!',
  };

  const loginResponse = await makeLoginRequest(appUrl, loginData, 200);

  // Extract Cookie from headers
  const authCookie = loginResponse.headers['set-cookie'][0];

  return authCookie;
}
