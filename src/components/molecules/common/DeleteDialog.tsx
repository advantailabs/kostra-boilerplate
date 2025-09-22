import React from 'react';
import { Modal } from './Modal';

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
}: DeleteDialogProps) {
  const handleDelete = async () => {
    try {
      await onConfirm();
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
      // Error is already handled by the mutation hook
    }
  };

  const defaultWarningMessage = `Are you sure you want to delete the ${itemType} <strong>${itemName}</strong>? This action cannot be undone.`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      title={title}
      primaryActionText={isLoading ? 'Deleting...' : 'Delete'}
      secondaryActionText="Cancel"
      onPrimaryAction={handleDelete}
      isPrimaryActionDisabled={isLoading}
      isPrimaryActionLoading={isLoading}
      primaryActionVariant="destructive"
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

        <p
          className="text-sm text-gray-600 dark:text-gray-400"
          dangerouslySetInnerHTML={{ __html: warningMessage || defaultWarningMessage }}
        />

        {additionalInfo && <div className="mt-4 space-y-2">{additionalInfo}</div>}
      </div>
    </Modal>
  );
}
