import { prisma } from '@/lib/prisma';
import { UserPlan, UserRole } from '@prisma/client';

export interface GoogleUserUpdate {
  googleId: string;
  name: string;
  email: string;
  profilePicture?: string;
  isOnboarded?: boolean;
}

const upsertUser = async (user: GoogleUserUpdate) => {
  return prisma.user.upsert({
    where: { googleId: user.googleId },
    update: { ...user },
    create: {
      ...user,
      isOnboarded: user.isOnboarded ?? false,
    },
  });
};

const createUser = async (user: GoogleUserUpdate) => {
  return prisma.user.create({
    data: {
      email: user.email,
      name: user.name,
      googleId: user.googleId,
      profilePicture: user.profilePicture,
      role: 'USER',
      isOnboarded: true,
      credits: 100,
      plan: UserPlan.FREE,
      isOverDue: false,
    },
  });
};

const deleteUser = async (googleId: string) => {
  return prisma.user.update({
    where: { googleId },
    data: { deletedAt: new Date() },
  });
};

const getUserByRole = async (role: UserRole, includeAdmins: boolean = false) => {
  let roles: UserRole[] = [];
  if (includeAdmins) {
    roles = [UserRole.ADMIN, role];
  } else {
    roles = [role];
  }
  return prisma.user.findMany({
    where: { role: { in: roles } },
  });
};

const getUserByGoogleId = async (googleId: string) => {
  return prisma.user.findFirst({
    where: { googleId, deletedAt: null },
  });
};

const getUserById = async (userId: string | number | null) => {
  const id = Number(userId);

  if (!id || id <= 0) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id },
  });
};

const getUserByEmail = async (email: string) => {
  return prisma.user.findFirst({
    where: { email, deletedAt: null },
  });
};

const setUserStripeCustomerId = async (userId: number, stripeCustomerId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId },
  });
};

const setUserPlan = async (userId: number, plan: UserPlan) => {
  return prisma.user.update({
    where: { id: userId },
    data: { plan },
  });
};

const setUserOverdue = async (userId: number, isOverDue: boolean) => {
  return prisma.user.update({
    where: { id: userId },
    data: { isOverDue },
  });
};

const getUserByGoogleIdOrEmail = async (googleId: string, email: string) => {
  return prisma.user.findFirst({
    where: { OR: [{ googleId }, { email }] },
  });
};

const updateUserGoogleId = async (userId: number, googleId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { googleId },
  });
};

export {
  createUser,
  deleteUser,
  getUserByEmail,
  getUserByGoogleId,
  getUserByGoogleIdOrEmail,
  getUserById,
  getUserByRole,
  setUserOverdue,
  setUserPlan,
  setUserStripeCustomerId,
  updateUserGoogleId,
  upsertUser,
};
