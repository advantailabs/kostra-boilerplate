'use client';

import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

function AppPageContent() {
  return (
    <div className="min-h-screen bg-background p-4">
      <Button variant="default">Click me</Button>
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
