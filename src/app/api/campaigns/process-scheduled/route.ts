import { CampaignEmailService } from '@/services/internal/email/campaign-email';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/campaigns/process-scheduled
 * Process all campaigns scheduled for the current time
 * This endpoint should be called by a cron job (e.g., Vercel Cron Jobs)
 * Requires Authorization header with Bearer token matching CRON_SECRET
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret from Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const cronSecret = process.env.CRON_SECRET;

    if (!token || token !== cronSecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    const currentTime = new Date();

    // Process all campaigns scheduled for the current time
    await CampaignEmailService.processScheduledCampaigns();

    return NextResponse.json({
      success: true,
      message: 'Scheduled campaigns processed successfully',
      processedAt: currentTime.toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing scheduled campaigns:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process scheduled campaigns',
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
