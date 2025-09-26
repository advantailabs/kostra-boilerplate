'use client';

import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/atom/Badge';
import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { Textarea } from '@/components/atom/Textarea';
import { Modal } from '@/components/molecules/common/Modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/molecules/common/Select';
// Using built-in toLocaleString for date formatting to match existing patterns
import { CONTACT_PURPOSES, CONTACT_STATUSES, ContactSubmission } from '@/types/contact';

type ContactDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  contact: ContactSubmission | null;
  onSave: (_update: { status?: string; adminNotes?: string; resolvedAt?: string }) => Promise<void>;
  isSaving?: boolean;
};

export function ContactDetailsModal({
  isOpen,
  onClose,
  contact,
  onSave,
  isSaving,
}: ContactDetailsModalProps) {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (contact) {
      setStatus(contact.status as unknown as string);
      setAdminNotes(contact.adminNotes || '');
    }
  }, [contact]);

  const purposeLabel = useMemo(() => {
    if (!contact) return '';
    const p = CONTACT_PURPOSES.find(p => p.value === (contact.purpose as unknown as string));
    return p?.label || contact.purpose;
  }, [contact]);

  const statusMeta = useMemo(() => {
    if (!contact) return { label: '', variant: 'neutral' as const };
    const s = CONTACT_STATUSES.find(s => s.value === (contact.status as unknown as string));
    return s
      ? { label: s.label, variant: s.variant === 'secondary' ? 'neutral' : (s.variant as any) }
      : { label: String(contact.status), variant: 'neutral' };
  }, [contact]);

  const handleSave = async () => {
    await onSave({
      status,
      adminNotes,
      resolvedAt: status === 'RESOLVED' ? new Date().toISOString() : undefined,
    });
  };

  const footer = (
    <div className="flex items-center justify-end gap-2">
      <Button variant="secondary" onClick={onClose} disabled={isSaving}>
        Close
      </Button>
      <Button onClick={handleSave} isLoading={isSaving}>
        Save changes
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Details"
      description="View and update the contact inquiry."
      footer={footer}
      maxWidth="sm:max-w-2xl"
    >
      {contact && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="font-medium">Name</Label>
              <Input value={contact.name} disabled className="mt-2" />
            </div>
            <div>
              <Label className="font-medium">Email</Label>
              <Input value={contact.email} disabled className="mt-2" />
            </div>
            <div>
              <Label className="font-medium">Purpose</Label>
              <Input value={purposeLabel} disabled className="mt-2" />
            </div>
            <div>
              <Label className="font-medium">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent align="end">
                  {CONTACT_STATUSES.map(s => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="font-medium">Message</Label>
            <Textarea value={contact.message} disabled className="mt-2" rows={5} />
          </div>

          <div>
            <Label className="font-medium">Admin Notes</Label>
            <Textarea
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              className="mt-2"
              rows={4}
              placeholder="Add internal notes for this inquiry"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label className="font-medium">Submitted</Label>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {new Date(contact.createdAt).toLocaleString()}
              </div>
            </div>
            <div>
              <Label className="font-medium">Updated</Label>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {new Date(contact.updatedAt).toLocaleString()}
              </div>
            </div>
            <div>
              <Label className="font-medium">Current Status</Label>
              <div className="mt-1">
                <Badge variant={statusMeta.variant as any}>{statusMeta.label}</Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

// no default export to avoid import lint issues
