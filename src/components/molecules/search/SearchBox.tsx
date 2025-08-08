'use client';

import {
  RiAttachment2,
  RiMicLine,
  RiSearchEyeLine,
  RiSendPlaneLine,
  RiUserLine,
} from '@remixicon/react';
import React, { useState } from 'react';

import { Button } from '@/components/atom/Button';
import { PillSelect } from '@/components/atom/PillSelect';
import { Textarea } from '@/components/atom/Textarea';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';

interface AttachedFile {
  id: string;
  name: string;
  size: number;
}

type SearchMode = 'web' | 'deep';

interface SearchBoxProps {
  onSearch: (_data: {
    query: string;
    files: AttachedFile[];
    knowledgeBaseId: string;
    mode: SearchMode;
  }) => void;
  className?: string;
}

export function SearchBox({ onSearch, className = '' }: SearchBoxProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState<string>('');
  const [searchMode, setSearchMode] = useState<SearchMode>('deep');

  const { data: knowledgeBasesData, isLoading: loadingKnowledgeBases } = useKnowledgeBases();
  const knowledgeBases = React.useMemo(
    () => knowledgeBasesData?.knowledgeBases || [],
    [knowledgeBasesData?.knowledgeBases]
  );

  React.useEffect(() => {
    if (knowledgeBases.length > 0 && !selectedKnowledgeBaseId) {
      setSelectedKnowledgeBaseId(knowledgeBases[0].id.toString());
    } else if (knowledgeBases.length === 0) {
      setSelectedKnowledgeBaseId('');
    }
  }, [knowledgeBases, selectedKnowledgeBaseId]);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = Math.max(textarea.scrollHeight, 64);
    textarea.style.height = `${newHeight}px`;
  }, []);

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [searchQuery, adjustTextareaHeight]);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachedFiles = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
    }));
    setAttachedFiles(prev => [...prev, ...newAttachedFiles]);
  };

  return (
    <div className="space-y-2">
      {/* Knowledge Base Selector stays at top right */}
      <div className="fixed right-4 right-auto top-20 z-40 max-[639px]:left-1/2 max-[639px]:top-1 max-[639px]:flex max-[639px]:-translate-x-1/2 max-[639px]:items-start max-[639px]:justify-center max-[639px]:pt-20 sm:right-6 sm:top-20 min-[1024px]:top-0 min-[1024px]:mt-6">
        <PillSelect
          value={selectedKnowledgeBaseId}
          onValueChange={setSelectedKnowledgeBaseId}
          icon={
            <RiUserLine className="h-2 w-2 text-gray-500 sm:h-2.5 sm:w-2.5 dark:text-gray-400" />
          }
          placeholder="Select knowledge base"
          displayValue={
            selectedKnowledgeBaseId && !loadingKnowledgeBases && knowledgeBases.length > 0
              ? knowledgeBases.find(kb => kb.id.toString() === selectedKnowledgeBaseId)?.title
              : undefined
          }
          options={(() => {
            if (loadingKnowledgeBases) {
              return [{ value: 'loading', label: 'Loading...', disabled: true }];
            }
            if (knowledgeBases.length === 0) {
              return [{ value: 'no-knowledge-bases', label: 'No knowledge bases', disabled: true }];
            }
            return knowledgeBases.map(knowledgeBase => ({
              value: knowledgeBase.id.toString(),
              label: knowledgeBase.title,
            }));
          })()}
          className="h-5 rounded-full border-gray-200/50 px-1.5 py-0.5 text-xs shadow-xl backdrop-blur-md transition-all duration-200 hover:bg-white sm:h-6 sm:px-2 sm:py-1 sm:text-sm"
        />
      </div>

      <div
        className={`overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-sm sm:rounded-2xl sm:p-3 dark:border-gray-800 dark:bg-gray-900 ${className}`}
      >
        <form onSubmit={handleSearch} className="space-y-0">
          {/* Search Input */}
          <div className="relative overflow-hidden">
            {/* Textarea */}
            <Textarea
              ref={textareaRef}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search files or ask questions..."
              className="min-h-[3rem] sm:min-h-[4rem]"
              textareaClassName="min-h-[3rem] sm:min-h-[4rem] w-full resize-none border-0 bg-transparent px-0 py-2 sm:py-3 text-xs sm:text-sm shadow-none focus:ring-0 focus:border-0 dark:bg-transparent overflow-hidden pr-20
"
              style={{ outline: 'none' }}
              autoFocus
              rows={2}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSearch(e as any);
                }
              }}
            />

            {/* Mode Dropdown - bottom-left inside textarea */}
            <div className="absolute left-0 z-10 pt-0 sm:left-0">
              <PillSelect
                value={searchMode}
                onValueChange={value => setSearchMode(value as SearchMode)}
                icon={
                  <RiSearchEyeLine className="h-2 w-2 text-gray-500 sm:h-2.5 sm:w-2.5 dark:text-gray-400" />
                }
                displayValue={searchMode === 'web' ? 'Web search' : 'Deep research'}
                options={[
                  { value: 'web', label: 'Web search' },
                  { value: 'deep', label: 'Deep research' },
                ]}
                className="h-5 px-1.5 py-0.5 text-xs sm:h-6 sm:px-2 sm:py-0.5 sm:text-sm"
              />
            </div>

            {/* Controls - bottom-right */}
            <div className="flex items-center justify-end space-x-1 overflow-hidden sm:space-x-2">
              {/* File Upload */}
              <div className="relative">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  accept=".pdf,.doc,.docx,.txt,.md,.json,.csv,.xlsx,.xls,.png,.jpg,.jpeg,.gif,.webp"
                />
                <Button type="button" variant="elevated" className="h-5 w-5 p-0 sm:h-6 sm:w-6">
                  <RiAttachment2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>
              </div>

              {/* Audio Button */}
              <Button type="button" variant="elevated" className="h-5 w-5 p-0 sm:h-6 sm:w-6">
                <RiMicLine className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </Button>

              {/* Send Button */}
              <Button
                type="button"
                variant="elevated"
                className="h-5 w-5 bg-gray-800 p-0 text-gray-300 hover:bg-gray-800 hover:text-gray-300 sm:h-6 sm:w-6 dark:bg-white dark:text-gray-600 dark:hover:bg-white dark:hover:text-gray-600"
              >
                <RiSendPlaneLine className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
