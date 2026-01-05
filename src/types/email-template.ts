import { EmailTemplate, EmailType } from '@/lib/prisma/generated/client';

// Public type that excludes any sensitive fields (if any)
export type PublicEmailTemplate = EmailTemplate;

// Extended types for complex queries
export interface EmailTemplateWithUser extends EmailTemplate {
  user: {
    id: number;
    googleId: string | null;
    name: string;
    email: string;
    profilePicture: string | null;
    role: 'ADMIN' | 'USER';
    isOnboarded: boolean;
    credits: number;
    stripeCustomerId: string | null;
    plan: 'FREE' | 'PRO';
    isOverDue: boolean;
    planExpiringAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  };
}

// Database operation types
export interface CreateEmailTemplateData {
  userId: number;
  name: string;
  subject: string;
  fromEmail: string;
  fromName: string;
  replyToEmail?: string;
  emailType: EmailType;
  body: string;
  variables?: string[];
}

export interface UpdateEmailTemplateData {
  name?: string;
  subject?: string;
  fromEmail?: string;
  fromName?: string;
  replyToEmail?: string;
  emailType?: EmailType;
  body?: string;
  variables?: string[];
}

// API Request types
export interface CreateEmailTemplateRequest {
  name: string;
  subject: string;
  fromEmail: string;
  fromName: string;
  replyToEmail?: string;
  emailType?: EmailType;
  body: string;
  variables?: string[];
}

export interface UpdateEmailTemplateRequest {
  name?: string;
  subject?: string;
  fromEmail?: string;
  fromName?: string;
  replyToEmail?: string;
  emailType?: EmailType;
  body?: string;
  variables?: string[];
}

// API Response types
export interface EmailTemplateResponse {
  id: number;
  userId: number;
  name: string;
  subject: string;
  fromEmail: string;
  fromName: string;
  replyToEmail: string | null;
  emailType: EmailType;
  body: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplateWithUserResponse extends EmailTemplateResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
}
