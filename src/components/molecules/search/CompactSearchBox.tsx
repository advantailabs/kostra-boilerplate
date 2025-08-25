'use client';

import { RiSendPlaneLine, RiSettingsLine } from '@remixicon/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { SpeechRecognitionButton } from '@/components/atom/SpeechRecognitionButton';
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
  // previousQuery state removed as it's no longer needed for appending
  // Speech recognition ref removed as component doesn't support it currently
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

  // Update internal state when initialQuery prop changes
  React.useEffect(() => {
    if (initialQuery !== undefined) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  React.useEffect(() => {
    if (!syncQueryParams) return;
    const params = new URLSearchParams(urlParams.toString());
    if (selectedKnowledgeBaseId) params.set('kb', selectedKnowledgeBaseId);
    else params.delete('kb');
    if (searchMode) params.set('mode', searchMode);
    router.replace(`${pathname}?${params.toString()}`);
  }, [selectedKnowledgeBaseId, searchMode, syncQueryParams, router, pathname, urlParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    onSearch({
      query: searchQuery,
      files: attachedFiles,
      knowledgeBaseId: selectedKnowledgeBaseId,
      mode: searchMode,
    });

    // Don't set isSubmitting here - let the navigation happen naturally
    // The input will be preserved by the initialQuery prop when the component remounts
  };

  const handleTranscript = (transcript: string | null) => {
    // When final transcript arrives, just set the current query (no appending)
    if (transcript) {
      setSearchQuery(transcript);
    }
  };

  const handleInterimTranscript = (transcript: string | null): void => {
    // Show interim results in real-time
    // If transcript is null, it means we're stopping or starting fresh, so clear everything
    if (transcript === null) {
      setSearchQuery('');
    } else {
      setSearchQuery(transcript);
    }
  };

  const handleSpeechStart = () => {
    // This ensures the input is cleared when user starts recording again
    setSearchQuery('');
  };

  const handleSpeechStop = () => {
    // Don't clear the input when speech recognition stops
    // Keep the transcript for potential editing or sending
  };
  return (
    <div className="space-y-2">
      <div className="flex items-stretch gap-3">
        <div
          className={`flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-sm sm:rounded-2xl sm:p-3 dark:border-gray-800 dark:bg-gray-900 ${className}`}
        >
          <form onSubmit={handleSearch} className="space-y-0">
            <div className="relative overflow-hidden">
              {/* Settings button on the left */}
              <div className="pointer-events-auto absolute left-1.5 top-1/2 z-10 -translate-y-1/2">
                <Button
                  type="button"
                  variant="elevated"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    setTempSelectedKbId(selectedKnowledgeBaseId);
                    setTempSearchMode(searchMode);
                    setIsSettingsOpen(true);
                  }}
                >
                  <RiSettingsLine className="h-3 w-3" />
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
                    handleSearch(e as React.FormEvent);
                  }
                }}
                autoFocus
              />

              <div className="flex items-center justify-end space-x-1 overflow-hidden sm:space-x-2">
                <div className="absolute right-1 top-1/2 -translate-y-1/2 space-x-1">
                  <SpeechRecognitionButton
                    onTranscript={handleTranscript}
                    onInterimTranscript={handleInterimTranscript}
                    onSpeechStart={handleSpeechStart}
                    onSpeechStop={handleSpeechStop}
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  />
                  <Button
                    type="submit"
                    variant="elevated"
                    className="h-6 w-6 bg-gray-800 p-0 text-gray-300 hover:bg-gray-800 hover:text-gray-300 dark:bg-white dark:text-gray-600 dark:hover:bg-white dark:hover:text-gray-600"
                  >
                    <RiSendPlaneLine className="h-3 w-3 dark:text-gray-600" />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
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
