import { Button } from '@/components/atom/Button';
import { Checkbox } from '@/components/atom/Checkbox';
import { Input } from '@/components/atom/Input';
import { Dialog, DialogContent, DialogHeader } from '@/components/molecules/common/Dialog';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface DeleteKnowledgeBaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (_options: { deleteFiles: boolean }) => void;
  knowledgeBaseName: string;
  fileCount: number;
  isLoading?: boolean;
}

export function DeleteKnowledgeBaseDialog({
  isOpen,
  onClose,
  onConfirm,
  knowledgeBaseName,
  fileCount,
  isLoading = false,
}: DeleteKnowledgeBaseDialogProps) {
  const [deleteFiles, setDeleteFiles] = useState(false);
  const [confirmationName, setConfirmationName] = useState('');
  const [showFileDeletionWarning, setShowFileDeletionWarning] = useState(false);

  const handleConfirm = () => {
    if (confirmationName !== knowledgeBaseName) {
      return;
    }
    onConfirm({ deleteFiles });
  };

  const isConfirmDisabled =
    isLoading ||
    confirmationName !== knowledgeBaseName ||
    (deleteFiles && !showFileDeletionWarning);

  const handleFileDeletionChange = (checked: boolean) => {
    setDeleteFiles(checked);
    setShowFileDeletionWarning(checked);
  };

  const handleClose = () => {
    setDeleteFiles(false);
    setConfirmationName('');
    setShowFileDeletionWarning(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 sm:max-w-md">
        <DialogHeader className="border-b border-gray-200 p-4 dark:border-gray-700">
          <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Delete Knowledge Base
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Please confirm to delete this knowledge base
          </p>
        </DialogHeader>

        <div className="px-4 pt-4">
          {/* Warning Message */}
          <div className="mb-4 rounded-md bg-red-50 p-3 dark:bg-red-900/20">
            <div className="flex">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">
                  This action cannot be undone. This will permanently delete the knowledge base "
                  {knowledgeBaseName}".
                </p>
              </div>
            </div>
          </div>

          {/* File Deletion Option */}
          <div className="mb-4 space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="delete-files"
                checked={deleteFiles}
                onCheckedChange={handleFileDeletionChange}
                className="mt-0.5"
              />
              <div className="space-y-1">
                <label
                  htmlFor="delete-files"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Delete files from knowledge base
                </label>
                <p className="text-xs text-gray-500">
                  This will remove {fileCount} file{fileCount !== 1 ? 's' : ''} from the knowledge
                  base and vector database
                </p>
              </div>
            </div>

            {showFileDeletionWarning && (
              <div className="rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20">
                <div className="flex">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Warning
                    </h3>
                    <div className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                      <p>
                        This will permanently delete all {fileCount} file
                        {fileCount !== 1 ? 's' : ''} from this knowledge base. This action cannot be
                        undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Name Confirmation */}
          <div className="mb-4">
            <label htmlFor="confirmation-name" className="text-sm font-medium">
              Type "{knowledgeBaseName}" to confirm deletion
            </label>
            <Input
              id="confirmation-name"
              type="text"
              placeholder="Enter knowledge base name"
              value={confirmationName}
              onChange={e => setConfirmationName(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="-mx-4 border-t border-gray-200 dark:border-gray-700" />

          <div className="flex justify-end gap-2 py-4">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
              isLoading={isLoading}
            >
              Delete Knowledge Base
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
