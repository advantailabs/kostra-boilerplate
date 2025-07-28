import { Avatar } from '@/components/atom/Avatar';
import { Message, Persona } from '@prisma/client';
import Image from 'next/image';

import { cx } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

interface MessageBubbleProps {
  message: Message;
  persona?: Persona | null;
  className?: string;
}

export function MessageBubble({ message, persona, className }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const { user } = useAuthStore();

  // Helper function to render user avatar
  const renderUserAvatar = () => {
    if (user?.profilePicture) {
      return (
        <Image
          src={user.profilePicture}
          alt={user.name || 'User'}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
        />
      );
    }

    // Fallback to initials or icon
    const initials = user?.name
      ? user.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : '?';

    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{initials}</span>
      </div>
    );
  };

  // Helper function to render assistant avatar
  const renderAssistantAvatar = () => {
    if (persona?.logo) {
      return (
        <Avatar
          src={persona.logo}
          alt={`${persona.name} avatar`}
          fallback={persona.name}
          size="sm"
        />
      );
    }

    // Fallback to initials or icon
    const initials = persona?.name
      ? persona.name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'AI';

    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{initials}</span>
      </div>
    );
  };

  return (
    <div className={cx('flex gap-3 p-4', isUser ? 'justify-end' : 'justify-start', className)}>
      {!isUser && renderAssistantAvatar()}
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
      {isUser && renderUserAvatar()}
    </div>
  );
}
