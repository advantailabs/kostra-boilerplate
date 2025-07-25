import { MessageBubble } from '@/components/atom/MessageBubble';
import { ConversationHeader } from '@/components/molecules/chat/ConversationHeader';
import { EnhancedMessageInput } from '@/components/molecules/chat/EnhancedMessageInput';
import { PersonaSelectionModal } from '@/components/molecules/chat/PersonaSelectionModal';
import { Message, Persona, Thread } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface ConversationViewProps {
  personas: Persona[];
  activeThread: (Thread & { persona: Persona | null; messages: Message[] }) | null;
  onCreateThread: (_personaId: number, _message: string) => void;
  onSendMessage: (_message: string) => void;
  onDeleteThread: (_threadId: number) => void;
  showPersonaModal?: boolean;
  onClosePersonaModal?: () => void;
  isStreaming?: boolean;
  streamingMessage?: string;
}

export function ConversationView({
  personas,
  activeThread,
  onCreateThread,
  onSendMessage,
  onDeleteThread,
  showPersonaModal = false,
  onClosePersonaModal,
  isStreaming = false,
  streamingMessage = '',
}: ConversationViewProps) {
  const router = useRouter();
  const [selectedPersonaId, setSelectedPersonaId] = useState<number | undefined>(personas[0]?.id);
  const [message, setMessage] = useState('');
  const [pendingUserMessage, setPendingUserMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or streaming
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Use setTimeout to ensure DOM has updated
    const timeoutId = setTimeout(scrollToBottom, 100);

    return () => clearTimeout(timeoutId);
  }, [activeThread?.messages, isStreaming, streamingMessage, pendingUserMessage]);

  const handleSendMessage = async () => {
    if (!activeThread) {
      // Create new thread
      if (!selectedPersonaId || !message.trim()) return;

      // Set pending user message immediately for optimistic UI
      setPendingUserMessage(message.trim());

      try {
        await onCreateThread(selectedPersonaId, message.trim());
        setMessage('');
        setPendingUserMessage(''); // Clear pending message after thread is created
      } catch (error) {
        console.error('Failed to create thread:', error);
        setPendingUserMessage(''); // Clear pending message on error
      }
    } else {
      // Send message to existing thread
      if (!message.trim()) return;

      try {
        await onSendMessage(message.trim());
        setMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
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

  // Determine if we should show messages or empty state
  const shouldShowMessages = activeThread || pendingUserMessage || isStreaming;

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
          {shouldShowMessages ? (
            <div className="space-y-3 p-4">
              {/* Show existing thread messages */}
              {activeThread?.messages.map(message => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {/* Show pending user message when creating new thread */}
              {!activeThread && pendingUserMessage && (
                <MessageBubble
                  message={{
                    id: 0, // Temporary ID for pending message
                    content: pendingUserMessage,
                    role: 'user',
                    threadId: 0, // Temporary thread ID
                    timestamp: new Date(),
                    openaiMessageId: null,
                    deletedAt: null,
                  }}
                />
              )}

              {/* Show streaming message if currently streaming */}
              {isStreaming && streamingMessage && (
                <div className="flex justify-start">
                  <div className="max-w-3xl rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-800">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500">
                          <span className="text-xs font-medium text-white">AI</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {streamingMessage}
                          <span className="animate-pulse">|</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Show loading indicator next to assistant icon when streaming */}
              {isStreaming && !streamingMessage && (
                <div className="flex justify-start">
                  <div className="max-w-3xl rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-800">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500">
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          AI is thinking...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            // Empty state remains the same
            <div className="flex h-full flex-col items-center justify-center p-6">
              <div className="max-w-xl text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Welcome to your AI Assistant
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Start a conversation by selecting a persona and typing your message below.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <EnhancedMessageInput
            value={message}
            onChange={setMessage}
            onSend={handleSendMessage}
            disabled={
              isStreaming || (!activeThread && (!selectedPersonaId || personas.length === 0))
            }
            loading={false} // Remove loading from send button since we show it next to assistant icon
            placeholder={
              activeThread
                ? isStreaming
                  ? 'AI is responding...'
                  : 'Type your message...'
                : selectedPersona
                  ? `Message ${selectedPersona.name}...`
                  : personas.length === 0
                    ? 'Create a persona first...'
                    : 'Select a persona first...'
            }
          />
        </div>
      </div>

      {/* Persona Selection Modal */}
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
