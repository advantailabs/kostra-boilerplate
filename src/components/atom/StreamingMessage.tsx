import { Avatar } from './Avatar';

interface StreamingMessageProps {
  message: string;
  personaLogo?: string | null;
  personaName?: string | null;
}

export function StreamingMessage({
  message,
  personaLogo,
  personaName = 'AI',
}: StreamingMessageProps) {
  return (
    <div className="flex justify-start gap-3">
      <Avatar
        src={personaLogo || undefined}
        alt={`${personaName} avatar`}
        fallback={personaName || 'AI'}
        size="sm"
      />
      <div className="max-w-[80%] rounded-lg bg-gray-100 px-4 py-2 text-sm dark:bg-gray-800 dark:text-gray-100">
        <div className="text-gray-900 dark:text-gray-100">
          {message}
          <span className="animate-pulse">|</span>
        </div>
      </div>
    </div>
  );
}
