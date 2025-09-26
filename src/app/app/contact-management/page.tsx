'use client';

import { RiDeleteBinLine, RiEyeLine, RiRefreshLine } from '@remixicon/react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { Badge } from '@/components/atom/Badge';
import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { LoadingScreen } from '@/components/atom/LoadingScreen';
import { DeleteDialog } from '@/components/molecules/common/DeleteDialog';
import { PageHeader } from '@/components/molecules/common/PageHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/molecules/common/Select';
import { Table, TableBody, TableCell, TableRow } from '@/components/molecules/common/Table';
import { ContactDetailsModal } from '@/components/organisms/modules/contacts/ContactDetailsModal';
import { useContacts, useDeleteContact, useUpdateContact } from '@/hooks/useContacts';
import { CONTACT_PURPOSES, CONTACT_STATUSES, ContactSubmission } from '@/types/contact';

export default function ContactManagementPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 400);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [purpose, setPurpose] = useState<string | undefined>(undefined);

  const { data, isLoading, refetch, isFetching } = useContacts({
    status: status as any,
    purpose: purpose as any,
    search: debouncedSearch,
    page: page.toString(),
    limit: limit.toString(),
  });

  const submissions = data?.submissions || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ContactSubmission | null>(null);

  const { mutateAsync: updateContact, isPending: isUpdating } = useUpdateContact();
  const { mutateAsync: deleteContact, isPending: isDeleting } = useDeleteContact();

  // React Query will fetch when queryKey changes (debouncedSearch/status/purpose/page)

  useEffect(() => {
    // Debug the response shape
    // eslint-disable-next-line no-console
    console.log('Contacts query data:', data);
  }, [data]);

  const handleOpenDetails = (c: ContactSubmission) => {
    setSelected(c);
    setShowDetails(true);
  };

  const handleSaveDetails = async (update: {
    status?: string;
    adminNotes?: string;
    resolvedAt?: string;
  }) => {
    if (!selected) return;
    await updateContact({ id: selected.id, data: update });
    setShowDetails(false);
    setSelected(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteContact(deleteTarget.id);
    setDeleteTarget(null);
  };

  const clearFilters = () => {
    setSearchInput('');
    setStatus(undefined);
    setPurpose(undefined);
  };

  if (isLoading && !data) {
    return <LoadingScreen message="Loading contact submissions..." />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="flex items-center justify-between border-b border-gray-200 max-sm:flex-col max-sm:items-start max-sm:gap-3 dark:border-gray-700">
        <PageHeader title="Contact Inquiries" description="Manage contact form submissions" />
        <div className="px-4 py-3 max-sm:hidden">
          <Button
            onClick={() => refetch()}
            className="max-sm:w-auto max-sm:justify-center max-sm:px-2 max-sm:py-2"
          >
            <RiRefreshLine className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      <div className="h-full p-4 max-sm:p-3">
        {/* Filters */}
        <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center">
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="sm:w-64">
              <Input
                placeholder="Search by name or email..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                inputClassName="h-8 py-1 text-xs"
              />
            </div>
            <div className="sm:w-56">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-8 py-1 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent align="start">
                  {CONTACT_STATUSES.map(s => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:w-56">
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger className="h-8 py-1 text-xs">
                  <SelectValue placeholder="Purpose" />
                </SelectTrigger>
                <SelectContent align="start">
                  {CONTACT_PURPOSES.map(p => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="border px-2 py-1 text-indigo-600 sm:border-0 dark:text-indigo-500"
            >
              Clear filters
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-hidden overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <Table className="border-0">
            <TableBody>
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map(s => {
                  const statusMeta = CONTACT_STATUSES.find(
                    x => x.value === (s.status as unknown as string)
                  );
                  const purposeMeta = CONTACT_PURPOSES.find(
                    x => x.value === (s.purpose as unknown as string)
                  );
                  const badgeVariant =
                    statusMeta?.variant === 'secondary'
                      ? 'neutral'
                      : statusMeta?.variant || 'neutral';
                  return (
                    <TableRow
                      key={s.id}
                      className="group select-none hover:bg-gray-50 hover:dark:bg-gray-900"
                    >
                      <TableCell className="py-1 text-gray-700 dark:text-gray-300">
                        <div className="truncate">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                            {s.name}
                          </p>
                          <p className="truncate text-xs text-gray-500">{s.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-1">{purposeMeta?.label || s.purpose}</TableCell>
                      <TableCell className="py-1">
                        <Badge variant={badgeVariant as any}>{statusMeta?.label || s.status}</Badge>
                      </TableCell>
                      <TableCell className="py-1 text-gray-600 dark:text-gray-400">
                        {new Date(s.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="py-1 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => handleOpenDetails(s)}
                            className="group size-8 hover:border hover:border-gray-300 hover:bg-gray-50 hover:dark:border-gray-700 hover:dark:bg-gray-900"
                          >
                            <RiEyeLine size={14} className="shrink-0" />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => setDeleteTarget(s)}
                            className="group size-8 hover:border hover:border-gray-300 hover:bg-gray-50 hover:dark:border-gray-700 hover:dark:bg-gray-900"
                          >
                            <RiDeleteBinLine
                              size={14}
                              className="shrink-0 text-red-600 dark:text-red-500"
                            />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {submissions.length > 0 && (
          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Page {page} of {totalPages} • {total} total
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={page <= 1 || isFetching}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                disabled={page >= totalPages || isFetching}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && (
        <ContactDetailsModal
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelected(null);
          }}
          contact={selected}
          onSave={handleSaveDetails}
          isSaving={isUpdating}
        />
      )}

      {/* Delete Dialog */}
      {deleteTarget && (
        <DeleteDialog
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          title="Delete Contact Submission"
          itemName={deleteTarget.name}
          itemType="contact submission"
          showNameConfirmation
          confirmationPlaceholder="Type the contact name to confirm"
        />
      )}
    </div>
  );
}
