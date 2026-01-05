import { getAuthUser } from '@/lib/auth/jwt';
import {
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils/response/response';
import { formatZodError } from '@/lib/utils/validation/validation';
import { CampaignRecipientService } from '@/services/internal/campaign-recipient';
import { getUserById } from '@/services/repositories/user';
import {
  campaignRecipientIdSchema,
  updateCampaignRecipientSchema,
  type UpdateCampaignRecipientInput,
} from '@/validations/campaign';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { userId } = (await getAuthUser(request)) || {};
    const user = await getUserById(userId);

    if (!user) {
      return unauthorizedResponse();
    }

    // Validate campaign recipient ID using Zod
    const validationResult = campaignRecipientIdSchema.safeParse({
      id: params.id,
    });

    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    const { id } = validationResult.data;
    const campaignRecipientId = parseInt(id, 10);

    const campaignRecipient =
      await CampaignRecipientService.getCampaignRecipientById(campaignRecipientId);

    if (!campaignRecipient) {
      return notFoundResponse('Campaign recipient not found');
    }

    return successResponse({ data: campaignRecipient });
  } catch (error) {
    console.error('Error fetching campaign recipient:', error);
    return internalServerErrorResponse();
  }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { userId } = (await getAuthUser(request)) || {};
    const user = await getUserById(userId);

    if (!user) {
      return unauthorizedResponse();
    }

    // Validate campaign recipient ID using Zod
    const idValidationResult = campaignRecipientIdSchema.safeParse({
      id: params.id,
    });

    if (!idValidationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(idValidationResult.error));
    }

    const { id } = idValidationResult.data;
    const campaignRecipientId = parseInt(id, 10);

    const body = await request.json();

    // Validate request body
    const validationResult = updateCampaignRecipientSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = formatZodError(validationResult.error);
      return validationErrorResponse('Invalid input data', errors);
    }

    const campaignRecipientData: UpdateCampaignRecipientInput = validationResult.data;

    // Update campaign recipient
    const campaignRecipient = await CampaignRecipientService.updateCampaignRecipient(
      campaignRecipientId,
      campaignRecipientData
    );

    return successResponse({ data: campaignRecipient });
  } catch (error) {
    console.error('Error updating campaign recipient:', error);
    if (error instanceof Error && error.message === 'Campaign recipient not found') {
      return notFoundResponse('Campaign recipient not found');
    }
    return internalServerErrorResponse();
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { userId } = (await getAuthUser(request)) || {};
    const user = await getUserById(userId);

    if (!user) {
      return unauthorizedResponse();
    }

    // Validate campaign recipient ID using Zod
    const validationResult = campaignRecipientIdSchema.safeParse({
      id: params.id,
    });

    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    const { id } = validationResult.data;
    const campaignRecipientId = parseInt(id, 10);

    // Delete campaign recipient
    await CampaignRecipientService.deleteCampaignRecipient(campaignRecipientId);

    return successResponse({ data: null });
  } catch (error) {
    console.error('Error deleting campaign recipient:', error);
    if (error instanceof Error && error.message === 'Campaign recipient not found') {
      return notFoundResponse('Campaign recipient not found');
    }
    if (error instanceof Error) {
      return validationErrorResponse(error.message, []);
    }
    return internalServerErrorResponse();
  }
}
