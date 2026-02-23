/**
 * User Details Modal for Admin Users Page
 * Displays comprehensive user information with profile picture
 */

import { UserProfilePicture } from '@/components/atom/UserProfilePicture';
import { Modal } from '@/components/molecules/common/Modal';
import { UserDetailsList } from '@/components/molecules/common/UserDetailsList';
import { Badge } from '@/components/ui/badge';
import { ModalUserDetailsProps } from '@/types/user';

export function ModalUserDetails({ isOpen, onClose, user }: ModalUserDetailsProps) {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      description={`Detailed information for ${user.name}`}
      maxWidth="max-w-lg!"
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
            <h3 className="truncate text-lg font-semibold text-text">{user.name}</h3>
            <p className="truncate text-sm text-text-muted">{user.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant={user.role === 'ADMIN' ? 'success' : 'info'}>{user.role}</Badge>
              <Badge variant={user.plan === 'PRO' ? 'warning' : 'default'}>{user.plan} Plan</Badge>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="border-t border-border pt-6">
          <h4 className="mb-4 text-sm font-medium text-text">Account Information</h4>
          <UserDetailsList user={user} className="grid grid-cols-1 gap-4 sm:grid-cols-2" />
        </div>
      </div>
    </Modal>
  );
}
