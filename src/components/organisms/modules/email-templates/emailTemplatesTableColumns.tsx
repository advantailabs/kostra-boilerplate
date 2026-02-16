'use client';

import { RiMoreLine } from '@remixicon/react';
import type { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { EmailTemplate } from '@/services/api/email-templates';

export interface EmailTemplateTableMeta {
  onEdit?: (template: EmailTemplate) => void;
  onDelete?: (id: number, name: string) => void;
}

function getTypeBadgeVariant(emailType: 'TRANSACTIONAL' | 'PROMOTIONAL') {
  return emailType === 'TRANSACTIONAL' ? 'default' : 'warning';
}

function EmailTemplateActionsCell({
  template,
  meta,
}: {
  template: EmailTemplate;
  meta: EmailTemplateTableMeta | undefined;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleEdit = () => {
    setIsDropdownOpen(false);
    meta?.onEdit?.(template);
  };

  const handleDelete = () => {
    setIsDropdownOpen(false);
    meta?.onDelete?.(template.id, template.name);
  };

  return (
    <div className="py-1 text-right" onClick={e => e.stopPropagation()}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="group size-8 hover:border hover:border-gray-300 hover:bg-gray-50 hover:dark:border-gray-700 hover:dark:bg-gray-900"
          >
            <RiMoreLine size={16} className="shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit}>Edit Template</DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-600 focus:text-red-600 dark:text-red-400 focus:dark:text-red-400"
          >
            Delete Template
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const emailTemplateTableColumns: ColumnDef<EmailTemplate>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const template = row.original;
      return (
        <div className="truncate py-1 text-gray-700 dark:text-gray-300">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-50">
            {template.name || 'Unnamed Template'}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => {
      const template = row.original;
      return (
        <div className="truncate py-1 text-sm text-text-muted">
          {template.subject || 'No subject'}
        </div>
      );
    },
  },
  {
    accessorKey: 'fromName',
    header: 'From Name',
    cell: ({ row }) => {
      const template = row.original;
      return (
        <div className="truncate py-1 text-sm text-text-muted">
          {template.fromName || 'No from name'}
        </div>
      );
    },
  },
  {
    id: 'user',
    header: 'User',
    cell: ({ row }) => {
      const template = row.original;
      const { user } = template;
      return (
        <div className="flex items-center gap-3 py-1">
          {user.profilePicture ? (
            <Image
              src={user.profilePicture}
              alt={user.name}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 ${user.profilePicture ? 'hidden' : ''}`}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="truncate">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-50">
              {user.name}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'emailType',
    header: 'Type',
    cell: ({ row }) => {
      const template = row.original;
      return (
        <div className="py-1">
          <Badge variant={getTypeBadgeVariant(template.emailType)}>
            {template.emailType === 'TRANSACTIONAL'
              ? 'Transactional'
              : 'Promotional'}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: 'Last Modified',
    cell: ({ row }) => {
      const template = row.original;
      const formatted =
        template.updatedAt &&
          !Number.isNaN(new Date(template.updatedAt).getTime())
          ? new Date(template.updatedAt).toLocaleDateString()
          : 'N/A';
      return (
        <div className="py-1 text-text-muted">
          <div className="text-sm text-text-muted">{formatted}</div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row, table }) => {
      const template = row.original;
      const meta = table.options.meta as EmailTemplateTableMeta | undefined;
      return <EmailTemplateActionsCell template={template} meta={meta} />;
    },
    enableSorting: false,
  },
];
