'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Check, Pencil, Trash2, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface PackageTableRow {
    id: number;
    title: string;
    description: string;
    isFeatured: boolean;
    price: number | string;
    currencySymbol: string;
    features: string[];
    createdAt: string;
    updatedAt: string;
}

export interface PackageTableMeta {
    onEdit?: (pkg: PackageTableRow) => void;
    onDelete?: (id: number, title: string) => void;
}

export const packageTableColumns: ColumnDef<PackageTableRow>[] = [
    /* {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    }, */
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => {
            const pkg = row.original;
            return (
                <div className="truncate py-1">
                    <p className="truncate text-sm font-medium text-text">
                        {pkg.title || 'Unnamed Package'}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                        {pkg.description || 'No description'}
                    </p>
                </div>
            );
        },
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => {
            const pkg = row.original;
            const value =
                typeof pkg.price === 'string'
                    ? parseFloat(pkg.price).toFixed(2)
                    : pkg.price.toFixed(2);
            return (
                <div className="py-1 text-sm font-medium text-text">
                    {pkg.currencySymbol}
                    {value}
                </div>
            );
        },
    },
    {
        accessorKey: 'isFeatured',
        header: 'Featured',
        cell: ({ row }) => {
            const pkg = row.original;
            return (
                <Badge
                    variant={pkg.isFeatured ? 'default' : 'outline'}
                    className={`inline-flex items-center gap-1 py-1 font-medium ${!pkg.isFeatured ? 'opacity-50' : ''}`}
                >
                    {pkg.isFeatured ? (
                        <Check className="h-3 w-3" />
                    ) : (
                        <X className="h-3 w-3" />
                    )}
                    Featured
                </Badge>
            );
        },
    },
    {
        id: 'features',
        header: 'Features',
        cell: ({ row }) => (
            <Badge variant="outline" className="text-xs">
                {row.original.features.length} features
            </Badge>
        ),
    },
    {
        accessorKey: 'updatedAt',
        header: 'Last Modified',
        cell: ({ row }) => {
            const updatedAt = row.original.updatedAt;
            const formatted =
                updatedAt && !Number.isNaN(new Date(updatedAt).getTime())
                    ? new Date(updatedAt).toLocaleDateString()
                    : 'N/A';
            return (
                <div className="py-1 text-text-muted">
                    {/* <div className="text-xs text-text-muted">Last Modified:</div> */}
                    <div className="text-sm text-text-muted">{formatted}</div>
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row, table }) => {
            const pkg = row.original;
            const meta = table.options.meta as PackageTableMeta | undefined;
            return (
                <div
                    className="flex justify-end gap-2 py-1"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Button
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            meta?.onEdit?.(pkg);
                        }}
                        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <Pencil size={16} className="shrink-0 text-text-muted" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={(e) => {
                            e.stopPropagation();
                            meta?.onDelete?.(pkg.id, pkg.title);
                        }}
                        className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                    >
                        <Trash2 size={16} className="shrink-0 text-red-600 dark:text-red-400" />
                    </Button>
                </div>
            );
        },
        enableSorting: false,
    },
];
