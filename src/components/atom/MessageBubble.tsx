import { Avatar } from '@/components/atom/Avatar';
import { cx, processContentWithCitations } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import { CitationFile, StoredCitation } from '@/types/chat';
import { Message, Persona } from '@prisma/client';
import Image from 'next/image';
import { useState } from 'react';
import { CitationList } from './CitationList';
import MarkdownRenderer from './SyntaxHighlighter';

interface MessageBubbleProps {
  message: Message;
  persona?: Persona | null;
  citations?: CitationFile[];
  className?: string;
}

export function MessageBubble({ message, persona, citations, className }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);

  // Parse stored citations from message
  const storedCitations: StoredCitation[] = (() => {
    const { citations } = message as any;
    if (!citations) return [];
    if (typeof citations === 'string') return JSON.parse(citations);
    return citations;
  })();

  // Convert stored citations to CitationFile format for display
  const displayCitations: CitationFile[] = storedCitations.map(citation => ({
    openaiFileId: citation.openaiFileId,
    fileId: citation.fileId,
    originalName: citation.originalName,
    filename: citation.filename,
    mimeType: citation.mimeType,
    size: citation.size,
    citationText: citation.citationText,
    startIndex: citation.startIndex,
    endIndex: citation.endIndex,
  }));

  // Use passed citations (for streaming) or parsed citations (for stored messages)
  const finalCitations = citations || displayCitations;

  // Process content to remove citation text for display
  const displayContent = processContentWithCitations(message.content, storedCitations, false);

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
    <div className={cx('flex gap-3', isUser ? 'justify-end' : 'justify-start', className)}>
      {!isUser && renderAssistantAvatar()}
      <div className={cx('flex flex-col', isUser ? 'flex-1' : '')}>
        <div
          className={cx(
            'min-w-0 rounded-lg px-3 py-2',
            isUser
              ? 'ml-auto max-w-[85%] bg-indigo-600 text-white'
              : 'max-w-[85%] bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
          )}
        >
          {/* 📝 Message content */}
          <p className="break-words text-sm">
            <MarkdownRenderer content={displayContent} />
          </p>

          {/* ⏰ Timestamp */}
          <div className="mt-2 flex w-full items-center justify-between text-sm">
            <span className={cx(isUser ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400')}>
              {new Date(message.timestamp).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              })}{' '}
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>

            <button
              onClick={() => {
                navigator.clipboard.writeText(displayContent);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              title="Copy full message"
            >
              {copied ? (
                <span className="text-xs">Copied</span>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v16c0 
      1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 
      18H8V7h11v16z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 📎 Citations (Assistant only) */}
        {!isUser && finalCitations && finalCitations.length > 0 && (
          <CitationList citations={finalCitations} />
        )}
      </div>
      {isUser && renderUserAvatar()}
    </div>
  );
}
