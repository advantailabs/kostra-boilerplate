import { ThreadSidebar } from '@/components/molecules/chat/ThreadSidebar';
import { ConversationView } from '@/components/organisms/chat/ConversationView';
import { cx } from '@/lib/utils';
import { PublicCitationFile } from '@/types/chat';
import { Message, Persona, Thread } from '@prisma/client';
import { RiChat1Line } from '@remixicon/react';
import { useState } from 'react';

interface ChatInterfaceProps {
  personas: Persona[];
  threads: (Thread & { persona: Persona | null })[];
  activeThread: (Thread & { persona: Persona | null; messages: Message[] }) | null;
  onCreateThread: (
    _personaId: number,
    _message: string,
    _files?: Array<{ originalName: string; mimeType: string; size: number; s3Key: string }>
  ) => void;
  onSelectThread: (_threadId: number) => void;
  onSendMessage: (
    _message: string,
    _files?: Array<{ originalName: string; mimeType: string; size: number; s3Key: string }>
  ) => void;
  onDeleteThread: (_threadId: number) => void;
  onNewThread: () => void;
  isStreaming?: boolean;
  streamingMessage?: string;
  currentCitations?: PublicCitationFile[];
  onLoadMoreThreads?: () => void;
  hasMoreThreads?: boolean;
  isLoadingMoreThreads?: boolean;
}

export function ChatInterface({
  personas,
  threads,
  activeThread,
  onCreateThread,
  onSelectThread,
  onSendMessage,
  onDeleteThread,
  onNewThread,
  isStreaming = false,
  streamingMessage = '',
  currentCitations = [],
  onLoadMoreThreads,
  hasMoreThreads = false,
  isLoadingMoreThreads = false,
}: ChatInterfaceProps) {
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [isThreadSidebarOpen, setIsThreadSidebarOpen] = useState(false);

  const handleNewThread = () => {
    onNewThread();
    setShowPersonaModal(true);
  };

  const handleClosePersonaModal = () => {
    setShowPersonaModal(false);
  };

  const handleThreadSelect = (threadId: number) => {
    onSelectThread(threadId);
    setIsThreadSidebarOpen(false); // Close sidebar when thread is selected
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Main conversation area */}
      <div
        className={`flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300 ${
          isThreadSidebarOpen ? 'min-[400px]:max-[799px]:blur-sm' : ''
        }`}
      >
        {/* Conversations button - show only below 800px */}
        <div className="sticky top-0 z-30 flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-2 py-1.5 min-[800px]:hidden dark:border-gray-700 dark:bg-gray-950">
          <div className="flex items-center gap-x-2">
            <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Conversations
            </h1>
          </div>
          <button
            onClick={() => setIsThreadSidebarOpen(true)}
            className={cx(
              'rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200',
              'duration-400 transition-colors'
            )}
          >
            <RiChat1Line className="h-5 w-5" />
          </button>
        </div>

        <ConversationView
          personas={personas}
          activeThread={activeThread}
          onCreateThread={onCreateThread}
          onSendMessage={onSendMessage}
          onDeleteThread={onDeleteThread}
          showPersonaModal={showPersonaModal}
          onClosePersonaModal={handleClosePersonaModal}
          isStreaming={isStreaming}
          streamingMessage={streamingMessage}
          currentCitations={currentCitations}
        />
      </div>

      {/* Mobile Thread Sidebar - toggleable for screens under 800px */}
      {isThreadSidebarOpen && (
        <div className="fixed inset-y-0 left-0 z-50 w-full bg-white shadow-lg min-[400px]:left-auto min-[400px]:right-0 min-[400px]:w-80 min-[800px]:hidden dark:bg-gray-950">
          <ThreadSidebar
            threads={threads}
            activeThreadId={activeThread?.id}
            onThreadSelect={handleThreadSelect}
            onThreadDelete={onDeleteThread}
            onNewThread={handleNewThread}
            className="h-full border-none"
            onClose={() => setIsThreadSidebarOpen(false)}
            onLoadMore={onLoadMoreThreads}
            hasMore={hasMoreThreads}
            isLoadingMore={isLoadingMoreThreads}
          />
        </div>
      )}

      {/* Desktop Thread Sidebar - always visible on screens 800px and above */}
      <div className="hidden min-[800px]:block">
        <ThreadSidebar
          threads={threads}
          activeThreadId={activeThread?.id}
          onThreadSelect={onSelectThread}
          onThreadDelete={onDeleteThread}
          onNewThread={handleNewThread}
          className="w-80 border-l border-gray-200 dark:border-gray-700"
          onLoadMore={onLoadMoreThreads}
          hasMore={hasMoreThreads}
          isLoadingMore={isLoadingMoreThreads}
        />
      </div>
    </div>
  );
}
