import { setAuthCookie } from '@/lib/auth/jwt';
import {
    badRequestResponse,
    formatZodError,
    internalServerErrorResponse,
    successResponse,
    validationErrorResponse,
} from '@/lib/utils';
import { verifySignupSchema } from '@/schemas/auth.schema';
import { AuthService } from '@/services/internal/auth/auth';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = verifySignupSchema.safeParse(body);

    if (!validationResult.success) {
      return validationErrorResponse('Invalid input data', formatZodError(validationResult.error));
    }

    const { email, password, name, otp } = validationResult.data;

    const result = await AuthService.completeSignup({
      email,
      password,
      name,
      otp,
    });

    if (!result.success) {
      return badRequestResponse(result.message);
    }

    // Set the token in an HTTP-only cookie (same as Google login)
    if (result.data?.token) {
      await setAuthCookie(result.data.token);
    }

    return successResponse({
      message: result.message,
      user: result.data?.user,
      token: result.data?.token,
    });
  } catch (error) {
    console.error('Verify signup API error:', error);
    return internalServerErrorResponse();
  }
}
