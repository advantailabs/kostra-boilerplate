import { Avatar } from './Avatar';

interface LoadingIndicatorProps {
  personaLogo?: string | null;
  personaName?: string | null;
  message?: string;
  showAvatar?: boolean;
}

export function LoadingIndicator({
  personaLogo,
  personaName = 'AI',
  message = 'AI is thinking...',
  showAvatar = true,
}: LoadingIndicatorProps) {
  return (
    <div className="flex justify-start gap-3">
      {showAvatar && (
        <Avatar
          src={personaLogo || undefined}
          alt={`${personaName} avatar`}
          fallback={personaName || 'AI'}
          size="sm"
        />
      )}
      <div className="max-w-[80%] rounded-lg bg-gray-100 px-4 py-2 text-sm dark:bg-gray-800 dark:text-gray-100">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
          </div>
          <div className="text-gray-900 dark:text-gray-100">{message}</div>
        </div>
      </div>
    </div>
  );
}
