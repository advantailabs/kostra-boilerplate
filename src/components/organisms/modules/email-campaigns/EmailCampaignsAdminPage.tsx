'use client';

import { useCallback, useState } from 'react';

import { CampaignWithRelations } from '@/types/campaign';
import { useEmailCampaigns } from '../../../../hooks/useEmailCampaigns';
import { CampaignRecipientsModal } from './CampaignRecipientsModal';
import { DeleteEmailCampaignDialog } from './DeleteEmailCampaignDialog';
import { EmailCampaignEditorModal } from './EmailCampaignEditorModal';
import { EmailCampaignsTable } from './EmailCampaignsTable';

interface EmailCampaignsAdminPageProps {
  className?: string;
}

export function EmailCampaignsAdminPage({ className }: EmailCampaignsAdminPageProps) {
  // Fetch email campaigns from the database
  const { campaigns, isCampaignsLoading, campaignsError } = useEmailCampaigns();

  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignWithRelations | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // State to control the visibility of the delete campaign dialog
  const [isDeleteCampaignDialogOpen, setIsDeleteCampaignDialogOpen] = useState(false);
  // State to store the ID of the campaign being deleted
  const [deletingCampaignId, setDeletingCampaignId] = useState<number | null>(null);
  // State to store the name of the campaign being deleted
  const [deletingCampaignName, setDeletingCampaignName] = useState<string>('');

  // State to track current page for delete context
  const [currentPage, setCurrentPage] = useState(1);

  // State for recipients modal
  const [isRecipientsModalOpen, setIsRecipientsModalOpen] = useState(false);
  const [viewingCampaignId, setViewingCampaignId] = useState<number | null>(null);
  const [viewingCampaignName, setViewingCampaignName] = useState<string>('');

  const handleEditCampaign = useCallback((campaign: CampaignWithRelations) => {
    setEditingCampaign(campaign);
    setModalMode('edit');
    setIsCampaignModalOpen(true);
  }, []);

  const handleAddCampaign = useCallback(() => {
    setEditingCampaign(null);
    setModalMode('create');
    setIsCampaignModalOpen(true);
  }, []);

  const handleCampaignModalClose = useCallback(() => {
    setIsCampaignModalOpen(false);
    setTimeout(() => {
      setEditingCampaign(null);
    }, 300);
  }, []);

  const handleCampaignSuccess = useCallback(() => {
    // Close the modal and reset the editing state
    setIsCampaignModalOpen(false);
    setTimeout(() => {
      setEditingCampaign(null);
    }, 300);
  }, []);

  /**
   * Handles deleting a campaign
   * @param campaignId The ID of the campaign to delete
   * @param campaignName The name of the campaign to delete
   */
  const handleDeleteCampaign = useCallback((campaignId: number, campaignName: string) => {
    setDeletingCampaignId(campaignId);
    setDeletingCampaignName(campaignName);
    setIsDeleteCampaignDialogOpen(true);
  }, []);

  /**
   * Handles closing the delete campaign dialog
   */
  const handleDeleteCampaignDialogClose = useCallback(() => {
    setIsDeleteCampaignDialogOpen(false);
    setTimeout(() => {
      setDeletingCampaignId(null);
      setDeletingCampaignName('');
    }, 300);
  }, []);

  /**
   * Callback when a campaign is successfully deleted
   */
  const handleDeleteCampaignSuccess = useCallback(() => {
    // Modal is already closed by the ActionDialog, just reset the delete state
    setTimeout(() => {
      setDeletingCampaignId(null);
      setDeletingCampaignName('');
    }, 300);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  /**
   * Handles viewing campaign recipients
   * @param campaignId The ID of the campaign to view recipients for
   */
  const handleViewCampaign = useCallback(
    (campaignId: number) => {
      const campaign = campaigns?.find(c => c.id === campaignId);
      setViewingCampaignId(campaignId);
      setViewingCampaignName(campaign?.name || 'Campaign');
      setIsRecipientsModalOpen(true);
    },
    [campaigns],
  );

  /**
   * Handles closing the recipients modal
   */
  const handleRecipientsModalClose = useCallback(() => {
    setIsRecipientsModalOpen(false);
    setTimeout(() => {
      setViewingCampaignId(null);
      setViewingCampaignName('');
    }, 300);
  }, []);

  return (
    <div className={className}>
      <EmailCampaignEditorModal
        key={`editor-${modalMode}-${editingCampaign?.id || 'new'}`}
        isOpen={isCampaignModalOpen}
        onClose={handleCampaignModalClose}
        onSuccess={handleCampaignSuccess}
        campaign={editingCampaign}
        mode={modalMode}
      />

      <DeleteEmailCampaignDialog
        key={`delete-${deletingCampaignId || 'none'}`}
        isOpen={isDeleteCampaignDialogOpen}
        onClose={handleDeleteCampaignDialogClose}
        campaignId={deletingCampaignId}
        campaignName={deletingCampaignName}
        onSuccess={handleDeleteCampaignSuccess}
        currentPage={currentPage}
      />

      <EmailCampaignsTable
        onEdit={handleEditCampaign}
        onDelete={handleDeleteCampaign}
        onView={handleViewCampaign}
        onAdd={handleAddCampaign}
        onPageChange={handlePageChange}
        campaigns={Array.isArray(campaigns) ? campaigns : []}
        isLoading={isCampaignsLoading}
        error={campaignsError}
      />

      <CampaignRecipientsModal
        key={`recipients-${viewingCampaignId || 'none'}`}
        isOpen={isRecipientsModalOpen}
        onClose={handleRecipientsModalClose}
        campaignId={viewingCampaignId}
        campaignName={viewingCampaignName}
        recipients={campaigns?.find(c => c.id === viewingCampaignId)?.recipients}
      />
    </div>
  );
}
