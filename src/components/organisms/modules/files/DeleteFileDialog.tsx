import { ActionDialog } from '@/components/molecules/common/ActionDialog';

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
    <ActionDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete File"
      itemName={fileName}
      itemType="file"
      actionType="delete"
      isLoading={isDeleting}
      onSuccess={onSuccess}
      warningMessage={`This will permanently delete the file from storage and is irreversible`}
    />
  );
}
