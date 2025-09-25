import type { ZodError } from 'zod';

export interface FieldErrorItem {
  field: string;
  message: string;
}

export function formatZodError(error: ZodError): FieldErrorItem[] {
  return error.issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}
