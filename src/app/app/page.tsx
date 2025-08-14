'use client';

import { useSearchParams } from 'next/navigation';

import { CreditDisplay } from '@/components/atom/CreditDisplay';
import { SearchBox } from '@/components/molecules/search/SearchBox';
import type { SearchMode } from '@/lib/constants/search';

export default function AppPage() {
  const params = useSearchParams();
  const kb = params.get('kb') || undefined;
  const mode = (params.get('mode') as SearchMode) || 'smart-search';

  const handleSearch = (data: {
    query: string;
    files: Array<{ id: string; name: string; size: number }>;
    knowledgeBaseId: string;
    mode: SearchMode;
  }) => {
    console.log('Search:', data);
  };

  return (
    <div className="min-h-screen bg-white p-2 sm:p-4 sm:px-6 sm:pb-6 sm:pt-10 lg:px-10 lg:pt-7 dark:bg-gray-950">
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center sm:min-h-[calc(100vh-8rem)]">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
          {/* Title */}
          <div className="mb-4 text-center sm:mb-6 md:mb-8">
            <div className="mb-2 flex items-center justify-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl md:text-3xl dark:text-gray-100">
                Smart Search
              </h1>
              <CreditDisplay size="md" />
            </div>
          </div>

          {/* Search Container */}
          <SearchBox onSearch={handleSearch} initialKnowledgeBaseId={kb} initialMode={mode} />
        </div>
      </div>
    </div>
  );
}
