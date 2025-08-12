interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-800 ${className}`} />;
}

export function SearchResultSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-11/12" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}
