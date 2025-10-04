interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading ...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-background p-4 sm:px-6 sm:pb-6 sm:pt-10 lg:px-10 lg:pt-7">
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-2 text-sm text-text-muted">{message}</p>
        </div>
      </div>
    </div>
  );
}
