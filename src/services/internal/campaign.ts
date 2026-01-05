import { CampaignRecipient, CampaignStatus } from '@/lib/prisma/generated/client';
import {
  createCampaign,
  deleteCampaign,
  findCampaignById,
  findCampaignByIdWithRelations,
  findCampaigns,
  findCampaignsByUserId,
  updateCampaign,
  updateCampaignStatus,
} from '@/services/repositories/campaign';
import {
  createCampaignRecipients,
  deleteCampaignRecipients,
  findCampaignRecipientsByCampaignId,
} from '@/services/repositories/campaign-recipient';
import { findEmailTemplateById } from '@/services/repositories/email-template';
import { CampaignWithRelations, CreateCampaignData, UpdateCampaignData } from '@/types/campaign';
import { CampaignEmailService } from './email/campaign-email';

/**
 * Service for managing campaigns with business logic
 */
export class CampaignService {
  /**
   * Create a new campaign with validation and recipient management
   */
  static async createCampaign(data: CreateCampaignData): Promise<CampaignWithRelations> {
    try {
      // Validate email template exists
      const emailTemplate = await findEmailTemplateById(data.emailTemplateId);
      if (!emailTemplate) {
        throw new Error('Email template not found');
      }

      // Create the campaign
      const campaign = await createCampaign(data);

      // Create recipients with personalized email bodies
      await createCampaignRecipients(campaign.id, data.recipients, emailTemplate.body);

      // Return campaign with relations
      const campaignWithRelations = await findCampaignByIdWithRelations(campaign.id);
      if (!campaignWithRelations) {
        throw new Error('Failed to retrieve created campaign');
      }

      return campaignWithRelations;
    } catch (error) {
      console.error('Error in CampaignService.createCampaign:', error);
      throw error;
    }
  }

  /**
   * Get campaign by ID with relations
   */
  static async getCampaignById(id: number): Promise<CampaignWithRelations | null> {
    try {
      return await findCampaignByIdWithRelations(id);
    } catch (error) {
      console.error('Error in CampaignService.getCampaignById:', error);
      throw error;
    }
  }

  /**
   * Update campaign with business logic
   */
  static async updateCampaign(
    id: number,
    data: UpdateCampaignData
  ): Promise<CampaignWithRelations> {
    try {
      // Get existing campaign
      const existingCampaign = await findCampaignById(id);
      if (!existingCampaign) {
        throw new Error('Campaign not found');
      }

      // Update the campaign
      await updateCampaign(id, data);

      // Handle recipient management
      await this.handleRecipientManagement(
        id,
        existingCampaign.status,
        data,
        existingCampaign.emailTemplateId
      );

      // Return updated campaign with relations
      const updatedCampaign = await findCampaignByIdWithRelations(id);
      if (!updatedCampaign) {
        throw new Error('Failed to retrieve updated campaign');
      }

      return updatedCampaign;
    } catch (error) {
      console.error('Error in CampaignService.updateCampaign:', error);
      throw error;
    }
  }

  /**
   * Delete campaign
   */
  static async deleteCampaign(id: number): Promise<void> {
    try {
      // Check if campaign exists
      const existingCampaign = await findCampaignById(id);
      if (!existingCampaign) {
        throw new Error('Campaign not found');
      }

      await deleteCampaign(id);
    } catch (error) {
      console.error('Error in CampaignService.deleteCampaign:', error);
      throw error;
    }
  }

  /**
   * List campaigns for a user
   */
  static async listCampaignsByUserId(userId: number): Promise<CampaignWithRelations[]> {
    try {
      const campaigns = await findCampaignsByUserId(userId);

      // Get relations for each campaign
      const campaignsWithRelations = await Promise.all(
        campaigns.map(async campaign => {
          const campaignWithRelations = await findCampaignByIdWithRelations(campaign.id);
          return campaignWithRelations!;
        })
      );

      return campaignsWithRelations;
    } catch (error) {
      console.error('Error in CampaignService.listCampaignsByUserId:', error);
      throw error;
    }
  }

  /**
   * List all campaigns (admin)
   */
  static async listCampaigns(): Promise<CampaignWithRelations[]> {
    try {
      return (await findCampaigns(true)) as CampaignWithRelations[];
    } catch (error) {
      console.error('Error in CampaignService.listCampaigns:', error);
      throw error;
    }
  }

  /**
   * Handle status changes and recipient management
   */
  private static async handleRecipientManagement(
    campaignId: number,
    _existingStatus: string,
    updateData: UpdateCampaignData,
    emailTemplateId: number
  ): Promise<void> {
    // Get current recipients
    const currentRecipients = await findCampaignRecipientsByCampaignId(campaignId);
    const currentRecipientIds = currentRecipients.map(r => r.userId);

    // Handle recipient changes
    if (updateData.recipients !== undefined) {
      const newRecipientIds = updateData.recipients;

      // Find recipients to add and remove
      const recipientsToAdd = newRecipientIds.filter(id => !currentRecipientIds.includes(id));
      const recipientsToRemove = currentRecipientIds.filter(id => !newRecipientIds.includes(id));

      // Remove recipients that are no longer in the list
      if (recipientsToRemove.length > 0) {
        await this.removeRecipients(recipientsToRemove, currentRecipients);
      }

      // Add new recipients
      if (recipientsToAdd.length > 0) {
        await this.addRecipients(campaignId, recipientsToAdd, emailTemplateId);
      }
    }

    // Status changes don't require special processing
    // Recipients are already managed above
  }

  private static async addRecipients(
    campaignId: number,
    newRecipientIds: number[],
    emailTemplateId: number
  ): Promise<void> {
    // Get email template
    const emailTemplate = await findEmailTemplateById(emailTemplateId);
    if (!emailTemplate) {
      throw new Error('Email template not found');
    }

    // Create new recipients with email bodies
    await createCampaignRecipients(campaignId, newRecipientIds, emailTemplate.body);
  }

  private static async removeRecipients(
    recipientIdsToRemove: number[],
    currentRecipients: CampaignRecipient[]
  ): Promise<void> {
    // Find all campaign recipient IDs to delete
    const campaignRecipientIdsToDelete = currentRecipients
      .filter(r => recipientIdsToRemove.includes(r.userId))
      .map(r => r.id);

    // Bulk delete recipients
    if (campaignRecipientIdsToDelete.length > 0) {
      await deleteCampaignRecipients(campaignRecipientIdsToDelete);
    }
  }

  /**
   * Send campaign emails immediately
   */
  static async sendCampaignImmediately(id: number, _userId: number): Promise<void> {
    try {
      // Get campaign details
      const campaign = await findCampaignByIdWithRelations(id);
      if (!campaign) {
        throw new Error('Campaign not found');
      }

      // For email campaigns, we allow any authenticated user to trigger sending
      // The campaign will still send to all recipients defined in the campaign

      // Check if campaign has pending recipients
      const pendingRecipients = campaign.recipients
        .filter(r => r.status === 'PENDING')
        .map(r => r.id);

      if (pendingRecipients.length === 0) {
        // Check if there are any recipients at all
        const totalRecipients = campaign.recipients.length;
        if (totalRecipients === 0) {
          throw new Error('No recipients found for this campaign');
        } else {
          // Check if there are failed recipients
          const failedRecipients = campaign.recipients.filter(r => r.status === 'FAILED');
          const sentCount = campaign.recipients.filter(r => r.status === 'SENT').length;
          const failedCount = failedRecipients.length;

          if (failedCount > 0) {
            throw new Error(
              `All recipients have already been processed. Sent: ${sentCount}, Failed: ${failedCount}.`
            );
          } else {
            throw new Error(
              `All recipients have already been processed. Sent: ${sentCount}, Failed: ${failedCount}`
            );
          }
        }
      }

      // Send emails immediately using CampaignEmailService
      await CampaignEmailService.sendCampaignEmails({
        campaignId: id,
        recipientIds: pendingRecipients,
      });
    } catch (error) {
      console.error('Error in CampaignService.sendCampaignImmediately:', error);
      throw error;
    }
  }

  /**
   * Reset failed recipients back to pending status for retry
   * @deprecated Failed recipients cannot be reset to PENDING. Once failed, they remain failed.
   */

  static async updateCampaignStatusBasedOnRecipients(campaignId: number): Promise<void> {
    try {
      // Get all recipients for the campaign
      const recipients = await findCampaignRecipientsByCampaignId(campaignId);

      if (recipients.length === 0) {
        return; // No recipients to process
      }

      // Count recipients by status
      const statusCounts = recipients.reduce(
        (acc, recipient) => {
          acc[recipient.status] = (acc[recipient.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const sentCount = statusCounts.SENT || 0;
      const failedCount = statusCounts.FAILED || 0;
      const pendingCount = statusCounts.PENDING || 0;
      const totalCount = recipients.length;

      // Determine campaign status based on recipient statuses
      let newCampaignStatus: CampaignStatus;

      if (pendingCount > 0) {
        // Still have pending recipients, keep as SCHEDULED
        newCampaignStatus = 'SCHEDULED' as CampaignStatus;
      } else if (failedCount === totalCount) {
        // All emails failed
        newCampaignStatus = 'FAILED' as CampaignStatus;
      } else if (sentCount === totalCount) {
        // All emails sent successfully
        newCampaignStatus = 'SENT' as CampaignStatus;
      } else if (sentCount > 0 && failedCount > 0) {
        // Some sent, some failed
        newCampaignStatus = 'PARTIALLYSUCCESS' as CampaignStatus;
      } else {
        // Fallback case - shouldn't happen but keeping as SCHEDULED
        newCampaignStatus = 'SCHEDULED' as CampaignStatus;
      }

      // Update campaign status
      await updateCampaignStatus(campaignId, newCampaignStatus);
    } catch (error) {
      console.error('Error in CampaignService.updateCampaignStatusBasedOnRecipients:', error);
      throw error;
    }
  }

  /**
   * Manually fix campaign status for existing campaigns
   * This can be used to correct campaign statuses that were set incorrectly before the new logic
   */
  static async fixCampaignStatus(campaignId: number): Promise<void> {
    try {
      await this.updateCampaignStatusBasedOnRecipients(campaignId);
    } catch (error) {
      console.error('Error in CampaignService.fixCampaignStatus:', error);
      throw error;
    }
  }
}
