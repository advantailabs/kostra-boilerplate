'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import { siteConfig } from '@/app/siteConfig';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminDashboard = pathname === siteConfig.baseLinks.admin.dashboard;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="p-4 sm:px-6 sm:pb-10 sm:pt-10 lg:px-10 lg:pt-7">
        {isAdminDashboard && (
          <>
            <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">Manage your application from the admin panel.</p>
            <div className="pt-6">{children}</div>
          </>
        )}
        {!isAdminDashboard && children}
      </div>
    </div>
  );
}
