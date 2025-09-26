import { getAuthUser } from '@/lib/auth/jwt';
import {
  AppErrorClass,
  badRequestResponse,
  errorResponse,
  forbiddenResponse,
  formatZodError,
  internalServerErrorResponse,
  mapPrismaError,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils';
import { contactService } from '@/services/internal/contact';
import { contactSubmissionUpdateSchema } from '@/validations/contact';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Middleware protects; just ensure presence
    const authUser = await getAuthUser(request);
    if (!authUser?.userId) return unauthorizedResponse();

    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) {
      return badRequestResponse('Invalid contact submission ID');
    }

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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is authenticated and has admin role
    const authUser = await getAuthUser(request);
    if (!authUser?.userId) {
      return unauthorizedResponse();
    }

    if (authUser.role !== 'ADMIN') {
      return forbiddenResponse('Admin access required');
    }

    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) {
      return badRequestResponse('Invalid contact submission ID');
    }

    const body = await request.json();

    // Validate the request body
    const validationResult = contactSubmissionUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    // Accept both Date and ISO string for resolvedAt
    const { status, adminNotes, resolvedAt } = validationResult.data as any;
    const parsedResolvedAt = typeof resolvedAt === 'string' ? new Date(resolvedAt) : resolvedAt;
    const submission = await contactService.updateContactSubmission(id, {
      status: status as any,
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
      const appError = mapPrismaError(error);
      return errorResponse(appError);
    }

    return internalServerErrorResponse('Failed to update contact submission');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Middleware protects; just ensure presence
    const authUser = await getAuthUser(request);
    if (!authUser?.userId) return unauthorizedResponse();

    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) {
      return badRequestResponse('Invalid contact submission ID');
    }

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
