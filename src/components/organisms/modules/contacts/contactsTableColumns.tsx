'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Eye, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    CONTACT_PURPOSES,
    CONTACT_STATUSES,
    type ContactSubmission,
} from '@/types/contact';

export interface ContactTableMeta {
    onViewDetails?: (contact: ContactSubmission) => void;
    onDelete?: (contact: ContactSubmission) => void;
}

const VALID_BADGE_VARIANTS = [
    'default',
    'secondary',
    'destructive',
    'outline',
    'ghost',
    'link',
    'success',
    'warning',
    'error',
    'info',
] as const;

function getStatusBadgeVariant(
    variant: string | undefined
): React.ComponentProps<typeof Badge>['variant'] {
    if (variant && VALID_BADGE_VARIANTS.includes(variant as (typeof VALID_BADGE_VARIANTS)[number])) {
        return variant as React.ComponentProps<typeof Badge>['variant'];
    }
    return 'default';
}

export const contactsTableColumns: ColumnDef<ContactSubmission>[] = [
    {
        id: 'contact',
        header: 'Contact',
        accessorKey: 'name',
        cell: ({ row }) => {
            const s = row.original;
            return (
                <div className="truncate py-1 text-text">
                    <p className="truncate text-sm font-medium text-text">
                        {s.name || 'Unnamed Contact'}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                        {s.email || 'No email'}
                    </p>
                </div>
            );
        },
    },
    {
        id: 'purpose',
        header: 'Purpose',
        accessorKey: 'purpose',
        cell: ({ row }) => {
            const s = row.original;
            const purposeMeta = CONTACT_PURPOSES.find(
                x => x.value === (s.purpose as unknown as string)
            );
            return (
                <div className="py-1 text-text-muted">
                    <div className="text-sm text-text-muted">
                        {purposeMeta?.label || s.purpose}
                    </div>
                </div>
            );
        },
    },
    {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {
            const s = row.original;
            const statusMeta = CONTACT_STATUSES.find(
                x => x.value === (s.status as unknown as string)
            );
            const badgeVariant = getStatusBadgeVariant(statusMeta?.variant);
            return (
                <div className="py-1">
                    <Badge variant={badgeVariant}>
                        {statusMeta?.label || s.status}
                    </Badge>
                </div>
            );
        },
    },
    {
        id: 'submitted',
        header: 'Submitted',
        accessorKey: 'createdAt',
        cell: ({ row }) => {
            const createdAt = row.original.createdAt;
            const formatted =
                createdAt && !Number.isNaN(new Date(createdAt).getTime())
                    ? new Date(createdAt).toLocaleDateString()
                    : 'N/A';
            return (
                <div className="py-1">
                    <div className="text-sm text-text-muted">{formatted}</div>
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row, table }) => {
            const contact = row.original;
            const meta = table.options.meta as ContactTableMeta | undefined;
            return (
                <div
                    className="flex justify-end gap-2 py-1"
                    onClick={e => e.stopPropagation()}
                >
                    <Button
                        variant="ghost"
                        onClick={e => {
                            e.stopPropagation();
                            meta?.onViewDetails?.(contact);
                        }}
                        className="group size-8 hover:border hover:border-border hover:bg-background"
                    >
                        <Eye className="size-3.5 shrink-0" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={e => {
                            e.stopPropagation();
                            meta?.onDelete?.(contact);
                        }}
                        className="group size-8 hover:border hover:border-border hover:bg-background"
                    >
                        <Trash2 className="size-3.5 shrink-0 text-danger" />
                    </Button>
                </div>
            );
        },
        enableSorting: false,
    },
];
