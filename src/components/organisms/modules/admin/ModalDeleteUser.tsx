import { DeleteDialog } from '@/components/molecules/common/DeleteDialog';
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
    <DeleteDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete User"
      itemName={user.name}
      itemType="user"
      isLoading={isDeleting}
      warningMessage="This will permanently delete the user account and all associated data."
      additionalInfo={additionalInfo}
    />
  );
}
