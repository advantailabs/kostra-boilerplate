'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { Badge } from '@/components/atom/Badge';
import { PageHeaderWithAction } from '@/components/molecules/common/PageHeaderWithAction';
import { Button } from '@/components/ui/button';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { DataTable } from '@/components/ui/data-table';
import { CampaignStatus } from '@/lib/prisma/generated/browser';
import { CampaignWithRelations } from '@/types/campaign';
import { Pagination } from '../../../molecules/common/Pagination';
import { UnifiedSearchBar } from '../../../molecules/common/UnifiedSearchBar';

import {
  emailCampaignsTableColumns,
  formatCampaignStatusText,
  formatScheduledDate,
  getStatusBadgeVariant,
} from './emailCampaignsTableColumns';

type StatusFilterValue = 'ALL' | CampaignStatus | 'DRAFT';
const STATUS_OPTIONS: { value: StatusFilterValue; label: string }[] = [
  { value: 'ALL', label: 'All Status' },
  { value: 'SENT', label: 'Sent' },
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'PARTIALLYSUCCESS', label: 'Partial Success' },
  { value: 'DRAFT', label: 'Draft' },
];

// Component for mobile campaign card
interface MobileCampaignCardProps {
  campaign: CampaignWithRelations;
  onEdit: (_campaign: CampaignWithRelations) => void;
  onDelete: (_campaignId: number, _campaignName: string) => void;
  onView: (_campaignId: number) => void;
}

function MobileCampaignCard({ campaign, onEdit, onDelete, onView }: MobileCampaignCardProps) {
  const handleEdit = () => {
    onEdit(campaign);
  };

  const handleDelete = () => {
    onDelete(campaign.id, campaign.name);
  };

  const handleView = () => {
    onView(campaign.id);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="cursor-pointer truncate text-sm font-semibold text-gray-900 hover:text-blue-800 dark:text-gray-50 dark:hover:text-blue-300">
            {campaign.name}
          </h3>
        </div>
        <div className="ml-2 flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleView}
            className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
          >
            <Eye size={16} className="text-blue-600 dark:text-blue-400" />
          </Button>
          <Button
            variant="ghost"
            onClick={handleEdit}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Pencil size={16} className="text-gray-600 " />
          </Button>
          <Button
            variant="ghost"
            onClick={handleDelete}
            className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
          >
            <Trash2 size={16} className="text-red-600 dark:text-red-400" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 ">Status:</span>
          <Badge variant={getStatusBadgeVariant(campaign.status)}>
            {formatCampaignStatusText(campaign.status)}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 ">Template:</span>
          <span className="ml-2 truncate text-xs text-gray-600 ">
            {campaign.emailTemplate.name}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 ">Recipients:</span>
          <span className="text-xs text-gray-600 ">
            {campaign.recipients.length}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 ">Scheduled:</span>
          <span className="text-xs text-gray-600 ">
            {formatScheduledDate(campaign.scheduledAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

interface EmailCampaignsTableProps {
  onEdit: (_campaign: CampaignWithRelations) => void;
  onDelete: (_campaignId: number, _campaignName: string) => void;
  onView: (_campaignId: number) => void;
  onAdd: () => void;
  onPageChange?: (_page: number) => void;
  campaigns: CampaignWithRelations[];
  isLoading?: boolean;
  error?: Error | null;
  className?: string;
}

export function EmailCampaignsTable({
  onEdit,
  onDelete,
  onView,
  onAdd,
  onPageChange,
  campaigns,
  isLoading = false,
  error: _error = null,
  className,
}: EmailCampaignsTableProps) {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 400);
  const [filterStatus, setFilterStatus] = useState<StatusFilterValue>('ALL');

  // Filter campaigns based on search and status
  const filteredCampaigns = (campaigns || []).filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(debouncedSearch.toLowerCase());

    const matchesStatus = filterStatus === 'ALL' || campaign.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const total = filteredCampaigns.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);

  // Handle smart pagination after deletion
  if (paginatedCampaigns.length === 0 && page > 1 && !isLoading && totalPages >= 1) {
    setPage(prev => Math.max(1, prev - 1));
  }


  // Notify parent of page changes
  useEffect(() => {
    if (onPageChange) {
      onPageChange(page);
    }
  }, [page, onPageChange]);

  return (
    <div className={`min-h-screen overflow-x-hidden ${className || ''}`}>
      <PageHeaderWithAction
        title="Email Campaigns"
        description="Manage your email marketing campaigns"
        onAdd={onAdd}
        addButtonText="New Campaign"
        actions={
          <div className="flex items-center gap-2">
            <Combobox
              items={STATUS_OPTIONS}
              value={
                STATUS_OPTIONS.find((o) => o.value === filterStatus) ?? STATUS_OPTIONS[0]
              }
              onValueChange={(item) => setFilterStatus(item?.value ?? 'ALL')}
              itemToStringValue={(item) => item.label}
            >
              <ComboboxInput placeholder="All Status" className="w-40 min-w-0" />
              <ComboboxContent>
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
          </div>
        }
      />
      <div className="h-full space-y-4 p-4 max-sm:p-3">
        {/* Mobile controls: Status + New Campaign (only on small screens) */}
        <div className="mb-4 flex flex-col gap-3 sm:hidden">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status:
              </label>
              <Combobox
                items={STATUS_OPTIONS}
                value={
                  STATUS_OPTIONS.find((o) => o.value === filterStatus) ?? STATUS_OPTIONS[0]
                }
                onValueChange={(item) => setFilterStatus(item?.value ?? 'ALL')}
                itemToStringValue={(item) => item.label}
              >
                <ComboboxInput placeholder="All Status" className="w-40 min-w-0" />
                <ComboboxContent>
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
            </div>
            <Button onClick={onAdd} className="w-auto shrink-0 justify-center px-4 py-2">
              + New Campaign
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="">
          <UnifiedSearchBar
            placeholder="Search by name..."
            value={searchInput}
            onChange={setSearchInput}
            className="flex-1"
          />
        </div>

        {/* Desktop Table */}
        <div className="relative overflow-hidden overflow-x-auto rounded-md bg-background">
          <DataTable<CampaignWithRelations, unknown>
            columns={emailCampaignsTableColumns}
            data={paginatedCampaigns}
            meta={{ onView, onEdit, onDelete }}
            emptyMessage="No email campaigns found."
            isLoading={isLoading || searchInput !== debouncedSearch}
            loadingMessage={
              searchInput !== debouncedSearch ? 'Searching...' : 'Loading email campaigns...'
            }
          />
        </div>

        {/* Mobile Card Layout */}
        {/*  <div className="space-y-3 md:hidden">
          {(() => {
            if (isLoading) {
              return (
                <div className="flex h-24 items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="text-sm text-gray-500">Loading email campaigns...</span>
                </div>
              );
            }
            if (searchInput !== debouncedSearch) {
              return (
                <div className="flex h-24 items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="text-sm text-gray-500">Searching...</span>
                </div>
              );
            }
            if (paginatedCampaigns.length === 0) {
              return (
                <div className="flex h-24 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800">
                  <span className="text-sm text-gray-500">No email campaigns found.</span>
                </div>
              );
            }
            return paginatedCampaigns.map(campaign => (
              <MobileCampaignCard
                key={campaign.id}
                campaign={campaign}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ));
          })()}
        </div> */}

        {/* Pagination */}
        {paginatedCampaigns.length > 0 && (
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
