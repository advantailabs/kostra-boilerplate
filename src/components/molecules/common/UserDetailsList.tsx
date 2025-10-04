/**
 * Reusable User Details List component
 * Displays user information in a structured format
 */

import { ADMIN_ROLES, UserRole } from '@/lib/constants/admin';
import { UserDetailsListProps } from '@/types/user';
import { formatDistanceToNow } from 'date-fns';

interface DetailItemProps {
  label: string;
  value: string | number | boolean;
  className?: string;
}

function DetailItem({ label, value, className }: DetailItemProps) {
  return (
    <div className={className}>
      <dt className="text-sm font-medium text-text-muted">{label}</dt>
      <dd className="mt-1 text-sm text-text">{value}</dd>
    </div>
  );
}

export function UserDetailsList({ user, className }: UserDetailsListProps) {
  const { name, email, role, isOnboarded, credits, plan, createdAt, updatedAt } = user;

  // Get role display name
  const getRoleDisplayName = (userRole: UserRole) => {
    const roleConfig = ADMIN_ROLES.find(r => r.value === userRole);
    return roleConfig?.label || userRole;
  };

  // Format dates
  const createdDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const updatedDate = formatDistanceToNow(new Date(updatedAt), { addSuffix: true });

  return (
    <dl className={className}>
      <DetailItem label="Full Name" value={name} />
      <DetailItem label="Email Address" value={email} />
      <DetailItem label="Role" value={getRoleDisplayName(role)} />
      <DetailItem label="Status" value={isOnboarded ? 'Onboarded' : 'Onboarding Pending'} />
      <DetailItem label="Credits" value={credits.toLocaleString()} />
      <DetailItem label="Plan" value={plan} />
      <DetailItem label="Member Since" value={createdDate} />
      <DetailItem label="Last Updated" value={updatedDate} />
    </dl>
  );
}
