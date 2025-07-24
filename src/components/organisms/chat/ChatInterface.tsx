import { ThreadSidebar } from '@/components/molecules/chat/ThreadSidebar';
import { ConversationView } from '@/components/organisms/chat/ConversationView';
import { Message, Persona, Thread } from '@prisma/client';

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
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0">
        <ThreadSidebar
          threads={threads}
          activeThreadId={activeThread?.id}
          onThreadSelect={onSelectThread}
          onThreadDelete={onDeleteThread}
          onNewThread={onNewThread}
        />
      </div>

      {/* Main conversation area */}
      <div className="flex flex-1 flex-col">
        <ConversationView
          personas={personas}
          activeThread={activeThread}
          onCreateThread={onCreateThread}
          onSendMessage={onSendMessage}
          onDeleteThread={onDeleteThread}
        />
      </div>
    </div>
  );
}
