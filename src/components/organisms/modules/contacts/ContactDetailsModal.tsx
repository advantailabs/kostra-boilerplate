'use client';

import {
  BadgeCheck,
  Calendar,
  Mail,
  MessageSquare,
  StickyNote,
  Tag,
  User,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { Modal } from '@/components/molecules/common/Modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CONTACT_PURPOSES, CONTACT_STATUSES, ContactSubmission } from '@/types/contact';

type ContactStatusOption = (typeof CONTACT_STATUSES)[number];

type ContactDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  contact: ContactSubmission | null;
  onSave: (_update: { status?: string; adminNotes?: string; resolvedAt?: string }) => Promise<void>;
  isSaving?: boolean;
};

const BADGE_VARIANT_MAP: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' | 'ghost' | 'info' | 'error'> = {
  neutral: 'secondary',
  default: 'default',
  secondary: 'secondary',
  success: 'success',
  warning: 'warning',
  destructive: 'destructive',
  outline: 'outline',
  ghost: 'ghost',
  info: 'info',
  error: 'error',
};

export function ContactDetailsModal({
  isOpen,
  onClose,
  contact,
  onSave,
  isSaving,
}: ContactDetailsModalProps) {
  const [status, setStatus] = useState<string | undefined>(() => contact?.status ? contact.status : '');
  const [adminNotes, setAdminNotes] = useState(() => contact?.adminNotes ? contact.adminNotes : '');

  const purposeLabel = useMemo(() => {
    if (!contact) return '';
    const p = CONTACT_PURPOSES.find(p => p.value === (contact.purpose as unknown as string));
    return p?.label || contact.purpose;
  }, [contact]);

  const statusMeta = useMemo(() => {
    if (!contact) return { label: '', variant: 'neutral' as const };
    const s = CONTACT_STATUSES.find(s => s.value === (contact.status as unknown as string));
    return s
      ? { label: s.label, variant: s.variant === 'secondary' ? 'neutral' : (s.variant as string) }
      : { label: String(contact.status), variant: 'neutral' };
  }, [contact]);

  const badgeVariant = BADGE_VARIANT_MAP[statusMeta.variant] ?? 'secondary';

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
      <Button onClick={handleSave} isLoading={isSaving} loadingText="Saving...">
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
      maxWidth="sm:max-w-2xl!"
    >
      {contact && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <Field>
              <FieldLabel htmlFor="contact-name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Name
              </FieldLabel>
              <FieldContent>
                <Input id="contact-name" value={contact.name} disabled />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="contact-email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </FieldLabel>
              <FieldContent>
                <Input id="contact-email" value={contact.email} disabled />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="contact-purpose" className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                Purpose
              </FieldLabel>
              <FieldContent>
                <Input id="contact-purpose" value={purposeLabel} disabled />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="contact-status" className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                Status
              </FieldLabel>
              <FieldContent>
                <Combobox<ContactStatusOption>
                  id="contact-status"
                  items={CONTACT_STATUSES}
                  value={(CONTACT_STATUSES.find(s => s.value === status) ?? undefined) as ContactStatusOption | undefined}
                  onValueChange={item => item != null && setStatus(item.value)}
                  itemToStringValue={item => item.label}
                >
                  <ComboboxInput placeholder="Select status" className="w-full" />
                  <ComboboxContent className="pointer-events-auto">
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
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="contact-message" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              Message
            </FieldLabel>
            <FieldContent>
              <Textarea id="contact-message" value={contact.message} disabled rows={5} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="contact-admin-notes" className="flex items-center gap-2">
              <StickyNote className="h-4 w-4 text-muted-foreground" />
              Admin Notes
            </FieldLabel>
            <FieldContent>
              <Textarea
                id="contact-admin-notes"
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                rows={4}
                placeholder="Add internal notes for this inquiry"
              />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="contact-submitted" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Submitted
              </FieldLabel>
              <FieldContent>
                <div id="contact-submitted" className="text-sm text-muted-foreground">
                  {new Date(contact.createdAt).toLocaleString()}
                </div>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-updated" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Updated
              </FieldLabel>
              <FieldContent>
                <div id="contact-updated" className="text-sm text-muted-foreground">
                  {new Date(contact.updatedAt).toLocaleString()}
                </div>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="contact-current-status" className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                Current Status
              </FieldLabel>
              <FieldContent>
                <div id="contact-current-status">
                  <Badge variant={badgeVariant}>{statusMeta.label}</Badge>
                </div>
              </FieldContent>
            </Field>
          </div>
        </div>
      )}
    </Modal>
  );
}
