import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { CircleAlert } from 'lucide-react';
import React, { useState } from 'react';
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
            'rounded-md border border-transparent bg-primary px-4 py-2  font-medium text-white hover:bg-primary-hover focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          loadingText: 'Restoring...',
          actionText: 'Restore',
          primaryActionVariant: 'primary' as const,
        };
      case 'delete':
      default:
        return {
          buttonClass:
            'rounded-md border border-transparent bg-red-600 px-4 py-2  font-medium text-white hover:bg-red-700 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
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
      <Button
        type="button"
        className="rounded-md border border-border bg-background px-4 py-2 font-medium text-text hover:bg-background-light focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        onClick={handleClose}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        type="button"
        className={actionConfig.buttonClass + ' cursor-pointer disabled:cursor-not-allowed'}
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
      </Button>
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
        {warningMessage && (
          <Alert variant="destructive" className="mb-4 border-none">
            <CircleAlert />
            <AlertDescription className="text-sm">{warningMessage}</AlertDescription>
          </Alert>
        )}

        <p className="text-sm text-text-muted">
          Are you sure you want to {actionType} the {itemType} <strong>{itemName}</strong>?
          {actionType === 'delete' ? ' This action cannot be undone.' : ''}
        </p>

        {showNameConfirmation && (
          <Field className="mt-4">
            <FieldLabel htmlFor="confirmation-name" className="text-sm font-medium text-text">
              Type &quot;{itemName}&quot; to confirm {actionType}
            </FieldLabel>
            <Input
              id="confirmation-name"
              type="text"
              placeholder={confirmationPlaceholder}
              value={confirmationName}
              onChange={e => setConfirmationName(e.target.value)}
              className="mt-2"
            />
          </Field>
        )}

        {additionalInfo && <div className="mt-4 space-y-2">{additionalInfo}</div>}
      </div>
    </Modal>
  );
}
