'use client';

// import Image from 'next/image';
// import Link from 'next/link';
import { getApiErrorMessage } from '@/lib/utils/error-handler';
import { RiCheckLine, RiFileCopyLine } from '@remixicon/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/atom/Button';
import { CreditDisplay } from '@/components/atom/CreditDisplay';
import MarkdownRenderer from '@/components/atom/SyntaxHighlighter';
// Spinner kept for potential future use
import { SearchResultSkeleton } from '@/components/atom/Skeleton';
import { CompactSearchBox } from '@/components/molecules/search/CompactSearchBox';
import { useSmartSearchWithCredits } from '@/hooks/useSearchWithCredits';
import type { SearchMode } from '@/lib/constants/search';
import { generateFileDownloadUrl } from '@/services/api/files';

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
  const [copiedAnswer, setCopiedAnswer] = React.useState(false);
  const mode = (params.get('mode') as SearchMode) || 'smart-search';
  const { search } = useSmartSearchWithCredits();
  const lastQueryKeyRef = React.useRef<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

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

      const key = `${query}::${knowledgeBaseId}::${mode}`;
      if (lastQueryKeyRef.current === key) return;
      lastQueryKeyRef.current = key;

      setError(null);
      setIsLoading(true);
      try {
        const data = await search({
          query,
          knowledgeBaseId: Number(knowledgeBaseId),
          mode,
        });
        const ordered = (data.results || [])
          .slice()
          .sort((a: any, b: any) => (a.rank ?? 0) - (b.rank ?? 0));
        setResults(ordered);
        setAnswer((data as any).answer ?? null);
      } catch (e: any) {
        setError(getApiErrorMessage(e, 'Search failed'));
        setResults([]);
        setAnswer(null);
        // Allow retry for same params after an error
        lastQueryKeyRef.current = null;
      } finally {
        setIsLoading(false);
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
    <>
      <div className="min-h-screen bg-white p-4 pb-40 sm:px-8 sm:py-6 dark:bg-gray-950">
        <div className="mx-auto w-full max-w-3xl">
          {/* Header removed (logo will be shown above search box) */}
          {/* Single column: compact search box + centered results */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="pt-6 text-2xl font-semibold text-gray-900 dark:text-white">
                {query ? query.charAt(0).toUpperCase() + query.slice(1) : 'Search'}
              </h1>
            </div>

            <div className="mx-0">
              {!isLoading && !error && mode === 'smart-search' && results.length > 0 && (
                <div className="mt-1 pb-2 text-sm text-gray-600 dark:text-gray-300">
                  Showing top {results.length} most relevant files
                </div>
              )}
              {isLoading && (
                <div className="space-y-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SearchResultSkeleton key={i} />
                  ))}
                </div>
              )}

              {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}

              {!isLoading && !error && (
                <div className="mx-auto max-w-5xl space-y-6">
                  {mode === 'smart-qa' && !!answer && (
                    <>
                      <div className="relative">
                        <Button
                          type="button"
                          variant="ghost"
                          className="absolute right-2 top-2 z-10 p-1.5"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(answer || '');
                              setCopiedAnswer(true);
                              setTimeout(() => setCopiedAnswer(false), 2000);
                            } catch (e) {
                              // no-op
                            }
                          }}
                          title={copiedAnswer ? 'Copied!' : 'Copy answer'}
                        >
                          {copiedAnswer ? (
                            <RiCheckLine className="h-4 w-4 text-green-600" />
                          ) : (
                            <RiFileCopyLine className="h-4 w-4" />
                          )}
                        </Button>
                        <MarkdownRenderer content={answer} />
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
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      No results found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="sticky bottom-4 z-40">
        {/* Full-width background overlay to prevent text bleed-through */}
        <div className="pointer-events-none absolute inset-x-0 -bottom-4 -top-20 bg-gradient-to-b from-transparent via-white/90 to-white dark:via-gray-950/90 dark:to-gray-950" />

        <div className="relative mx-auto w-full max-w-3xl bg-white py-3 pt-6 dark:bg-gray-950">
          <div className="absolute right-0 top-0 z-10">
            <CreditDisplay size="sm" />
          </div>
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
        </div>
      </div>
    </>
  );
}
