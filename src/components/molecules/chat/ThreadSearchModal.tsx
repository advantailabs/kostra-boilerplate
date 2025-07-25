import { Button } from '@/components/atom/Button';
import { Dialog, DialogContent } from '@/components/molecules/common/Dialog';
import { Persona, Thread } from '@prisma/client';
import { RiCloseLine, RiEditBoxLine, RiMessage2Line } from '@remixicon/react';
import { useState } from 'react';

interface ThreadSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  threads: (Thread & { persona: Persona | null })[];
  onThreadSelect: (_threadId: number) => void;
  onNewThread?: () => void;
}

// Search result item component
function SearchResultItem({
  thread,
  onClick,
}: {
  thread: Thread & { persona: Persona | null };
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-gray-700"
    >
      <RiMessage2Line className="h-4 w-4 shrink-0 text-gray-400" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-100">{thread.title}</p>
        {thread.persona && <p className="truncate text-xs text-gray-400">{thread.persona.name}</p>}
      </div>
    </button>
  );
}

// New chat option component
function NewChatOption({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-gray-700"
    >
      <RiEditBoxLine className="h-4 w-4 shrink-0 text-gray-400" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-100">New chat</p>
      </div>
    </button>
  );
}

// Group threads by date
function groupThreadsByDate(threads: (Thread & { persona: Persona | null })[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  const groups: { [key: string]: (Thread & { persona: Persona | null })[] } = {
    Today: [],
    Yesterday: [],
    Older: [],
  };

  threads.forEach(thread => {
    const threadDate = new Date(thread.createdAt);
    const threadDateOnly = new Date(
      threadDate.getFullYear(),
      threadDate.getMonth(),
      threadDate.getDate()
    );

    if (threadDateOnly.getTime() === today.getTime()) {
      groups.Today.push(thread);
    } else if (threadDateOnly.getTime() === yesterday.getTime()) {
      groups.Yesterday.push(thread);
    } else {
      groups.Older.push(thread);
    }
  });

  return groups;
}

export function ThreadSearchModal({
  isOpen,
  onClose,
  threads,
  onThreadSelect,
  onNewThread,
}: ThreadSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredThreads = threads.filter(
    thread =>
      thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.persona?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedThreads = groupThreadsByDate(filteredThreads);

  const handleThreadSelect = (threadId: number) => {
    onThreadSelect(threadId);
    onClose();
    setSearchTerm('');
  };

  const handleNewChat = () => {
    onNewThread?.();
    onClose();
    setSearchTerm('');
  };

  const handleClose = () => {
    onClose();
    setSearchTerm('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 p-0">
        {/* Search Header */}
        <div className="flex items-center border-b border-gray-700 px-4 py-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search threads..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <Button
            variant="secondary"
            onClick={handleClose}
            className="h-8 w-8 border-0 bg-transparent p-0 hover:bg-gray-700"
          >
            <RiCloseLine className="h-4 w-4 text-gray-400" />
          </Button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-2">
          {/* New Chat Option */}
          {!searchTerm && (
            <div className="mb-4">
              <NewChatOption onClick={handleNewChat} />
            </div>
          )}

          {filteredThreads.length === 0 && searchTerm ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400">No threads found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedThreads).map(([groupName, groupThreads]) => {
                if (groupThreads.length === 0) return null;

                return (
                  <div key={groupName}>
                    <h3 className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                      {groupName}
                    </h3>
                    <div className="space-y-1">
                      {groupThreads.map(thread => (
                        <SearchResultItem
                          key={thread.id}
                          thread={thread}
                          onClick={() => handleThreadSelect(thread.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
