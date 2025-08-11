import { Avatar } from '@/components/atom/Avatar';
import { LoadingIndicator } from '@/components/atom/LoadingIndicator';
import { MessageBubble } from '@/components/atom/MessageBubble';
import { StreamingMessage } from '@/components/atom/StreamingMessage';
import { ConversationHeader } from '@/components/molecules/chat/ConversationHeader';
import { EnhancedMessageInput } from '@/components/molecules/chat/EnhancedMessageInput';
import { PersonaSelectionModal } from '@/components/molecules/chat/PersonaSelectionModal';
import { PublicCitationFile } from '@/types/chat';
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
  currentCitations?: PublicCitationFile[];
}

export function ConversationView({
  personas,
  activeThread,
  onCreateThread,
  onSendMessage,
  showPersonaModal = false,
  onClosePersonaModal,
  isStreaming = false,
  streamingMessage = '',
  currentCitations = [],
}: ConversationViewProps) {
  const router = useRouter();
  const [selectedPersonaId, setSelectedPersonaId] = useState<number | undefined>(personas[0]?.id);
  const [message, setMessage] = useState('');
  const [pendingUserMessage, setPendingUserMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or streaming
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        });
      }
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

  const selectedPersona = personas.find(p => p.id === selectedPersonaId);

  // Determine if we should show messages or empty state
  const shouldShowMessages = activeThread || pendingUserMessage || isStreaming;

  return (
    <>
      <div className="flex h-full min-h-0 flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 min-[800px]:static min-[800px]:top-0 dark:bg-gray-950">
          <ConversationHeader
            thread={activeThread || undefined}
            selectedPersona={!activeThread ? selectedPersona : undefined}
          />
        </div>

        {/* Messages or Empty State */}
        <div
          ref={messagesContainerRef}
          className="scrollbar-thin chat-messages-container relative min-h-0 flex-1 overflow-y-auto pb-2"
        >
          {shouldShowMessages ? (
            <div className="space-y-3 p-2 pt-4 min-[800px]:p-4 min-[800px]:pt-4">
              {/* Show existing thread messages */}
              {activeThread?.messages.map(message => (
                <MessageBubble key={message.id} message={message} persona={activeThread.persona} />
              ))}

              {/* Show pending user message when creating new thread */}
              {!activeThread && pendingUserMessage && (
                <MessageBubble
                  message={
                    {
                      id: 0, // Temporary ID for pending message
                      content: pendingUserMessage,
                      role: 'user',
                      threadId: 0, // Temporary thread ID
                      timestamp: new Date(),
                      openaiMessageId: null,
                      deletedAt: null,
                      citations: null,
                    } as any
                  }
                  persona={selectedPersona || undefined}
                />
              )}

              {/* Show streaming message if currently streaming */}
              {isStreaming && streamingMessage && (
                <StreamingMessage
                  message={streamingMessage}
                  personaLogo={activeThread?.persona?.logo || selectedPersona?.logo}
                  personaName={activeThread?.persona?.name || selectedPersona?.name}
                  citations={currentCitations}
                />
              )}

              {/* Show loading indicator when streaming but no message yet */}
              {isStreaming && !streamingMessage && (
                <LoadingIndicator
                  personaLogo={activeThread?.persona?.logo || selectedPersona?.logo}
                  personaName={activeThread?.persona?.name || selectedPersona?.name}
                  message="AI is thinking..."
                />
              )}

              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            // Empty state with selected persona
            <div className="flex h-full flex-col items-center justify-center p-6">
              <div className="max-w-xl text-center">
                {selectedPersona && (
                  <div className="mb-4 flex justify-center">
                    <Avatar
                      src={selectedPersona.logo}
                      alt={`${selectedPersona.name} avatar`}
                      fallback={selectedPersona.name}
                      size="lg"
                    />
                  </div>
                )}
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {selectedPersona
                    ? `Welcome to ${selectedPersona.name}`
                    : 'Welcome to your AI Assistant'}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {selectedPersona
                    ? 'Start a conversation by typing your message below.'
                    : 'Start a conversation by selecting a persona and typing your message below.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-2 pb-2 min-[800px]:p-4 min-[800px]:pb-4 dark:border-gray-600">
          <EnhancedMessageInput
            value={message}
            onChange={setMessage}
            onSend={handleSendMessage}
            disabled={
              isStreaming || (!activeThread && (!selectedPersonaId || personas.length === 0))
            }
            loading={false} // Remove loading from send button since we show it next to assistant icon
            placeholder={(() => {
              if (activeThread) {
                return isStreaming ? 'AI is responding...' : 'Type your message...';
              }
              if (selectedPersona) {
                return `Message ${selectedPersona.name}...`;
              }
              if (personas.length === 0) {
                return 'Create a persona first...';
              }
              return 'Select a persona first...';
            })()}
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
