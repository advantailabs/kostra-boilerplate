import { ThreadSidebar } from '@/components/molecules/chat/ThreadSidebar';
import { ConversationView } from '@/components/organisms/chat/ConversationView';
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
        />
      </div>

      {/* Right Sidebar */}
      <div className="w-60 flex-shrink-0 border-l border-gray-200 dark:border-gray-700">
        <ThreadSidebar
          threads={threads}
          activeThreadId={activeThread?.id}
          onThreadSelect={onSelectThread}
          onThreadDelete={onDeleteThread}
          onNewThread={handleNewThread}
        />
      </div>
    </div>
  );
}
