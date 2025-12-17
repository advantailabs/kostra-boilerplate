'use client';

import { Badge } from '@/components/atom/Badge';
import { Suspense } from 'react';

function AppPageContent() {
  const variants = ['default', 'neutral', 'success', 'error', 'warning', 'info', 'primary'] as const;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Badges</h1>
        <div className="flex flex-wrap gap-3 items-center">
          {variants.map(v => (
            <Badge key={v} variant={v as any}>
              {v}
            </Badge>
          ))}
        </div>
      </div>
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
