/**
 * Email-related constants
 */

export const EMAIL_CONSTANTS = {
  // OTP Email Subjects
  SUBJECTS: {
    SIGNUP: 'Verify Your Email - Kostra',
    PASSWORD_RESET: 'Reset Your Password - Kostra',
  },

  // OTP Email Headers
  HEADERS: {
    SIGNUP: 'Verify Your Email',
    PASSWORD_RESET: 'Reset Your Password',
  },

  // OTP Email Instructions
  INSTRUCTIONS: {
    SIGNUP: 'Use the verification code below to complete your email verification process.',
    PASSWORD_RESET: 'Use the verification code below to reset your password.',
  },

  // OTP Email Disclaimers
  DISCLAIMERS: {
    SIGNUP: 'If you did not request this, you can safely ignore this email.',
    PASSWORD_RESET: 'If you did not request this password reset, you can safely ignore this email.',
  },

  // OTP Expiry
  OTP_EXPIRY_MINUTES: 10,
} as const;
