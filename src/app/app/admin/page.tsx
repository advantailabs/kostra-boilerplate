'use client';

import Link from 'next/link';

import { siteConfig } from '@/app/siteConfig';
import { Button } from '@/components/atom/Button';
import { PageHeaderWithAction } from '@/components/molecules/common/PageHeaderWithAction';

export default function AdminPage() {
  return (
    <>
      <PageHeaderWithAction
        title="Admin Dashboard"
        description="Manage your application from the admin panel"
      />

      <div className="space-y-6 p-4">
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-medium text-text">User Management</h3>
            <p className="mt-2 text-sm text-text-muted">Manage users, roles, and permissions.</p>
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
