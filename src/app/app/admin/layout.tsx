'use client';

import React from 'react';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <div className="">{children}</div>
    </div>
  );
}
