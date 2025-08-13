'use client';

import { RiSendPlaneLine, RiSettings3Line } from '@remixicon/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Modal } from '@/components/molecules/common/Modal';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { SEARCH_MODE_OPTIONS, type SearchMode } from '@/lib/constants/search';

interface AttachedFile {
  id: string;
  name: string;
  size: number;
}

interface CompactSearchBoxProps {
  onSearch: (_data: {
    query: string;
    files: AttachedFile[];
    knowledgeBaseId: string;
    mode: SearchMode;
  }) => void;
  className?: string;
  initialQuery?: string;
  initialKnowledgeBaseId?: string;
  initialMode?: SearchMode;
  syncQueryParams?: boolean;
}

export function CompactSearchBox({
  onSearch,
  className = '',
  initialQuery,
  initialKnowledgeBaseId,
  initialMode,
  syncQueryParams = false,
}: CompactSearchBoxProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery ?? '');
  const [attachedFiles] = useState<AttachedFile[]>([]);
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState<string>(
    initialKnowledgeBaseId ?? ''
  );
  const [searchMode, setSearchMode] = useState<SearchMode>(initialMode ?? 'smart-search');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempSelectedKbId, setTempSelectedKbId] = useState<string>('');
  const [tempSearchMode, setTempSearchMode] = useState<SearchMode>('smart-search');
  const router = useRouter();
  const pathname = usePathname();
  const urlParams = useSearchParams();

  const { data: knowledgeBasesData, isLoading: loadingKnowledgeBases } = useKnowledgeBases();
  const knowledgeBases = React.useMemo(
    () => knowledgeBasesData?.knowledgeBases || [],
    [knowledgeBasesData?.knowledgeBases]
  );

  React.useEffect(() => {
    if (knowledgeBases.length > 0 && !selectedKnowledgeBaseId) {
      setSelectedKnowledgeBaseId(initialKnowledgeBaseId ?? knowledgeBases[0].id.toString());
    }
  }, [knowledgeBases, selectedKnowledgeBaseId, initialKnowledgeBaseId]);

  React.useEffect(() => {
    if (!syncQueryParams) return;
    const params = new URLSearchParams(urlParams.toString());
    if (selectedKnowledgeBaseId) params.set('kb', selectedKnowledgeBaseId);
    else params.delete('kb');
    if (searchMode) params.set('mode', searchMode);
    router.replace(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKnowledgeBaseId, searchMode, syncQueryParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    onSearch({
      query: searchQuery,
      files: attachedFiles,
      knowledgeBaseId: selectedKnowledgeBaseId,
      mode: searchMode,
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-stretch gap-3">
        <Link href="/app" className="flex items-center">
          <Image
            src="/logos/dark-symbol.png"
            alt="Peon"
            width={40}
            height={40}
            className="block h-10 w-10 dark:hidden"
            priority
          />
          <Image
            src="/logos/light-symbol.png"
            alt="Peon"
            width={40}
            height={40}
            className="hidden h-10 w-10 dark:block"
            priority
          />
        </Link>
        <div
          className={`flex-1 overflow-hidden rounded-full border border-gray-200 bg-white p-2 shadow-sm sm:p-3 dark:border-gray-800 dark:bg-gray-900 ${className}`}
        >
          <form onSubmit={handleSearch} className="space-y-0">
            <div className="relative overflow-hidden">
              {/* Settings button on the left */}
              <div className="pointer-events-auto absolute left-1.5 top-1/2 z-10 -translate-y-1/2">
                <Button
                  type="button"
                  variant="elevated"
                  className="h-6 w-6 rounded-full p-0"
                  onClick={() => {
                    setTempSelectedKbId(selectedKnowledgeBaseId);
                    setTempSearchMode(searchMode);
                    setIsSettingsOpen(true);
                  }}
                >
                  <RiSettings3Line className="h-3 w-3" />
                </Button>
              </div>
              <Input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search files or ask questions..."
                inputClassName="bg-transparent dark:bg-transparent pr-24 pl-10 border-0 shadow-none focus:ring-0 focus:border-0"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch(e as any);
                  }
                }}
                autoFocus
              />

              <div className="flex items-center justify-end space-x-1 overflow-hidden sm:space-x-2">
                <div className="absolute right-1 top-1/2 -translate-y-1/2 space-x-1">
                  <Button
                    type="submit"
                    variant="elevated"
                    className="h-6 w-6 rounded-full bg-gray-800 p-0 text-gray-300 hover:bg-gray-800 hover:text-gray-300 dark:bg-white dark:text-gray-600 dark:hover:bg-white dark:hover:text-gray-600"
                  >
                    <RiSendPlaneLine className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="mt-1 flex items-center justify-between px-3 text-[10px] text-gray-500 sm:px-4 sm:text-xs dark:text-gray-400">
        <div />
        <div>Press Enter to send, Shift+Enter for new line</div>
      </div>

      <Modal
        isOpen={isSettingsOpen}
        title="Search settings"
        onClose={() => setIsSettingsOpen(false)}
        primaryActionText="Apply"
        onPrimaryAction={() => {
          if (tempSelectedKbId) setSelectedKnowledgeBaseId(tempSelectedKbId);
          if (tempSearchMode) setSearchMode(tempSearchMode);
          setIsSettingsOpen(false);
        }}
        maxWidth="max-w-2xl"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Knowledge bases
            </h3>
            <div className="max-h-64 space-y-1 overflow-auto rounded-md border border-gray-200 p-1 dark:border-gray-800">
              {loadingKnowledgeBases ? (
                <div className="p-2 text-xs text-gray-500 dark:text-gray-400">Loading...</div>
              ) : knowledgeBases.length === 0 ? (
                <div className="p-2 text-xs text-gray-500 dark:text-gray-400">
                  No knowledge bases
                </div>
              ) : (
                knowledgeBases.map(kb => (
                  <button
                    key={kb.id}
                    type="button"
                    onClick={() => setTempSelectedKbId(kb.id.toString())}
                    className={`w-full rounded-md px-2 py-2 text-left text-sm transition-colors ${
                      tempSelectedKbId === kb.id.toString()
                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    {kb.title}
                  </button>
                ))
              )}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Search mode
            </h3>
            <div className="max-h-64 space-y-1 overflow-auto rounded-md border border-gray-200 p-1 dark:border-gray-800">
              {SEARCH_MODE_OPTIONS.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTempSearchMode(option.value as SearchMode)}
                  className={`w-full rounded-md px-2 py-2 text-left text-sm transition-colors ${
                    tempSearchMode === option.value
                      ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
