import { ActionDialog } from '@/components/molecules/common/ActionDialog';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { ModalDeleteUserProps } from '@/types/user';

export function ModalDeleteUser({ isOpen, onClose, user }: ModalDeleteUserProps) {
  const { deleteUser, isDeleting } = useAdminUsers();

  const handleDelete = async () => {
    if (!user) return;
    await deleteUser(user.id);
  };

  if (!user) return null;

  const additionalInfo = (
    <div className="space-y-2">
      <div>
        <span className="font-medium text-text">Name:</span>
        <span className="ml-2 text-text-muted">{user.name}</span>
      </div>
      <div>
        <span className="font-medium text-text">Email:</span>
        <span className="ml-2 text-text-muted">{user.email}</span>
      </div>
    </div>
  );

  return (
    <ActionDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete User"
      itemName={user.name}
      itemType="user"
      actionType="delete"
      isLoading={isDeleting}
      warningMessage="This will permanently delete the user account and all associated data."
      additionalInfo={additionalInfo}
    />
  );
}
