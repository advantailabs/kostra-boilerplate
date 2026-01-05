'use client';

import { RiSearchLine } from '@remixicon/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { UserSelection, UserSelectionModalProps } from '@/types/user';
import { Button } from '../../atom/Button';
import { Input } from '../../atom/Input';
import { Modal } from './Modal';

export function UserSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  allUsers,
  selectedUsers,
  isLoading,
}: UserSelectionModalProps) {
  const [tempSelectedUsers, setTempSelectedUsers] = useState<UserSelection[]>(selectedUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeletedUsers, setShowDeletedUsers] = useState(false);
  const [debouncedSearch] = useDebounce(searchQuery, 300);

  // Update temp selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempSelectedUsers(selectedUsers);
    }
  }, [isOpen, selectedUsers]);

  // Filter users based on search and deleted status
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearch.toLowerCase());
    const isDeleted = user.deletedAt !== null;
    const showDeleted = showDeletedUsers || !isDeleted;

    return matchesSearch && showDeleted;
  });

  const handleUserToggle = (user: UserSelection) => {
    const isSelected = tempSelectedUsers.some(u => u.id === user.id);
    if (isSelected) {
      setTempSelectedUsers(tempSelectedUsers.filter(u => u.id !== user.id));
    } else {
      setTempSelectedUsers([...tempSelectedUsers, user]);
    }
  };

  const handleConfirm = () => {
    onConfirm(tempSelectedUsers);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const modalFooter = (
    <div className="flex justify-end gap-3 py-4">
      <Button type="button" variant="secondary" onClick={handleCancel}>
        Cancel
      </Button>
      <Button type="button" onClick={handleConfirm}>
        Confirm Selection ({tempSelectedUsers.length})
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Users"
      description="Choose users to include in this campaign"
      maxWidth="max-w-2xl"
      footer={modalFooter}
    >
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowDeletedUsers(!showDeletedUsers)}
            className={`rounded-md border px-3 py-2 text-sm transition-colors ${showDeletedUsers
              ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400'
              : 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
              }`}
          >
            {showDeletedUsers ? 'Hide Deleted' : 'Show Deleted'}
          </button>
        </div>

        <div className="scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600 max-h-96 overflow-y-auto p-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
          ) : (
            <>
              {filteredUsers.length > 0 ? (
                <div className="space-y-1">
                  {filteredUsers.map(user => {
                    const isSelected = tempSelectedUsers.some(u => u.id === user.id);
                    const isDeleted = user.deletedAt !== null;
                    return (
                      <div
                        key={user.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-md border border-gray-300 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 ${isDeleted ? 'opacity-60' : ''
                          }`}
                        onClick={() => !isDeleted && handleUserToggle(user)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (!isDeleted) {
                              handleUserToggle(user);
                            }
                          }
                        }}
                      >
                        <div className="flex h-4 w-4 items-center justify-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={isDeleted}
                            onChange={() => { }}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                          />
                        </div>
                        {user.profilePicture ? (
                          <Image
                            src={user.profilePicture}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-sm font-medium ${isDeleted
                                ? 'text-gray-500 dark:text-gray-400'
                                : 'text-gray-900 dark:text-gray-100'
                                }`}
                            >
                              {user.name}
                            </p>
                            {isDeleted && (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                                Deleted
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-xs ${isDeleted
                              ? 'text-gray-400 dark:text-gray-500'
                              : 'text-gray-500 dark:text-gray-400'
                              }`}
                          >
                            {user.email}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                  No users found
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
