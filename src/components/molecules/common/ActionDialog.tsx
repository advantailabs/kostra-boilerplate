import React, { useState } from 'react';
import { Input } from '../../atom/Input';
import { Modal } from './Modal';

/**
 * Generic ActionDialog component for consistent action confirmation across the application.
 * Supports different action types like delete, restore, etc.
 *
 * @example
 * // Basic delete usage
 * <ActionDialog
 *   isOpen={showDelete}
 *   onClose={() => setShowDelete(false)}
 *   onConfirm={handleDelete}
 *   title="Delete Item"
 *   itemName="My Item"
 *   itemType="item"
 *   actionType="delete"
 *   isLoading={isDeleting}
 * />
 *
 * @example
 * // Restore action with purple styling
 * <ActionDialog
 *   isOpen={showRestore}
 *   onClose={() => setShowRestore(false)}
 *   onConfirm={handleRestore}
 *   title="Restore User"
 *   itemName={user.name}
 *   itemType="user"
 *   actionType="restore"
 *   isLoading={isRestoring}
 *   warningMessage="This will restore the user account with all pre-deletion data."
 *   additionalInfo={
 *     <div>
 *       <p>Email: {user.email}</p>
 *       <p>Role: {user.role}</p>
 *     </div>
 *   }
 * />
 */
export interface ActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  itemName: string;
  itemType: string;
  actionType?: 'delete' | 'restore';
  isLoading?: boolean;
  onSuccess?: () => void;
  warningMessage?: string;
  additionalInfo?: React.ReactNode;
  // Name confirmation feature (for contact management)
  showNameConfirmation?: boolean;
  confirmationPlaceholder?: string;
}

export function ActionDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  itemType,
  actionType = 'delete',
  isLoading = false,
  onSuccess,
  warningMessage,
  additionalInfo,
  showNameConfirmation = false,
  confirmationPlaceholder = 'Type the name to confirm',
}: ActionDialogProps) {
  const [confirmationName, setConfirmationName] = useState('');

  const handleAction = async () => {
    if (showNameConfirmation && confirmationName !== itemName) {
      return;
    }
    try {
      await onConfirm();
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error(`Error ${actionType}ing ${itemType}:`, error);
      // Error is already handled by the mutation hook
    }
  };

  const handleClose = () => {
    setConfirmationName('');
    onClose();
  };

  const isConfirmDisabled = isLoading || (showNameConfirmation && confirmationName !== itemName);

  // Get action-specific styling and text
  const getActionConfig = () => {
    switch (actionType) {
      case 'restore':
        return {
          buttonClass:
            'rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          loadingText: 'Restoring...',
          actionText: 'Restore',
          primaryActionVariant: 'primary' as const,
        };
      case 'delete':
      default:
        return {
          buttonClass:
            'rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          loadingText: 'Deleting...',
          actionText: 'Delete',
          primaryActionVariant: 'destructive' as const,
        };
    }
  };

  const actionConfig = getActionConfig();

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
        className={actionConfig.buttonClass}
        onClick={handleAction}
        disabled={isConfirmDisabled}
      >
        {isLoading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            {actionConfig.loadingText}
          </>
        ) : (
          actionConfig.actionText
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
      primaryActionText={
        showNameConfirmation
          ? undefined
          : isLoading
            ? actionConfig.loadingText
            : actionConfig.actionText
      }
      secondaryActionText={showNameConfirmation ? undefined : 'Cancel'}
      onPrimaryAction={showNameConfirmation ? undefined : handleAction}
      isPrimaryActionDisabled={showNameConfirmation ? undefined : isConfirmDisabled}
      isPrimaryActionLoading={showNameConfirmation ? undefined : isLoading}
      primaryActionVariant={actionConfig.primaryActionVariant}
      footer={customFooter}
    >
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
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
          Are you sure you want to {actionType} the {itemType} <strong>{itemName}</strong>?
          {actionType === 'delete' ? ' This action cannot be undone.' : ''}
        </p>

        {showNameConfirmation && (
          <div className="mt-4">
            <label
              htmlFor="confirmation-name"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Type "{itemName}" to confirm {actionType}
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
