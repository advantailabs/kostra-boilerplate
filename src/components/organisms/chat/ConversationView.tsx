import { MessageBubble } from '@/components/atom/MessageBubble';
import { ConversationHeader } from '@/components/molecules/chat/ConversationHeader';
import { MessageInput } from '@/components/molecules/chat/MessageInput';
import { Message, Persona, Thread } from '@prisma/client';
import { useState } from 'react';

interface ConversationViewProps {
  personas: Persona[];
  activeThread: (Thread & { persona: Persona | null; messages: Message[] }) | null;
  onCreateThread: (_personaId: number, _message: string) => void;
  onSendMessage: (_message: string) => void;
  onDeleteThread: (_threadId: number) => void;
}

export function ConversationView({
  personas,
  activeThread,
  onCreateThread,
  onSendMessage,
  onDeleteThread,
}: ConversationViewProps) {
  const [selectedPersonaId, setSelectedPersonaId] = useState<number | undefined>();
  const [sending, setSending] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!activeThread) {
      // Create new thread
      if (!selectedPersonaId) return;

      setSending(true);
      try {
        await onCreateThread(selectedPersonaId, message);
      } finally {
        setSending(false);
      }
    } else {
      // Send message to existing thread
      setSending(true);
      try {
        await onSendMessage(message);
      } finally {
        setSending(false);
      }
    }
  };

  const handlePersonaSelect = (personaId: number) => {
    setSelectedPersonaId(personaId);
  };

  const handleDeleteThread = () => {
    if (activeThread) {
      onDeleteThread(activeThread.id);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <ConversationHeader
        thread={activeThread || undefined}
        onDelete={activeThread ? handleDeleteThread : undefined}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {activeThread ? (
          <div className="space-y-2">
            {activeThread.messages.map(message => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Start a new conversation
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Select a persona and send your first message
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <MessageInput
          personas={personas}
          selectedPersonaId={activeThread?.personaId || selectedPersonaId}
          onPersonaSelect={handlePersonaSelect}
          onSendMessage={handleSendMessage}
          disabled={sending}
          loading={sending}
          placeholder={
            activeThread ? 'Type your message...' : 'Select a persona and type your message...'
          }
        />
      </div>
    </div>
  );
}
