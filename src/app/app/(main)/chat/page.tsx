'use client';

import { ChatInterface } from '@/components/organisms/chat/ChatInterface';
import { useChat } from '@/hooks/useChat';
import { usePersonas } from '@/hooks/usePersonas';
import { useThreads } from '@/hooks/useThreads';
import { CreateThreadRequest } from '@/types/chat';
import { useState } from 'react';

export default function ChatPage() {
  const { personas, isLoading: personasLoading } = usePersonas();
  const { threads, isLoading: threadsLoading, createThread, deleteThread } = useThreads();

  const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
  const { thread: activeThread, addMessage } = useChat(activeThreadId || undefined);

  const handleCreateThread = async (personaId: number, message: string) => {
    try {
      const threadData: CreateThreadRequest = { personaId, message };
      const newThread = await createThread(threadData);
      setActiveThreadId(newThread.id);
    } catch (error) {
      console.error('Failed to create thread:', error);
    }
  };

  const handleSelectThread = (threadId: number) => {
    setActiveThreadId(threadId);
  };

  const handleSendMessage = async (message: string) => {
    if (!activeThreadId) return;

    try {
      await addMessage({ content: message });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleDeleteThread = async (threadId: number) => {
    try {
      await deleteThread(threadId);
      if (activeThreadId === threadId) {
        setActiveThreadId(null);
      }
    } catch (error) {
      console.error('Failed to delete thread:', error);
    }
  };

  const handleNewThread = () => {
    setActiveThreadId(null);
  };

  const isLoading = personasLoading || threadsLoading;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="mt-2 text-sm text-gray-500">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <ChatInterface
      personas={personas}
      threads={threads}
      activeThread={activeThread || null}
      onCreateThread={handleCreateThread}
      onSelectThread={handleSelectThread}
      onSendMessage={handleSendMessage}
      onDeleteThread={handleDeleteThread}
      onNewThread={handleNewThread}
    />
  );
}
