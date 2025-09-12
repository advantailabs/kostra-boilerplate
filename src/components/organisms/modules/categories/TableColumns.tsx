'use client';

import { Button } from '@/components/atom/Button';
import { Checkbox } from '@/components/atom/Checkbox';
import { CategoryResponseType } from '@/types/blog.type';
import { RiDeleteBinLine, RiEditLine, RiMoreLine } from '@remixicon/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Three-dot menu component
function ActionsMenu({
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; right: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right - window.scrollX,
      });
    } else {
      setPosition(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !buttonRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        className="h-8 w-8 p-0"
        onClick={e => {
          e.stopPropagation(); // Prevent row selection
          setIsOpen(!isOpen);
        }}
      >
        <RiMoreLine className="h-4 w-4" />
      </Button>

      {isOpen &&
        position &&
        createPortal(
          <div
            className="fixed z-50 w-48 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-950"
            style={{
              top: position.top,
              right: position.right,
            }}
          >
            <div className="py-1">
              {canEdit && (
                <button
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 hover:dark:bg-gray-800"
                  onClick={e => {
                    e.stopPropagation();
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
                  onClick={e => {
                    e.stopPropagation();
                    onDelete?.();
                    setIsOpen(false);
                  }}
                >
                  <RiDeleteBinLine className="h-4 w-4" />
                  Delete Category
                </button>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

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
    header: () => <div className="flex justify-end">Actions</div>,
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
