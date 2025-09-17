'use client';

import Link from 'next/link';

import { siteConfig } from '@/app/siteConfig';
import { Button } from '@/components/atom/Button';
import { PageHeaderWithAction } from '@/components/molecules/common/PageHeaderWithAction';
import { useRouteProtection } from '@/hooks/useRouteProtection';

export default function AdminPage() {
  // Protect this admin-only page
  useRouteProtection();
  return (
    <>
      <PageHeaderWithAction
        title="Admin Dashboard"
        description="Manage your application from the admin panel"
      />

      <div className="space-y-6 p-4">
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
            <h3 className="font-medium text-gray-900 dark:text-gray-50">User Management</h3>
            <p className="mt-2 text-sm text-gray-500">Manage users, roles, and permissions.</p>
            <div className="mt-4">
              <Button asChild variant="secondary">
                <Link href={siteConfig.baseLinks.admin.users}>Manage Users</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
