import { prisma } from '@/lib/prisma';
import { UserPlan, UserRole } from '@prisma/client';

export interface GoogleUserUpdate {
  googleId?: string;
  name: string;
  email: string;
  profilePicture?: string;
  isOnboarded?: boolean;
  password?: string;
  role?: UserRole;
}

// Interface for updating user by ID (admin operations)
export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: UserRole;
  profilePicture?: string;
  isOnboarded?: boolean;
  credits?: number;
  plan?: UserPlan;
  isOverDue?: boolean;
  stripeCustomerId?: string;
  planExpiringAt?: string;
  password?: string;
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

const getUserByEmail = async (email: string, includeDeleted: boolean = false) => {
  const whereClause: any = { email };

  if (!includeDeleted) {
    whereClause.deletedAt = null;
  }

  return prisma.user.findFirst({
    where: whereClause,
  });
};

const createUser = async (user: GoogleUserUpdate) => {
  // Check if user already exists (including soft deleted users)
  const existingUser = await getUserByEmail(user.email, true);
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const userData: any = {
    email: user.email,
    name: user.name,
    googleId: user.googleId,
    profilePicture: user.profilePicture,
    role: user.role || UserRole.USER,
    isOnboarded: user.isOnboarded ?? true,
    credits: 100,
    plan: UserPlan.FREE,
    isOverDue: false,
  };

  // Only add password if it exists
  if (user.password) {
    userData.password = user.password;
  }

  return prisma.user.create({
    data: userData,
  });
};

const deleteUser = async (googleId: string) => {
  return prisma.user.update({
    where: { googleId },
    data: { deletedAt: new Date() },
  });
};

const getUserByRole = async (
  role: UserRole,
  includeAdmins: boolean = false,
  includeDeleted: boolean = false
) => {
  let roles: UserRole[] = [];
  if (includeAdmins) {
    roles = [UserRole.ADMIN, role];
  } else {
    roles = [role];
  }
  return prisma.user.findMany({
    where: {
      role: { in: roles },
      ...(includeDeleted ? {} : { deletedAt: null }),
    },
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
    where: { id, deletedAt: null },
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
    where: {
      deletedAt: null,
      OR: [{ googleId }, { email }],
    },
  });
};

const updateUserGoogleId = async (userId: number, googleId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { googleId },
  });
};

// Update user by ID (for admin operations)
const updateUserById = async (userId: number, userData: UpdateUserData) => {
  return prisma.user.update({
    where: { id: userId },
    data: userData,
  });
};

const updateUserByEmail = async (email: string, userData: UpdateUserData) => {
  return prisma.user.update({
    where: { email },
    data: userData,
  });
};

// Soft delete user by ID (for admin operations)
const deleteUserById = async (userId: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() },
  });
};

// Restore soft-deleted user by ID
const restoreUserById = async (userId: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: { deletedAt: null },
  });
};

export {
  createUser,
  deleteUser,
  deleteUserById,
  getUserByEmail,
  getUserByGoogleId,
  getUserByGoogleIdOrEmail,
  getUserById,
  getUserByRole,
  restoreUserById,
  setUserOverdue,
  setUserPlan,
  setUserStripeCustomerId,
  updateUserByEmail,
  updateUserById,
  updateUserGoogleId,
  upsertUser,
};
