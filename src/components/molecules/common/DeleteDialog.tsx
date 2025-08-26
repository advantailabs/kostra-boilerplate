import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/molecules/common/Dialog';
import { useState } from 'react';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  itemName?: string;
  showNameConfirmation?: boolean;
  confirmationPlaceholder?: string;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item',
  description,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isLoading = false,
  itemName,
  showNameConfirmation = false,
  confirmationPlaceholder = 'Type the name to confirm',
}: DeleteDialogProps) {
  const [confirmationName, setConfirmationName] = useState('');

  const defaultDescription = itemName
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : 'Are you sure you want to delete this item? This action cannot be undone.';

  const handleConfirm = () => {
    if (showNameConfirmation && confirmationName !== itemName) {
      return;
    }
    onConfirm();
  };

  const isConfirmDisabled = isLoading || (showNameConfirmation && confirmationName !== itemName);

  const handleClose = () => {
    setConfirmationName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 sm:max-w-md">
        <DialogHeader className="border-b border-gray-200 p-4 dark:border-gray-700">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description || defaultDescription}</DialogDescription>
        </DialogHeader>

        <div className="px-4 pt-4">
          {showNameConfirmation && (
            <div className="mb-4">
              <label htmlFor="confirmation-name" className="text-sm font-medium">
                Type "{itemName}" to confirm deletion
              </label>
              <Input
                id="confirmation-name"
                type="text"
                placeholder={confirmationPlaceholder}
                value={confirmationName}
                onChange={e => setConfirmationName(e.target.value)}
                className="mt-2"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pb-4">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={isLoading}>
              {cancelText}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
