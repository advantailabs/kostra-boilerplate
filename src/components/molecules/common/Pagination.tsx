import { Button } from '@/components/atom/Button';

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (_page: number) => void;
  className?: string;
}

export function Pagination({ pagination, onPageChange, className }: PaginationProps) {
  const { page, totalPages, totalCount } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`mt-3 flex items-center justify-between ${className || ''}`}>
      <div className="text-sm text-text-muted">
        Page {page} of {totalPages} • {totalCount} total
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
