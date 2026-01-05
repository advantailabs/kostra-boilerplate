import { getAuthUser } from '@/lib/auth/jwt';
import {
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils/response/response';
import { formatZodError } from '@/lib/utils/validation/validation';
import {
  deleteEmailTemplate,
  findEmailTemplateById,
  updateEmailTemplate,
} from '@/services/repositories/email-template';
import { getUserById } from '@/services/repositories/user';
import {
  updateEmailTemplateSchema,
  type UpdateEmailTemplateInput,
} from '@/validations/email-template';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  try {
    const { userId } = (await getAuthUser(request)) || {};
    const user = await getUserById(userId);

    if (!user) {
      return unauthorizedResponse();
    }

    const templateId = parseInt(params.id, 10);

    if (Number.isNaN(templateId)) {
      return validationErrorResponse('Invalid template ID', [
        { field: 'id', message: 'Template ID must be a valid number' },
      ]);
    }

    // Get email template
    const emailTemplate = await findEmailTemplateById(templateId);

    if (!emailTemplate) {
      return notFoundResponse('Email template not found');
    }

    return successResponse({
      emailTemplate,
      message: 'Email template retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching email template:', error);
    return internalServerErrorResponse();
  }
}

export async function PATCH(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  try {
    const { userId } = (await getAuthUser(request)) || {};
    const user = await getUserById(userId);

    if (!user) {
      return unauthorizedResponse();
    }

    const templateId = parseInt(params.id, 10);

    if (Number.isNaN(templateId)) {
      return validationErrorResponse('Invalid template ID', [
        { field: 'id', message: 'Template ID must be a valid number' },
      ]);
    }

    const body = await request.json();

    // Validate request body
    const validationResult = updateEmailTemplateSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = formatZodError(validationResult.error);
      return validationErrorResponse('Invalid input data', errors);
    }

    const templateData: UpdateEmailTemplateInput = validationResult.data;

    // Update email template
    const emailTemplate = await updateEmailTemplate(templateId, templateData);

    return successResponse({
      emailTemplate,
      message: 'Email template updated successfully',
    });
  } catch (error) {
    console.error('Error updating email template:', error);
    if (error instanceof Error && error.message === 'Email template not found') {
      return notFoundResponse('Email template not found');
    }
    return internalServerErrorResponse();
  }
}

export async function DELETE(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  try {
    const { userId } = (await getAuthUser(request)) || {};
    const user = await getUserById(userId);

    if (!user) {
      return unauthorizedResponse();
    }

    const templateId = parseInt(params.id, 10);

    if (Number.isNaN(templateId)) {
      return validationErrorResponse('Invalid template ID', [
        { field: 'id', message: 'Template ID must be a valid number' },
      ]);
    }

    // Delete email template
    await deleteEmailTemplate(templateId);

    return successResponse({
      message: 'Email template deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting email template:', error);
    if (error instanceof Error && error.message === 'Email template not found') {
      return notFoundResponse('Email template not found');
    }
    return internalServerErrorResponse();
  }
}
