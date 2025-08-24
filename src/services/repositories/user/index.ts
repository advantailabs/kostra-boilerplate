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
  return prisma.user.findUnique({
    where: { googleId },
  });
};

const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
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

export {
  deleteUser,
  getUserByEmail,
  getUserByGoogleId,
  getUserByRole,
  setUserOverdue,
  setUserPlan,
  setUserStripeCustomerId,
  upsertUser,
};
