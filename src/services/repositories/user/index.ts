import { prisma } from '@/lib/prisma';
import { UserPlan, UserRole } from '@/lib/prisma/generated/client';
import {
  UserFindManyArgs,
  UserOrderByWithRelationInput,
  UserWhereInput,
} from '@/lib/prisma/generated/models';

export interface CreateUserData {
  email: string;
  name: string;
  googleId?: string;
  password?: string;
  role?: UserRole;
  isOnboarded?: boolean;
  profilePicture?: string;
}

export interface GoogleUserUpdate {
  googleId?: string;
  name: string;
  email: string;
  profilePicture?: string;
  isOnboarded?: boolean;
  password?: string;
  role?: UserRole;
  credits: number;
  plan: UserPlan;
  isOverDue: boolean;
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
  planExpiringAt?: string | null | Date;
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
  const whereClause: UserWhereInput = { email };

  if (!includeDeleted) {
    whereClause.deletedAt = null;
  }

  return prisma.user.findFirst({
    where: whereClause,
  });
};

const createUser = async (user: CreateUserData) => {
  // Check if user already exists (including soft deleted users)
  const existingUser = await getUserByEmail(user.email, true);
  if (existingUser) {
    throw new Error('Email already exists');
  }

  // Determine role based on demo mode
  let role = user.role || UserRole.USER;
  if (process.env.IS_DEMO === 'true') {
    role = UserRole.ADMIN;
  }

  const userData: GoogleUserUpdate = {
    email: user.email,
    name: user.name,
    googleId: user.googleId,
    profilePicture: user.profilePicture,
    role: role,
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

// Advanced user filtering and sorting
export interface UserFilterOptions {
  search?: string;
  role?: UserRole;
  plan?: UserPlan;
  isOnboarded?: boolean;
  includeDeleted?: boolean;
  sortBy?:
    | 'id'
    | 'name'
    | 'email'
    | 'role'
    | 'plan'
    | 'isOnboarded'
    | 'credits'
    | 'createdAt'
    | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

const getUsersWithFilters = async (options: UserFilterOptions = {}) => {
  const {
    search = '',
    role,
    plan,
    isOnboarded,
    includeDeleted = false,
    sortBy = 'id',
    sortOrder = 'desc',
    limit,
    offset = 0,
  } = options;

  // Build where clause
  const whereClause: UserWhereInput = {};

  // Search filter
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Role filter
  if (role) {
    whereClause.role = role;
  }

  // Plan filter
  if (plan) {
    whereClause.plan = plan;
  }

  // Onboarding status filter
  if (isOnboarded !== undefined) {
    whereClause.isOnboarded = isOnboarded;
  }

  // Include deleted users
  if (!includeDeleted) {
    whereClause.deletedAt = null;
  }

  // Build orderBy clause
  const orderBy: UserOrderByWithRelationInput = {};
  orderBy[sortBy] = sortOrder;

  // Execute query
  const queryOptions: UserFindManyArgs = {
    where: whereClause,
    orderBy,
  };

  if (limit) {
    queryOptions.take = limit;
    queryOptions.skip = offset;
  }

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany(queryOptions),
    prisma.user.count({ where: whereClause }),
  ]);

  return {
    users,
    totalCount,
  };
};

const getUserByGoogleId = async (googleId: string) => {
  return prisma.user.findFirst({
    where: { googleId, deletedAt: null },
  });
};

const getUserById = async (userId: string | number | null | undefined) => {
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

const updateUserByStripeCustomerId = async (
  stripeCustomerId: string,
  updateData: UpdateUserData
) => {
  return prisma.user.updateMany({
    where: { stripeCustomerId },
    data: updateData,
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
  getUsersWithFilters,
  restoreUserById,
  setUserOverdue,
  setUserPlan,
  setUserStripeCustomerId,
  updateUserByEmail,
  updateUserById,
  updateUserByStripeCustomerId,
  updateUserGoogleId,
  upsertUser,
};
