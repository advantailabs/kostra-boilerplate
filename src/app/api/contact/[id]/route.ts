import { getAuthUser } from '@/lib/auth/jwt';
import {
  AppErrorClass,
  errorResponse,
  forbiddenResponse,
  formatZodError,
  internalServerErrorResponse,
  mapPrismaError,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils';
import { contactIdSchema, ContactUpdateInput, contactUpdateSchema } from '@/schemas/contact.schema';
import { contactService } from '@/services/internal/contact';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    // Middleware protects; just ensure presence
    const authUser = await getAuthUser(request);
    if (!authUser?.userId) return unauthorizedResponse();

    // Validate ID parameter using schema
    const validationResult = contactIdSchema.safeParse({ id: params.id });
    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }
    const id = validationResult.data.id;

    const submission = await contactService.getContactSubmission(id);

    return successResponse({
      data: submission,
      message: 'Contact submission retrieved successfully',
    });
  } catch (error) {
    console.error('Get contact submission error:', error);

    if (error instanceof AppErrorClass) {
      return errorResponse(error);
    }

    return internalServerErrorResponse('Failed to fetch contact submission');
  }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    // Check if user is authenticated and has admin role
    const authUser = await getAuthUser(request);
    if (!authUser?.userId) {
      return unauthorizedResponse();
    }

    if (authUser.role !== 'ADMIN') {
      return forbiddenResponse('Admin access required');
    }

    // Validate ID parameter using schema
    const idValidationResult = contactIdSchema.safeParse({ id: params.id });
    if (!idValidationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(idValidationResult.error));
    }
    const id = idValidationResult.data.id;

    const body = await request.json();

    // Validate the request body using the new schema
    const validationResult = contactUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    // Accept both Date and ISO string for resolvedAt
    const { status, adminNotes, resolvedAt } = validationResult.data as ContactUpdateInput;
    const parsedResolvedAt = typeof resolvedAt === 'string' ? new Date(resolvedAt) : resolvedAt;
    const submission = await contactService.updateContactSubmission(id, {
      status: status as ContactUpdateInput['status'],
      adminNotes: adminNotes as string | undefined,
      resolvedAt: parsedResolvedAt as Date | undefined,
    });

    return successResponse({
      data: submission,
      message: 'Contact submission updated successfully',
    });
  } catch (error) {
    console.error('Update contact submission error:', error);

    if (error instanceof AppErrorClass) {
      return errorResponse(error);
    }

    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const appError = mapPrismaError(error as PrismaClientKnownRequestError);
      return errorResponse(appError);
    }

    return internalServerErrorResponse('Failed to update contact submission');
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    // Middleware protects; just ensure presence
    const authUser = await getAuthUser(request);
    if (!authUser?.userId) return unauthorizedResponse();

    // Validate ID parameter using schema
    const validationResult = contactIdSchema.safeParse({ id: params.id });
    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }
    const id = validationResult.data.id;

    await contactService.deleteContactSubmission(id);

    return successResponse({
      message: 'Contact submission deleted successfully',
    });
  } catch (error) {
    console.error('Delete contact submission error:', error);

    if (error instanceof AppErrorClass) {
      return errorResponse(error);
    }

    return internalServerErrorResponse('Failed to delete contact submission');
  }
}
