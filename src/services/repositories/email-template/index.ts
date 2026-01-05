import { prisma as sharedPrisma } from '@/lib/prisma';
import { EmailTemplate, PrismaClient } from '@/lib/prisma/generated/client';

import {
  CreateEmailTemplateData,
  EmailTemplateWithUser,
  PublicEmailTemplate,
  UpdateEmailTemplateData,
} from '@/types/email-template';

const defaultPrisma = sharedPrisma as PrismaClient;

const createEmailTemplate = async (
  data: CreateEmailTemplateData,
  prisma: PrismaClient = defaultPrisma
): Promise<EmailTemplate> => {
  try {
    const emailTemplate = await prisma.emailTemplate.create({
      data: {
        userId: data.userId,
        name: data.name,
        subject: data.subject,
        fromEmail: data.fromEmail,
        fromName: data.fromName,
        replyToEmail: data.replyToEmail,
        emailType: data.emailType,
        body: data.body,
        variables: data.variables || [],
      },
    });

    return emailTemplate;
  } catch (error) {
    console.error('Error creating email template:', error);
    throw new Error('Failed to create email template');
  }
};

const findEmailTemplatesByUserId = async (
  userId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<PublicEmailTemplate[]> => {
  try {
    const emailTemplates = await prisma.emailTemplate.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return emailTemplates;
  } catch (error) {
    console.error('Error fetching email templates:', error);
    throw new Error('Failed to fetch email templates');
  }
};

const findEmailTemplateById = async (
  id: number,
  prisma: PrismaClient = defaultPrisma
): Promise<PublicEmailTemplate | null> => {
  try {
    const emailTemplate = await prisma.emailTemplate.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    return emailTemplate;
  } catch (error) {
    console.error('Error fetching email template:', error);
    throw new Error('Failed to fetch email template');
  }
};

const updateEmailTemplate = async (
  id: number,
  data: UpdateEmailTemplateData,
  prisma: PrismaClient = defaultPrisma
): Promise<PublicEmailTemplate> => {
  try {
    // First check if the template exists
    const existingTemplate = await prisma.emailTemplate.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingTemplate) {
      throw new Error('Email template not found');
    }

    const updatedTemplate = await prisma.emailTemplate.update({
      where: { id },
      data: {
        ...data,
        // Ensure variables is always an array
        ...(data.variables !== undefined && { variables: data.variables }),
        updatedAt: new Date(),
      },
    });

    return updatedTemplate;
  } catch (error) {
    console.error('Error updating email template:', error);
    if (error instanceof Error && error.message === 'Email template not found') {
      throw error;
    }
    throw new Error('Failed to update email template');
  }
};

const deleteEmailTemplate = async (
  id: number,
  prisma: PrismaClient = defaultPrisma
): Promise<void> => {
  try {
    // First check if the template exists
    const existingTemplate = await prisma.emailTemplate.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingTemplate) {
      throw new Error('Email template not found');
    }

    // Soft delete
    await prisma.emailTemplate.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error deleting email template:', error);
    if (error instanceof Error && error.message === 'Email template not found') {
      throw error;
    }
    throw new Error('Failed to delete email template');
  }
};

const findEmailTemplates = async (
  withUser: boolean = false,
  prisma: PrismaClient = defaultPrisma
): Promise<EmailTemplateWithUser[] | PublicEmailTemplate[]> => {
  try {
    const emailTemplates = await prisma.emailTemplate.findMany({
      where: {
        deletedAt: null,
      },
      ...(withUser && {
        include: {
          user: true,
        },
      }),
      orderBy: {
        createdAt: 'desc',
      },
    });

    return emailTemplates;
  } catch (error) {
    console.error('Error fetching email templates with user:', error);
    throw new Error('Failed to fetch email templates');
  }
};

const findEmailTemplateByIdWithUser = async (
  id: number,
  prisma: PrismaClient = defaultPrisma
): Promise<EmailTemplateWithUser | null> => {
  try {
    const emailTemplate = await prisma.emailTemplate.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        user: true,
      },
    });

    return emailTemplate;
  } catch (error) {
    console.error('Error fetching email template with user:', error);
    throw new Error('Failed to fetch email template');
  }
};

export {
  createEmailTemplate,
  deleteEmailTemplate,
  findEmailTemplateById,
  findEmailTemplateByIdWithUser,
  findEmailTemplates,
  findEmailTemplatesByUserId,
  updateEmailTemplate,
};
