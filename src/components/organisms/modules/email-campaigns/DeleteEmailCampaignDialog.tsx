'use client';

import { ActionDialog } from '@/components/molecules/common/ActionDialog';
import { useEmailCampaigns } from '../../../../hooks/useEmailCampaigns';

interface DeleteEmailCampaignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: number | null;
  campaignName: string;
  onSuccess: () => void;
  currentPage?: number;
}

export function DeleteEmailCampaignDialog({
  isOpen,
  onClose,
  campaignId,
  campaignName,
  onSuccess,
  currentPage: _currentPage = 1,
}: DeleteEmailCampaignDialogProps) {
  const { deleteCampaign, isDeleting } = useEmailCampaigns();

  const handleDelete = async () => {
    if (!campaignId) return;
    await deleteCampaign(campaignId);
  };

  return (
    <ActionDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Campaign"
      itemName={campaignName}
      itemType="campaign"
      actionType="delete"
      isLoading={isDeleting}
      onSuccess={onSuccess}
      warningMessage="This will permanently delete the campaign and cannot be undone."
    />
  );
}
