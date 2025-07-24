import { cx } from '@/lib/utils';
import { Message } from '@prisma/client';
import { RiRobotLine, RiUser3Line } from '@remixicon/react';

interface MessageBubbleProps {
  message: Message;
  className?: string;
}

export function MessageBubble({ message, className }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const Icon = isUser ? RiUser3Line : RiRobotLine;

  return (
    <div className={cx('flex gap-3 p-4', isUser ? 'justify-end' : 'justify-start', className)}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
          <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        </div>
      )}
      <div
        className={cx(
          'max-w-[80%] rounded-lg px-4 py-2 text-sm',
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p
          className={cx(
            'mt-1 text-xs',
            isUser ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'
          )}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </div>
      )}
    </div>
  );
}
