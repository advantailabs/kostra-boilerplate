import { UserRole } from '@/lib/prisma/generated/client';
import { isValidJWTToken } from './auth';

// Validation utilities for tests
export function validateApiResponse(response: any, expectedSuccess: boolean = true) {
  if (typeof response !== 'object' || response === null) {
    throw new Error('Response must be an object');
  }

  if (typeof response.success !== 'boolean') {
    throw new Error('Response must have a success boolean field');
  }

  if (response.success !== expectedSuccess) {
    throw new Error(`Expected success to be ${expectedSuccess}, got ${response.success}`);
  }

  // For success responses, message is in response.data.message
  // For error responses, message is in response.message
  if (expectedSuccess) {
    if (response.data && typeof response.data.message !== 'string') {
      throw new Error('Success response must have a message string field in data');
    }
  } else if (typeof response.message !== 'string') {
    throw new Error('Error response must have a message string field');
  }

  if (expectedSuccess && response.data) {
    if (typeof response.data !== 'object') {
      throw new Error('Response data must be an object when success is true');
    }
  }
}

export function validateErrorResponse(response: any) {
  validateApiResponse(response, false);

  // Error responses should not have data field (or if they do, it should be undefined)
  if (response.data !== undefined && response.data !== null) {
    throw new Error('Error response should not have data field');
  }
}

/**
 * Validates user data structure returned from API
 */
export function validateUserData(userData: any) {
  const requiredFields = ['id', 'email', 'name', 'role'];

  for (const field of requiredFields) {
    if (!(field in userData)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (typeof userData.id !== 'number') {
    throw new Error('User ID must be a number');
  }

  if (typeof userData.email !== 'string' || !userData.email.includes('@')) {
    throw new Error('Invalid email format');
  }

  if (typeof userData.name !== 'string' || userData.name.length === 0) {
    throw new Error('Invalid name');
  }

  if (!Object.values(UserRole).includes(userData.role)) {
    throw new Error('Invalid user role');
  }
}

/**
 * Validates login response structure
 */
export function validateLoginResponse(response: any) {
  validateApiResponse(response, true);

  if (!response.data) {
    throw new Error('Login response must have data field');
  }

  if (response.data.user) {
    validateUserData(response.data.user);
  }

  if (response.data.token) {
    if (!isValidJWTToken(response.data.token)) {
      throw new Error('Invalid JWT token format');
    }
  }
}

/**
 * Validates logout response structure
 */
export function validateLogoutResponse(response: any) {
  validateApiResponse(response, true);

  if (!response.data) {
    throw new Error('Logout response must have data field');
  }

  if (typeof response.data.success !== 'boolean') {
    throw new Error('Logout response data must have success boolean field');
  }

  if (typeof response.data.message !== 'string') {
    throw new Error('Logout response data must have message string field');
  }

  if (response.data.success !== true) {
    throw new Error('Logout response data success must be true');
  }
}

/**
 * Validates signup response structure
 */
export function validateSignupResponse(response: any) {
  validateApiResponse(response, true);

  if (!response.data) {
    throw new Error('Signup response must have data field');
  }

  if (typeof response.data.message !== 'string') {
    throw new Error('Signup response data must have message string field');
  }
}

/**
 * Validates verify signup response structure
 */
export function validateVerifySignupResponse(response: any) {
  validateApiResponse(response, true);

  if (!response.data) {
    throw new Error('Verify signup response must have data field');
  }

  if (typeof response.data.message !== 'string') {
    throw new Error('Verify signup response data must have message string field');
  }

  if (response.data.user) {
    validateUserData(response.data.user);
  }

  if (response.data.token) {
    if (!isValidJWTToken(response.data.token)) {
      throw new Error('Invalid JWT token format');
    }
  }
}
