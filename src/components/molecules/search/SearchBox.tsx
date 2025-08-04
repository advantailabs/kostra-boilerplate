'use client';

import {
  RiAttachment2,
  RiCloseLine,
  RiFileLine,
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
import { formatFileSize } from '@/lib/file-utils';

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

  // Fetch knowledge bases
  const { data: knowledgeBasesData, isLoading: loadingKnowledgeBases } = useKnowledgeBases();
  const knowledgeBases = React.useMemo(
    () => knowledgeBasesData?.knowledgeBases || [],
    [knowledgeBasesData?.knowledgeBases]
  );

  // Set first knowledge base as default when data loads
  React.useEffect(() => {
    if (knowledgeBases.length > 0 && !selectedKnowledgeBaseId) {
      setSelectedKnowledgeBaseId(knowledgeBases[0].id.toString());
    } else if (knowledgeBases.length === 0) {
      setSelectedKnowledgeBaseId('');
    }
  }, [knowledgeBases, selectedKnowledgeBaseId]);

  // Auto-resize textarea
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';

    // Calculate new height based on content
    const newHeight = Math.max(textarea.scrollHeight, 64); // 64px = 4rem minimum (2 lines)
    textarea.style.height = `${newHeight}px`;
  }, []);

  // Adjust height when value changes
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

  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  return (
    <div className="space-y-2">
      <div
        className={`overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-sm sm:rounded-2xl sm:p-3 dark:border-gray-800 dark:bg-gray-900 ${className}`}
      >
        <form onSubmit={handleSearch} className="space-y-0">
          {/* Attached Files */}
          {attachedFiles.length > 0 && (
            <div className="mb-2 border-b border-gray-200 pb-2 sm:mb-3 sm:pb-3 dark:border-gray-700">
              <div className="space-y-2">
                {attachedFiles.map(file => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-2 sm:p-3 dark:bg-gray-800"
                  >
                    <div className="flex min-w-0 flex-1 items-center space-x-2 sm:space-x-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-blue-100 sm:h-8 sm:w-8 dark:bg-blue-900/20">
                        <RiFileLine className="h-3 w-3 text-blue-600 sm:h-4 sm:w-4 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <p className="truncate text-xs font-medium text-gray-900 sm:text-sm dark:text-gray-100">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeFile(file.id)}
                      className="h-5 w-5 flex-shrink-0 p-0 text-gray-400 hover:text-gray-600 sm:h-6 sm:w-6 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      <RiCloseLine className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input Container */}
          <div className="relative overflow-hidden">
            {/* Search Input */}
            <Textarea
              ref={textareaRef}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search files or ask questions..."
              className="min-h-[3rem] sm:min-h-[4rem]"
              textareaClassName="min-h-[3rem] sm:min-h-[4rem] w-full resize-none border-0 bg-transparent px-0 py-2 sm:py-3 text-xs sm:text-sm shadow-none focus:ring-0 focus:border-0 dark:bg-transparent overflow-hidden"
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

            {/* Controls Row */}
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:pt-0">
              {/* Left side - Knowledge Base and Mode dropdowns */}
              <div className="flex items-center space-x-1 overflow-hidden sm:space-x-2">
                {/* Knowledge Base Dropdown */}
                <PillSelect
                  value={selectedKnowledgeBaseId}
                  onValueChange={setSelectedKnowledgeBaseId}
                  icon={
                    <RiUserLine className="h-2 w-2 text-gray-500 sm:h-2.5 sm:w-2.5 dark:text-gray-400" />
                  }
                  placeholder="Select knowledge base"
                  displayValue={
                    selectedKnowledgeBaseId && !loadingKnowledgeBases && knowledgeBases.length > 0
                      ? knowledgeBases.find(kb => kb.id.toString() === selectedKnowledgeBaseId)
                          ?.title
                      : undefined
                  }
                  options={(() => {
                    if (loadingKnowledgeBases) {
                      return [{ value: 'loading', label: 'Loading...', disabled: true }];
                    }
                    if (knowledgeBases.length === 0) {
                      return [
                        {
                          value: 'no-knowledge-bases',
                          label: 'No knowledge bases',
                          disabled: true,
                        },
                      ];
                    }
                    return knowledgeBases.map(knowledgeBase => ({
                      value: knowledgeBase.id.toString(),
                      label: knowledgeBase.title,
                    }));
                  })()}
                  className="h-5 px-1.5 py-0.5 text-xs sm:h-6 sm:px-2 sm:py-1 sm:text-sm"
                />

                {/* Mode Dropdown */}
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
                  className="h-5 px-1.5 py-0.5 text-xs sm:h-6 sm:px-2 sm:py-1 sm:text-sm"
                />
              </div>

              {/* Right side - Attachment, Audio, and Send buttons */}
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
          </div>
        </form>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
