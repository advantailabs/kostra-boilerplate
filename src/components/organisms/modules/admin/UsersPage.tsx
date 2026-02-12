'use client';

import { useState } from 'react';

import { LoadingScreen } from '@/components/atom/LoadingScreen';
import { useAuthStore } from '@/store/auth';
import { User } from '@/types/user';
import { ModalAddUser } from './ModalAddUser';
import { ModalDeleteUser } from './ModalDeleteUser';
import { ModalEditUser } from './ModalEditUser';
import { ModalRestoreUser } from './ModalRestoreUser';
import { ModalUserDetails } from './ModalUserDetails';
import { UsersTable } from './UsersTable';

interface UsersPageProps {
  className?: string;
}

export function UsersPage({ className }: UsersPageProps) {
  const { user: currentUser } = useAuthStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleRestoreUser = (user: User) => {
    setSelectedUser(user);
    setIsRestoreModalOpen(true);
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

  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  if (!currentUser) {
    return <LoadingScreen message="Loading users..." />;
  }

  return (
    <div className={className || ''}>
      <UsersTable
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onViewDetails={handleViewUserDetails}
        onAdd={handleAddUser}
        onRestore={handleRestoreUser}
      />

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
      <ModalEditUser isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        user={selectedUser}
        key={selectedUser ? selectedUser.id : ''}
      />
      <ModalRestoreUser
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
