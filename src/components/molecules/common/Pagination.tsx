import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';

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

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i += 1) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (page <= 3) {
        // Show first 4 pages + ellipsis + last page
        for (let i = 2; i <= 4; i += 1) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        // Show first page + ellipsis + last 4 pages
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i += 1) {
          pages.push(i);
        }
      } else {
        // Show first page + ellipsis + current page and neighbors + ellipsis + last page
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i += 1) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`mt-3 flex items-center justify-between ${className || ''}`}>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Page {page} of {totalPages} • {totalCount} total
      </div>
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <Button
          variant="secondary"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="h-6 w-6 p-0"
        >
          <RiArrowLeftSLine className="h-3 w-3" />
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum, index) => (
            <div key={index}>
              {pageNum === '...' ? (
                <span className="flex h-6 w-6 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  ...
                </span>
              ) : (
                <Button
                  variant={pageNum === page ? 'primary' : 'secondary'}
                  onClick={() => onPageChange(pageNum as number)}
                  className="h-6 w-6 p-0 text-sm"
                >
                  {pageNum}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <Button
          variant="secondary"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="h-6 w-6 p-0"
        >
          <RiArrowRightSLine className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
