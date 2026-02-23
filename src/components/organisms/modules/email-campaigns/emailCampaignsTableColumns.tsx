'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil, Trash2 } from 'lucide-react';

import { type BadgeProps } from '@/components/atom/Badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CampaignWithRelations } from '@/types/campaign';

export interface EmailCampaignTableMeta {
  onView?: (campaignId: number) => void;
  onEdit?: (campaign: CampaignWithRelations) => void;
  onDelete?: (campaignId: number, campaignName: string) => void;
}

// --- Helpers (exported for use in table and mobile cards) ---

export function getStatusBadgeVariant(status: string): BadgeProps['variant'] {
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
}

export function formatCampaignStatusText(status: string): string {
  switch (status) {
    case 'SENT':
      return 'Sent';
    case 'SCHEDULED':
      return 'Scheduled';
    case 'FAILED':
      return 'Failed';
    case 'PARTIALLYSUCCESS':
      return 'Partial Success';
    default:
      return 'Draft';
  }
}

export function formatScheduledDate(scheduledAt: Date | null): string {
  if (!scheduledAt) return '-';
  return new Date(scheduledAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// --- Column definitions ---

export const emailCampaignsTableColumns: ColumnDef<CampaignWithRelations>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const campaign = row.original;
      return (
        <div className="truncate py-1 text-gray-700 dark:text-gray-300">
          <p className="cursor-pointer truncate text-sm font-semibold text-gray-900 hover:text-blue-800 dark:text-gray-50 dark:hover:text-blue-300">
            {campaign.name}
          </p>
        </div>
      );
    },
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      const campaign = row.original;
      return (
        <Badge variant={getStatusBadgeVariant(campaign.status)}>
          {formatCampaignStatusText(campaign.status)}
        </Badge>
      );
    },
  },
  {
    id: 'template',
    header: 'Template',
    accessorFn: row => row.emailTemplate.name,
    cell: ({ row }) => (
      <div className="truncate py-1 text-sm text-text-muted">
        {row.original.emailTemplate.name}
      </div>
    ),
  },
  {
    id: 'recipients',
    header: 'Recipients',
    accessorFn: row => row.recipients.length,
    cell: ({ row }) => (
      <div className="py-1 text-sm text-text-muted">
        {row.original.recipients.length}
      </div>
    ),
  },
  {
    id: 'scheduled',
    header: 'Scheduled',
    accessorFn: row => row.scheduledAt,
    cell: ({ row }) => (
      <div className="py-1 text-sm text-text-muted">
        {formatScheduledDate(row.original.scheduledAt)}
      </div>
    ),
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row, table }) => {
      const campaign = row.original;
      const meta = table.options.meta as EmailCampaignTableMeta | undefined;

      const handleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        meta?.onView?.(campaign.id);
      };

      const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        meta?.onEdit?.(campaign);
      };

      const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        meta?.onDelete?.(campaign.id, campaign.name);
      };

      return (
        <div
          className="flex items-center justify-end gap-2 py-1 text-right"
          onClick={e => e.stopPropagation()}
        >
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
            <Pencil size={16} className="text-text-muted" />
          </Button>
          <Button
            variant="ghost"
            onClick={handleDelete}
            className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
          >
            <Trash2 size={16} className="text-red-600 dark:text-red-400" />
          </Button>
        </div>
      );
    },
    enableSorting: false,
  },
];
