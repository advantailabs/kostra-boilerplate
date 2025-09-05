'use client';

import { Suspense } from 'react';

function AppPageContent() {
  return <div className="min-h-screen bg-white dark:bg-gray-950" />;
}

export default function AppPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-gray-950" />}>
      <AppPageContent />
    </Suspense>
  );
}
