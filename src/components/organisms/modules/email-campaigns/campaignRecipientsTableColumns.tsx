'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { type BadgeProps } from '@/components/atom/Badge';
import { Badge } from '@/components/ui/badge';

import { CampaignRecipientWithUserSimple } from '@/types/campaign';

export type CampaignRecipientTableRow = CampaignRecipientWithUserSimple;

export interface CampaignRecipientTableMeta {
    errorMessages?: Record<number, string>;
}

// --- Helpers (exported for use in modal mobile cards) ---

export function getRecipientStatusBadgeVariant(
    status: string,
): BadgeProps['variant'] {
    switch (status) {
        case 'SENT':
        case 'OPENED':
        case 'CLICKED':
            return 'success';
        case 'FAILED':
            return 'error';
        case 'PENDING':
            return 'warning';
        default:
            return 'default';
    }
}

export function formatStatusText(status: string): string {
    switch (status) {
        case 'SENT':
            return 'Sent';
        case 'OPENED':
            return 'Opened';
        case 'CLICKED':
            return 'Clicked';
        case 'FAILED':
            return 'Failed';
        case 'PENDING':
            return 'Pending';
        default:
            return status;
    }
}

export function formatDate(date: Date | string | null): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
}

export function getErrorMessage(
    recipient: CampaignRecipientWithUserSimple,
    errorMessages?: Record<number, string>,
): string {
    if (errorMessages && errorMessages[recipient.id]) {
        return errorMessages[recipient.id];
    }
    if (recipient.errorMessage) {
        return recipient.errorMessage;
    }
    if (!recipient.user.email.includes('@')) {
        return 'Invalid email address format.';
    }
    if (
        recipient.user.email.endsWith('.test') ||
        recipient.user.email.endsWith('.example')
    ) {
        return 'Cannot send emails to test or example domains.';
    }
    return "Email delivery failed. Please check the recipient's email address and try again.";
}

// --- Column definitions ---

export const campaignRecipientsTableColumns: ColumnDef<CampaignRecipientWithUserSimple>[] =
    [
        {
            id: 'name',
            header: 'Name',
            accessorFn: row => row.user.name,
            cell: ({ row }) => (
                <p className="truncate py-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {row.original.user.name}
                </p>
            ),
        },
        {
            id: 'email',
            header: 'Email',
            accessorFn: row => row.user.email,
            cell: ({ row }) => (
                <p className="truncate py-1 text-sm text-text-muted">
                    {row.original.user.email}
                </p>
            ),
        },
        {
            id: 'status',
            header: 'Status',
            accessorKey: 'status',
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <Badge variant={getRecipientStatusBadgeVariant(status)}>
                        {formatStatusText(status)}
                    </Badge>
                );
            },
        },
        {
            id: 'details',
            header: '',
            cell: ({ row, table }) => {
                const recipient = row.original;
                const meta = table.options.meta as CampaignRecipientTableMeta | undefined;
                if (recipient.status === 'FAILED') {
                    return (
                        <div className="rounded-md bg-red-50 p-2 dark:bg-red-900/20">
                            <p className="text-xs text-red-800 dark:text-red-200">
                                <strong>Error:</strong>{' '}
                                {getErrorMessage(recipient, meta?.errorMessages)}
                            </p>
                        </div>
                    );
                }
                if (recipient.status === 'SENT') {
                    return (
                        <div className="rounded-md bg-green-50 p-2 dark:bg-green-900/20">
                            <p className="text-xs text-green-800 dark:text-green-200">
                                <strong>Sent:</strong> {formatDate(recipient.sentAt)}
                            </p>
                        </div>
                    );
                }
                return null;
            },
            enableSorting: false,
        },
    ];
