import { getAuthUser } from '@/lib/auth/jwt';
import {
  internalServerErrorResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils/response/response';
import { formatZodError } from '@/lib/utils/validation/validation';
import { CampaignRecipientService } from '@/services/internal/campaign-recipient';
import { getUserById } from '@/services/repositories/user';
import {
  createCampaignRecipientSchema,
  type CreateCampaignRecipientInput,
} from '@/validations/campaign';
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

    // Get all campaign recipients
    const campaignRecipients = await CampaignRecipientService.listCampaignRecipients();

    return successResponse({ data: campaignRecipients });
  } catch (error) {
    console.error('Error fetching campaign recipients:', error);
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
    const validationResult = createCampaignRecipientSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = formatZodError(validationResult.error);
      return validationErrorResponse('Invalid input data', errors);
    }

    const campaignRecipientData: CreateCampaignRecipientInput = validationResult.data;

    // Create campaign recipient
    const campaignRecipient =
      await CampaignRecipientService.createCampaignRecipient(campaignRecipientData);

    return successResponse({ data: campaignRecipient }, 201);
  } catch (error) {
    console.error('Error creating campaign recipient:', error);

    return internalServerErrorResponse();
  }
}
