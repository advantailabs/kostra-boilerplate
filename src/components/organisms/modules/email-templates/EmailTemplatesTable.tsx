'use client';

import { RiMoreLine } from '@remixicon/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { PageHeaderWithAction } from '@/components/molecules/common/PageHeaderWithAction';
import { EmailTemplate } from '@/services/api/email-templates';
import { Badge } from '../../../atom/Badge';
import { Button } from '../../../atom/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../molecules/common/Dropdown';
import { Pagination } from '../../../molecules/common/Pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../molecules/common/Select';
import { Table, TableBody, TableCell, TableRow } from '../../../molecules/common/Table';
import { UnifiedSearchBar } from '../../../molecules/common/UnifiedSearchBar';

// Component for individual table row to manage DropdownMenu state
interface EmailTemplateRowProps {
  template: EmailTemplate;
  onEdit: (_template: EmailTemplate) => void;
  onDelete: (_templateId: number, _templateName: string) => void;
}

function EmailTemplateRow({ template, onEdit, onDelete }: EmailTemplateRowProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getTypeBadgeVariant = (emailType: 'TRANSACTIONAL' | 'PROMOTIONAL') => {
    return emailType === 'TRANSACTIONAL' ? 'default' : 'warning';
  };

  const handleEdit = () => {
    setIsDropdownOpen(false); // Close dropdown before opening modal
    onEdit(template);
  };

  const handleDelete = () => {
    setIsDropdownOpen(false); // Close dropdown before opening modal
    onDelete(template.id, template.name);
  };

  return (
    <TableRow
      key={template.id}
      className="group cursor-pointer select-text border-b border-border-light bg-background-light hover:bg-background !text-text-muted"
    >
      <TableCell className="py-6 text-gray-700 ">
        <div className="truncate">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {template.name || 'Unnamed Template'}
          </p>
        </div>
      </TableCell>
      <TableCell className="py-3 text-gray-600 ">
        <div className="truncate text-sm">{template.subject || 'No subject'}</div>
      </TableCell>
      <TableCell className="py-3 text-gray-600 ">
        <div className="truncate text-sm">{template.fromName || 'No from name'}</div>
      </TableCell>
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          {template.user.profilePicture ? (
            <Image
              src={template.user.profilePicture}
              alt={template.user.name}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
              onError={e => {
                // Fallback to initials if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 ${template.user.profilePicture ? 'hidden' : ''
              }`}
          >
            {template.user.name.charAt(0).toUpperCase()}
          </div>
          <div className="truncate">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {template.user.name}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-3">
        <Badge variant={getTypeBadgeVariant(template.emailType)}>
          {template.emailType === 'TRANSACTIONAL' ? 'Transactional' : 'Promotional'}
        </Badge>
      </TableCell>
      <TableCell className="py-3 text-gray-600 ">
        <div className="text-xs text-gray-500 ">Last Modified:</div>
        <div className="text-sm">
          {template.updatedAt && !Number.isNaN(new Date(template.updatedAt).getTime())
            ? new Date(template.updatedAt).toLocaleDateString()
            : 'N/A'}
        </div>
      </TableCell>
      <TableCell className="py-3 text-right">
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
      </TableCell>
    </TableRow>
  );
}

interface EmailTemplatesTableProps {
  onEdit: (_template: EmailTemplate) => void;
  onDelete: (_templateId: number, _templateName: string) => void;
  onAdd: () => void;
  onPageChange?: (_page: number) => void;
  templates: EmailTemplate[];
  isLoading?: boolean;
  className?: string;
}

export function EmailTemplatesTable({
  onEdit,
  onDelete,
  onAdd,
  onPageChange,
  templates,
  isLoading = false,
  className,
}: EmailTemplatesTableProps) {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 400);
  const [filterType, setFilterType] = useState<'ALL' | 'TRANSACTIONAL' | 'PROMOTIONAL'>('ALL');

  // Filter templates based on search and type
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(debouncedSearch.toLowerCase());

    const matchesType = filterType === 'ALL' || template.emailType === filterType;

    return matchesSearch && matchesType;
  });

  // Pagination
  const total = filteredTemplates.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex);

  // Handle smart pagination after deletion
  useEffect(() => {
    // Don't run pagination logic while loading
    if (isLoading) return;
    const maxPage = Math.max(totalPages, 1);
    if (page > maxPage) {
      setPage(maxPage);
      return;
    }
    if (page > 1 && paginatedTemplates.length === 0) {
      setPage(prev => Math.max(1, prev - 1));
    }
  }, [page, paginatedTemplates.length, totalPages, isLoading]);

  // Notify parent of page changes
  useEffect(() => {
    if (onPageChange) {
      onPageChange(page);
    }
  }, [page, onPageChange]);

  return (
    <div className={`min-h-screen bg-background ${className || ''}`}>
      <PageHeaderWithAction
        title="Email Templates"
        description="Manage your reusable email templates"
        onAdd={onAdd}
        addButtonText="New Template"
      />
      <div className="h-full p-4 max-sm:p-3">
        {/* Search and Filter */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <UnifiedSearchBar
            placeholder="Search by title..."
            value={searchInput}
            onChange={setSearchInput}
            className="flex-1"
          />

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</label>
            <Select
              value={filterType}
              onValueChange={(value: 'ALL' | 'TRANSACTIONAL' | 'PROMOTIONAL') =>
                setFilterType(value)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="TRANSACTIONAL">Transactional</SelectItem>
                <SelectItem value="PROMOTIONAL">Promotional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-hidden overflow-x-auto rounded-xl bg-background table-cell-box-shadow">
          <Table className="border-0">
            <TableBody>
              {(() => {
                if (isLoading) {
                  return (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center bg-white dark:bg-background-light ">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          <span className="text-sm text-gray-500">Loading email templates...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
                if (searchInput !== debouncedSearch) {
                  return (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center bg-white dark:bg-background-light">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          <span className="text-sm text-gray-500">Searching...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
                if (paginatedTemplates.length === 0) {
                  return (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center bg-white dark:bg-background-light">
                        No email templates found.
                      </TableCell>
                    </TableRow>
                  );
                }
                return paginatedTemplates.map(template => (
                  <EmailTemplateRow
                    key={template.id}
                    template={template}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ));
              })()}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {paginatedTemplates.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500 ">
              Showing {startIndex + 1} to {Math.min(endIndex, total)} of {total} results
            </div>
            <Pagination
              pagination={{
                page,
                limit,
                totalCount: total,
                totalPages,
              }}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
