import { campaignsApi } from '@/services/api/campaigns';
import { CreateCampaignRequest, UpdateCampaignRequest } from '@/types/campaign';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useEmailCampaigns() {
  const queryClient = useQueryClient();

  // Get all email campaigns
  const {
    data: campaigns,
    isLoading: isCampaignsLoading,
    error: campaignsError,
  } = useQuery({
    queryKey: ['emailCampaigns'],
    queryFn: campaignsApi.getCampaigns,
  });

  // Create campaign mutation
  const createCampaign = useMutation({
    mutationFn: (data: CreateCampaignRequest) => campaignsApi.createCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailCampaigns'] });
    },
  });

  // Update campaign mutation
  const updateCampaign = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCampaignRequest }) =>
      campaignsApi.updateCampaign(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailCampaigns'] });
    },
  });

  // Delete campaign mutation
  const deleteCampaign = useMutation({
    mutationFn: (id: number) => campaignsApi.deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailCampaigns'] });
    },
  });

  return {
    campaigns: campaigns || [],
    isCampaignsLoading,
    campaignsError,
    createCampaign: createCampaign.mutateAsync,
    updateCampaign: updateCampaign.mutateAsync,
    deleteCampaign: deleteCampaign.mutateAsync,
    isCreating: createCampaign.isPending,
    isUpdating: updateCampaign.isPending,
    isDeleting: deleteCampaign.isPending,
  };
}
