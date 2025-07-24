import { Persona, Thread } from '@prisma/client';
import { RiMore2Fill, RiRobot2Line } from '@remixicon/react';

interface ConversationHeaderProps {
  thread?: Thread & { persona: Persona | null };
  selectedPersona?: Persona;
  onDelete?: () => void;
  className?: string;
}

export function ConversationHeader({
  thread,
  selectedPersona,
  onDelete,
  className,
}: ConversationHeaderProps) {
  if (!thread) {
    return (
      <div
        className={`flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700 ${className}`}
      >
        <div className="flex items-center gap-3">
          {selectedPersona && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm">
              <RiRobot2Line className="h-4 w-4 text-white" />
            </div>
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
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700 ${className}`}
    >
      <div className="flex items-center gap-3">
        {thread.persona && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm">
            <RiRobot2Line className="h-4 w-4 text-white" />
          </div>
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
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          title="Delete conversation"
        >
          <RiMore2Fill className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
