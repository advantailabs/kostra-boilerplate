'use client';

import { Modal } from '@/components/molecules/common/Modal';

interface DeleteBlogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  blogId: number | null;
  blogTitle: string;
  onSuccess: () => void;
  deleteBlog: (id: number) => Promise<void>;
  isDeleting: boolean;
}

export function DeleteBlogDialog({
  isOpen,
  onClose,
  blogId,
  blogTitle,
  onSuccess,
  deleteBlog,
  isDeleting,
}: DeleteBlogDialogProps) {
  // Handle blog deletion
  const handleDelete = async () => {
    if (!blogId) return;
    try {
      await deleteBlog(blogId);
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error deleting blog:', error);
      // Error is already handled by the mutation hook
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      title="Delete Blog"
      primaryActionText={isDeleting ? 'Deleting...' : 'Delete'}
      secondaryActionText="Cancel"
      onPrimaryAction={handleDelete}
      isPrimaryActionDisabled={isDeleting || !blogId}
      isPrimaryActionLoading={isDeleting}
      primaryActionVariant="destructive"
    >
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete the blog <strong>{blogTitle}</strong>? This action cannot
          be undone.
        </p>
      </div>
    </Modal>
  );
}
