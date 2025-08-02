import { ThreadSidebar } from '@/components/molecules/chat/ThreadSidebar';
import { ConversationView } from '@/components/organisms/chat/ConversationView';
import { PublicCitationFile } from '@/types/chat';
import { Message, Persona, Thread } from '@prisma/client';
import { useState } from 'react';

interface ChatInterfaceProps {
  personas: Persona[];
  threads: (Thread & { persona: Persona | null })[];
  activeThread: (Thread & { persona: Persona | null; messages: Message[] }) | null;
  onCreateThread: (_personaId: number, _message: string) => void;
  onSelectThread: (_threadId: number) => void;
  onSendMessage: (_message: string) => void;
  onDeleteThread: (_threadId: number) => void;
  onNewThread: () => void;
  isStreaming?: boolean;
  streamingMessage?: string;
  currentCitations?: PublicCitationFile[];
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
}: ChatInterfaceProps) {
  const [showPersonaModal, setShowPersonaModal] = useState(false);

  const handleNewThread = () => {
    onNewThread();
    setShowPersonaModal(true);
  };

  const handleClosePersonaModal = () => {
    setShowPersonaModal(false);
  };

  return (
    <div className="flex h-full">
      {/* Main conversation area */}
      <div className="flex min-w-0 flex-1 flex-col">
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

      {/* Thread Sidebar */}
      <ThreadSidebar
        threads={threads}
        activeThreadId={activeThread?.id}
        onThreadSelect={onSelectThread}
        onThreadDelete={onDeleteThread}
        onNewThread={handleNewThread}
        className="w-80 border-l border-gray-200 dark:border-gray-700"
      />
    </div>
  );
}
