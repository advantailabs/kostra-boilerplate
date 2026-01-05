'use client';

import { RiDeleteBinLine, RiEyeLine, RiPencilLine } from '@remixicon/react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { PageHeaderWithAction } from '@/components/molecules/common/PageHeaderWithAction';
import { CampaignStatus } from '@/lib/prisma/generated/browser';
import { CampaignWithRelations } from '@/types/campaign';
import { Badge, BadgeProps } from '../../../atom/Badge';
import { Button } from '../../../atom/Button';
import { Pagination } from '../../../molecules/common/Pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../molecules/common/Select';
import { Table, TableBody, TableCell, TableRow } from '../../../molecules/common/Table';
import { UnifiedSearchBar } from '../../../molecules/common/UnifiedSearchBar';

// Shared helper: map campaign status to badge variant
const getStatusBadgeVariant = (status: string): BadgeProps['variant'] => {
  switch (status) {
    case 'SENT':
      return 'success';
    case 'SCHEDULED':
      return 'warning';
    case 'FAILED':
      return 'error';
    case 'PARTIALLYSUCCESS':
      return 'info';
    default:
      return 'default';
  }
};

// Component for mobile campaign card
interface MobileCampaignCardProps {
  campaign: CampaignWithRelations;
  onEdit: (_campaign: CampaignWithRelations) => void;
  onDelete: (_campaignId: number, _campaignName: string) => void;
  onView: (_campaignId: number) => void;
}

function MobileCampaignCard({ campaign, onEdit, onDelete, onView }: MobileCampaignCardProps) {
  const formatScheduledDate = (scheduledAt: Date | null) => {
    if (!scheduledAt) return '-';
    return new Date(scheduledAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

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
            <RiEyeLine size={16} className="text-blue-600 dark:text-blue-400" />
          </Button>
          <Button
            variant="ghost"
            onClick={handleEdit}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <RiPencilLine size={16} className="text-gray-600 " />
          </Button>
          <Button
            variant="ghost"
            onClick={handleDelete}
            className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
          >
            <RiDeleteBinLine size={16} className="text-red-600 dark:text-red-400" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 ">Status:</span>
          <Badge variant={getStatusBadgeVariant(campaign.status)}>
            {(() => {
              switch (campaign.status) {
                case 'SENT':
                  return 'Sent';
                case 'SCHEDULED':
                  return 'Scheduled';
                case 'FAILED' as CampaignStatus:
                  return 'Failed';
                case 'PARTIALLYSUCCESS' as CampaignStatus:
                  return 'Partial Success';
                default:
                  return 'Draft';
              }
            })()}
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

// Component for individual table row
interface EmailCampaignRowProps {
  campaign: CampaignWithRelations;
  onEdit: (_campaign: CampaignWithRelations) => void;
  onDelete: (_campaignId: number, _campaignName: string) => void;
  onView: (_campaignId: number) => void;
}

function EmailCampaignRow({ campaign, onEdit, onDelete, onView }: EmailCampaignRowProps) {
  const formatScheduledDate = (scheduledAt: Date | null) => {
    if (!scheduledAt) return '-';
    return new Date(scheduledAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

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
    <TableRow
      key={campaign.id}
      className="group cursor-pointer select-text border-b border-border-light bg-background-light hover:bg-background !text-text-muted"
    >
      <TableCell className="py-6 text-gray-700 dark:text-gray-300">
        <div className="truncate">
          <p className="cursor-pointer truncate text-sm font-semibold text-gray-900 hover:text-blue-800 dark:text-gray-50 dark:hover:text-blue-300">
            {campaign.name}
          </p>
        </div>
      </TableCell>
      <TableCell className="py-3">
        <Badge variant={getStatusBadgeVariant(campaign.status)}>
          {(() => {
            switch (campaign.status) {
              case 'SENT':
                return 'Sent';
              case 'SCHEDULED':
                return 'Scheduled';
              case 'FAILED' as CampaignStatus:
                return 'Failed';
              case 'PARTIALLYSUCCESS' as CampaignStatus:
                return 'Partial Success';
              default:
                return 'Draft';
            }
          })()}
        </Badge>
      </TableCell>

      <TableCell className="py-3 text-gray-600 ">
        <div className="truncate text-sm">{campaign.emailTemplate.name}</div>
      </TableCell>
      <TableCell className="py-3 text-gray-600 ">
        <div className="text-sm">{campaign.recipients.length}</div>
      </TableCell>
      <TableCell className="py-3 text-gray-600 ">
        <div className="text-sm">{formatScheduledDate(campaign.scheduledAt)}</div>
      </TableCell>
      <TableCell className="py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            onClick={handleView}
            className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
          >
            <RiEyeLine size={16} className="text-blue-600 dark:text-blue-400" />
          </Button>
          <Button
            variant="ghost"
            onClick={handleEdit}
            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <RiPencilLine size={16} className="text-text-muted " />
          </Button>
          <Button
            variant="ghost"
            onClick={handleDelete}
            className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
          >
            <RiDeleteBinLine size={16} className="text-red-600 dark:text-red-400" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
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
  const [filterStatus, setFilterStatus] = useState<'ALL' | CampaignStatus>('ALL');

  // Fix for dropdown closing issues
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Force close and blur any active elements
      setTimeout(() => {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }
      }, 0);
    }
  };

  const selectContentProps = {
    position: 'popper' as const,
    sideOffset: 4,
    className: 'z-50',
    onCloseAutoFocus: (e: Event) => e.preventDefault(),
  };

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
    <div className={`min-h-screen overflow-x-hidden bg-background ${className || ''}`}>
      <PageHeaderWithAction
        title="Email Campaigns"
        description="Manage your email marketing campaigns"
        onAdd={onAdd}
        addButtonText="New Campaign"
        actions={
          <div className="flex items-center gap-2">
            <Select
              value={filterStatus}
              onValueChange={(value: 'ALL' | CampaignStatus) => setFilterStatus(value)}
              onOpenChange={handleOpenChange}
            >
              <SelectTrigger className="w-40 min-w-0">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent {...selectContentProps}>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="PARTIALLYSUCCESS">Partial Success</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />
      <div className="h-full p-4 max-sm:p-3">
        {/* Mobile controls: Status + New Campaign (only on small screens) */}
        <div className="mb-4 flex flex-col gap-3 sm:hidden">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status:
              </label>
              <Select
                value={filterStatus}
                onValueChange={(value: 'ALL' | CampaignStatus) => setFilterStatus(value)}
                onOpenChange={handleOpenChange}
              >
                <SelectTrigger className="w-40 min-w-0">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent {...selectContentProps}>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="SENT">Sent</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="PARTIALLYSUCCESS">Partial Success</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={onAdd} className="w-auto shrink-0 justify-center px-4 py-2">
              + New Campaign
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-2">
          <UnifiedSearchBar
            placeholder="Search by name..."
            value={searchInput}
            onChange={setSearchInput}
            className="flex-1"
          />
        </div>

        {/* Desktop Table */}
        <div className="relative hidden overflow-hidden overflow-x-auto bg-background rounded-lg md:block table-cell-box-shadow dark:border-gray-800 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)] before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)] dark:before:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.5)]">
          <Table className="min-w-full border-0">
            <TableBody>
              {(() => {
                if (isLoading) {
                  return (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center bg-white dark:bg-background-light">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          <span className="text-sm text-gray-500">Loading email campaigns...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
                if (searchInput !== debouncedSearch) {
                  return (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center bg-white dark:bg-background-light">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          <span className="text-sm text-gray-500">Searching...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
                if (paginatedCampaigns.length === 0) {
                  return (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center bg-white dark:bg-background-light">
                        No email campaigns found.
                      </TableCell>
                    </TableRow>
                  );
                }
                return paginatedCampaigns.map(campaign => (
                  <EmailCampaignRow
                    key={campaign.id}
                    campaign={campaign}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                  />
                ));
              })()}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card Layout */}
        <div className="space-y-3 md:hidden">
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
        </div>

        {/* Pagination */}
        {paginatedCampaigns.length > 0 && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center text-sm text-gray-500 sm:text-left ">
              Showing {startIndex + 1} to {Math.min(endIndex, total)} of {total} results
            </div>
            <div className="flex justify-center sm:justify-end">
              <Pagination
                pagination={{
                  page,
                  limit,
                  totalCount: total,
                  totalPages,
                }}
                onPageChange={setPage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
