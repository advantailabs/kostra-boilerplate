import { prisma as sharedPrisma } from '@/lib/prisma';
import { Campaign, CampaignStatus, PrismaClient } from '@/lib/prisma/generated/client';

import {
  CampaignWithRelations,
  CampaignWithTemplateAndRecipients,
  CreateCampaignData,
  UpdateCampaignData,
} from '@/types/campaign';

const defaultPrisma = sharedPrisma as PrismaClient;

const createCampaign = async (
  data: CreateCampaignData,
  prisma: PrismaClient = defaultPrisma
): Promise<Campaign> => {
  try {
    const campaign = await prisma.campaign.create({
      data: {
        userId: data.userId,
        name: data.name,
        emailTemplateId: data.emailTemplateId,
        description: data.description,
        status: data.status,
        scheduledAt: data.scheduledAt,
      },
    });

    return campaign;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw new Error('Failed to create campaign');
  }
};

const findCampaignsByUserId = async (
  userId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<Campaign[]> => {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return campaigns;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw new Error('Failed to fetch campaigns');
  }
};

const findCampaignById = async (
  id: number,
  prisma: PrismaClient = defaultPrisma
): Promise<Campaign | null> => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: {
        id,
      },
    });

    return campaign;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    throw new Error('Failed to fetch campaign');
  }
};

const findCampaignByIdWithRelations = async (
  id: number,
  prisma: PrismaClient = defaultPrisma
): Promise<CampaignWithRelations | null> => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        emailTemplate: {
          select: {
            id: true,
            name: true,
            subject: true,
            fromEmail: true,
            fromName: true,
            body: true,
            variables: true,
          },
        },
        recipients: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return campaign;
  } catch (error) {
    console.error('Error fetching campaign with relations:', error);
    throw new Error('Failed to fetch campaign');
  }
};

const updateCampaign = async (
  id: number,
  data: UpdateCampaignData,
  prisma: PrismaClient = defaultPrisma
): Promise<Campaign> => {
  try {
    // First check if the campaign exists
    const existingCampaign = await prisma.campaign.findUnique({
      where: {
        id,
      },
    });

    if (!existingCampaign) {
      throw new Error('Campaign not found');
    }

    const { recipients: _recipients, ...campaignData } = data;

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        ...campaignData,
        updatedAt: new Date(),
      },
    });

    return updatedCampaign;
  } catch (error) {
    console.error('Error updating campaign:', error);
    if (error instanceof Error && error.message === 'Campaign not found') {
      throw error;
    }
    throw new Error('Failed to update campaign');
  }
};

const deleteCampaign = async (id: number, prisma: PrismaClient = defaultPrisma): Promise<void> => {
  try {
    // First check if the campaign exists
    const existingCampaign = await prisma.campaign.findUnique({
      where: {
        id,
      },
    });

    if (!existingCampaign) {
      throw new Error('Campaign not found');
    }

    // Delete campaign (this will cascade delete recipients due to onDelete: Cascade)
    await prisma.campaign.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    if (error instanceof Error && error.message === 'Campaign not found') {
      throw error;
    }
    throw new Error('Failed to delete campaign');
  }
};

const findCampaigns = async (
  withRelations: boolean = false,
  prisma: PrismaClient = defaultPrisma
): Promise<Campaign[] | CampaignWithRelations[]> => {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: withRelations
        ? {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            emailTemplate: {
              select: {
                id: true,
                name: true,
                subject: true,
                fromEmail: true,
                fromName: true,
                body: true,
                variables: true,
              },
            },
            recipients: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          }
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return campaigns;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw new Error('Failed to fetch campaigns');
  }
};

const updateCampaignStatus = async (
  id: number,
  status: CampaignStatus,
  prisma: PrismaClient = defaultPrisma
): Promise<Campaign> => {
  try {
    // First check if the campaign exists
    const existingCampaign = await prisma.campaign.findUnique({
      where: {
        id,
      },
    });

    if (!existingCampaign) {
      throw new Error('Campaign not found');
    }

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
    });

    return updatedCampaign;
  } catch (error) {
    console.error('Error updating campaign status:', error);
    if (error instanceof Error && error.message === 'Campaign not found') {
      throw error;
    }
    throw new Error('Failed to update campaign status');
  }
};

/**
 * Find campaigns scheduled to send at or before now that still have PENDING recipients.
 * Returns lightweight data: campaign id and pending recipient ids.
 */
const findDueScheduledCampaignsWithPendingRecipients = async (
  prisma: PrismaClient = defaultPrisma
): Promise<Array<{ id: number; recipientIds: number[] }>> => {
  try {
    const now = new Date();

    const campaigns = await prisma.campaign.findMany({
      where: {
        status: 'SCHEDULED' as CampaignStatus,
        scheduledAt: { lte: now },
      },
      include: {
        recipients: {
          where: { status: 'PENDING' },
          select: { id: true },
        },
      },
    });

    return campaigns
      .map(c => ({ id: c.id, recipientIds: c.recipients.map(r => r.id) }))
      .filter(c => c.recipientIds.length > 0);
  } catch (error) {
    console.error('Error fetching due scheduled campaigns:', error);
    throw new Error('Failed to fetch due scheduled campaigns');
  }
};

/**
 * Find campaign with email template and pending recipients filtered by recipient IDs.
 * Used for sending campaign emails to specific recipients.
 */
const findCampaignWithTemplateAndPendingRecipients = async (
  campaignId: number,
  recipientIds: number[],
  prisma: PrismaClient = defaultPrisma
): Promise<CampaignWithTemplateAndRecipients | null> => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        emailTemplate: true,
        recipients: {
          where: {
            id: { in: recipientIds },
            status: 'PENDING',
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isOnboarded: true,
                credits: true,
                plan: true,
                isOverDue: true,
                planExpiringAt: true,
              },
            },
          },
        },
      },
    });

    return campaign;
  } catch (error) {
    console.error('Error fetching campaign with template and pending recipients:', error);
    throw new Error('Failed to fetch campaign with template and pending recipients');
  }
};

export {
  createCampaign,
  deleteCampaign,
  findCampaignById,
  findCampaignByIdWithRelations,
  findCampaigns,
  findCampaignsByUserId,
  findCampaignWithTemplateAndPendingRecipients,
  findDueScheduledCampaignsWithPendingRecipients,
  updateCampaign,
  updateCampaignStatus,
};
