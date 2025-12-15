import { ContactPurpose, ContactStatus } from '@/lib/prisma/generated/client';
import {
  ContactFormData,
  ContactSubmissionFilters,
  ContactSubmissionUpdate,
} from '@/validations/contact';

// ContactFormData is now imported from validations

export interface ContactSubmission {
  id: number;
  uuid: string;
  userId?: number | null;
  name: string;
  email: string;
  purpose: ContactPurpose;
  message: string;
  status: ContactStatus;
  adminNotes?: string | null;
  resolvedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: number;
    name: string;
    email: string;
  } | null;
}

// Re-export types from validations as the single source of truth
export type { ContactFormData, ContactSubmissionFilters, ContactSubmissionUpdate };

export interface ContactSubmissionResponse {
  submissions: ContactSubmission[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const CONTACT_PURPOSES = [
  { value: 'ACCOUNT', label: 'Account Issues' },
  { value: 'BILLING', label: 'Billing & Payments' },
  { value: 'TECHNICAL_SUPPORT', label: 'Technical Support' },
  { value: 'FEATURE_REQUEST', label: 'Feature Request' },
  { value: 'BUG_REPORT', label: 'Bug Report' },
  { value: 'GENERAL_INQUIRY', label: 'General Inquiry' },
  { value: 'OTHER', label: 'Other' },
] as const;

export const CONTACT_STATUSES = [
  { value: 'NEW', label: 'New', variant: 'default' },
  { value: 'IN_PROGRESS', label: 'In Progress', variant: 'warning' },
  { value: 'RESOLVED', label: 'Resolved', variant: 'success' },
  { value: 'CLOSED', label: 'Closed', variant: 'secondary' },
] as const;
