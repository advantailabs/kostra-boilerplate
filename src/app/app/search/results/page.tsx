'use client';

// import Image from 'next/image';
// import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { Button } from '../../../../components/atom/Button';
// Spinner kept for potential future use
import { SearchResultSkeleton } from '../../../../components/atom/Skeleton';
import { CompactSearchBox } from '../../../../components/molecules/search/CompactSearchBox';
import { useSmartSearch } from '../../../../hooks/useSearch';
import type { SearchMode } from '../../../../lib/constants/search';
import { generateFileDownloadUrl } from '../../../../services/api/files';

interface ResultItem {
  id: string;
  filename: string;
  score: number;
  attributes?: Record<string, unknown> | null;
  content?: any;
  openaiFileId?: string | null;
  fileId?: number | null;
  rank: number;
}

export default function SearchResultsPage() {
  const params = useSearchParams();
  const router = useRouter();
  const query = params.get('q') || '';
  const knowledgeBaseId = params.get('kb') || '';
  const [results, setResults] = React.useState<ResultItem[]>([]);
  const [answer, setAnswer] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const mode = (params.get('mode') as SearchMode) || 'smart-search';
  const { search, isPending } = useSmartSearch();

  const handleDownload = React.useCallback(async (fileId?: number | null) => {
    if (!fileId) return;
    try {
      const { downloadUrl, filename } = await generateFileDownloadUrl(fileId);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Failed to download file', err);
    }
  }, []);

  React.useEffect(() => {
    const run = async () => {
      if (!query || !knowledgeBaseId) return;
      setError(null);
      try {
        const data = await search({
          query,
          knowledgeBaseId: Number(knowledgeBaseId),
          mode,
        });
        const ordered = (data.results || []).slice().sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
        setResults(ordered);
        setAnswer((data as any).answer ?? null);
      } catch (e: any) {
        setError(e?.message || 'Search failed');
      }
    };
    run();
  }, [query, knowledgeBaseId, mode, search]);

  const renderExcerpt = (item: ResultItem) => {
    const texts: string[] = Array.isArray(item?.content)
      ? item.content
          .filter((c: any) => c?.type === 'text' && typeof c?.text === 'string')
          .map((c: any) => c.text)
      : [];
    const preview = texts.join(' ').slice(0, 300);
    return preview || 'No preview available.';
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:px-8 sm:py-6 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header removed (logo will be shown above search box) */}
        {/* Single column: compact search box + centered results */}
        <div className="space-y-6">
          <div>
            {/* Page-level logo removed */}
            <CompactSearchBox
              initialQuery={query}
              initialKnowledgeBaseId={knowledgeBaseId || undefined}
              initialMode={mode}
              syncQueryParams
              onSearch={({ query: q, knowledgeBaseId: kb, mode: m }) => {
                const paramsNext = new URLSearchParams();
                paramsNext.set('q', q);
                if (kb) paramsNext.set('kb', kb);
                paramsNext.set('mode', m);
                router.push(`/app/search/results?${paramsNext.toString()}`);
              }}
            />
            {mode === 'smart-search' && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Showing top 10 most relevant files
              </div>
            )}
          </div>

          <div className="-mx-4 sm:mx-0">
            {isPending && (
              <div className="space-y-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SearchResultSkeleton key={i} />
                ))}
              </div>
            )}

            {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}

            {!isPending && !error && (
              <div className="mx-auto max-w-5xl space-y-6">
                {mode === 'smart-qa' && !!answer && (
                  <>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                      {answer}
                    </div>
                    <div className="my-4 h-px w-full bg-gray-200 dark:bg-gray-800" />
                  </>
                )}
                {results.map(item => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="p-0 text-left text-base font-medium text-blue-700 hover:underline dark:text-blue-400"
                        onClick={() => handleDownload(item.fileId)}
                        disabled={!item.fileId}
                      >
                        {item.filename}
                      </Button>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Confidence: {(item.score * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {renderExcerpt(item)}
                    </div>
                  </div>
                ))}

                {results.length === 0 && (
                  <div className="text-sm text-gray-600 dark:text-gray-300">No results found.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
