'use client';

import { Button } from '@/components/atom/Button';
import { Checkbox } from '@/components/atom/Checkbox';
import { CategoryResponseType } from '@/types/blog.type';
import { ColumnDef } from '@tanstack/react-table';
import { RiEditLine, RiDeleteBinLine, RiMoreLine } from '@remixicon/react';
import { useState } from 'react';

// Three-dot menu component
const ActionsMenu = ({
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsOpen(!isOpen)}>
        <RiMoreLine className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-10 w-48 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-950">
          <div className="py-1">
            {canEdit && (
              <button
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 hover:dark:bg-gray-800"
                onClick={() => {
                  onEdit?.();
                  setIsOpen(false);
                }}
              >
                <RiEditLine className="h-4 w-4" />
                Edit Category
              </button>
            )}
            {canDelete && (
              <button
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 hover:dark:bg-gray-800"
                onClick={() => {
                  onDelete?.();
                  setIsOpen(false);
                }}
              >
                <RiDeleteBinLine className="h-4 w-4" />
                Delete Category
              </button>
            )}
          </div>
        </div>
      )}

      {/* Overlay to close menu when clicking outside */}
      {isOpen && <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

export const createColumns = (
  onEdit?: (_categoryId: number) => void,
  onDelete?: (_categoryId: number, _categoryName: string) => void,
  canUpdate?: boolean,
  canDelete?: boolean
): ColumnDef<CategoryResponseType>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomeRowsSelected()
              ? 'indeterminate'
              : false
        }
        onCheckedChange={() => table.toggleAllPageRowsSelected()}
        className="translate-y-0.5"
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={() => row.toggleSelected()}
        className="translate-y-0.5"
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => {
      const slug = row.getValue('slug') as string;
      return <div className="text-sm text-gray-600">{slug}</div>;
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const name = row.getValue('name') as string;
      return <div className="font-medium">{name}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <ActionsMenu
            onEdit={() => onEdit?.(row.original.id)}
            onDelete={() => onDelete?.(row.original.id, row.original.name)}
            canEdit={canUpdate}
            canDelete={canDelete}
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];


