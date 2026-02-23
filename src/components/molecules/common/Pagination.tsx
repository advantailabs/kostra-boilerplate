import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  Pagination as PaginationNav,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

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
  const { page, totalPages, totalCount, limit } = pagination;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

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
  const isPreviousDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;

  const handlePreviousClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!isPreviousDisabled) {
      onPageChange(Math.max(1, page - 1));
    }
  };

  const handleNextClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!isNextDisabled) {
      onPageChange(Math.min(totalPages, page + 1));
    }
  };

  const handlePageClick = (e: React.MouseEvent<HTMLAnchorElement>, pageNum: number) => {
    e.preventDefault();
    onPageChange(pageNum);
  };

  return (
    <div className={cn('mt-3 flex items-center justify-between', className)}>
      <div className="text-center text-sm text-gray-500 sm:text-left dark:text-gray-400">
        Showing {startIndex + 1} to {Math.min(endIndex, totalCount)} of {totalCount} results
      </div>
      <PaginationNav className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={handlePreviousClick}
              className={cn(isPreviousDisabled && 'pointer-events-none opacity-50')}
              aria-disabled={isPreviousDisabled}
            />
          </PaginationItem>
          {pageNumbers.map((pageNum, index) => (
            <PaginationItem key={index}>
              {pageNum === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  isActive={pageNum === page}
                  onClick={(e) => handlePageClick(e, pageNum as number)}
                >
                  {pageNum}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={handleNextClick}
              className={cn(isNextDisabled && 'pointer-events-none opacity-50')}
              aria-disabled={isNextDisabled}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationNav>
    </div>
  );
}
