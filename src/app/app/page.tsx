'use client';

import { Suspense } from 'react';

function AppPageContent() {
  return (
    <div className="min-h-screen bg-background p-8">
    </div>
  );
}

export default function AppPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AppPageContent />
    </Suspense>
  );
}
