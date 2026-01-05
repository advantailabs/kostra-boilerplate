import { getAuthUser } from '@/lib/auth/jwt';
import {
  internalServerErrorResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils/response/response';
import { formatZodError } from '@/lib/utils/validation/validation';
import { CampaignService } from '@/services/internal/campaign';
import { getUserById } from '@/services/repositories/user';
import { createCampaignSchema, type CreateCampaignInput } from '@/validations/campaign';
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

    // Get all campaigns
    const campaigns = await CampaignService.listCampaigns();

    return successResponse({ data: campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
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
    const validationResult = createCampaignSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = formatZodError(validationResult.error);
      return validationErrorResponse('Invalid input data', errors);
    }

    const campaignData: CreateCampaignInput = validationResult.data;

    // Create campaign
    const campaign = await CampaignService.createCampaign({
      userId: user.id,
      ...campaignData,
    });

    return successResponse({ data: campaign }, 201);
  } catch (error) {
    console.error('Error creating campaign:', error);
    if (error instanceof Error) {
      return validationErrorResponse(error.message, []);
    }
    return internalServerErrorResponse();
  }
}
