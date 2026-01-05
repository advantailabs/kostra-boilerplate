import { CampaignRecipient } from '@/lib/prisma/generated/browser';
import { axiosInstance } from '@/lib/utils/http/axios';
import {
  CampaignWithRelations,
  CreateCampaignRequest,
  UpdateCampaignRequest,
} from '@/types/campaign';

export const campaignsApi = {
  /**
   * Get all campaigns
   */
  async getCampaigns(): Promise<CampaignWithRelations[]> {
    const response = await axiosInstance.get('/campaigns');
    return response.data.data.data || [];
  },

  /**
   * Get campaign by ID
   */
  async getCampaign(id: number): Promise<CampaignWithRelations> {
    const response = await axiosInstance.get(`/campaigns/${id}`);
    return response.data.data.data;
  },

  /**
   * Create a new campaign
   */
  async createCampaign(data: CreateCampaignRequest): Promise<CampaignWithRelations> {
    const response = await axiosInstance.post('/campaigns', data);
    return response.data.data.data;
  },

  /**
   * Update an existing campaign
   */
  async updateCampaign(id: number, data: UpdateCampaignRequest): Promise<CampaignWithRelations> {
    const response = await axiosInstance.put(`/campaigns/${id}`, data);
    return response.data.data.data;
  },

  /**
   * Delete a campaign
   */
  async deleteCampaign(id: number): Promise<void> {
    await axiosInstance.delete(`/campaigns/${id}`);
  },

  /**
   * Get campaign recipients
   */
  async getCampaignRecipients(id: number): Promise<CampaignRecipient[]> {
    const response = await axiosInstance.get(`/campaigns/${id}/recipients`);
    return response.data.data?.recipients || [];
  },
};
