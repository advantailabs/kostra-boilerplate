import {
  createCampaignRecipient,
  deleteCampaignRecipient,
  findCampaignRecipientById,
  findCampaignRecipientsByCampaignId,
  findCampaignRecipientsByUserId,
  findCampaignRecipientsWithRelations,
  updateCampaignRecipient,
} from '@/services/repositories/campaign-recipient';
import {
  CampaignRecipientWithUser,
  CreateCampaignRecipientData,
  UpdateCampaignRecipientData,
} from '@/types/campaign';

/**
 * Service for managing campaign recipients with business logic
 */
export class CampaignRecipientService {
  /**
   * Create a new campaign recipient
   */
  static async createCampaignRecipient(
    data: CreateCampaignRecipientData,
  ): Promise<CampaignRecipientWithUser> {
    try {
      const campaignRecipient = await createCampaignRecipient(data);

      // Return with relations
      const campaignRecipientWithRelations = await findCampaignRecipientById(
        campaignRecipient.id,
        true,
      );
      if (!campaignRecipientWithRelations) {
        throw new Error('Failed to retrieve created campaign recipient');
      }

      return campaignRecipientWithRelations as CampaignRecipientWithUser;
    } catch (error) {
      console.error('Error in CampaignRecipientService.createCampaignRecipient:', error);
      throw error;
    }
  }

  /**
   * Get campaign recipient by ID with relations
   */
  static async getCampaignRecipientById(id: number): Promise<CampaignRecipientWithUser | null> {
    try {
      return (await findCampaignRecipientById(id, true)) as CampaignRecipientWithUser | null;
    } catch (error) {
      console.error('Error in CampaignRecipientService.getCampaignRecipientById:', error);
      throw error;
    }
  }

  /**
   * Update campaign recipient
   */
  static async updateCampaignRecipient(
    id: number,
    data: UpdateCampaignRecipientData,
  ): Promise<CampaignRecipientWithUser> {
    try {
      // Check if campaign recipient exists
      const existingCampaignRecipient = await findCampaignRecipientById(id, false);
      if (!existingCampaignRecipient) {
        throw new Error('Campaign recipient not found');
      }

      // Update the campaign recipient
      await updateCampaignRecipient(id, data);

      // Return updated campaign recipient with relations
      const updatedCampaignRecipient = await findCampaignRecipientById(id, true);
      if (!updatedCampaignRecipient) {
        throw new Error('Failed to retrieve updated campaign recipient');
      }

      return updatedCampaignRecipient as CampaignRecipientWithUser;
    } catch (error) {
      console.error('Error in CampaignRecipientService.updateCampaignRecipient:', error);
      throw error;
    }
  }

  /**
   * Delete campaign recipient
   */
  static async deleteCampaignRecipient(id: number): Promise<void> {
    try {
      // Check if campaign recipient exists
      const existingCampaignRecipient = await findCampaignRecipientById(id, false);
      if (!existingCampaignRecipient) {
        throw new Error('Campaign recipient not found');
      }

      await deleteCampaignRecipient(id);
    } catch (error) {
      console.error('Error in CampaignRecipientService.deleteCampaignRecipient:', error);
      throw error;
    }
  }

  /**
   * List campaign recipients for a specific campaign
   */
  static async listCampaignRecipientsByCampaignId(
    campaignId: number,
  ): Promise<CampaignRecipientWithUser[]> {
    try {
      const campaignRecipients = await findCampaignRecipientsByCampaignId(campaignId);

      // Get relations for each campaign recipient
      const campaignRecipientsWithRelations = await Promise.all(
        campaignRecipients.map(async campaignRecipient => {
          const campaignRecipientWithRelations = await findCampaignRecipientById(
            campaignRecipient.id,
            true,
          );
          return campaignRecipientWithRelations! as CampaignRecipientWithUser;
        }),
      );

      return campaignRecipientsWithRelations;
    } catch (error) {
      console.error('Error in CampaignRecipientService.listCampaignRecipientsByCampaignId:', error);
      throw error;
    }
  }

  /**
   * List campaign recipients for a specific user
   */
  static async listCampaignRecipientsByUserId(
    userId: number,
  ): Promise<CampaignRecipientWithUser[]> {
    try {
      const campaignRecipients = await findCampaignRecipientsByUserId(userId);

      // Get relations for each campaign recipient
      const campaignRecipientsWithRelations = await Promise.all(
        campaignRecipients.map(async campaignRecipient => {
          const campaignRecipientWithRelations = await findCampaignRecipientById(
            campaignRecipient.id,
            true,
          );
          return campaignRecipientWithRelations! as CampaignRecipientWithUser;
        }),
      );

      return campaignRecipientsWithRelations;
    } catch (error) {
      console.error('Error in CampaignRecipientService.listCampaignRecipientsByUserId:', error);
      throw error;
    }
  }

  /**
   * List all campaign recipients (admin)
   */
  static async listCampaignRecipients(): Promise<CampaignRecipientWithUser[]> {
    try {
      return await findCampaignRecipientsWithRelations();
    } catch (error) {
      console.error('Error in CampaignRecipientService.listCampaignRecipients:', error);
      throw error;
    }
  }

  /**
   * Update campaign recipient status (for tracking)
   */
  static async updateRecipientStatus(
    id: number,
    status: 'SENT' | 'FAILED' | 'OPENED' | 'CLICKED',
    timestamp?: Date,
  ): Promise<CampaignRecipientWithUser> {
    try {
      const updateData: UpdateCampaignRecipientData = {
        status,
      };

      // Set appropriate timestamp based on status
      if (timestamp) {
        switch (status) {
          case 'SENT':
            updateData.sentAt = timestamp;
            break;
          case 'OPENED':
            updateData.openedAt = timestamp;
            break;
          case 'CLICKED':
            updateData.clickedAt = timestamp;
            break;
        }
      }

      return await this.updateCampaignRecipient(id, updateData);
    } catch (error) {
      console.error('Error in CampaignRecipientService.updateRecipientStatus:', error);
      throw error;
    }
  }

  /**
   * Get campaign recipient statistics for a campaign
   */
  static async getCampaignRecipientStats(campaignId: number): Promise<{
    total: number;
    pending: number;
    sent: number;
    failed: number;
    opened: number;
    clicked: number;
  }> {
    try {
      const campaignRecipients = await findCampaignRecipientsByCampaignId(campaignId);

      const stats = {
        total: campaignRecipients.length,
        pending: 0,
        sent: 0,
        failed: 0,
        opened: 0,
        clicked: 0,
      };

      campaignRecipients.forEach(recipient => {
        switch (recipient.status) {
          case 'PENDING':
            stats.pending += 1;
            break;
          case 'SENT':
            stats.sent += 1;
            break;
          case 'FAILED':
            stats.failed += 1;
            break;
          case 'OPENED':
            stats.opened += 1;
            break;
          case 'CLICKED':
            stats.clicked += 1;
            break;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error in CampaignRecipientService.getCampaignRecipientStats:', error);
      throw error;
    }
  }
}
