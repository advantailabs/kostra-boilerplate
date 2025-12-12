import { OtpPurpose } from '@/lib/prisma/generated/client';
import { emailOTPRepository } from '@/services/repositories/email-otp';
import { EmailService } from './email';

export interface GenerateOTPData {
  email: string;
  purpose: OtpPurpose;
}

export interface VerifyOTPData {
  email: string;
  otp: string;
  purpose: OtpPurpose;
}

export class OTPService {
  private static readonly OTP_LENGTH = 4;

  private static readonly OTP_EXPIRY_MINUTES = 10;

  private static readonly MAX_OTP_ATTEMPTS = 3;

  /**
   * Generate a random OTP
   */
  private static generateOTP(): string {
    const min = 10 ** (this.OTP_LENGTH - 1);
    const max = 10 ** this.OTP_LENGTH - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }

  /**
   * Calculate OTP expiry time
   */
  private static getOTPExpiryTime(): Date {
    const now = new Date();
    now.setMinutes(now.getMinutes() + this.OTP_EXPIRY_MINUTES);
    return now;
  }

  /**
   * Generate and send OTP
   */
  static async generateAndSendOTP(
    data: GenerateOTPData
  ): Promise<{ success: boolean; message: string }> {
    const { email, purpose } = data;

    try {
      // Check if there are too many active OTPs for this email
      const activeOTPCount = await emailOTPRepository.countActiveOTPs(email, purpose);

      if (activeOTPCount >= this.MAX_OTP_ATTEMPTS) {
        return {
          success: false,
          message: 'Too many OTP requests. Please wait before requesting another OTP.',
        };
      }

      // Delete any existing OTPs for this email and purpose
      await emailOTPRepository.deleteAllOTPsForEmail(email, purpose);

      // Generate new OTP
      const otp = this.generateOTP();
      const expiringAt = this.getOTPExpiryTime();

      // Save OTP to database
      await emailOTPRepository.create({
        email,
        otp,
        purpose,
        expiringAt,
      });

      // Send OTP via email
      await EmailService.sendOTPEmail({
        email,
        otp,
        purpose,
      });

      return {
        success: true,
        message: 'OTP sent successfully to your email address.',
      };
    } catch (error) {
      console.error('Error generating and sending OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP. Please try again later.',
      };
    }
  }

  /**
   * Verify OTP
   */
  static async verifyOTP(data: VerifyOTPData): Promise<{ success: boolean; message: string }> {
    const { email, otp, purpose } = data;

    try {
      const isValid = await emailOTPRepository.verifyAndDeleteOTP(email, otp, purpose);

      if (isValid) {
        return {
          success: true,
          message: 'OTP verified successfully.',
        };
      }
      return {
        success: false,
        message: 'Invalid or expired OTP. Please try again.',
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'Failed to verify OTP. Please try again later.',
      };
    }
  }

  /**
   * Resend OTP
   */
  static async resendOTP(data: GenerateOTPData): Promise<{ success: boolean; message: string }> {
    return this.generateAndSendOTP(data);
  }

  /**
   * Clean up expired OTPs (can be called by a cron job)
   */
  static async cleanupExpiredOTPs(): Promise<number> {
    return emailOTPRepository.cleanupExpiredOTPs();
  }
}
