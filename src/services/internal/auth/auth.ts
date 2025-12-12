import { generateJWT } from '@/lib/auth/jwt';
import { OtpPurpose, UserRole } from '@/lib/prisma/generated/client';
import { comparePassword, hashPassword, validatePassword } from '@/lib/utils';
import { emailOTPRepository } from '../../repositories/email-otp';
import { createUser, getUserByEmail, updateUserByEmail } from '../../repositories/user';
import { OTPService } from '../email/otp';

export interface SignupData {
  email: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
  newPassword: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  data?: {
    user?: {
      id: number;
      email: string;
      name: string;
      role: UserRole;
    };
    token?: string;
  };
}

export class AuthService {
  /**
   * Initiate signup process - send OTP
   */
  static async initiateSignup(data: SignupData): Promise<AuthResult> {
    const { email } = data;

    try {
      // Check if user already exists
      const existingUser = await getUserByEmail(email);

      if (existingUser) {
        return {
          success: false,
          message: 'An account with this email already exists.',
        };
      }

      // Generate and send OTP
      const otpResult = await OTPService.generateAndSendOTP({
        email,
        purpose: OtpPurpose.SIGNUP,
      });

      if (!otpResult.success) {
        return {
          success: false,
          message: otpResult.message,
        };
      }

      return {
        success: true,
        message: 'OTP sent to your email address. Please verify to complete registration.',
      };
    } catch (error) {
      console.error('Error initiating signup:', error);
      return {
        success: false,
        message: 'Failed to initiate signup. Please try again later.',
      };
    }
  }

  /**
   * Complete signup after OTP verification
   */
  static async completeSignup(data: {
    email: string;
    name: string;
    password: string;
    otp: string;
  }): Promise<AuthResult> {
    const { email, name, password, otp } = data;

    try {
      // Verify OTP
      const otpResult = await OTPService.verifyOTP({
        email,
        otp,
        purpose: OtpPurpose.SIGNUP,
      });

      if (!otpResult.success) {
        return {
          success: false,
          message: otpResult.message,
        };
      }

      // Validate password strength
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          message: `Password validation failed: ${passwordValidation.errors.join(', ')}`,
        };
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await createUser({
        email,
        name,
        password: hashedPassword,
        role: UserRole.USER,
        isOnboarded: true,
      });

      // Generate JWT token
      const token = await generateJWT({
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        profilePicture: user.profilePicture || undefined,
        isOnboarded: user.isOnboarded,
        credits: user.credits || 0,
        plan: user.plan || 'FREE',
        isOverdue: user.isOverDue || false,
        planExpiringAt: user.planExpiringAt?.toISOString(),
        googleId: user.googleId || '',
        stripeCustomerId: user.stripeCustomerId || undefined,
      });

      return {
        success: true,
        message: 'Account created successfully!',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token,
        },
      };
    } catch (error) {
      console.error('Error completing signup:', error);
      return {
        success: false,
        message: 'Failed to create account. Please try again later.',
      };
    }
  }

  /**
   * Login user
   */
  static async login(data: LoginData): Promise<AuthResult> {
    const { email, password } = data;

    try {
      // Find user
      const user = await getUserByEmail(email);

      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password.',
        };
      }

      // Check if user has a password (not Google-only user)
      if (!user.password) {
        return {
          success: false,
          message: 'Please use Google sign-in for this account.',
        };
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password.',
        };
      }

      // Generate JWT token
      const token = await generateJWT({
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        profilePicture: user.profilePicture || undefined,
        isOnboarded: user.isOnboarded,
        credits: user.credits || 0,
        plan: user.plan || 'FREE',
        isOverdue: user.isOverDue || false,
        planExpiringAt: user.planExpiringAt?.toISOString(),
        googleId: user.googleId || '',
        stripeCustomerId: user.stripeCustomerId || undefined,
      });

      return {
        success: true,
        message: 'Login successful!',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token,
        },
      };
    } catch (error) {
      console.error('Error during login:', error);
      return {
        success: false,
        message: 'Login failed. Please try again later.',
      };
    }
  }

  /**
   * Initiate password reset - send OTP
   */
  static async initiatePasswordReset(email: string): Promise<AuthResult> {
    try {
      // Check if user exists
      const user = await getUserByEmail(email);

      if (!user) {
        return {
          success: false,
          message: 'No account found with this email address.',
        };
      }

      // Generate and send OTP
      const otpResult = await OTPService.generateAndSendOTP({
        email,
        purpose: OtpPurpose.PASSWORD_RESET,
      });

      if (!otpResult.success) {
        return {
          success: false,
          message: otpResult.message,
        };
      }

      return {
        success: true,
        message: 'OTP sent to your email address. Please verify to reset your password.',
      };
    } catch (error) {
      console.error('Error initiating password reset:', error);
      return {
        success: false,
        message: 'Failed to initiate password reset. Please try again later.',
      };
    }
  }

  /**
   * Complete password reset after OTP verification
   */
  static async completePasswordReset(
    data: ResetPasswordData & { otp: string }
  ): Promise<AuthResult> {
    const { email, newPassword, otp } = data;

    try {
      // Verify OTP
      const otpResult = await OTPService.verifyOTP({
        email,
        otp,
        purpose: OtpPurpose.PASSWORD_RESET,
      });

      if (!otpResult.success) {
        return {
          success: false,
          message: otpResult.message,
        };
      }

      // Validate new password strength
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          message: `Password validation failed: ${passwordValidation.errors.join(', ')}`,
        };
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update user password
      await updateUserByEmail(email, { password: hashedPassword });

      // Purge all remaining PASSWORD_RESET OTPs for this email
      await emailOTPRepository.deleteAllOTPsForEmail(email, OtpPurpose.PASSWORD_RESET);

      return {
        success: true,
        message: 'Password reset successfully! You can now login with your new password.',
      };
    } catch (error) {
      console.error('Error completing password reset:', error);
      return {
        success: false,
        message: 'Failed to reset password. Please try again later.',
      };
    }
  }
}
