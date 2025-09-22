'use client';

import { RiMore2Fill } from '@remixicon/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { Badge } from '@/components/atom/Badge';
import { Button } from '@/components/atom/Button';
import { LoadingScreen } from '@/components/atom/LoadingScreen';
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
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { ADMIN_ROLES, ROLES, UserRole } from '@/lib/constants/admin';
import { useAuthStore } from '@/store/auth';
import { User } from '@/types/user';

interface UsersTableProps {
  onEdit: (_user: User) => void;
  onDelete: (_user: User) => void;
  onViewDetails: (_user: User) => void;
  onAdd: () => void;
  onPageChange?: (_page: number) => void;
  className?: string;
}

export function UsersTable({
  onEdit,
  onDelete,
  onViewDetails,
  onAdd,
  onPageChange,
  className,
}: UsersTableProps) {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 400);

  const { users, isLoading, updateUser } = useAdminUsers({ search: debouncedSearch });
  const { user: currentUser } = useAuthStore();

  // For now, we'll simulate pagination on the client side since the API doesn't support it
  const total = users.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = users.slice(startIndex, endIndex);

  // Handle smart pagination after deletion
  useEffect(() => {
    // If current page is empty and we're not on page 1, go to previous page
    if (paginatedUsers.length === 0 && page > 1 && !isLoading && totalPages > 1) {
      setPage(page - 1);
    }
  }, [paginatedUsers.length, page, isLoading, totalPages]);

  // Notify parent of page changes
  useEffect(() => {
    if (onPageChange) {
      onPageChange(page);
    }
  }, [page, onPageChange]);

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await updateUser({ userId, userData: { role: newRole as UserRole } });
    } catch (error) {
      // Error handling is done in the hook
    }
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
    <div className={`min-h-screen bg-white dark:bg-gray-950 ${className || ''}`}>
      <PageHeaderWithAction
        title="Users"
        description="Workspace administrators can add, manage, and remove users"
        onAdd={onAdd}
        addButtonText="Add User"
      />

      <div className="h-full p-4 max-sm:p-3">
        <UnifiedSearchBar
          placeholder="Search by name or email..."
          value={searchInput}
          onChange={setSearchInput}
          className="mb-2"
        />

        {/* Table */}
        <div className="relative overflow-hidden overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <Table className="border-0">
            <TableBody>
              {isLoading && searchInput !== debouncedSearch ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                      <span className="text-sm text-gray-500">Searching...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map(user => (
                  <TableRow
                    key={user.id}
                    className="group cursor-pointer select-none hover:bg-gray-50 hover:dark:bg-gray-900"
                    onClick={() => onViewDetails(user)}
                  >
                    <TableCell className="p-4 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-x-3 truncate">
                        {user.profilePicture ? (
                          <Image
                            src={user.profilePicture}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="size-8 shrink-0 rounded-full border border-gray-300 object-cover dark:border-gray-800"
                          />
                        ) : (
                          <span
                            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
                            aria-hidden="true"
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <div className="truncate">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                            {user.name}
                          </p>
                          <p className="truncate text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-4">
                      <div onClick={e => e.stopPropagation()}>
                        <Select
                          defaultValue={getUserRoleForDisplay(user.role)}
                          disabled={isCurrentUser(user)}
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
                    <TableCell className="p-4 text-gray-600 dark:text-gray-400">
                      <div className="text-sm font-medium">{user.credits} Credits</div>
                    </TableCell>
                    <TableCell className="p-4 text-gray-600 dark:text-gray-400">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Joined:</div>
                      <div className="text-sm">
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
                              className="group size-8 data-[state=open]:border-gray-300 data-[state=open]:bg-gray-50 hover:border hover:border-gray-300 hover:bg-gray-50 data-[state=open]:dark:border-gray-700 data-[state=open]:dark:bg-gray-900 hover:dark:border-gray-700 hover:dark:bg-gray-900"
                              onClick={e => e.stopPropagation()}
                            >
                              <RiMore2Fill
                                className="size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-hover:dark:text-gray-400"
                                aria-hidden="true"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem
                              onClick={e => {
                                e.stopPropagation();
                                onViewDetails(user);
                              }}
                            >
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={e => {
                                e.stopPropagation();
                                onEdit(user);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 dark:text-red-500"
                              disabled={isCurrentUser(user)}
                              onClick={e => {
                                e.stopPropagation();
                                onDelete(user);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
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
        {paginatedUsers.length > 0 && totalPages > 1 && (
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
    </div>
  );
}
