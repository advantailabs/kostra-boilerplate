'use client';

import { LoadingScreen } from '@/components/atom/LoadingScreen';
import { ChatInterface } from '@/components/organisms/chat/ChatInterface';
import { useChat } from '@/hooks/useChat';
import { usePersonas } from '@/hooks/usePersonas';
import { useThreads } from '@/hooks/useThreads';
import { CreateThreadRequest } from '@/types/chat';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();
  const { personas, isLoading: personasLoading } = usePersonas();
  const {
    threads,
    isLoading: threadsLoading,
    deleteThread,
    loadMore,
    hasMore,
    isLoadingMore,
  } = useThreads();

  const { createThreadStreaming, isStreaming, streamingMessage, currentCitations } =
    useChat(undefined); // No active thread on main chat page

  const handleCreateThread = async (
    personaId: number,
    message: string,
    files?: Array<{ originalName: string; mimeType: string; size: number; s3Key: string }>
  ) => {
    try {
      const threadData: CreateThreadRequest = { personaId, message, files };
      const newThreadId = await createThreadStreaming(threadData);
      if (newThreadId) {
        router.replace(`/app/chat/${newThreadId}`);
      } else {
        console.error('Failed to create thread. Please try again.');
      }
    } catch (error) {
      console.error('Failed to create thread:', error);
    }
  };

  const handleSelectThread = (threadId: number) => {
    router.push(`/app/chat/${threadId}`);
  };

  const handleSendMessage = async (
    _message: string,
    _files?: Array<{ originalName: string; mimeType: string; size: number; s3Key: string }>
  ) => {
    // This shouldn't be called on the main chat page
    console.warn('handleSendMessage called on main chat page');
  };

  const handleDeleteThread = async (threadId: number) => {
    try {
      await deleteThread(threadId);
      // Refresh the page to update the threads list
      router.refresh();
    } catch (error) {
      console.error('Failed to delete thread:', error);
    }
  };

  const handleNewThread = () => {
    // Already on the main chat page, no need to navigate
  };

  const isLoading = personasLoading || threadsLoading;

  if (isLoading) {
    return <LoadingScreen message="Loading chat..." />;
  }

  return (
    <div className="mobile-chat-layout h-screen overflow-hidden">
      <ChatInterface
        personas={personas}
        threads={threads}
        activeThread={null} // No active thread on main chat page
        onCreateThread={handleCreateThread}
        onSelectThread={handleSelectThread}
        onSendMessage={handleSendMessage}
        onDeleteThread={handleDeleteThread}
        onNewThread={handleNewThread}
        // Infinite props
        onLoadMoreThreads={loadMore}
        hasMoreThreads={hasMore}
        isLoadingMoreThreads={isLoadingMore}
        isStreaming={isStreaming}
        streamingMessage={streamingMessage}
        currentCitations={currentCitations}
      />
    </div>
  );
}
