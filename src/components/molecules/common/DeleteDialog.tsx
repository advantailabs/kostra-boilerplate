import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="mt-1 text-sm leading-6">
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>

        {showNameConfirmation && (
          <div className="mt-4">
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

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button
              type="button"
              className="mt-2 w-full sm:mt-0 sm:w-fit"
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="w-full sm:w-fit"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
