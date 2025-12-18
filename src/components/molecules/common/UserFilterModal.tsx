'use client';

import { RiSortAsc, RiSortDesc } from '@remixicon/react';
import { useState } from 'react';

import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Modal } from '@/components/molecules/common/Modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/molecules/common/Select';
import { ADMIN_ROLES } from '@/lib/constants/admin';

export interface UserFilters {
  search?: string;
  sortBy?:
  | 'id'
  | 'name'
  | 'email'
  | 'role'
  | 'plan'
  | 'isOnboarded'
  | 'credits'
  | 'createdAt'
  | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  role?: 'USER' | 'ADMIN';
  plan?: 'FREE' | 'PRO';
  isOnboarded?: 'true' | 'false';
  includeDeleted?: boolean;
}

interface UserFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: UserFilters;
  onFiltersChange: (_filters: UserFilters) => void;
}

export function UserFilterModal({
  isOpen,
  onClose,
  filters: _filters,
  onFiltersChange,
}: UserFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<UserFilters>(_filters);

  const handleSearch = (value: string) => {
    setLocalFilters(prev => ({ ...prev, search: value }));
  };

  const handleSort = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setLocalFilters(prev => ({ ...prev, sortBy: sortBy as any, sortOrder }));
  };

  const handleFilter = (key: string, value: string) => {
    if (value === 'all') {
      setLocalFilters(prev => {
        const newFilters = { ...prev };
        delete newFilters[key as keyof UserFilters];
        return newFilters;
      });
    } else {
      setLocalFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleIncludeDeleted = (checked: boolean) => {
    setLocalFilters(prev => ({ ...prev, includeDeleted: checked }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: UserFilters = {
      sortBy: 'id',
      sortOrder: 'desc',
      includeDeleted: false,
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    onClose();
  };

  // Custom footer with reset and apply buttons
  const customFooter = (
    <div className="flex w-full gap-3">
      <Button variant="secondary" onClick={handleReset} className="flex-1">
        Reset
      </Button>
      <Button onClick={handleApply} className="flex-1">
        Apply Filters
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Users"
      description="Set filters to find the users you need"
      maxWidth="max-w-2xl"
      contentClassName="max-h-[90vh] overflow-y-auto"
      footer={customFooter}
    >
      {/* Search - Full Width */}
      <div className="mb-4">
        <label htmlFor="search-users" className="mb-2 block text-sm font-medium text-text">
          Search Users
        </label>
        <Input
          id="search-users"
          type="text"
          placeholder="Search users by name or email..."
          value={localFilters.search || ''}
          onChange={e => handleSearch(e.target.value)}
        />
      </div>

      {/* Two Column Layout for Filters */}
      <div className="mb-4 grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Role Filter */}
          <div>
            <label htmlFor="role-filter" className="mb-2 block text-sm font-medium text-text">
              Role
            </label>
            <Select
              value={localFilters.role || 'all'}
              onValueChange={value => handleFilter('role', value)}
              aria-label="Select role"
            >
              <SelectTrigger id="role-filter">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {ADMIN_ROLES.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Plan Filter */}
          <div>
            <label htmlFor="plan-filter" className="mb-2 block text-sm font-medium text-text">
              Plan
            </label>
            <Select
              value={localFilters.plan || 'all'}
              onValueChange={value => handleFilter('plan', value)}
              aria-label="Select plan"
            >
              <SelectTrigger id="plan-filter">
                <SelectValue placeholder="All plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All plans</SelectItem>
                <SelectItem value="FREE">Free</SelectItem>
                <SelectItem value="PRO">Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Onboarding Status Filter */}
          <div>
            <label htmlFor="onboarding-filter" className="mb-2 block text-sm font-medium text-text">
              Onboarding Status
            </label>
            <Select
              value={localFilters.isOnboarded || 'all'}
              onValueChange={value => handleFilter('isOnboarded', value)}
              aria-label="Select onboarding status"
            >
              <SelectTrigger id="onboarding-filter">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="true">Onboarded</SelectItem>
                <SelectItem value="false">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Include Deleted Users */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="include-deleted"
              checked={localFilters.includeDeleted || false}
              onChange={e => handleIncludeDeleted(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="include-deleted" className="text-sm font-medium text-text">
              Include deleted users
            </label>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Sort Options */}
          <div>
            <label htmlFor="sort-by-filter" className="mb-2 block text-sm font-medium text-text">
              Sort By
            </label>
            <Select
              value={localFilters.sortBy || 'id'}
              onValueChange={value => handleSort(value, localFilters.sortOrder || 'desc')}
              aria-label="Select sort by"
            >
              <SelectTrigger id="sort-by-filter">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="role">Role</SelectItem>
                <SelectItem value="plan">Plan</SelectItem>
                <SelectItem value="isOnboarded">Onboarding Status</SelectItem>
                <SelectItem value="credits">Credits</SelectItem>
                <SelectItem value="createdAt">Date Created</SelectItem>
                <SelectItem value="updatedAt">Last Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="sort-order-button" className="mb-2 block text-sm font-medium text-text">
              Sort Order
            </label>
            <Button
              id="sort-order-button"
              variant="secondary"
              onClick={() =>
                handleSort(
                  localFilters.sortBy || 'id',
                  localFilters.sortOrder === 'asc' ? 'desc' : 'asc'
                )
              }
              className="flex w-full items-center justify-center gap-2"
            >
              {localFilters.sortOrder === 'asc' ? (
                <RiSortAsc className="h-4 w-4" />
              ) : (
                <RiSortDesc className="h-4 w-4" />
              )}
              {localFilters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
