import { prisma } from '@/lib/prisma';
import { UserPlan, UserRole } from '@prisma/client';

import { ClerkUserUpdate } from '@/app/types/user.type';

const upsertUser = async (user: ClerkUserUpdate) => {
  return prisma.user.upsert({
    where: { clerkUserId: user.clerkUserId },
    update: { ...user },
    create: user,
  });
};

const deleteUser = async (clerkUserId: string) => {
  return prisma.user.update({
    where: { clerkUserId },
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

const getUserByClerkId = async (clerkId: string) => {
  return prisma.user.findUnique({
    where: { clerkUserId: clerkId },
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
  getUserByClerkId,
  getUserByRole,
  setUserOverdue,
  setUserPlan,
  setUserStripeCustomerId,
  upsertUser,
};
