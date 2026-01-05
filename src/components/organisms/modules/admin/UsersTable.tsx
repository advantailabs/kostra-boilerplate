'use client';

import { RiMore2Fill } from '@remixicon/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { Badge } from '@/components/atom/Badge';
import { Button } from '@/components/atom/Button';
import { LoadingScreen } from '@/components/atom/LoadingScreen';
import { Switch } from '@/components/atom/Switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/molecules/common/Dropdown';
import { PageHeaderWithAction } from '@/components/molecules/common/PageHeaderWithAction';
import { Pagination } from '@/components/molecules/common/Pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/molecules/common/Select';
import { Table, TableBody, TableCell, TableRow } from '@/components/molecules/common/Table';
import { UnifiedSearchBar } from '@/components/molecules/common/UnifiedSearchBar';
import { UserFilterModal, UserFilters } from '@/components/molecules/common/UserFilterModal';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { ADMIN_ROLES, ROLES, UserRole } from '@/lib/constants/admin';
import { useAuthStore } from '@/store/auth';
import { User } from '@/types/user';

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

  // Map user role to display format
  const getUserRoleForDisplay = (role: string) => {
    return role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.USER;
  };

  // Check if user is the current user
  const isCurrentUser = (user: User) => {
    return Boolean(currentUser && user.id.toString() === currentUser.id.toString());
  };

  // Get plan badge variant
  const getPlanBadgeVariant = (plan: string) => {
    return plan === 'PRO' ? 'primary' : 'neutral';
  };

  // Get onboarding status badge variant
  const getOnboardingBadgeVariant = (isOnboarded: boolean) => {
    return isOnboarded ? 'success' : 'warning';
  };

  if (isLoading && !searchInput) {
    return <LoadingScreen message="Loading users..." />;
  }

  return (
    <div className={`min-h-screen bg-background ${className || ''}`}>
      <PageHeaderWithAction
        title="Users"
        description="Workspace administrators can add, manage, and remove users"
        onAdd={onAdd}
        addButtonText="Add User"
        onFilter={handleFilterModalOpen}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="h-full p-4 max-sm:p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <UnifiedSearchBar
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={setSearchInput}
            className="flex-1"
          />
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-sm text-text-muted">Show Deleted Users</span>
            <Switch checked={showDeleted} onCheckedChange={setShowDeleted} />
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-hidden overflow-x-auto rounded-xl bg-background shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)] before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)] dark:before:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.5)]">
          <Table className="border-0">
            <TableBody>
              {isLoading && searchInput !== debouncedSearch ? (
                <TableRow className="border-b border-border-light bg-background-light">
                  <TableCell colSpan={7} className="h-24 text-center !text-text-muted">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span className="text-sm text-text-muted">Searching...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow className="border-b border-border-light bg-background-light">
                  <TableCell colSpan={7} className="h-24 text-center !text-text-muted">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map(user => (
                  <TableRow
                    key={user.id}
                    className="group cursor-pointer select-text border-b border-border-light bg-background-light hover:bg-background"
                    onClick={() => onViewDetails(user)}
                  >
                    <TableCell className="p-4 text-text">
                      <div className="flex items-center gap-x-3 truncate">
                        {user.profilePicture ? (
                          <Image
                            src={user.profilePicture}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="size-8 shrink-0 rounded-full border border-border object-cover"
                          />
                        ) : (
                          <span
                            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs text-text"
                            aria-hidden="true"
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <div className="truncate">
                          <p className="truncate text-sm font-medium text-text">{user.name}</p>
                          <p className="truncate text-xs text-text-muted">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div onClick={e => e.stopPropagation()}>
                        <Select
                          defaultValue={getUserRoleForDisplay(user.role)}
                          disabled={isCurrentUser(user) || Boolean(user.deletedAt)}
                          onValueChange={value => handleRoleChange(user.id, value)}
                        >
                          <SelectTrigger className="h-8 w-24">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent align="end">
                            {ADMIN_ROLES.map(role => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <Badge variant={getPlanBadgeVariant(user.plan)}>{user.plan}</Badge>
                    </TableCell>
                    <TableCell className="p-4">
                      <Badge variant={getOnboardingBadgeVariant(user.isOnboarded)}>
                        {user.isOnboarded ? 'Onboarded' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="text-sm font-medium text-text">{user.credits} Credits</div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="text-xs text-text-muted">Joined:</div>
                      <div className="text-sm text-text-muted">
                        {user.createdAt && !Number.isNaN(new Date(user.createdAt).getTime())
                          ? new Date(user.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="group size-8 data-[state=open]:border-border data-[state=open]:bg-background hover:border hover:border-border hover:bg-background"
                              onClick={e => e.stopPropagation()}
                            >
                              <RiMore2Fill
                                className="size-4 shrink-0 text-text-muted group-hover:text-text"
                                aria-hidden="true"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={e => {
                                e.stopPropagation();
                                onViewDetails(user);
                              }}
                            >
                              View details
                            </DropdownMenuItem>
                            {user.deletedAt ? (
                              <DropdownMenuItem
                                onClick={async e => {
                                  e.stopPropagation();
                                  if (onRestore) {
                                    onRestore(user);
                                  } else {
                                    await restoreUser(user.id);
                                  }
                                }}
                              >
                                {isRestoring ? 'Restoring...' : 'Restore user'}
                              </DropdownMenuItem>
                            ) : (
                              <>
                                <DropdownMenuItem
                                  onClick={e => {
                                    e.stopPropagation();
                                    onEdit(user);
                                  }}
                                >
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-danger"
                                  disabled={isCurrentUser(user)}
                                  onClick={e => {
                                    e.stopPropagation();
                                    onDelete(user);
                                  }}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
