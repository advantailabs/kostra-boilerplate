import { axiosInstance } from '@/lib/utils/http/axios';

export interface EmailTemplate {
  id: number;
  userId: number;
  name: string;
  subject: string;
  fromEmail: string;
  fromName: string;
  replyToEmail?: string;
  emailType: 'TRANSACTIONAL' | 'PROMOTIONAL';
  body: string;
  variables?: string[];
  createdAt: string;
  updatedAt: string;
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
    planExpiringAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
}

export interface CreateEmailTemplateRequest {
  name: string;
  subject: string;
  fromEmail: string;
  fromName: string;
  replyToEmail?: string;
  emailType: 'TRANSACTIONAL' | 'PROMOTIONAL';
  body: string;
  variables?: string[];
}

export interface UpdateEmailTemplateRequest {
  name?: string;
  subject?: string;
  fromEmail?: string;
  fromName?: string;
  replyToEmail?: string;
  emailType?: 'TRANSACTIONAL' | 'PROMOTIONAL';
  body?: string;
  variables?: string[];
}

export interface EmailTemplatesResponse {
  emailTemplates: EmailTemplate[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const emailTemplatesApi = {
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    const response = await axiosInstance.get('/email-templates');
    return response.data.data?.emailTemplates || [];
  },

  async getEmailTemplateById(id: number): Promise<EmailTemplate> {
    const response = await axiosInstance.get(`/email-templates/${id}`);
    return response.data.data?.emailTemplate;
  },

  async createEmailTemplate(data: CreateEmailTemplateRequest): Promise<EmailTemplate> {
    const response = await axiosInstance.post('/email-templates', data);
    return response.data.data?.emailTemplate;
  },

  async updateEmailTemplate(id: number, data: UpdateEmailTemplateRequest): Promise<EmailTemplate> {
    const response = await axiosInstance.patch(`/email-templates/${id}`, data);
    return response.data.data?.emailTemplate;
  },

  async deleteEmailTemplate(id: number): Promise<void> {
    await axiosInstance.delete(`/email-templates/${id}`);
  },
};
