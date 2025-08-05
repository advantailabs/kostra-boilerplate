import { Button } from '@/components/atom/Button';
import { formatFileSize } from '@/lib/file-utils';
import { RiAttachment2, RiCloseLine, RiMoreLine, RiSendPlaneFill } from '@remixicon/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface EnhancedMessageInputProps {
  value: string;
  onChange: (_value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  showCharCount?: boolean;
  autoFocus?: boolean;
}

interface SelectedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

const MAX_FILES = 10;
const VISIBLE_FILES = 3;
const MIN_TEXTAREA_HEIGHT = 80; // Minimum height in pixels
const MAX_TEXTAREA_HEIGHT = 200; // Maximum height before scrolling
const DEFAULT_MAX_LENGTH = 2000; // Default character limit

export function EnhancedMessageInput({
  value,
  onChange,
  onSend,
  disabled = false,
  loading = false,
  placeholder = 'Type your message...',
  className,
  maxLength = DEFAULT_MAX_LENGTH,
  showCharCount = true,
  autoFocus = true,
}: EnhancedMessageInputProps) {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Auto-focus the textarea when component mounts
  useEffect(() => {
    if (autoFocus && textareaRef.current && !disabled) {
      // Use a slight delay to ensure the component is fully rendered
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [autoFocus, disabled]);

  // Re-focus textarea after sending a message (if it was focused before)
  useEffect(() => {
    if (autoFocus && !value && textareaRef.current && !disabled) {
      // Re-focus after the input is cleared (message sent)
      const timer = setTimeout(() => {
        if (document.activeElement !== textareaRef.current) {
          textareaRef.current?.focus();
        }
      }, 50);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [value, autoFocus, disabled]);

  // Auto-resize textarea based on content
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';

    // Calculate new height based on content
    const newHeight = Math.min(
      Math.max(textarea.scrollHeight, MIN_TEXTAREA_HEIGHT),
      MAX_TEXTAREA_HEIGHT
    );

    textarea.style.height = `${newHeight}px`;
  }, []);

  // Adjust height when value changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [value, adjustTextareaHeight]);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send message on Enter (but not Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled && !loading) {
        onSend();
      }
      return;
    }

    // Handle Ctrl/Cmd + Enter as alternative send shortcut
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (value.trim() && !disabled && !loading) {
        onSend();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

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

    // Re-focus textarea after file selection
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const removeFile = (fileId: string) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== fileId));
    // Close popup if no files left or if we're now below the visible threshold
    if (selectedFiles.length <= VISIBLE_FILES + 1) {
      setShowAllFiles(false);
    }
  };

  const canSend = value.trim() && !disabled && !loading;
  const visibleFiles = selectedFiles.slice(0, VISIBLE_FILES);
  const hiddenFiles = selectedFiles.slice(VISIBLE_FILES);
  const hasHiddenFiles = hiddenFiles.length > 0;
  const charCount = value.length;
  const isNearLimit = charCount > maxLength * 0.8;
  const isAtLimit = charCount >= maxLength;

  return (
    <div className={`space-y-2 sm:space-y-3 ${className}`}>
      {/* Input Area */}
      <div className="flex items-end gap-1 sm:gap-2">
        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || loading || selectedFiles.length >= MAX_FILES}
        />

        {/* File Attachment Button - Hidden on small screens */}
        <Button
          type="button"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || loading || selectedFiles.length >= MAX_FILES}
          className="hidden flex-shrink-0 p-1.5 min-[400px]:flex sm:p-2"
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
            ref={textareaRef}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled || loading}
            maxLength={maxLength}
            className={`chat-input-textarea w-full resize-none rounded-lg border px-2 py-2 pr-24 text-sm placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 min-[400px]:pr-12 sm:px-3 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 ${
              isFocused || value.trim()
                ? 'border-indigo-500 focus:ring-indigo-500 dark:border-indigo-400 dark:focus:ring-indigo-400'
                : 'border-gray-300 dark:border-gray-600'
            } ${isAtLimit ? 'border-red-500 focus:ring-red-500 dark:border-red-400' : ''}`}
            style={{
              minHeight: `${MIN_TEXTAREA_HEIGHT}px`,
              maxHeight: `${MAX_TEXTAREA_HEIGHT}px`,
              overflow: 'auto',
            }}
          />

          {/* Attachment Button - Inside textarea on small screens */}
          <div className="absolute bottom-2 right-11 min-[400px]:hidden">
            <Button
              type="button"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || loading || selectedFiles.length >= MAX_FILES}
              className="h-9 w-9 flex-shrink-0 rounded-full bg-gray-100 p-0 text-gray-600 shadow-sm transition-all duration-200 hover:bg-gray-200 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:disabled:hover:bg-gray-700"
              title={
                selectedFiles.length >= MAX_FILES
                  ? `Maximum ${MAX_FILES} files allowed`
                  : 'Attach files'
              }
            >
              <RiAttachment2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Send Button - Inside textarea on small screens */}
          <div className="absolute bottom-2 right-2 min-[400px]:hidden">
            <Button
              type="button"
              onClick={onSend}
              disabled={!canSend || loading || isAtLimit}
              className="h-9 w-9 flex-shrink-0 rounded-full bg-indigo-600 p-0 text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-600 disabled:hover:shadow-sm"
              title="Send message (Enter or Ctrl+Enter)"
            >
              <RiSendPlaneFill className={`h-4 w-4 ${loading ? 'animate-pulse' : ''}`} />
            </Button>
          </div>

          {/* Loading indicator inside textarea */}
          {loading && (
            <div className="absolute bottom-2 right-20 flex items-center space-x-1 min-[400px]:right-12">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
              <div className="animation-delay-75 h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
              <div className="animation-delay-150 h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
            </div>
          )}

          {/* Character count indicator */}
          {showCharCount && (isFocused || isNearLimit) && (
            <div
              className={`absolute bottom-1 text-xs transition-colors ${
                isAtLimit ? 'right-20 min-[400px]:right-12' : 'right-20 min-[400px]:right-12'
              } ${(() => {
                if (isAtLimit) return 'text-red-500 dark:text-red-400';
                if (isNearLimit) return 'text-amber-500 dark:text-amber-400';
                return 'text-gray-400';
              })()}`}
            >
              {charCount}/{maxLength}
            </div>
          )}
        </div>

        {/* Send Button - Outside textarea on larger screens */}
        <div className="hidden min-[400px]:block">
          <Button
            type="button"
            onClick={onSend}
            disabled={!canSend || loading || isAtLimit}
            className="flex-shrink-0 px-3 py-2 transition-all duration-200 hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-600 sm:px-3"
            title="Send message (Enter or Ctrl+Enter)"
          >
            <RiSendPlaneFill className={`h-4 w-4 ${loading ? 'animate-pulse' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Selected Files - Aligned with input area */}
      {selectedFiles.length > 0 && (
        <div className="flex items-start gap-1 sm:gap-2">
          {/* Spacer to align with input area (same width as attachment button + gap) */}
          <div className="w-8 flex-shrink-0 sm:w-10" />

          {/* Files container */}
          <div className="flex flex-1 flex-wrap items-center gap-1">
            {/* Visible files */}
            {visibleFiles.map(file => (
              <div
                key={file.id}
                className="animate-fadeIn flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-800"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-gray-900 dark:text-gray-100">
                    {file.name} ({formatFileSize(file.size)})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="flex-shrink-0 rounded-full p-0.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
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
                  <div className="animate-fadeIn absolute bottom-full left-0 z-10 mb-2 w-80 max-w-sm rounded-lg border border-gray-200 p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
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
                            className="ml-2 flex-shrink-0 rounded-full p-0.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-300"
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

      {/* Enhanced Helper Text */}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span className="hidden sm:inline">Ctrl+Enter to send</span>
        </div>
        <div className="flex items-center space-x-2">
          {selectedFiles.length > 0 && (
            <span>
              {selectedFiles.length}/{MAX_FILES} file{selectedFiles.length > 1 ? 's' : ''}
            </span>
          )}
          {showCharCount && !isFocused && !isNearLimit && charCount > 0 && (
            <span className="text-gray-400">{charCount} chars</span>
          )}
        </div>
      </div>
    </div>
  );
}
