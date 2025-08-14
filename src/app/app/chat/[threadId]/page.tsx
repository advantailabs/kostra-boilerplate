'use client';

import { ChatInterface } from '@/components/organisms/chat/ChatInterface';
import { useChatWithCredits } from '@/hooks/useChatWithCredits';
import { usePersonas } from '@/hooks/usePersonas';
import { useThreads } from '@/hooks/useThreads';
import { CreateThreadRequest } from '@/types/chat';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ThreadPage() {
  const router = useRouter();
  const params = useParams();
  const threadId = params.threadId ? parseInt(params.threadId as string, 10) : null;

  const { personas, isLoading: personasLoading } = usePersonas();
  const {
    threads,
    isLoading: threadsLoading,
    deleteThread,
    loadMore,
    hasMore,
    isLoadingMore,
  } = useThreads();

  const {
    thread: activeThread,
    addMessageStreaming,
    createThreadStreaming,
    isStreaming,
    streamingMessage,
    currentCitations,
  } = useChatWithCredits(threadId || undefined);

  // Redirect to main chat page if no threadId
  // Do not rely on the sidebar list to decide existence; the page fetches the thread directly
  useEffect(() => {
    if (!threadId) {
      router.replace('/app/chat');
    }
  }, [threadId, router]);

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
      }
    } catch (error) {
      console.error('Failed to create thread:', error);
    }
  };

  const handleSelectThread = (threadId: number) => {
    router.push(`/app/chat/${threadId}`);
  };

  const handleSendMessage = async (
    message: string,
    files?: Array<{ originalName: string; mimeType: string; size: number; s3Key: string }>
  ) => {
    if (!threadId) return;

    try {
      await addMessageStreaming({ content: message, files });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleDeleteThread = async (threadId: number) => {
    try {
      await deleteThread(threadId);
      router.push('/app/chat');
    } catch (error) {
      console.error('Failed to delete thread:', error);
    }
  };

  const handleNewThread = () => {
    router.push('/app/chat');
  };

  const isLoading = personasLoading || threadsLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="mt-2 text-sm text-gray-500">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-chat-layout h-screen overflow-hidden">
      <ChatInterface
        personas={personas}
        threads={threads}
        activeThread={activeThread || null}
        onCreateThread={handleCreateThread}
        onSelectThread={handleSelectThread}
        onSendMessage={handleSendMessage}
        onDeleteThread={handleDeleteThread}
        onNewThread={handleNewThread}
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
