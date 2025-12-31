/**
 * Centralized error definitions with error codes and messages
 * Used across both frontend and backend for consistency
 */

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

export interface AppError {
  code: string;
  message: string;
  httpStatus: number;
}

export const ERRORS = {
  // Authentication Errors (AUTH_xxx)
  AUTH_REQUIRED: {
    code: 'AUTH_REQUIRED',
    message: 'Authentication required',
    httpStatus: 401,
  },
  AUTH_USER_NOT_FOUND: {
    code: 'AUTH_USER_NOT_FOUND',
    message: 'Your account could not be found. Please try signing out and signing back in.',
    httpStatus: 404,
  },
  AUTH_INVALID_TOKEN: {
    code: 'AUTH_INVALID_TOKEN',
    message: 'Authentication error. Please sign out and sign back in.',
    httpStatus: 401,
  },
  AUTH_INSUFFICIENT_CREDITS: {
    code: 'AUTH_INSUFFICIENT_CREDITS',
    message: 'Insufficient credits to perform this action.',
    httpStatus: 402,
  },

  // Validation Errors (VALIDATION_xxx)
  VALIDATION_FAILED: {
    code: 'VALIDATION_FAILED',
    message: 'Validation failed',
    httpStatus: 400,
  },
  VALIDATION_EMAIL_INVALID: {
    code: 'VALIDATION_EMAIL_INVALID',
    message: 'Invalid email address',
    httpStatus: 400,
  },
  VALIDATION_FILE_TYPE_INVALID: {
    code: 'VALIDATION_FILE_TYPE_INVALID',
    message: 'Invalid file type. Please upload a supported file format.',
    httpStatus: 400,
  },
  VALIDATION_FILE_SIZE_EXCEEDED: {
    code: 'VALIDATION_FILE_SIZE_EXCEEDED',
    message: 'File size exceeds the maximum allowed limit.',
    httpStatus: 400,
  },

  // Package Errors (PACKAGE_xxx)
  PACKAGE_NOT_FOUND: {
    code: 'PACKAGE_NOT_FOUND',
    message: 'Package not found',
    httpStatus: 404,
  },
  PACKAGE_CREATION_FAILED: {
    code: 'PACKAGE_CREATION_FAILED',
    message: 'Failed to create package. Please try again.',
    httpStatus: 500,
  },
  PACKAGE_UPDATE_FAILED: {
    code: 'PACKAGE_UPDATE_FAILED',
    message: 'Failed to update package. Please try again.',
    httpStatus: 500,
  },
  PACKAGE_DELETE_FAILED: {
    code: 'PACKAGE_DELETE_FAILED',
    message: 'Failed to delete package. Please try again.',
    httpStatus: 500,
  },

  // File Errors (FILE_xxx)
  FILE_NOT_FOUND: {
    code: 'FILE_NOT_FOUND',
    message: 'File not found',
    httpStatus: 404,
  },
  FILE_UPLOAD_FAILED: {
    code: 'FILE_UPLOAD_FAILED',
    message: 'Failed to upload file. Please try again.',
    httpStatus: 500,
  },
  FILE_DELETE_FAILED: {
    code: 'FILE_DELETE_FAILED',
    message: 'Failed to delete file. Please try again.',
    httpStatus: 500,
  },
  FILE_PROCESSING_FAILED: {
    code: 'FILE_PROCESSING_FAILED',
    message: 'Failed to process file. Please check the file format and try again.',
    httpStatus: 500,
  },
  FILE_SIZE_TOO_LARGE: {
    code: 'FILE_SIZE_TOO_LARGE',
    message: 'File size is too large. Please upload a smaller file.',
    httpStatus: 413,
  },

  // Database Errors (DB_xxx)
  DB_CONNECTION_FAILED: {
    code: 'DB_CONNECTION_FAILED',
    message: 'Unable to connect to the database. Please try again in a moment.',
    httpStatus: 503,
  },
  DB_TIMEOUT: {
    code: 'DB_TIMEOUT',
    message: 'Database operation timed out. Please try again.',
    httpStatus: 408,
  },
  DB_CONSTRAINT_VIOLATION: {
    code: 'DB_CONSTRAINT_VIOLATION',
    message: 'Invalid data provided. Please check your information and try again.',
    httpStatus: 400,
  },
  DB_RECORD_NOT_FOUND: {
    code: 'DB_RECORD_NOT_FOUND',
    message: 'Required information not found. Please refresh the page and try again.',
    httpStatus: 404,
  },
  DB_OPERATION_FAILED: {
    code: 'DB_OPERATION_FAILED',
    message: 'Database error occurred. Please try again or contact support if the issue persists.',
    httpStatus: 500,
  },

  // Network Errors (NETWORK_xxx)
  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    message: 'Network error. Please check your internet connection and try again.',
    httpStatus: 503,
  },
  NETWORK_TIMEOUT: {
    code: 'NETWORK_TIMEOUT',
    message: 'Request timed out. Please try again.',
    httpStatus: 408,
  },

  // Contact Errors (CONTACT_xxx)
  CONTACT_NOT_FOUND: {
    code: 'CONTACT_NOT_FOUND',
    message: 'Contact submission not found',
    httpStatus: 404,
  },
  CONTACT_CREATION_FAILED: {
    code: 'CONTACT_CREATION_FAILED',
    message: 'Failed to create contact submission. Please try again.',
    httpStatus: 500,
  },
  CONTACT_UPDATE_FAILED: {
    code: 'CONTACT_UPDATE_FAILED',
    message: 'Failed to update contact submission. Please try again.',
    httpStatus: 500,
  },
  CONTACT_DELETE_FAILED: {
    code: 'CONTACT_DELETE_FAILED',
    message: 'Failed to delete contact submission. Please try again.',
    httpStatus: 500,
  },
  CONTACT_FETCH_FAILED: {
    code: 'CONTACT_FETCH_FAILED',
    message: 'Failed to fetch contact submissions. Please try again.',
    httpStatus: 500,
  },

  // Generic Errors (GENERIC_xxx)
  GENERIC_INTERNAL_ERROR: {
    code: 'GENERIC_INTERNAL_ERROR',
    message: 'An unexpected error occurred. Please try again.',
    httpStatus: 500,
  },
  GENERIC_BAD_REQUEST: {
    code: 'GENERIC_BAD_REQUEST',
    message: 'Invalid request. Please check your information and try again.',
    httpStatus: 400,
  },
  GENERIC_FORBIDDEN: {
    code: 'GENERIC_FORBIDDEN',
    message: 'You do not have permission to perform this action.',
    httpStatus: 403,
  },
} as const;

/**
 * Create an error object from predefined errors
 */
export class AppErrorClass extends Error {
  code: string;

  httpStatus: number;

  constructor(error: AppError, originalError?: Error) {
    super(error.message);
    this.name = 'AppError';
    this.code = error.code;
    this.httpStatus = error.httpStatus;

    if (originalError?.stack) {
      this.stack = originalError.stack;
    }
  }
}

/**
 * Map Prisma error codes to application errors
 */
// Prisma Error referrence https://www.prisma.io/docs/orm/reference/error-reference
export function mapPrismaError(prismaError: PrismaClientKnownRequestError): AppError {
  switch (prismaError.code) {
    case 'P2002':
      // Unique constraint violation
      if ((prismaError.meta?.target as Array<string>).includes('name')) {
        // Could be package title, knowledge base title, etc.
        return ERRORS.DB_CONSTRAINT_VIOLATION;
      }
      if ((prismaError.meta?.target as Array<string>).includes('email')) {
        return ERRORS.VALIDATION_EMAIL_INVALID;
      }
      return ERRORS.DB_CONSTRAINT_VIOLATION;

    case 'P2003':
      // Foreign key constraint violation
      return ERRORS.DB_CONSTRAINT_VIOLATION;

    case 'P2025':
      // Record not found
      return ERRORS.DB_RECORD_NOT_FOUND;

    case 'P1001':
      // Connection error
      return ERRORS.DB_CONNECTION_FAILED;

    case 'P1008':
      // Timeout
      return ERRORS.DB_TIMEOUT;

    default:
      return ERRORS.DB_OPERATION_FAILED;
  }
}

/**
 * Get error by code
 */
export function getErrorByCode(code: string): AppError | null {
  const errorKey = Object.keys(ERRORS).find(
    key => ERRORS[key as keyof typeof ERRORS].code === code
  );
  return errorKey ? ERRORS[errorKey as keyof typeof ERRORS] : null;
}

/**
 * Check if error is an application error
 */
export function isAppError(error: { code: string; httpStatus: number }): error is AppErrorClass {
  return (
    error instanceof AppErrorClass ||
    (typeof error?.code === 'string' &&
      !!error.code &&
      typeof error?.httpStatus === 'number' &&
      Number.isFinite(error.httpStatus))
  );
}
