import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Persona, Thread } from '@prisma/client';
import { RiAddLine, RiDeleteBinLine, RiMessage2Line, RiSearchLine } from '@remixicon/react';
import React, { useState } from 'react';

interface ThreadSidebarProps {
  threads: (Thread & { persona: Persona | null })[];
  activeThreadId?: number;
  onThreadSelect: (_threadId: number) => void;
  onThreadDelete: (_threadId: number) => void;
  onNewThread: () => void;
  className?: string;
}

// Simple thread list item component
function ThreadListItem({
  thread,
  isActive,
  onSelect,
  onDelete,
}: {
  thread: Thread & { persona: Persona | null };
  isActive: boolean;
  onSelect: (_threadId: number) => void;
  onDelete: (_threadId: number) => void;
}) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(thread.id);
  };

  return (
    <div
      className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
        isActive ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100' : ''
      }`}
      onClick={() => onSelect(thread.id)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(thread.id);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Select conversation: ${thread.title}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <RiMessage2Line className="h-4 w-4 shrink-0 text-gray-400" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{thread.title}</p>
          {thread.persona && (
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {thread.persona.name}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={handleDelete}
        className="opacity-0 transition-opacity group-hover:opacity-100"
        title="Delete thread"
      >
        <RiDeleteBinLine className="h-4 w-4 text-gray-400 hover:text-red-500" />
      </button>
    </div>
  );
}

export function ThreadSidebar({
  threads,
  activeThreadId,
  onThreadSelect,
  onThreadDelete,
  onNewThread,
  className,
}: ThreadSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThreads = threads.filter(
    thread =>
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.persona?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`flex h-full flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}
    >
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Conversations</h2>
          <Button onClick={onNewThread} variant="secondary" className="h-8 w-8 p-0">
            <RiAddLine className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-3">
          <div className="relative">
            <RiSearchLine className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredThreads.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
              {!searchQuery && (
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  Start a new conversation to begin chatting
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredThreads.map(thread => (
              <ThreadListItem
                key={thread.id}
                thread={thread}
                isActive={activeThreadId === thread.id}
                onSelect={onThreadSelect}
                onDelete={onThreadDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
