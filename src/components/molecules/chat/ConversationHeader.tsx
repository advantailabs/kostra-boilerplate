import { Persona, Thread } from '@prisma/client';
import { RiMore2Fill } from '@remixicon/react';

interface ConversationHeaderProps {
  thread?: Thread & { persona: Persona | null };
  onDelete?: () => void;
  className?: string;
}

export function ConversationHeader({ thread, onDelete, className }: ConversationHeaderProps) {
  if (!thread) {
    return (
      <div
        className={`flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700 ${className}`}
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            New Conversation
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select a persona to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700 ${className}`}
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{thread.title}</h2>
        {thread.persona && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chatting with {thread.persona.name}
          </p>
        )}
      </div>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          title="Delete conversation"
        >
          <RiMore2Fill className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
