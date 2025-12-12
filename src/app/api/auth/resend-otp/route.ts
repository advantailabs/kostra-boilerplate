import { OtpPurpose } from '@/lib/prisma/generated/client';
import {
  badRequestResponse,
  formatZodError,
  internalServerErrorResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/utils';
import { resendOTPSchema } from '@/schemas/auth.schema';
import { OTPService } from '@/services/internal/email/otp';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = resendOTPSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse('Invalid input data', formatZodError(validationResult.error));
    }

    const { email, purpose } = validationResult.data;

    const result = await OTPService.resendOTP({
      email,
      purpose: purpose as OtpPurpose,
    });

    if (!result.success) {
      return badRequestResponse(result.message);
    }

    return successResponse({
      message: result.message,
    });
  } catch (error) {
    console.error('Resend OTP API error:', error);
    return internalServerErrorResponse();
  }
}
