'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Category } from '@/services/api/categories';

export type CategoryTableRow = Category;

export interface CategoryTableMeta {
    onEdit?: (category: CategoryTableRow) => void;
    onDelete?: (id: number, name: string) => void;
}

export const categoryTableColumns: ColumnDef<CategoryTableRow>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
            const category = row.original;
            return (
                <div className="truncate py-1">
                    <p className="truncate text-sm font-medium text-text">
                        {category.name || 'Unnamed Category'}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                        {category.slug || 'No slug'}
                    </p>
                </div>
            );
        },
    },
    {
        id: 'blogs',
        header: 'Blogs',
        cell: ({ row }) => (
            <Badge variant="outline" className="py-1">
                {row.original._count?.blogs ?? 0} blogs
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
            const category = row.original;
            const meta = table.options.meta as CategoryTableMeta | undefined;
            return (
                <div
                    className="flex justify-end gap-2 py-1"
                    onClick={e => e.stopPropagation()}
                >
                    <Button
                        variant="ghost"
                        onClick={e => {
                            e.stopPropagation();
                            meta?.onEdit?.(category);
                        }}
                        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <Pencil size={16} className="shrink-0 text-text-muted" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={e => {
                            e.stopPropagation();
                            meta?.onDelete?.(category.id, category.name);
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
