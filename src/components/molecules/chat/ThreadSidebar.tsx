import { Avatar } from '@/components/atom/Avatar';
import { Button } from '@/components/atom/Button';
import { DeleteDialog } from '@/components/molecules/common/DeleteDialog';
import { Persona, Thread } from '@prisma/client';
import {
  RiAddLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiMessage2Line,
  RiSearchLine,
} from '@remixicon/react';
import React, { useState } from 'react';
import { ThreadSearchModal } from './ThreadSearchModal';

interface ThreadSidebarProps {
  threads: (Thread & { persona: Persona | null })[];
  activeThreadId?: number;
  onThreadSelect: (_threadId: number) => void;
  onThreadDelete: (_threadId: number) => void;
  onNewThread: () => void;
  onClose?: () => void;
  className?: string;
}

// ✅ Updated ThreadListItem
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
      className={`group flex w-full cursor-pointer items-center justify-start gap-3 rounded-lg py-1 pl-2 pr-2 text-xs transition-colors hover:bg-gray-100 min-[800px]:justify-between min-[800px]:gap-3 min-[800px]:py-2 min-[800px]:pl-2 min-[800px]:pr-2 dark:hover:bg-gray-800 ${
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
      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden min-[800px]:gap-2">
        {thread.persona ? (
          <Avatar
            src={thread.persona.logo}
            alt={`${thread.persona.name} avatar`}
            fallback={thread.persona.name}
            size="sm"
          />
        ) : (
          <RiMessage2Line className="h-3 w-3 shrink-0 text-gray-400" />
        )}
        <div className="min-w-0 flex-1 overflow-hidden">
          <p className="truncate text-sm font-medium min-[800px]:text-sm" title={thread.title}>
            {thread.title}
          </p>
          {thread.persona && (
            <p
              className="truncate text-sm text-gray-500 min-[800px]:text-xs dark:text-gray-400"
              title={thread.persona.name}
            >
              {thread.persona.name}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={handleDelete}
        className="inline-flex shrink-0 opacity-0 transition-opacity group-hover:opacity-100 min-[800px]:ml-1"
        title="Delete thread"
      >
        <RiDeleteBinLine className="h-3 w-3 text-gray-400 hover:text-red-500" />
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
  onClose,
  className,
}: ThreadSidebarProps) {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState<
    (Thread & { persona: Persona | null }) | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteThread = (threadId: number) => {
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      setThreadToDelete(thread);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDeleteThread = async () => {
    if (threadToDelete) {
      setIsDeleting(true);
      try {
        await onThreadDelete(threadToDelete.id);
        setIsDeleteModalOpen(false);
        setThreadToDelete(null);
      } catch (error) {
        console.error('Failed to delete thread:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const cancelDeleteThread = () => {
    setIsDeleteModalOpen(false);
    setThreadToDelete(null);
  };

  return (
    <>
      <div
        className={`flex h-full w-full flex-col min-[400px]:min-w-60 min-[400px]:max-w-80 min-[800px]:w-60 min-[800px]:min-w-60 min-[800px]:max-w-60 ${className}`}
      >
        {/* Header */}
        <div className="border-b border-gray-300 px-3 py-2 min-[800px]:px-4 min-[800px]:py-3 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-sm">
                <RiMessage2Line className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Threads</h2>
                <p className="-mt-0.5 text-[10px] text-gray-500 min-[800px]:-mt-0 min-[800px]:text-xs dark:text-gray-400">
                  All Threads
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsSearchModalOpen(true)}
                variant="secondary"
                className="h-6 w-6 p-0"
                title="Search threads"
              >
                <RiSearchLine className="h-2.5 w-2.5" />
              </Button>
              <Button onClick={onNewThread} variant="secondary" className="h-6 w-6 p-0">
                <RiAddLine className="h-2.5 w-2.5" />
              </Button>
              {onClose && (
                <Button
                  onClick={onClose}
                  variant="secondary"
                  className="h-6 w-6 p-0 min-[800px]:hidden"
                  title="Close sidebar"
                >
                  <RiCloseLine className="h-2.5 w-2.5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Thread list */}
        <div className="scrollbar-hide flex-1 overflow-y-auto p-1 min-[800px]:p-2">
          {threads.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">No threads yet</p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  Start a new thread to begin chatting
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {threads.map(thread => (
                <ThreadListItem
                  key={thread.id}
                  thread={thread}
                  isActive={activeThreadId === thread.id}
                  onSelect={onThreadSelect}
                  onDelete={handleDeleteThread}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ThreadSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        threads={threads}
        onThreadSelect={onThreadSelect}
        onNewThread={onNewThread}
      />

      <DeleteDialog
        isOpen={isDeleteModalOpen}
        onClose={cancelDeleteThread}
        onConfirm={confirmDeleteThread}
        title="Delete Thread"
        itemName={threadToDelete?.title}
        confirmText="Delete Thread"
        isLoading={isDeleting}
      />
    </>
  );
}
