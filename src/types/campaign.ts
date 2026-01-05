import {
  Campaign,
  CampaignRecipient,
  CampaignRecipientStatus,
  CampaignStatus,
} from '@/lib/prisma/generated/client';

// Public types that exclude any sensitive fields
export type PublicCampaign = Campaign;
export type PublicCampaignRecipient = CampaignRecipient;

export interface CampaignRecipientWithUser extends CampaignRecipient {
  user: {
    id: number;
    name: string;
    email: string;
  };
  campaign: {
    id: number;
    name: string;
    status: CampaignStatus;
  };
}

// Extended types for complex queries
export interface CampaignRecipientWithUserSimple extends CampaignRecipient {
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CampaignWithRelations extends Campaign {
  user: {
    id: number;
    name: string;
    email: string;
  };
  emailTemplate: {
    id: number;
    name: string;
    subject: string;
    fromEmail: string;
    fromName: string;
    body: string;
    variables: string[];
  };
  recipients: CampaignRecipientWithUserSimple[];
}

export interface CampaignRecipientWithFullUser extends CampaignRecipient {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    isOnboarded: boolean;
    credits: number;
    plan: string;
    isOverDue: boolean;
    planExpiringAt: Date | null;
  };
}

export interface CampaignWithTemplateAndRecipients extends Campaign {
  user: {
    id: number;
    name: string;
    email: string;
  };
  emailTemplate: {
    id: number;
    name: string;
    subject: string;
    fromEmail: string;
    fromName: string;
    replyToEmail: string | null;
    body: string;
    variables: string[];
  };
  recipients: CampaignRecipientWithFullUser[];
}

// Database operation types
export interface CreateCampaignData {
  userId: number;
  name: string;
  emailTemplateId: number;
  description?: string;
  status: CampaignStatus;
  scheduledAt?: Date;
  recipients: number[]; // Array of user IDs
}

export interface UpdateCampaignData {
  name?: string;
  emailTemplateId?: number;
  description?: string;
  status?: CampaignStatus;
  scheduledAt?: Date;
  recipients?: number[]; // Array of user IDs
}

export interface CreateCampaignRecipientData {
  campaignId: number;
  userId: number;
  status?: CampaignRecipientStatus;
  emailBody?: string;
}

export interface UpdateCampaignRecipientData {
  status?: CampaignRecipientStatus;
  emailBody?: string;
  sentAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
}

// API Request types
export interface CreateCampaignRequest {
  name: string;
  emailTemplateId: number;
  description?: string;
  status?: CampaignStatus;
  scheduledAt?: string;
  recipients?: number[];
}

export interface UpdateCampaignRequest {
  name?: string;
  emailTemplateId?: number;
  description?: string;
  status?: CampaignStatus;
  scheduledAt?: string;
  recipients?: number[];
}

export interface CreateCampaignRecipientRequest {
  campaignId: number;
  userId: number;
  status?: CampaignRecipientStatus;
  emailBody?: string;
}

export interface UpdateCampaignRecipientRequest {
  status?: CampaignRecipientStatus;
  emailBody?: string;
  sentAt?: string;
  openedAt?: string;
  clickedAt?: string;
}

// API Response types
export interface CampaignResponse {
  id: number;
  userId: number;
  name: string;
  emailTemplateId: number;
  description: string | null;
  status: CampaignStatus;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignRecipientResponse {
  id: number;
  campaignId: number;
  userId: number;
  status: CampaignRecipientStatus;
  emailBody: string | null;
  sentAt: string | null;
  openedAt: string | null;
  clickedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignWithRelationsResponse extends CampaignResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
  emailTemplate: {
    id: number;
    name: string;
    subject: string;
    fromEmail: string;
    fromName: string;
    body: string;
    variables: string[];
  };
  recipients: CampaignRecipientResponse[];
}

export interface CampaignRecipientWithRelationsResponse extends CampaignRecipientResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
  campaign: {
    id: number;
    name: string;
    status: CampaignStatus;
  };
}

export interface CampaignFormData {
  name: string;
  description?: string;
  emailTemplateId?: number | undefined;
  recipients: number[];
  sendOption: 'immediately' | 'scheduled';
  scheduledDate?: string;
  scheduledTime?: string;
  status?: CampaignStatus;
}

export interface EmailCampaignEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  campaign?: CampaignWithRelations | null;
  mode: 'create' | 'edit';
}
