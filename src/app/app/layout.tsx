'use client';

import { ThemeProvider } from 'next-themes';
import React from 'react';

import { Sidebar } from '@/components/organisms/shared/navigation/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto scroll-auto antialiased selection:bg-indigo-100 selection:text-indigo-700 dark:bg-gray-950">
      <ThemeProvider defaultTheme="system" attribute="class">
        <Sidebar />
        <main className="lg:pl-60">{children}</main>
      </ThemeProvider>
    </div>
  );
}
