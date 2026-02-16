'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';

import { ActionDialog } from '@/components/molecules/common/ActionDialog';
import { PageHeaderWithAction } from '@/components/molecules/common/PageHeaderWithAction';
import { Pagination } from '@/components/molecules/common/Pagination';
import { ContactDetailsModal } from '@/components/organisms/modules/contacts/ContactDetailsModal';
import { contactsTableColumns } from '@/components/organisms/modules/contacts/contactsTableColumns';
import { Button } from '@/components/ui/button';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { DataTable } from '@/components/ui/data-table';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useContacts, useDeleteContact, useUpdateContact } from '@/hooks/useContacts';
import { ContactPurpose, ContactStatus } from '@/lib/prisma/generated/enums';
import { CONTACT_PURPOSES, CONTACT_STATUSES, ContactSubmission } from '@/types/contact';

export default function ContactManagementPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 400);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [purpose, setPurpose] = useState<string | undefined>(undefined);

  const { data, isLoading, refetch } = useContacts({
    status: status as ContactStatus,
    purpose: purpose as ContactPurpose,
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

  return (
    <div className="">
      <PageHeaderWithAction
        title="Contact Inquiries"
        description="Manage contact form submissions"
        onAdd={() => refetch()}
        addButtonText="Refresh"
      />

      <div className="h-full space-y-4 p-4 max-sm:p-3">
        {/* Filters */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Field className="sm:w-64">
              <Input
                placeholder="Search by name or email..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="bg-background"
              />
            </Field>
            <Field className="sm:w-56">
              <Combobox<(typeof CONTACT_STATUSES)[number]>
                key={status === undefined ? 'status-empty' : 'status-filled'}
                items={CONTACT_STATUSES}
                value={CONTACT_STATUSES.find(s => s.value === status)}
                onValueChange={item => setStatus(item?.value)}
                itemToStringValue={item => item.label}
              >
                <ComboboxInput placeholder="Status" showClear className="bg-background" />
                <ComboboxContent align="start">
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {item => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
            <Field className="sm:w-56">
              <Combobox<(typeof CONTACT_PURPOSES)[number]>
                key={purpose === undefined ? 'purpose-empty' : 'purpose-filled'}
                items={CONTACT_PURPOSES}
                value={CONTACT_PURPOSES.find(p => p.value === purpose)}
                onValueChange={item => setPurpose(item?.value)}
                itemToStringValue={item => item.label}
              >
                <ComboboxInput placeholder="Purpose" showClear className="bg-background" />
                <ComboboxContent align="start">
                  <ComboboxEmpty>No items found.</ComboboxEmpty>
                  <ComboboxList>
                    {item => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="relative overflow-hidden overflow-x-auto rounded-md bg-background  before:pointer-events-none before:inset-0 before:rounded-md">
          <DataTable<ContactSubmission, unknown>
            columns={contactsTableColumns}
            data={submissions}
            meta={{
              onRowClick: handleOpenDetails,
              onViewDetails: handleOpenDetails,
              onDelete: (s: ContactSubmission) => setDeleteTarget(s),
            }}
            emptyMessage="No contact submissions found."
            isLoading={isLoading || searchInput !== debouncedSearch}
            loadingMessage={
              searchInput !== debouncedSearch
                ? 'Searching...'
                : 'Loading contact submissions...'
            }
          />
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
          key={selected ? selected.id : ''}
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
