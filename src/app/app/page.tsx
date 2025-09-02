'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { CreditDisplay } from '@/components/atom/CreditDisplay';

function AppPageContent() {
  const params = useSearchParams();
  const kb = params.get('kb') || undefined;

  const handleSearch = (data: {
    query: string;
    files: Array<{ id: string; name: string; size: number }>;
    knowledgeBaseId: string;

  }) => {
    console.log('Search:', data);
  };

  return (
    <div className="min-h-screen bg-white p-2 sm:p-4 sm:px-6 sm:pb-6 sm:pt-10 lg:px-10 lg:pt-7 dark:bg-gray-950">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center sm:min-h-[calc(100vh-8rem)]">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
          {/* Search Container with top-right CreditDisplay */}
          <div className="relative pt-4">
            <div className="absolute right-0 top-0 z-10">
              <CreditDisplay size="md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white p-2 sm:p-4 sm:px-6 sm:pb-6 sm:pt-10 lg:px-10 lg:pt-7 dark:bg-gray-950">
          <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center sm:min-h-[calc(100vh-8rem)]">
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
              <div className="mb-4 text-center sm:mb-6 md:mb-8">
                <div className="mb-2 flex items-center justify-center gap-4">
                  <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl md:text-3xl dark:text-gray-100">
                    Smart Search
                  </h1>
                </div>
              </div>
              <div className="relative pt-4">
                <div className="absolute right-0 top-0 z-10">
                  <CreditDisplay size="md" />
                </div>
                <div className="animate-pulse">
                  <div className="h-12 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <AppPageContent />
    </Suspense>
  );
}
