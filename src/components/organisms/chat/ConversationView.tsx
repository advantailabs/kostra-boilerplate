import { Button } from '@/components/atom/Button';
import { MessageBubble } from '@/components/atom/MessageBubble';
import { ConversationHeader } from '@/components/molecules/chat/ConversationHeader';
import { EnhancedMessageInput } from '@/components/molecules/chat/EnhancedMessageInput';
import { PersonaSelectionModal } from '@/components/molecules/chat/PersonaSelectionModal';
import { Message, Persona, Thread } from '@prisma/client';
import { RiRobot2Line } from '@remixicon/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ConversationViewProps {
  personas: Persona[];
  activeThread: (Thread & { persona: Persona | null; messages: Message[] }) | null;
  onCreateThread: (_personaId: number, _message: string) => void;
  onSendMessage: (_message: string) => void;
  onDeleteThread: (_threadId: number) => void;
  showPersonaModal?: boolean;
  onClosePersonaModal?: () => void;
}

export function ConversationView({
  personas,
  activeThread,
  onCreateThread,
  onSendMessage,
  onDeleteThread,
  showPersonaModal = false,
  onClosePersonaModal,
}: ConversationViewProps) {
  const router = useRouter();
  const [selectedPersonaId, setSelectedPersonaId] = useState<number | undefined>(personas[0]?.id);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendMessage = async () => {
    if (!activeThread) {
      // Create new thread
      if (!selectedPersonaId || !message.trim()) return;

      setSending(true);
      try {
        await onCreateThread(selectedPersonaId, message.trim());
        setMessage('');
      } finally {
        setSending(false);
      }
    } else {
      // Send message to existing thread
      if (!message.trim()) return;

      setSending(true);
      try {
        await onSendMessage(message.trim());
        setMessage('');
      } finally {
        setSending(false);
      }
    }
  };

  const handlePersonaSelect = (personaId: number) => {
    setSelectedPersonaId(personaId);
  };

  const handlePersonaModalSelect = (personaId: number) => {
    setSelectedPersonaId(personaId);
    onClosePersonaModal?.();
  };

  const handleCreatePersona = () => {
    router.push('/app/personas');
  };

  const handleDeleteThread = () => {
    if (activeThread) {
      onDeleteThread(activeThread.id);
    }
  };

  const selectedPersona = personas.find(p => p.id === selectedPersonaId);

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Header */}
        <ConversationHeader
          thread={activeThread || undefined}
          selectedPersona={!activeThread ? selectedPersona : undefined}
          onDelete={activeThread ? handleDeleteThread : undefined}
        />

        {/* Messages or Empty State */}
        <div className="flex-1 overflow-y-auto">
          {activeThread ? (
            <div className="space-y-3 p-4">
              {activeThread.messages.map(message => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-6">
              <div className="max-w-xl text-center">
                {personas.length === 0 ? (
                  <div className="text-center">
                    <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                      No personas available. Create a persona to start chatting.
                    </p>
                    <Button onClick={handleCreatePersona}>Create Your First Persona</Button>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm">
                      <RiRobot2Line className="h-4 w-4 text-white" />
                    </div>

                    {selectedPersona && (
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Ready to chat with {selectedPersona.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Type your message below to start the conversation
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <EnhancedMessageInput
            value={message}
            onChange={setMessage}
            onSend={handleSendMessage}
            disabled={sending || (!activeThread && (!selectedPersonaId || personas.length === 0))}
            loading={sending}
            placeholder={
              activeThread
                ? 'Type your message...'
                : selectedPersona
                  ? `Message ${selectedPersona.name}...`
                  : personas.length === 0
                    ? 'Create a persona first...'
                    : 'Select a persona first...'
            }
          />
        </div>
      </div>

      {/* Persona Selection Modal - Rendered at the end to ensure proper overlay */}
      {showPersonaModal && (
        <PersonaSelectionModal
          isOpen={showPersonaModal}
          personas={personas}
          onClose={onClosePersonaModal || (() => {})}
          onSelectPersona={handlePersonaModalSelect}
          onCreatePersona={handleCreatePersona}
        />
      )}
    </>
  );
}
