'use client';

import { ActionDialog } from '@/components/molecules/common/ActionDialog';
import { usePackages } from '@/hooks/usePackages';

interface DeletePackageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: number | null;
  packageTitle: string;
  onSuccess: () => void;
  currentPage?: number;
  currentLimit?: number;
  currentSearch?: string;
}

export function DeletePackageDialog({
  isOpen,
  onClose,
  packageId,
  packageTitle,
  onSuccess,
  currentPage = 1,
  currentLimit = 10,
  currentSearch,
}: DeletePackageDialogProps) {
  const { deletePackage, isDeleting } = usePackages({
    page: currentPage,
    limit: currentLimit,
    title: currentSearch,
  });

  const handleDelete = () => {
    if (!packageId) return;
    deletePackage(packageId, {
      onSuccess: () => {
        onClose();
        onSuccess();
      },
    });
  };

  return (
    <ActionDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Package"
      itemName={packageTitle}
      itemType="package"
      actionType="delete"
      isLoading={isDeleting}
      onSuccess={onSuccess}
    />
  );
}
