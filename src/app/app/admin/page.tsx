'use client';

import Link from 'next/link';

import { Button } from '@/components/atom/Button';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
          <h3 className="font-medium text-gray-900 dark:text-gray-50">User Management</h3>
          <p className="mt-2 text-sm text-gray-500">Manage users, roles, and permissions.</p>
          <div className="mt-4">
            <Button asChild variant="secondary">
              <Link href="/app/admin/users">Manage Users</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
