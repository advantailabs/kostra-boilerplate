'use client';

import { ActionDialog } from '@/components/molecules/common/ActionDialog';
import { useEmailTemplates } from '../../../../hooks/useEmailTemplates';

interface DeleteEmailTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: number | null;
  templateName: string;
  onSuccess: () => void;
  currentPage?: number;
}

export function DeleteEmailTemplateDialog({
  isOpen,
  onClose,
  templateId,
  templateName,
  onSuccess,
  currentPage: _currentPage,
}: DeleteEmailTemplateDialogProps) {
  const { deleteEmailTemplate, isDeleting } = useEmailTemplates();

  const handleDelete = async () => {
    if (!templateId) return;

    await deleteEmailTemplate(templateId);
  };

  return (
    <ActionDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Email Template"
      itemName={templateName}
      itemType="email template"
      actionType="delete"
      isLoading={isDeleting}
      onSuccess={onSuccess}
      warningMessage="This will permanently delete the email template and cannot be undone."
    />
  );
}
