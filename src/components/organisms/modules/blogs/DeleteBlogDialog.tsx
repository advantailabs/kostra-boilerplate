'use client';

import { ActionDialog } from '@/components/molecules/common/ActionDialog';

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
  const handleDelete = async () => {
    if (!blogId) return;
    await deleteBlog(blogId);
  };

  return (
    <ActionDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Blog"
      itemName={blogTitle}
      itemType="blog"
      actionType="delete"
      isLoading={isDeleting}
      onSuccess={onSuccess}
    />
  );
}
