'use client';

import { UsersPage } from '@/components/organisms/modules/admin/UsersPage';
import { useRouteProtection } from '@/hooks/useRouteProtection';

export default function AdminUsersPage() {
  // Protect this admin-only page
  useRouteProtection();
  
  return <UsersPage />;
}
