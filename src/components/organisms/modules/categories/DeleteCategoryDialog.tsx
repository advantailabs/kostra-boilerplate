'use client';

import { DeleteDialog } from '@/components/molecules/common/DeleteDialog';
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
    <DeleteDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Category"
      itemName={categoryName}
      itemType="category"
      isLoading={isDeleting}
      onSuccess={onSuccess}
    />
  );
}
