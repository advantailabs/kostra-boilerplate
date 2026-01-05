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
import { CampaignRecipientService } from '@/services/internal/campaign-recipient';
import { getUserById } from '@/services/repositories/user';
import { campaignIdSchema } from '@/validations/campaign';
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

    // Check if campaign exists
    const campaign = await CampaignService.getCampaignById(campaignId);
    if (!campaign) {
      return notFoundResponse('Campaign not found');
    }

    // Get campaign recipients
    const campaignRecipients =
      await CampaignRecipientService.listCampaignRecipientsByCampaignId(campaignId);

    // Get campaign recipient statistics
    const stats = await CampaignRecipientService.getCampaignRecipientStats(campaignId);

    return successResponse({ data: { campaignRecipients, stats } });
  } catch (error) {
    console.error('Error fetching campaign recipients:', error);
    return internalServerErrorResponse();
  }
}
