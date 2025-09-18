'use client';

import { RiMore2Fill } from '@remixicon/react';
import { useState } from 'react';

import { Button } from '@/components/atom/Button';
import { LoadingScreen } from '@/components/atom/LoadingScreen';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/molecules/common/Dropdown';
import { PageHeaderWithAction } from '@/components/molecules/common/PageHeaderWithAction';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/molecules/common/Select';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { ADMIN_ROLES, ROLES, UserRole } from '@/lib/constants/admin';
import { useAuthStore } from '@/store/auth';
import { User } from '@/types/user';
import { ModalAddUser } from './ModalAddUser';
import { ModalDeleteUser } from './ModalDeleteUser';
import { ModalEditUser } from './ModalEditUser';
import { ModalUserDetails } from './ModalUserDetails';

interface UsersPageProps {
  className?: string;
}

export function UsersPage({ className }: UsersPageProps) {
  const { users, isLoading, updateUser } = useAdminUsers();
  const { user: currentUser } = useAuthStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedUser(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

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

  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  if (isLoading || !currentUser) {
    return <LoadingScreen message="Loading users..." />;
  }

  return (
    <div className={className || ''}>
      <PageHeaderWithAction
        title="Users"
        description="Workspace administrators can add, manage, and remove users"
        onAdd={handleAddUser}
        addButtonText="Add User"
      />

      <div className="h-full p-4 max-sm:p-3">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-800">
          {users.map(user => (
            <li key={user.id} className="flex items-center justify-between gap-x-6 py-2.5">
              <div className="flex items-center gap-x-4 truncate">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="size-9 shrink-0 rounded-full border border-gray-300 object-cover dark:border-gray-800"
                  />
                ) : (
                  <span
                    className="hidden size-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 sm:flex dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
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
              <div className="flex items-center gap-2">
                <Select
                  defaultValue={getUserRoleForDisplay(user.role)}
                  disabled={isCurrentUser(user)}
                  onValueChange={value => handleRoleChange(user.id, value)}
                >
                  <SelectTrigger className="h-8 w-32">
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="group size-8 hover:border hover:border-gray-300 hover:bg-gray-50 data-[state=open]:border-gray-300 data-[state=open]:bg-gray-50 hover:dark:border-gray-700 hover:dark:bg-gray-900 data-[state=open]:dark:border-gray-700 data-[state=open]:dark:bg-gray-900"
                    >
                      <RiMore2Fill
                        className="size-4 shrink-0 text-gray-500 group-hover:text-gray-700 group-hover:dark:text-gray-400"
                        aria-hidden="true"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem onClick={() => handleViewUserDetails(user)}>
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 dark:text-red-500"
                      disabled={isCurrentUser(user)}
                      onClick={() => handleDeleteUser(user)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ModalAddUser isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <ModalDeleteUser
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        user={selectedUser}
      />
      <ModalUserDetails
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        user={selectedUser}
      />
      <ModalEditUser isOpen={isEditModalOpen} onClose={handleCloseEditModal} user={selectedUser} />
    </div>
  );
}
