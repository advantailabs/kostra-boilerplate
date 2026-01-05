import { getAuthUser } from '@/lib/auth/jwt';
import {
  internalServerErrorResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils/response/response';
import { formatZodError } from '@/lib/utils/validation/validation';
import { createEmailTemplate, findEmailTemplates } from '@/services/repositories/email-template';
import { getUserById } from '@/services/repositories/user';
import {
  createEmailTemplateSchema,
  type CreateEmailTemplateInput,
} from '@/validations/email-template';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { userId } = (await getAuthUser(request)) || {};
    const user = await getUserById(userId);

    if (!user) {
      return unauthorizedResponse();
    }

    // Get all email templates with user information
    const emailTemplates = await findEmailTemplates(true);

    return successResponse({
      emailTemplates,
      message: 'Email templates retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return internalServerErrorResponse();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = (await getAuthUser(request)) || {};
    const user = await getUserById(userId);

    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();

    // Validate request body
    const validationResult = createEmailTemplateSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = formatZodError(validationResult.error);
      return validationErrorResponse('Invalid input data', errors);
    }

    const templateData: CreateEmailTemplateInput = validationResult.data;

    // Create email template
    const emailTemplate = await createEmailTemplate({
      userId: user.id,
      ...templateData,
    });

    return successResponse(
      {
        emailTemplate,
        message: 'Email template created successfully',
      },
      201
    );
  } catch (error) {
    console.error('Error creating email template:', error);
    return internalServerErrorResponse();
  }
}
