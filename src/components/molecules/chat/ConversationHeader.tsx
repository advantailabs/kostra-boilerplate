import { Avatar } from '@/components/atom/Avatar';
import { CreditDisplay } from '@/components/atom/CreditDisplay';
import { Persona, Thread } from '@prisma/client';

interface ConversationHeaderProps {
  thread?: Thread & { persona: Persona | null };
  selectedPersona?: Persona;

  className?: string;
}

export function ConversationHeader({
  thread,
  selectedPersona,

  className,
}: ConversationHeaderProps) {
  if (!thread) {
    return (
      <div
        className={`flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700 ${className}`}
      >
        <div className="flex items-center gap-3">
          {selectedPersona && (
            <Avatar
              src={selectedPersona.logo}
              alt={`${selectedPersona.name} avatar`}
              fallback={selectedPersona.name}
              size="sm"
            />
          )}
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {selectedPersona ? selectedPersona.name : 'New Conversation'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {selectedPersona ? 'Ready to start chatting' : 'Select a persona to start chatting'}
            </p>
          </div>
        </div>
        <CreditDisplay size="sm" />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between border-b border-gray-200 px-3 py-3 dark:border-gray-700 ${className}`}
    >
      <div className="flex items-center gap-3">
        {thread.persona && (
          <Avatar
            src={thread.persona.logo}
            alt={`${thread.persona.name} avatar`}
            fallback={thread.persona.name}
            size="sm"
          />
        )}
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{thread.title}</h2>
          {thread.persona && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Chatting with {thread.persona.name}
            </p>
          )}
        </div>
      </div>
      <CreditDisplay size="sm" />
    </div>
  );
}
