import { Modal } from '@/components/molecules/common/Modal';
import { useAdminUsers } from '@/hooks/useAdminUsers';

export type ModalDeleteUserProps = {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
};

export function ModalDeleteUser({ isOpen, onClose, user }: ModalDeleteUserProps) {
  const { deleteUser, isDeleting } = useAdminUsers();

  const handleDelete = async () => {
    if (!user) return;

    try {
      await deleteUser(user.id);
      onClose();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete User"
      description={`Are you sure you want to delete ${user.name}? This action cannot be undone.`}
      maxWidth="max-w-md"
      primaryActionText="Delete User"
      secondaryActionText="Cancel"
      onPrimaryAction={handleDelete}
      isPrimaryActionLoading={isDeleting}
      isPrimaryActionDisabled={isDeleting}
    >
      <div className="space-y-4">
        <div className="rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20">
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p>
              <strong>Warning:</strong> This will permanently delete the user account and all
              associated data.
            </p>
          </div>
        </div>

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
      </div>
    </Modal>
  );
}
