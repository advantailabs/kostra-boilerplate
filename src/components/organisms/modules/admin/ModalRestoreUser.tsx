import { useAdminUsers } from '../../../../hooks/useAdminUsers';
import { ModalDeleteUserProps } from '../../../../types/user';
import { ActionDialog } from '../../../molecules/common/ActionDialog';

export function ModalRestoreUser({ isOpen, onClose, user }: ModalDeleteUserProps) {
  const { restoreUser, isRestoring } = useAdminUsers();

  const handleRestore = async () => {
    if (!user) return;
    await restoreUser(user.id);
  };

  if (!user) return null;

  const additionalInfo = (
    <div className="space-y-2">
      <div>
        <span className="font-medium text-gray-900 dark:text-gray-50">Name:</span>
        <span className="ml-2 text-gray-700 dark:text-gray-300">{user.name}</span>
      </div>
      <div>
        <span className="font-medium text-gray-900 dark:text-gray-50">Email:</span>
        <span className="ml-2 text-gray-700 dark:text-gray-300">{user.email}</span>
      </div>
    </div>
  );

  return (
    <ActionDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleRestore}
      title="Restore User"
      itemName={user.name}
      itemType="user"
      actionType="restore"
      isLoading={isRestoring}
      warningMessage="This will restore the user account with all pre-deletion data."
      additionalInfo={additionalInfo}
    />
  );
}
