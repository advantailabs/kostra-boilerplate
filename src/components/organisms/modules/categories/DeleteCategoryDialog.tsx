'use client';

import { Modal } from '@/components/molecules/common/Modal';
import { useCategories } from '@/hooks/useCategories';

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: number | null;
  categoryName: string;
  onSuccess: () => void;
  currentPage?: number;
  currentLimit?: number;
  currentSearch?: string;
}

export function DeleteCategoryDialog({
  isOpen,
  onClose,
  categoryId,
  categoryName,
  onSuccess,
  currentPage = 1,
  currentLimit = 10,
  currentSearch,
}: DeleteCategoryDialogProps) {
  const { deleteCategory, isDeleting } = useCategories({
    page: currentPage,
    limit: currentLimit,
    name: currentSearch,
  });

  // Handle category deletion
  const handleDelete = () => {
    if (!categoryId) return;
    deleteCategory(categoryId, {
      onSuccess: () => {
        onClose();
        onSuccess();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      title="Delete Category"
      primaryActionText={isDeleting ? 'Deleting...' : 'Delete'}
      secondaryActionText="Cancel"
      onPrimaryAction={handleDelete}
      isPrimaryActionDisabled={isDeleting || !categoryId}
      isPrimaryActionLoading={isDeleting}
      primaryActionVariant="destructive"
    >
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Are you sure you want to delete the category{' '}
        <strong className="text-gray-900 dark:text-gray-100">{categoryName}</strong>? This action
        cannot be undone.
      </p>
    </Modal>
  );
}
