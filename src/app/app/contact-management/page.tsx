'use client';

import { RiDeleteBinLine, RiEyeLine } from '@remixicon/react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { Badge } from '@/components/atom/Badge';
import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { LoadingScreen } from '@/components/atom/LoadingScreen';
import { ActionDialog } from '@/components/molecules/common/ActionDialog';
import { PageHeaderWithAction } from '@/components/molecules/common/PageHeaderWithAction';
import { Pagination } from '@/components/molecules/common/Pagination';
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

  const { data, isLoading, refetch } = useContacts({
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
    <div className="min-h-screen bg-background">
      <PageHeaderWithAction
        title="Contact Inquiries"
        description="Manage contact form submissions"
        onAdd={() => refetch()}
        addButtonText="Refresh"
      />

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
              className="border px-2 py-1 text-primary sm:border-0"
            >
              Clear filters
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-hidden overflow-x-auto rounded-xl bg-background shadow-[0_1px_2px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)] before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)] dark:before:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.5)]">
          <Table className="border-0">
            <TableBody>
              {submissions.length === 0 ? (
                <TableRow className="border-b border-border-light bg-background-light">
                  <TableCell colSpan={5} className="h-24 text-center !text-text-muted">
                    No contact submissions found.
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
                      className="group cursor-pointer select-text border-b border-border-light bg-background-light hover:bg-background"
                      onClick={() => handleOpenDetails(s)}
                    >
                      <TableCell className="py-1 text-text">
                        <div className="truncate">
                          <p className="truncate text-sm font-medium text-text">
                            {s.name || 'Unnamed Contact'}
                          </p>
                          <p className="truncate text-xs text-text-muted">
                            {s.email || 'No email'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-text-muted">
                        <div className="text-xs text-text-muted">Purpose:</div>
                        <div className="text-sm text-text-muted">
                          {purposeMeta?.label || s.purpose}
                        </div>
                      </TableCell>
                      <TableCell className="py-1">
                        <Badge variant={badgeVariant as any}>{statusMeta?.label || s.status}</Badge>
                      </TableCell>
                      <TableCell className="py-1 text-text-muted">
                        <div className="text-xs text-text-muted">Submitted:</div>
                        <div className="text-sm text-text-muted">
                          {s.createdAt && !Number.isNaN(new Date(s.createdAt).getTime())
                            ? new Date(s.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="py-1 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            onClick={e => {
                              e.stopPropagation();
                              handleOpenDetails(s);
                            }}
                            className="group size-8 hover:border hover:border-border hover:bg-background"
                          >
                            <RiEyeLine size={14} className="shrink-0" />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={e => {
                              e.stopPropagation();
                              setDeleteTarget(s);
                            }}
                            className="group size-8 hover:border hover:border-border hover:bg-background"
                          >
                            <RiDeleteBinLine size={14} className="shrink-0 text-danger" />
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
          <Pagination
            pagination={{
              page,
              limit,
              totalCount: total,
              totalPages,
            }}
            onPageChange={setPage}
          />
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
        <ActionDialog
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          title="Delete Contact Submission"
          itemName={deleteTarget.name}
          itemType="contact submission"
          actionType="delete"
          showNameConfirmation
          confirmationPlaceholder="Type the contact name to confirm"
        />
      )}
    </div>
  );
}
