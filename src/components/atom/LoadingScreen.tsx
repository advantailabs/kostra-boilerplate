import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

export function LoadingScreen({
  message = 'Loading ...',
  className,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        'min-h-screen bg-muted/40 p-4 sm:px-6 sm:pb-6 sm:pt-10 lg:px-10 lg:pt-7',
        className
      )}
    >
      <div className="flex min-h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-2 text-sm text-text-muted">{message}</p>
        </div>
      </div>
    </div>
  );
}
