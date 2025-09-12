'use client';

import { Badge } from '@/components/atom/Badge';
import { Button } from '@/components/atom/Button';
import { Checkbox } from '@/components/atom/Checkbox';
import { BlogResponseType } from '@/types/blog.type';
import { RiDeleteBinLine, RiEditLine, RiMoreLine } from '@remixicon/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

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
  const menuRef = useRef<HTMLDivElement>(null);

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
      if (
        isOpen &&
        !buttonRef.current?.contains(event.target as Node) &&
        !menuRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
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
            ref={menuRef}
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
                  onClick={_e => {
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
                  onClick={e => {
                    e.stopPropagation();
                    onDelete?.();
                    setIsOpen(false);
                  }}
                >
                  <RiDeleteBinLine className="h-4 w-4" />
                  Delete Blog
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
  onEdit?: (_blogId: number) => void,
  onDelete?: (_blogId: number, _blogTitle: string) => void,
  canUpdate?: boolean,
  canDelete?: boolean,
  currentUserId?: number
): ColumnDef<BlogResponseType>[] => [
  {
    id: 'select',
    header: ({ table }) => {
      const isAllSelected = table.getIsAllPageRowsSelected();
      const isSomeSelected = table.getIsSomeRowsSelected();
      let checked: boolean | 'indeterminate' = false;
      if (isAllSelected) {
        checked = true;
      } else if (isSomeSelected) {
        checked = 'indeterminate';
      }
      return (
        <Checkbox
          checked={checked}
          onCheckedChange={() => table.toggleAllPageRowsSelected()}
          className="translate-y-0.5"
          aria-label="Select all"
        />
      );
    },
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
      const { author } = row.original;
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
    header: () => <div className="flex justify-end">Actions</div>,
    cell: ({ row }) => {
      // Check if current user is the author of the blog
      const isAuthor = currentUserId ? row.original.authorId === currentUserId : true;
      const canEditBlog = canUpdate && isAuthor;
      const canDeleteBlog = canDelete && isAuthor;

      return (
        <div className="flex justify-end">
          <ActionsMenu
            onEdit={() => onEdit?.(row.original.id)}
            onDelete={() => onDelete?.(row.original.id, row.original.title)}
            canEdit={canEditBlog}
            canDelete={canDeleteBlog}
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
