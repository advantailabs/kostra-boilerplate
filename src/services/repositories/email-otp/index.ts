import { prisma } from '@/lib/prisma';
import { OtpPurpose } from '@/lib/prisma/generated/client';

export interface CreateEmailOTPData {
  email: string;
  otp: string;
  purpose: OtpPurpose;
  expiringAt: Date;
}

export interface EmailOTPWithExpiry {
  id: number;
  email: string;
  otp: string;
  purpose: OtpPurpose;
  expiringAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const emailOTPRepository = {
  /**
   * Create a new OTP record
   */
  async create(data: CreateEmailOTPData): Promise<EmailOTPWithExpiry> {
    return prisma.emailOTP.create({
      data,
    });
  },

  /**
   * Find a valid OTP by email and purpose
   */
  async findValidOTP(email: string, purpose: OtpPurpose): Promise<EmailOTPWithExpiry | null> {
    return prisma.emailOTP.findFirst({
      where: {
        email,
        purpose,
        expiringAt: {
          gt: new Date(), // Only get non-expired OTPs
        },
      },
      orderBy: {
        createdAt: 'desc', // Get the most recent OTP
      },
    });
  },

  /**
   * Verify OTP and mark as used (delete the record)
   */
  async verifyAndDeleteOTP(email: string, otp: string, purpose: OtpPurpose): Promise<boolean> {
    const otpRecord = await prisma.emailOTP.findFirst({
      where: {
        email,
        otp,
        purpose,
        expiringAt: {
          gt: new Date(), // Only verify non-expired OTPs
        },
      },
    });

    if (!otpRecord) {
      return false;
    }

    // Delete the OTP record after successful verification
    await prisma.emailOTP.delete({
      where: {
        id: otpRecord.id,
      },
    });

    return true;
  },

  /**
   * Delete all OTPs for a specific email and purpose
   */
  async deleteAllOTPsForEmail(email: string, purpose: OtpPurpose): Promise<void> {
    await prisma.emailOTP.deleteMany({
      where: {
        email,
        purpose,
      },
    });
  },

  /**
   * Clean up expired OTPs
   */
  async cleanupExpiredOTPs(): Promise<number> {
    const result = await prisma.emailOTP.deleteMany({
      where: {
        expiringAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  },

  /**
   * Count active OTPs for an email and purpose
   */
  async countActiveOTPs(email: string, purpose: OtpPurpose): Promise<number> {
    return prisma.emailOTP.count({
      where: {
        email,
        purpose,
        expiringAt: {
          gt: new Date(),
        },
      },
    });
  },
};
