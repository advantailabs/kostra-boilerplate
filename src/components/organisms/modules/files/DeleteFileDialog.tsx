import { DeleteDialog } from '@/components/molecules/common/DeleteDialog';

interface DeleteFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: number | null;
  fileName: string;
  onSuccess?: () => void;
  deleteFile: ({ id }: { id: number }) => Promise<void>;
  isDeleting: boolean;
}

export function DeleteFileDialog({
  isOpen,
  onClose,
  fileId,
  fileName,
  onSuccess,
  deleteFile,
  isDeleting,
}: DeleteFileDialogProps) {
  const handleDelete = async () => {
    if (!fileId) {
      throw new Error('Missing file id');
    }
    await deleteFile({ id: fileId });
  };

  return (
    <DeleteDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete File"
      itemName={fileName}
      itemType="file"
      isLoading={isDeleting}
      onSuccess={onSuccess}
      warningMessage={`Are you sure you want to permanently delete <strong>${fileName}</strong>? This will delete the file from storage. This action cannot be undone.`}
    />
  );
}
