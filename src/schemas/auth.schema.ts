import { z } from 'zod';

/**
 * Authentication schemas for API validation
 */

// Signup schema (Step 1: Only email)
export const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Verify signup schema (Step 2: OTP verification and password setup)
export const verifySignupSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  otp: z.string().length(4, 'OTP must be 4 digits'),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  otp: z.string().length(4, 'OTP must be 4 digits'),
});

// Resend OTP schema
export const resendOTPSchema = z.object({
  email: z.string().email('Invalid email format'),
  purpose: z.enum(['SIGNUP', 'PASSWORD_RESET']),
});

// Google sign-in schema
export const googleSignInSchema = z.object({
  credential: z.string().min(1, 'Credential is required'),
});

// Type exports
export type SignupData = z.infer<typeof signupSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type VerifySignupData = z.infer<typeof verifySignupSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type ResendOTPData = z.infer<typeof resendOTPSchema>;
export type GoogleSignInData = z.infer<typeof googleSignInSchema>;
