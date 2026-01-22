'use client';

import { RiAttachment2, RiMicLine, RiSendPlaneLine, RiUserLine } from '@remixicon/react';
import React, { useState } from 'react';

import { Button } from '@/components/atom/Button';
import { PillSelect } from '@/components/atom/PillSelect';
import { Textarea } from '@/components/atom/Textarea';

export function DummySearchBox() {
  const [searchQuery, setSearchQuery] = useState('What are invoices due in the next 30 days?');

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
    // Demo mode - no actual search
  };

  return (
    <div className="space-y-2">
      <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-xs sm:p-3 dark:border-gray-800 dark:bg-gray-900">
        <form onSubmit={handleSearch} className="space-y-0">
          {/* Input Container */}
          <div className="relative">
            {/* Search Input */}
            <Textarea
              ref={textareaRef}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search files or ask questions..."
              className="min-h-[3rem]"
              textareaClassName="min-h-[3rem] w-full resize-none border-0 bg-transparent px-0 py-3 text-xs shadow-none focus:ring-0 focus:border-0 dark:bg-transparent sm:text-sm"
              style={{ outline: 'none' }}
              autoFocus
              rows={2}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSearch(e);
                }
              }}
            />

            {/* Controls Row */}
            <div className="flex flex-nowrap items-center justify-between gap-1.5 pt-0">
              {/* Left side - Knowledge Base dropdown */}
              <div className="flex flex-wrap items-center gap-2">
                <PillSelect
                  value="demo-kb"
                  onValueChange={() => { }}
                  icon={<RiUserLine className="h-2.5 w-2.5 text-gray-500 dark:text-gray-400" />}
                  placeholder="Select knowledge base"
                  displayValue="File Analyzer"
                  options={[
                    { value: 'demo-kb', label: 'File Analyzer' },
                    { value: 'demo-kb-2', label: 'Stock Trading Expert' },
                    { value: 'demo-kb-3', label: 'Crypto Analyst' },
                  ]}
                  className="h-6 px-2 py-1 text-xs sm:text-sm"
                />
              </div>

              {/* Right side - Attachment, Audio, and Send buttons */}
              <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                {/* File Upload */}
                <Button type="button" variant="elevated" className="h-5 w-5 p-0 sm:h-6 sm:w-6">
                  <RiAttachment2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>

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
