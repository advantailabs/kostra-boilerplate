import { getAuthUser } from '@/lib/auth/jwt';
import {
  AppErrorClass,
  errorResponse,
  formatZodError,
  internalServerErrorResponse,
  mapPrismaError,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils';
import { contactService } from '@/services/internal/contact';
import { contactFormSchema } from '@/validations/contact';
import { ContactPurpose, ContactStatus } from '@prisma/client';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = contactFormSchema.safeParse(body);
    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    const { name, email, purpose, message } = validationResult.data as {
      name: string;
      email: string;
      purpose: string;
      message: string;
    };

    // Get authenticated user if available
    let userId: number | undefined;
    try {
      const authUser = await getAuthUser(request);
      if (authUser?.userId) {
        userId = parseInt(authUser.userId.toString(), 10);
      }
    } catch (error) {
      // User not authenticated, continue without userId
      console.log('No authenticated user for contact submission');
    }

    // Create contact submission
    const submission = await contactService.createContactSubmission({
      userId,
      name,
      email,
      purpose,
      message,
    });

    return successResponse({
      data: submission,
      message: 'Contact submission created successfully',
    });
  } catch (error) {
    console.error('Contact submission error:', error);

    if (error instanceof AppErrorClass) {
      return errorResponse(error);
    }

    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const appError = mapPrismaError(error);
      return errorResponse(appError);
    }

    return internalServerErrorResponse('Failed to create contact submission');
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authentication is handled by route-level middleware; only ensure presence
    const authUser = await getAuthUser(request);
    if (!authUser?.userId) return unauthorizedResponse();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const rawStatus = searchParams.get('status');
    const rawPurpose = searchParams.get('purpose');
    const filters = {
      status: (rawStatus as ContactStatus) || undefined,
      purpose: (rawPurpose as ContactPurpose) || undefined,
      search: (searchParams.get('search') as string) || undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '20', 10),
    };

    const result = await contactService.getContactSubmissions(filters);

    return successResponse({
      data: result,
      message: 'Contact submissions retrieved successfully',
    });
  } catch (error) {
    console.error('Get contact submissions error:', error);

    if (error instanceof AppErrorClass) {
      return errorResponse(error);
    }

    return internalServerErrorResponse('Failed to fetch contact submissions');
  }
}
