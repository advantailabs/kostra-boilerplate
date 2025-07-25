import { Button } from '@/components/atom/Button';
import { RiAttachment2, RiCloseLine, RiMoreLine, RiSendPlaneFill } from '@remixicon/react';
import React, { useEffect, useRef, useState } from 'react';

interface EnhancedMessageInputProps {
  value: string;
  onChange: (_value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  className?: string;
}

interface SelectedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

const MAX_FILES = 10;
const VISIBLE_FILES = 3;

export function EnhancedMessageInput({
  value,
  onChange,
  onSend,
  disabled = false,
  loading = false,
  placeholder = 'Type your message...',
  className,
}: EnhancedMessageInputProps) {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowAllFiles(false);
      }
    };

    if (showAllFiles) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAllFiles]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled && !loading) {
        onSend();
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const availableSlots = MAX_FILES - selectedFiles.length;
    const filesToAdd = files.slice(0, availableSlots);

    const newFiles = filesToAdd.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setSelectedFiles(prev => [...prev, ...newFiles]);

    // Clear the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== fileId));
    // Close popup if no files left or if we're now below the visible threshold
    if (selectedFiles.length <= VISIBLE_FILES + 1) {
      setShowAllFiles(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
  };

  const canSend = value.trim() && !disabled;
  const visibleFiles = selectedFiles.slice(0, VISIBLE_FILES);
  const hiddenFiles = selectedFiles.slice(VISIBLE_FILES);
  const hasHiddenFiles = hiddenFiles.length > 0;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Input Area */}
      <div className="flex items-end gap-2">
        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || loading || selectedFiles.length >= MAX_FILES}
        />

        {/* File Attachment Button */}
        <Button
          type="button"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || loading || selectedFiles.length >= MAX_FILES}
          className="flex-shrink-0 p-2"
          title={
            selectedFiles.length >= MAX_FILES
              ? `Maximum ${MAX_FILES} files allowed`
              : 'Attach files'
          }
        >
          <RiAttachment2 className="h-4 w-4" />
        </Button>

        {/* Message Input */}
        <div className="relative flex-1">
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || loading}
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-indigo-400"
          />
        </div>

        {/* Send Button */}
        <Button
          type="button"
          onClick={onSend}
          disabled={!canSend}
          className="flex-shrink-0 px-3 py-2"
        >
          <RiSendPlaneFill className="h-4 w-4" />
        </Button>
      </div>

      {/* Selected Files - Aligned with input area */}
      {selectedFiles.length > 0 && (
        <div className="flex items-start gap-2">
          {/* Spacer to align with input area (same width as attachment button + gap) */}
          <div className="w-10 flex-shrink-0" />

          {/* Files container */}
          <div className="flex flex-1 flex-wrap items-center gap-1">
            {/* Visible files */}
            {visibleFiles.map(file => (
              <div
                key={file.id}
                className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-800"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-gray-900 dark:text-gray-100">
                    {file.name} ({formatFileSize(file.size)})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="flex-shrink-0 rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                  title="Remove file"
                >
                  <RiCloseLine className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}

            {/* View more button with click-based popup */}
            {hasHiddenFiles && (
              <div className="relative" ref={popupRef}>
                <button
                  type="button"
                  onClick={() => setShowAllFiles(!showAllFiles)}
                  className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                    showAllFiles
                      ? 'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <RiMoreLine className="h-3 w-3" />+{hiddenFiles.length} more
                </button>

                {/* Click-based popup showing all files */}
                {showAllFiles && (
                  <div className="absolute bottom-full left-0 z-10 mb-2 w-80 max-w-sm rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <div className="mb-2 text-xs font-medium text-gray-900 dark:text-gray-100">
                      All Files ({selectedFiles.length}/{MAX_FILES})
                    </div>
                    <div className="max-h-40 space-y-1 overflow-y-auto">
                      {selectedFiles.map(file => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between rounded-md bg-gray-50 px-2 py-1 dark:bg-gray-700"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-gray-900 dark:text-gray-100">
                              {file.name} ({formatFileSize(file.size)})
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(file.id)}
                            className="ml-2 flex-shrink-0 rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-300"
                            title="Remove file"
                          >
                            <RiCloseLine className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Helper Text */}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Press Enter to send, Shift+Enter for new line</span>
        {selectedFiles.length > 0 && (
          <span className="text-xs">
            {selectedFiles.length}/{MAX_FILES} file{selectedFiles.length > 1 ? 's' : ''} selected
          </span>
        )}
      </div>
    </div>
  );
}
