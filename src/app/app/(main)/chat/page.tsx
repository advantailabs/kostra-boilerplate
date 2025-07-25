'use client';

import { ChatInterface } from '@/components/organisms/chat/ChatInterface';
import { useChat } from '@/hooks/useChat';
import { usePersonas } from '@/hooks/usePersonas';
import { useThreads } from '@/hooks/useThreads';
import { CreateThreadRequest } from '@/types/chat';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();
  const { personas, isLoading: personasLoading } = usePersonas();
  const { threads, isLoading: threadsLoading, deleteThread } = useThreads();

  const { createThreadStreaming, isStreaming, streamingMessage } = useChat(undefined); // No active thread on main chat page

  const handleCreateThread = async (personaId: number, message: string) => {
    try {
      const threadData: CreateThreadRequest = { personaId, message };
      const newThreadId = await createThreadStreaming(threadData);
      if (newThreadId) {
        router.replace(`/app/chat/${newThreadId}`);
      } else {
        alert('Failed to create thread. Please try again.');
      }
    } catch (error) {
      console.error('Failed to create thread:', error);
    }
  };

  const handleSelectThread = (threadId: number) => {
    router.push(`/app/chat/${threadId}`);
  };

  const handleSendMessage = async (_message: string) => {
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
    <div className="h-screen">
      <ChatInterface
        personas={personas}
        threads={threads}
        activeThread={null} // No active thread on main chat page
        onCreateThread={handleCreateThread}
        onSelectThread={handleSelectThread}
        onSendMessage={handleSendMessage}
        onDeleteThread={handleDeleteThread}
        onNewThread={handleNewThread}
        isStreaming={isStreaming}
        streamingMessage={streamingMessage}
      />
    </div>
  );
}
