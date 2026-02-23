'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { PageHeaderWithAction } from '@/components/molecules/common/PageHeaderWithAction';
import { Pagination } from '@/components/molecules/common/Pagination';
import { UnifiedSearchBar } from '@/components/molecules/common/UnifiedSearchBar';
import { UserFilterModal, UserFilters } from '@/components/molecules/common/UserFilterModal';
import { DataTable } from '@/components/ui/data-table';
import { Switch } from '@/components/ui/switch';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { UserRole } from '@/lib/constants/admin';
import { useAuthStore } from '@/store/auth';
import { User } from '@/types/user';

import { Field, FieldLabel } from '@/components/ui/field';
import { userTableColumns } from './userTableColumns';

interface UsersTableProps {
  onEdit: (_user: User) => void;
  onDelete: (_user: User) => void;
  onViewDetails: (_user: User) => void;
  onAdd: () => void;
  onRestore?: (_user: User) => void;
  onPageChange?: (_page: number) => void;
  className?: string;
}

export function UsersTable({
  onEdit,
  onDelete,
  onViewDetails,
  onAdd,
  onRestore,
  onPageChange,
  className,
}: UsersTableProps) {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 400);
  const [showDeleted, setShowDeleted] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({
    sortBy: 'id',
    sortOrder: 'desc',
    includeDeleted: false,
  });

  // Check if any filters are active (excluding default sorting)
  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof UserFilters];
    // Exclude default sorting values and empty values
    if (key === 'sortBy' && value === 'id') return false;
    if (key === 'sortOrder' && value === 'desc') return false;
    if (key === 'includeDeleted' && value === false) return false;
    return value !== undefined && value !== '';
  });

  const { users, totalCount, pagination, isLoading, updateUser, restoreUser, isRestoring } =
    useAdminUsers({
      search: debouncedSearch,
      includeDeleted: showDeleted,
      role: filters.role,
      plan: filters.plan,
      isOnboarded: filters.isOnboarded,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      limit,
      offset: (page - 1) * limit,
    });
  const { user: currentUser } = useAuthStore();

  // Use server-side pagination
  const total = totalCount;
  const totalPages = pagination?.totalPages || Math.ceil(total / limit);


  // Handle smart pagination after deletion
  // If current page is empty and we're not on page 1, go to previous page
  if (users.length === 0 && page > 1 && !isLoading && totalPages >= 1) {
    setPage(prevPage => prevPage - 1);
  }

  // Notify parent of page changes
  useEffect(() => {
    if (onPageChange) {
      onPageChange(page);
    }
  }, [page, onPageChange]);

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await updateUser({ userId, userData: { role: newRole as UserRole } });
    } catch (_error) {
      // Error handling is done in the hook
    }
  };

  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleFilterModalOpen = () => {
    setIsFilterModalOpen(true);
  };

  const handleFilterModalClose = () => {
    setIsFilterModalOpen(false);
  };

  return (
    <div className={`min-h-screen ${className || ''}`}>
      <PageHeaderWithAction
        title="Users"
        description="Workspace administrators can add, manage, and remove users"
        onAdd={onAdd}
        addButtonText="Add User"
        onFilter={handleFilterModalOpen}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="h-full space-y-4 p-4 max-sm:p-3">
        <div className="flex items-center justify-between gap-3">
          <UnifiedSearchBar
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={setSearchInput}
            className=""
          />
          <Field className="flex w-fit items-center gap-2 whitespace-nowrap" orientation="horizontal">
            <FieldLabel htmlFor="showDeletedUsers" className="">Show Deleted Users</FieldLabel>
            <Switch id="showDeletedUsers" checked={showDeleted} onCheckedChange={setShowDeleted} />
          </Field>
        </div>

        {/* Table */}
        <div className="relative overflow-hidden overflow-x-auto rounded-md bg-background">
          <DataTable<User, unknown>
            columns={userTableColumns}
            data={users}
            meta={{
              onRowClick: onViewDetails,
              onViewDetails,
              onEdit,
              onDelete,
              onRestore,
              onRoleChange: handleRoleChange,
              currentUserId: currentUser?.id,
              restoreUser,
              isRestoring,
            }}
            emptyMessage="No users found."
            isLoading={isLoading || searchInput !== debouncedSearch}
            loadingMessage={
              searchInput !== debouncedSearch
                ? 'Searching...'
                : 'Loading users...'
            }
          />
        </div>

        {/* Pagination */}
        {users.length > 0 && totalPages > 1 && (
          <Pagination
            pagination={{
              page,
              limit,
              totalCount: total,
              totalPages,
            }}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Filter Modal */}
      <UserFilterModal
        isOpen={isFilterModalOpen}
        onClose={handleFilterModalClose}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
}
