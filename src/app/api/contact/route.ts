import { getAuthUser } from '@/lib/auth/jwt';
import { ContactPurpose, ContactStatus } from '@/lib/prisma/generated/client';
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
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

import { contactFiltersSchema } from '@/schemas/contact.schema';
import { contactService } from '@/services/internal/contact';
import { contactFormSchema } from '@/validations/contact';
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
    } catch (_error) {
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
      const appError = mapPrismaError(error as PrismaClientKnownRequestError);
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

    // Create filters object from searchParams
    const filters = Array.from(searchParams).reduce(
      (acc: Record<string, unknown>, [key, value]) => {
        acc[key] = value;
        return acc;
      },
      {}
    );

    // Validate filters using Zod
    const validationResult = contactFiltersSchema.safeParse(filters);

    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    const validatedFilters = validationResult.data;

    // Process validated filters
    const processedFilters = {
      status: validatedFilters.status as ContactStatus | undefined,
      purpose: validatedFilters.purpose as ContactPurpose | undefined,
      search: validatedFilters.search,
      page: validatedFilters.page || '1',
      limit: validatedFilters.limit || '20',
    };

    const result = await contactService.getContactSubmissions(processedFilters);

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
