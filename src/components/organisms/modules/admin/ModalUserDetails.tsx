/**
 * User Details Modal for Admin Users Page
 * Displays comprehensive user information with profile picture
 */

import { UserProfilePicture } from '@/components/atom/UserProfilePicture';
import { Modal } from '@/components/molecules/common/Modal';
import { UserDetailsList } from '@/components/molecules/common/UserDetailsList';
import { ModalUserDetailsProps } from '@/types/user';

export function ModalUserDetails({ isOpen, onClose, user }: ModalUserDetailsProps) {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      description={`Detailed information for ${user.name}`}
      maxWidth="max-w-lg"
      secondaryActionText="Close"
    >
      <div className="space-y-6">
        {/* Header with Profile Picture and Basic Info */}
        <div className="flex items-start gap-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <UserProfilePicture user={user} size="xl" />
          </div>

          {/* Basic User Info */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-gray-100">
              {user.name}
            </h3>
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  user.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                }`}
              >
                {user.role}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  user.plan === 'PRO'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                }`}
              >
                {user.plan} Plan
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
          <h4 className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">
            Account Information
          </h4>
          <UserDetailsList user={user} className="grid grid-cols-1 gap-4 sm:grid-cols-2" />
        </div>
      </div>
    </Modal>
  );
}
