interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading ...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-white p-4 sm:px-6 sm:pb-6 sm:pt-10 lg:px-10 lg:pt-7 dark:bg-gray-950">
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="mt-2 text-sm text-gray-500">{message}</p>
        </div>
      </div>
    </div>
  );
}
