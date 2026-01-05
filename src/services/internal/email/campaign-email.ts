import { getEmailDriver } from '@/lib/email/factory';
import { replaceEmailVariables } from '@/lib/utils/email';
import { sleep } from '@/lib/utils/extras';
import {
  findCampaignWithTemplateAndPendingRecipients,
  findDueScheduledCampaignsWithPendingRecipients,
} from '@/services/repositories/campaign';
import {
  markRecipientAsFailed,
  markRecipientAsSent,
} from '@/services/repositories/campaign-recipient';
import { CampaignService } from '../campaign';

export interface CampaignEmailData {
  campaignId: number;
  recipientIds: number[];
}

export class CampaignEmailService {
  /**
   * Send campaign emails to recipients
   * Handles both single and bulk email sending based on the recipientIds array.
   * If one recipient ID is provided, sends to that person; if multiple are provided, sends to all of them.
   */
  static async sendCampaignEmails(data: CampaignEmailData): Promise<void> {
    try {
      // Get campaign with template and recipients
      const campaign = await findCampaignWithTemplateAndPendingRecipients(
        data.campaignId,
        data.recipientIds
      );

      if (!campaign) {
        throw new Error('Campaign not found');
      }

      if (!campaign.emailTemplate) {
        throw new Error('Email template not found');
      }

      const emailDriver = getEmailDriver();
      const { emailTemplate, recipients } = campaign;

      // Send emails to all recipients with rate limiting
      // Add 1 second delay before sending each email
      for (let i = 0; i < recipients.length; i += 1) {
        const recipient = recipients[i];

        // Add 1 second delay before sending email
        await sleep(1000);

        try {
          // Replace variables in email body with user data
          const personalizedBody = replaceEmailVariables(emailTemplate.body, {
            name: recipient.user.name,
            email: recipient.user.email,
            id: recipient.user.id,
            role: recipient.user.role,
            isOnboarded: recipient.user.isOnboarded,
            credits: recipient.user.credits,
            plan: recipient.user.plan,
            isOverDue: recipient.user.isOverDue,
            planExpiringAt: recipient.user.planExpiringAt || undefined,
          });

          // Replace variables in subject
          const personalizedSubject = replaceEmailVariables(emailTemplate.subject, {
            name: recipient.user.name,
            email: recipient.user.email,
            id: recipient.user.id,
            role: recipient.user.role,
            isOnboarded: recipient.user.isOnboarded,
            credits: recipient.user.credits,
            plan: recipient.user.plan,
            isOverDue: recipient.user.isOverDue,
            planExpiringAt: recipient.user.planExpiringAt || undefined,
          });

          // Format from field with name and email
          const fromField = `${emailTemplate.fromName} <${emailTemplate.fromEmail}>`;

          // Prepare email message
          const emailMessage: Parameters<typeof emailDriver.send>[0] = {
            to: recipient.user.email,
            from: fromField,
            subject: personalizedSubject,
            html: personalizedBody,
            text: personalizedBody.replace(/<[^>]*>/g, ''), // Strip HTML for text version
          };

          // Add reply-to if provided in template
          if (
            (emailTemplate as { replyToEmail?: string | null }).replyToEmail &&
            (emailTemplate as { replyToEmail?: string | null }).replyToEmail !== ''
          ) {
            emailMessage.replyTo = (emailTemplate as { replyToEmail: string }).replyToEmail;
          }

          // Send email
          await emailDriver.send(emailMessage);

          // Update recipient status to SENT
          await markRecipientAsSent(recipient.id, personalizedBody);
        } catch (error) {
          console.log('error', error);
          // Extract error message for database storage
          const errorMessage =
            error instanceof Error ? error.message : String(error) || 'Unknown email error';

          // Log error details
          console.error(`Failed to send email to ${recipient.user.email}:`, errorMessage);

          // Update recipient status to FAILED with error message
          await markRecipientAsFailed(recipient.id, errorMessage);
        }
      }

      // Small delay to ensure all database writes are committed before checking statuses
      await new Promise<void>(resolve => {
        setTimeout(resolve, 100);
      });

      // Update campaign status based on recipient statuses
      await CampaignService.updateCampaignStatusBasedOnRecipients(data.campaignId);
    } catch (error) {
      console.error('Error in CampaignEmailService.sendCampaignEmails:', error);
      throw error;
    }
  }

  /**
   * Process all scheduled campaigns that are due to be sent
   * This method is called by the cron job to check for campaigns whose scheduledAt time
   * has passed and sends emails to all pending recipients using the configured email driver
   */
  static async processScheduledCampaigns(): Promise<void> {
    const scheduledCampaigns = await findDueScheduledCampaignsWithPendingRecipients();

    if (scheduledCampaigns.length === 0) {
      return;
    }

    // Process each campaign sequentially
    for (const campaign of scheduledCampaigns) {
      await this.sendCampaignEmails({
        campaignId: campaign.id,
        recipientIds: campaign.recipientIds,
      });
    }
  }
}
