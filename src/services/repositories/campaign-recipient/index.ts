import { prisma as sharedPrisma } from '@/lib/prisma';
import { CampaignRecipient, PrismaClient } from '@/lib/prisma/generated/client';
import { generateEmailHtmlWithUserData, UserData } from '@/lib/utils/email';

import {
  CampaignRecipientWithUser,
  CreateCampaignRecipientData,
  UpdateCampaignRecipientData,
} from '@/types/campaign';

const defaultPrisma = sharedPrisma as PrismaClient;

const createCampaignRecipient = async (
  data: CreateCampaignRecipientData,
  prisma: PrismaClient = defaultPrisma
): Promise<CampaignRecipient> => {
  try {
    const campaignRecipient = await prisma.campaignRecipient.create({
      data: {
        campaignId: data.campaignId,
        userId: data.userId,
        status: data.status || 'PENDING',
        emailBody: data.emailBody,
      },
    });

    return campaignRecipient;
  } catch (error) {
    console.error('Error creating campaign recipient:', error);
    throw new Error('Failed to create campaign recipient');
  }
};

const findCampaignRecipientsByCampaignId = async (
  campaignId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<CampaignRecipient[]> => {
  try {
    const campaignRecipients = await prisma.campaignRecipient.findMany({
      where: {
        campaignId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return campaignRecipients;
  } catch (error) {
    console.error('Error fetching campaign recipients:', error);
    throw new Error('Failed to fetch campaign recipients');
  }
};

const findCampaignRecipientsByUserId = async (
  userId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<CampaignRecipient[]> => {
  try {
    const campaignRecipients = await prisma.campaignRecipient.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return campaignRecipients;
  } catch (error) {
    console.error('Error fetching campaign recipients:', error);
    throw new Error('Failed to fetch campaign recipients');
  }
};

const findCampaignRecipientById = async (
  id: number,
  withRelations: boolean = false,
  prisma: PrismaClient = defaultPrisma
): Promise<CampaignRecipient | CampaignRecipientWithUser | null> => {
  try {
    const campaignRecipient = await prisma.campaignRecipient.findUnique({
      where: {
        id,
      },
      include: withRelations
        ? {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            campaign: {
              select: {
                id: true,
                name: true,
                status: true,
              },
            },
          }
        : undefined,
    });

    return campaignRecipient;
  } catch (error) {
    console.error('Error fetching campaign recipient:', error);
    throw new Error('Failed to fetch campaign recipient');
  }
};

const updateCampaignRecipient = async (
  id: number,
  data: UpdateCampaignRecipientData,
  prisma: PrismaClient = defaultPrisma
): Promise<CampaignRecipient> => {
  try {
    // First check if the campaign recipient exists
    const existingCampaignRecipient = await prisma.campaignRecipient.findUnique({
      where: {
        id,
      },
    });

    if (!existingCampaignRecipient) {
      throw new Error('Campaign recipient not found');
    }

    // Prevent changing status from FAILED to PENDING
    if (existingCampaignRecipient.status === 'FAILED' && data.status === 'PENDING') {
      throw new Error('Cannot change recipient status from FAILED to PENDING');
    }

    const updatedCampaignRecipient = await prisma.campaignRecipient.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return updatedCampaignRecipient;
  } catch (error) {
    console.error('Error updating campaign recipient:', error);
    if (error instanceof Error && error.message === 'Campaign recipient not found') {
      throw error;
    }
    if (
      error instanceof Error &&
      error.message === 'Cannot change recipient status from FAILED to PENDING'
    ) {
      throw error;
    }
    throw new Error('Failed to update campaign recipient');
  }
};

const deleteCampaignRecipient = async (
  id: number,
  prisma: PrismaClient = defaultPrisma
): Promise<void> => {
  try {
    // First check if the campaign recipient exists
    const existingCampaignRecipient = await prisma.campaignRecipient.findUnique({
      where: {
        id,
      },
    });

    if (!existingCampaignRecipient) {
      throw new Error('Campaign recipient not found');
    }

    await prisma.campaignRecipient.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting campaign recipient:', error);
    if (error instanceof Error && error.message === 'Campaign recipient not found') {
      throw error;
    }
    throw new Error('Failed to delete campaign recipient');
  }
};

const deleteCampaignRecipients = async (
  ids: number[],
  prisma: PrismaClient = defaultPrisma
): Promise<void> => {
  try {
    if (ids.length === 0) {
      return;
    }

    await prisma.campaignRecipient.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  } catch (error) {
    console.error('Error bulk deleting campaign recipients:', error);
    throw new Error('Failed to delete campaign recipients');
  }
};

const findCampaignRecipients = async (
  prisma: PrismaClient = defaultPrisma
): Promise<CampaignRecipient[]> => {
  try {
    const campaignRecipients = await prisma.campaignRecipient.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return campaignRecipients;
  } catch (error) {
    console.error('Error fetching campaign recipients:', error);
    throw new Error('Failed to fetch campaign recipients');
  }
};

const findCampaignRecipientsWithRelations = async (
  prisma: PrismaClient = defaultPrisma
): Promise<CampaignRecipientWithUser[]> => {
  try {
    const campaignRecipients = await prisma.campaignRecipient.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        campaign: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return campaignRecipients;
  } catch (error) {
    console.error('Error fetching campaign recipients with relations:', error);
    throw new Error('Failed to fetch campaign recipients');
  }
};

const createCampaignRecipients = async (
  campaignId: number,
  userIds: number[],
  emailBody?: string,
  prisma: PrismaClient = defaultPrisma
): Promise<CampaignRecipient[]> => {
  try {
    // If emailBody is provided, check if it's a template (contains variables) or pre-generated body
    if (emailBody) {
      const hasVariables = /\{\{[^}]+\}\}/.test(emailBody);

      if (hasVariables) {
        // It's a template with variables - generate personalized emails
        const users = await prisma.user.findMany({
          where: {
            id: {
              in: userIds,
            },
          },
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
            role: true,
            isOnboarded: true,
            credits: true,
            stripeCustomerId: true,
            plan: true,
            isOverDue: true,
            planExpiringAt: true,
          },
        });

        // Create recipients with personalized email bodies
        const recipientsData = users.map(user => {
          const userData: UserData = {
            id: user.id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture || undefined,
            role: user.role,
            isOnboarded: user.isOnboarded,
            credits: user.credits,
            stripeCustomerId: user.stripeCustomerId || undefined,
            plan: user.plan,
            isOverDue: user.isOverDue,
            planExpiringAt: user.planExpiringAt || undefined,
          };

          // Generate personalized email body for this user
          const personalizedEmailBody = generateEmailHtmlWithUserData(emailBody, userData);

          return {
            campaignId,
            userId: user.id,
            emailBody: personalizedEmailBody,
            status: 'PENDING' as const,
          };
        });

        await prisma.campaignRecipient.createMany({
          data: recipientsData,
        });
      } else {
        // It's a pre-generated email body - use it for all recipients
        await prisma.campaignRecipient.createMany({
          data: userIds.map(userId => ({
            campaignId,
            userId,
            emailBody,
            status: 'PENDING',
          })),
        });
      }
    } else {
      // No email body provided - create recipients without email body
      await prisma.campaignRecipient.createMany({
        data: userIds.map(userId => ({
          campaignId,
          userId,
          emailBody: null,
          status: 'PENDING',
        })),
      });
    }

    // Return the created recipients
    const createdRecipients = await prisma.campaignRecipient.findMany({
      where: {
        campaignId,
        userId: {
          in: userIds,
        },
      },
    });

    return createdRecipients;
  } catch (error) {
    console.error('Error creating campaign recipients:', error);
    throw new Error('Failed to create campaign recipients');
  }
};

const findFailedRecipientsByCampaignId = async (
  campaignId: number,
  prisma: PrismaClient = defaultPrisma
): Promise<CampaignRecipient[]> => {
  try {
    const failedRecipients = await prisma.campaignRecipient.findMany({
      where: {
        campaignId,
        status: 'FAILED',
        errorMessage: {
          not: null,
        },
      },
    });

    return failedRecipients;
  } catch (error) {
    console.error('Error fetching failed recipients:', error);
    throw new Error('Failed to fetch failed recipients');
  }
};

/**
 * Mark campaign recipient as SENT with email body and sent timestamp.
 */
const markRecipientAsSent = async (
  id: number,
  emailBody: string,
  prisma: PrismaClient = defaultPrisma
): Promise<CampaignRecipient> => {
  return prisma.campaignRecipient.update({
    where: { id },
    data: {
      status: 'SENT',
      sentAt: new Date(),
      emailBody,
      updatedAt: new Date(),
    },
  });
};

/**
 * Mark campaign recipient as FAILED with error message.
 */
const markRecipientAsFailed = async (
  id: number,
  errorMessage: string,
  prisma: PrismaClient = defaultPrisma
): Promise<CampaignRecipient> => {
  return prisma.campaignRecipient.update({
    where: { id },
    data: {
      status: 'FAILED',
      errorMessage,
      updatedAt: new Date(),
    },
  });
};

export {
  createCampaignRecipient,
  createCampaignRecipients,
  deleteCampaignRecipient,
  deleteCampaignRecipients,
  findCampaignRecipientById,
  findCampaignRecipients,
  findCampaignRecipientsByCampaignId,
  findCampaignRecipientsByUserId,
  findCampaignRecipientsWithRelations,
  findFailedRecipientsByCampaignId,
  markRecipientAsFailed,
  markRecipientAsSent,
  updateCampaignRecipient,
};
