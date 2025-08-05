'use client';

import { ChatInterface } from '@/components/organisms/chat/ChatInterface';
import { useChat } from '@/hooks/useChat';
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
  const { threads, isLoading: threadsLoading, deleteThread } = useThreads();

  const {
    thread: activeThread,
    addMessageStreaming,
    createThreadStreaming,
    isStreaming,
    streamingMessage,
    currentCitations,
  } = useChat(threadId || undefined);

  // Redirect to main chat page if no threadId or thread not found
  useEffect(() => {
    if (!threadId) {
      router.push('/app/chat');
      return;
    }

    if (!threadsLoading && threads.length > 0) {
      const threadExists = threads.some(t => t.id === threadId);
      if (!threadExists) {
        router.push('/app/chat');
      }
    }
  }, [threadId, threads, threadsLoading, router]);

  const handleCreateThread = async (personaId: number, message: string) => {
    try {
      const threadData: CreateThreadRequest = { personaId, message };
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

  const handleSendMessage = async (message: string) => {
    if (!threadId) return;

    try {
      await addMessageStreaming({ content: message });
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
        isStreaming={isStreaming}
        streamingMessage={streamingMessage}
        currentCitations={currentCitations}
      />
    </div>
  );
}
