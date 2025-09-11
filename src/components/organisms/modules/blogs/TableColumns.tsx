'use client';

import { Badge } from '@/components/atom/Badge';
import { Button } from '@/components/atom/Button';
import { Checkbox } from '@/components/atom/Checkbox';
import { BlogResponseType } from '@/types/blog.type';
import { ColumnDef } from '@tanstack/react-table';
import { RiEditLine, RiDeleteBinLine, RiMoreLine } from '@remixicon/react';
import { useState } from 'react';

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

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
                Edit Blog
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
                Delete Blog
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
  onEdit?: (_blogId: number) => void,
  onDelete?: (_blogId: number, _blogTitle: string) => void,
  canUpdate?: boolean,
  canDelete?: boolean
): ColumnDef<BlogResponseType>[] => [
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
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const title = row.getValue('title') as string;
      return <div className="max-w-[200px] truncate font-medium">{title}</div>;
    },
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags = row.getValue('tags') as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {tags?.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="default" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags && tags.length > 2 && (
            <Badge variant="default" className="text-xs">
              +{tags.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'published',
    header: 'Published',
    cell: ({ row }) => {
      const published = row.getValue('published') as boolean;
      return <div className="flex justify-center">{published ? <p>Yes</p> : <p>No</p>}</div>;
    },
  },
  {
    accessorKey: 'author',
    header: 'Author',
    cell: ({ row }) => {
      const author = row.original.author;
      return <div className="text-sm text-gray-600">{author?.name || 'Unknown'}</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string;
      return <div className="text-sm text-gray-600">{formatDate(date)}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      // Check if current user is the author of the blog
      const isAuthor = true; // TODO: Implement proper author check

      return (
        <div className="flex justify-end">
          <ActionsMenu
            onEdit={() => onEdit?.(row.original.id)}
            onDelete={() => onDelete?.(row.original.id, row.original.title)}
            canEdit={canUpdate && isAuthor}
            canDelete={canDelete && isAuthor}
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
