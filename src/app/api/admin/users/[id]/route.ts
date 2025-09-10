import { getAuthUser } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';
import { internalServerErrorResponse, unauthorizedResponse } from '@/lib/utils/response';
import { getUserById } from '@/services/repositories/user';
import { UserRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser || authUser.role !== 'ADMIN') {
      return unauthorizedResponse();
    }

    const targetUserId = parseInt(params.id, 10);
    if (Number.isNaN(targetUserId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const user = await getUserById(targetUserId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const response = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role,
        isOnboarded: user.isOnboarded,
        credits: user.credits,
        plan: user.plan,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user:', error);
    return internalServerErrorResponse();
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser || authUser.role !== 'ADMIN') {
      return unauthorizedResponse();
    }

    const targetUserId = parseInt(params.id, 10);
    if (Number.isNaN(targetUserId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, email, role } = body;

    // Validate role if provided
    if (role && !Object.values(UserRole).includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const user = await getUserById(targetUserId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
      },
    });

    const response = {
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        role: updatedUser.role,
        isOnboarded: updatedUser.isOnboarded,
        credits: updatedUser.credits,
        plan: updatedUser.plan,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating user:', error);
    return internalServerErrorResponse();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getAuthUser(request);

    if (!authUser || authUser.role !== 'ADMIN') {
      return unauthorizedResponse();
    }

    const targetUserId = parseInt(params.id, 10);
    if (Number.isNaN(targetUserId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (targetUserId === authUser.userId) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    const user = await getUserById(targetUserId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Soft delete user
    await prisma.user.update({
      where: { id: targetUserId },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return internalServerErrorResponse();
  }
}
