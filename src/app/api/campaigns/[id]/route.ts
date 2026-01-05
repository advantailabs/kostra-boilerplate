import { getAuthUser } from '@/lib/auth/jwt';
import {
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils/response/response';
import { formatZodError } from '@/lib/utils/validation/validation';
import { CampaignService } from '@/services/internal/campaign';
import { getUserById } from '@/services/repositories/user';
import {
  campaignIdSchema,
  updateCampaignSchema,
  type UpdateCampaignInput,
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

    // Validate campaign ID using Zod
    const validationResult = campaignIdSchema.safeParse({
      id: params.id,
    });

    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    const { id } = validationResult.data;
    const campaignId = parseInt(id, 10);

    const campaign = await CampaignService.getCampaignById(campaignId);

    if (!campaign) {
      return notFoundResponse('Campaign not found');
    }

    return successResponse({ data: campaign });
  } catch (error) {
    console.error('Error fetching campaign:', error);
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

    // Validate campaign ID using Zod
    const idValidationResult = campaignIdSchema.safeParse({
      id: params.id,
    });

    if (!idValidationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(idValidationResult.error));
    }

    const { id } = idValidationResult.data;
    const campaignId = parseInt(id, 10);

    const body = await request.json();

    // Validate request body
    const validationResult = updateCampaignSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = formatZodError(validationResult.error);
      return validationErrorResponse('Invalid input data', errors);
    }

    const campaignData: UpdateCampaignInput = validationResult.data;

    // Update campaign
    const campaign = await CampaignService.updateCampaign(campaignId, campaignData);

    return successResponse({ data: campaign });
  } catch (error) {
    console.error('Error updating campaign:', error);
    if (error instanceof Error && error.message === 'Campaign not found') {
      return notFoundResponse('Campaign not found');
    }
    if (error instanceof Error) {
      return validationErrorResponse(error.message, []);
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

    // Validate campaign ID using Zod
    const validationResult = campaignIdSchema.safeParse({
      id: params.id,
    });

    if (!validationResult.success) {
      return validationErrorResponse('Validation failed', formatZodError(validationResult.error));
    }

    const { id } = validationResult.data;
    const campaignId = parseInt(id, 10);

    // Delete campaign
    await CampaignService.deleteCampaign(campaignId);

    return successResponse({ data: null });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    if (error instanceof Error && error.message === 'Campaign not found') {
      return notFoundResponse('Campaign not found');
    }
    if (error instanceof Error) {
      return validationErrorResponse(error.message, []);
    }
    return internalServerErrorResponse();
  }
}
