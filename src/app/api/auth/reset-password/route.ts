import {
  badRequestResponse,
  formatZodError,
  internalServerErrorResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/utils';
import { AuthService } from '@/services/internal/auth/auth';
import { NextRequest } from 'next/server';
import { z } from 'zod';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  otp: z.string().length(4, 'OTP must be 4 digits'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = resetPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse('Invalid input data', formatZodError(validationResult.error));
    }

    const { email, newPassword, otp } = validationResult.data;

    const result = await AuthService.completePasswordReset({
      email,
      newPassword,
      otp,
    });

    if (!result.success) {
      return badRequestResponse(result.message);
    }

    return successResponse({
      message: result.message,
    });
  } catch (error) {
    console.error('Reset password API error:', error);
    return internalServerErrorResponse();
  }
}
