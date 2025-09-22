import {
  badRequestResponse,
  internalServerErrorResponse,
  successResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { formatZodError } from '@/lib/utils/validation';
import { forgotPasswordSchema } from '@/schemas/auth.schema';
import { AuthService } from '@/services/internal/auth';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = forgotPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse('Invalid input data', formatZodError(validationResult.error));
    }

    const { email } = validationResult.data;

    const result = await AuthService.initiatePasswordReset(email);

    if (!result.success) {
      return badRequestResponse(result.message);
    }

    return successResponse({
      message: result.message,
    });
  } catch (error) {
    console.error('Forgot password API error:', error);
    return internalServerErrorResponse();
  }
}
