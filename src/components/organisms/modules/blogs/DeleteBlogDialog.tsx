'use client';

import { Modal } from '@/components/molecules/common/Modal';
import { Button } from '@/components/atom/Button';
import { useBlogs } from '@/hooks/useBlogs';

interface DeleteBlogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  blogId: number | null;
  blogTitle: string;
  onSuccess: () => void;
}

export function DeleteBlogDialog({
  isOpen,
  onClose,
  blogId,
  blogTitle,
  onSuccess,
}: DeleteBlogDialogProps) {
  const { deleteBlog, isDeleting } = useBlogs();

  // Handle blog deletion
  const handleDelete = () => {
    if (!blogId) return;
    deleteBlog(blogId, {
      onSuccess: () => {
        onClose();
        onSuccess();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" title="Delete Blog">
      <div className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete the blog <strong>{blogTitle}</strong>? This action
            cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting || !blogId}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
