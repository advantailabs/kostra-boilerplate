'use client';

import { SearchBox } from '@/components/molecules/search/SearchBox';

export default function AppPage() {
  const handleSearch = (data: {
    query: string;
    files: Array<{ id: string; name: string; size: number }>;
    knowledgeBaseId: string;
    mode: 'web' | 'deep';
  }) => {
    console.log('Search:', data);
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:px-6 sm:pb-6 sm:pt-10 lg:px-10 lg:pt-7 dark:bg-gray-950">
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Search</h1>
          </div>

          {/* Search Container */}
          <SearchBox onSearch={handleSearch} />
        </div>
      </div>
    </div>
  );
}
