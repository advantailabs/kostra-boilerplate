import React, { useState } from 'react';
import { Modal } from './Modal';
import { Input } from '@/components/atom/Input';

/**
 * Generic DeleteDialog component for consistent delete confirmation across the application.
 *
 * @example
 * // Basic usage
 * <DeleteDialog
 *   isOpen={showDelete}
 *   onClose={() => setShowDelete(false)}
 *   onConfirm={handleDelete}
 *   title="Delete Item"
 *   itemName="My Item"
 *   itemType="item"
 *   isLoading={isDeleting}
 * />
 *
 * @example
 * // With custom warning and additional info
 * <DeleteDialog
 *   isOpen={showDelete}
 *   onClose={() => setShowDelete(false)}
 *   onConfirm={handleDelete}
 *   title="Delete User"
 *   itemName={user.name}
 *   itemType="user"
 *   isLoading={isDeleting}
 *   warningMessage="This will permanently delete the user account and all associated data."
 *   additionalInfo={
 *     <div>
 *       <p>Email: {user.email}</p>
 *       <p>Role: {user.role}</p>
 *     </div>
 *   }
 * />
 */
export interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  itemName: string;
  itemType: string;
  isLoading?: boolean;
  onSuccess?: () => void;
  warningMessage?: string;
  additionalInfo?: React.ReactNode;
  // Name confirmation feature (for contact management)
  showNameConfirmation?: boolean;
  confirmationPlaceholder?: string;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  itemType,
  isLoading = false,
  onSuccess,
  warningMessage,
  additionalInfo,
  showNameConfirmation = false,
  confirmationPlaceholder = 'Type the name to confirm',
}: DeleteDialogProps) {
  const [confirmationName, setConfirmationName] = useState('');

  const handleDelete = async () => {
    if (showNameConfirmation && confirmationName !== itemName) {
      return;
    }
    try {
      await onConfirm();
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
      // Error is already handled by the mutation hook
    }
  };

  const handleClose = () => {
    setConfirmationName('');
    onClose();
  };

  const isConfirmDisabled = isLoading || (showNameConfirmation && confirmationName !== itemName);

  // Custom footer for name confirmation
  const customFooter = showNameConfirmation ? (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleClose}
        disabled={isLoading}
      >
        Cancel
      </button>
      <button
        type="button"
        className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleDelete}
        disabled={isConfirmDisabled}
      >
        {isLoading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Deleting...
          </>
        ) : (
          'Delete'
        )}
      </button>
    </div>
  ) : undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-md"
      title={title}
      primaryActionText={showNameConfirmation ? undefined : isLoading ? 'Deleting...' : 'Delete'}
      secondaryActionText={showNameConfirmation ? undefined : 'Cancel'}
      onPrimaryAction={showNameConfirmation ? undefined : handleDelete}
      isPrimaryActionDisabled={showNameConfirmation ? undefined : isConfirmDisabled}
      isPrimaryActionLoading={showNameConfirmation ? undefined : isLoading}
      primaryActionVariant="destructive"
      footer={customFooter}
    >
      <div>
        {warningMessage && (
          <div className="mb-4 rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20">
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p>
                <strong>Warning:</strong> {warningMessage}
              </p>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete the {itemType} <strong>{itemName}</strong>? This action
          cannot be undone.
        </p>

        {showNameConfirmation && (
          <div className="mt-4">
            <label
              htmlFor="confirmation-name"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
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

        {additionalInfo && <div className="mt-4 space-y-2">{additionalInfo}</div>}
      </div>
    </Modal>
  );
}
