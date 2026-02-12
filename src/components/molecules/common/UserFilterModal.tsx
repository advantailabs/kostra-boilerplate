'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import { useState } from 'react';

import { Modal } from '@/components/molecules/common/Modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ADMIN_ROLES } from '@/lib/constants/admin';

const ROLE_OPTIONS = [
  { value: 'all', label: 'All roles' },
  ...ADMIN_ROLES,
];

const PLAN_OPTIONS = [
  { value: 'all', label: 'All plans' },
  { value: 'FREE', label: 'Free' },
  { value: 'PRO', label: 'Pro' },
];

const ONBOARDING_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'true', label: 'Onboarded' },
  { value: 'false', label: 'Pending' },
];

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

const SORT_BY_OPTIONS: { value: UserFilters['sortBy']; label: string }[] = [
  { value: 'id', label: 'ID' },
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'role', label: 'Role' },
  { value: 'plan', label: 'Plan' },
  { value: 'isOnboarded', label: 'Onboarding Status' },
  { value: 'credits', label: 'Credits' },
  { value: 'createdAt', label: 'Date Created' },
  { value: 'updatedAt', label: 'Last Updated' },
];

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

  const handleSort = (sortBy: UserFilters["sortBy"], sortOrder: UserFilters["sortOrder"]) => {
    setLocalFilters(prev => ({ ...prev, sortBy, sortOrder }));
  };

  const handleFilter = (key: keyof UserFilters, value: string) => {
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
      maxWidth="max-w-2xl!"
      contentClassName="max-h-[90vh] overflow-y-auto"
      footer={customFooter}
    >
      {/* Search - Full Width */}
      <div className="mb-4">
        <Field>
          <FieldLabel htmlFor="search-users">Search Users</FieldLabel>
          <Input
            id="search-users"
            type="text"
            placeholder="Search users by name or email..."
            value={localFilters.search || ''}
            onChange={e => handleSearch(e.target.value)}
          />
        </Field>
      </div>

      {/* Two Column Layout for Filters */}
      <div className="mb-4 grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Role Filter */}
          <Field>
            <FieldLabel htmlFor="role-filter">Role</FieldLabel>
            <Combobox
              id="role-filter"
              items={ROLE_OPTIONS}
              value={ROLE_OPTIONS.find(o => o.value === (localFilters.role ?? 'all'))}
              onValueChange={item => handleFilter('role', item?.value ?? 'all')}
              itemToStringValue={item => item.label}
            >
              <ComboboxInput placeholder="All roles" />
              <ComboboxContent className="pointer-events-auto">
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>

          {/* Plan Filter */}
          <Field>
            <FieldLabel htmlFor="plan-filter">Plan</FieldLabel>
            <Combobox
              id="plan-filter"
              items={PLAN_OPTIONS}
              value={PLAN_OPTIONS.find(o => o.value === (localFilters.plan ?? 'all'))}
              onValueChange={item => handleFilter('plan', item?.value ?? 'all')}
              itemToStringValue={item => item.label}
            >
              <ComboboxInput placeholder="All plans" />
              <ComboboxContent className="pointer-events-auto">
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>

          {/* Onboarding Status Filter */}
          <Field>
            <FieldLabel htmlFor="onboarding-filter">Onboarding Status</FieldLabel>
            <Combobox
              id="onboarding-filter"
              items={ONBOARDING_OPTIONS}
              value={ONBOARDING_OPTIONS.find(o => o.value === (localFilters.isOnboarded ?? 'all'))}
              onValueChange={item => handleFilter('isOnboarded', item?.value ?? 'all')}
              itemToStringValue={item => item.label}
            >
              <ComboboxInput placeholder="All statuses" />
              <ComboboxContent className="pointer-events-auto">
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>

          {/* Include Deleted Users */}
          <Field orientation="horizontal" className="flex-row items-center gap-2">
            <Checkbox
              id="include-deleted"
              checked={localFilters.includeDeleted ?? false}
              onCheckedChange={checked => handleIncludeDeleted(!!checked)}
            />
            <FieldLabel htmlFor="include-deleted">Include deleted users</FieldLabel>
          </Field>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Sort Options */}
          <Field>
            <FieldLabel htmlFor="sort-by-filter">Sort By</FieldLabel>
            <Combobox
              id="sort-by-filter"
              items={SORT_BY_OPTIONS}
              value={SORT_BY_OPTIONS.find(o => o.value === (localFilters.sortBy ?? 'id'))}
              onValueChange={item => {
                if (item?.value) {
                  handleSort(item.value, localFilters.sortOrder ?? 'desc');
                }
              }}
              itemToStringValue={item => item.label}
            >
              <ComboboxInput placeholder="Sort by" />
              <ComboboxContent className="pointer-events-auto">
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>

          <Field>
            <FieldLabel htmlFor="sort-order-button">Sort Order</FieldLabel>
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
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              {localFilters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </Field>
        </div>
      </div>
    </Modal>
  );
}
