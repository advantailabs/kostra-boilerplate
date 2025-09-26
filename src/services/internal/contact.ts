import { AppErrorClass, ERRORS } from '@/lib/utils';
import { ContactSubmissionFilters, ContactSubmissionResponse } from '@/types/contact';
import { contactRepository } from '../repositories/contact';

export interface ContactService {
  createContactSubmission(_data: {
    userId?: number;
    name: string;
    email: string;
    purpose: string;
    message: string;
  }): Promise<any>;

  getContactSubmission(_id: number): Promise<any>;

  getContactSubmissionByUuid(_uuid: string): Promise<any>;

  getContactSubmissions(_filters: ContactSubmissionFilters): Promise<ContactSubmissionResponse>;

  updateContactSubmission(
    _id: number,
    _data: {
      status?: string;
      adminNotes?: string;
      resolvedAt?: Date;
    }
  ): Promise<any>;

  deleteContactSubmission(_id: number): Promise<void>;
}

export async function createContactSubmission(data: {
  userId?: number;
  name: string;
  email: string;
  purpose: string;
  message: string;
}) {
  return contactRepository.create({
    ...data,
    name: data.name.trim(),
    email: data.email.trim(),
    message: data.message.trim(),
  } as any);
}

export async function getContactSubmission(id: number) {
  const submission = await contactRepository.findById(id);
  if (!submission) {
    throw new AppErrorClass(ERRORS.CONTACT_NOT_FOUND);
  }
  return submission;
}

export async function getContactSubmissionByUuid(uuid: string) {
  const submission = await contactRepository.findByUuid(uuid);
  if (!submission) {
    throw new AppErrorClass(ERRORS.CONTACT_NOT_FOUND);
  }
  return submission;
}

export async function getContactSubmissions(filters: ContactSubmissionFilters) {
  return contactRepository.findMany(filters);
}

export async function updateContactSubmission(
  id: number,
  data: {
    status?: string;
    adminNotes?: string;
    resolvedAt?: Date;
  }
) {
  const submission = await contactRepository.findById(id);
  if (!submission) {
    throw new AppErrorClass(ERRORS.CONTACT_NOT_FOUND);
  }

  return contactRepository.update(id, {
    ...data,
    adminNotes: data.adminNotes?.trim(),
  } as any);
}

export async function deleteContactSubmission(id: number) {
  const submission = await contactRepository.findById(id);
  if (!submission) {
    throw new AppErrorClass(ERRORS.CONTACT_NOT_FOUND);
  }
  await contactRepository.delete(id);
}

export const contactService: ContactService = {
  createContactSubmission,
  getContactSubmission,
  getContactSubmissionByUuid,
  getContactSubmissions,
  updateContactSubmission,
  deleteContactSubmission,
};
