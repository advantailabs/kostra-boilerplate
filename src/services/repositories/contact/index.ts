import { prisma } from '@/lib/prisma';
import { ContactPurpose, ContactStatus, ContactSubmission } from '@/lib/prisma/generated/client';
import { ContactSubmissionScalarWhereInput } from '@/lib/prisma/generated/models';
import { ContactSubmissionFilters, ContactSubmissionResponse } from '@/types/contact';

export interface ContactRepository {
  create(_data: {
    userId?: number;
    name: string;
    email: string;
    purpose: ContactPurpose;
    message: string;
  }): Promise<ContactSubmission>;

  findById(_id: number): Promise<ContactSubmission | null>;

  findByUuid(_uuid: string): Promise<ContactSubmission | null>;

  findMany(_filters: ContactSubmissionFilters): Promise<ContactSubmissionResponse>;

  update(
    _id: number,
    _data: {
      status?: ContactStatus;
      adminNotes?: string;
      resolvedAt?: Date;
    }
  ): Promise<ContactSubmission>;

  delete(_id: number): Promise<void>;
}

export const contactRepository: ContactRepository = {
  async create(data) {
    return prisma.contactSubmission.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  async findById(id: number) {
    return prisma.contactSubmission.findUnique({
      where: { id, deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  async findByUuid(uuid: string) {
    return prisma.contactSubmission.findUnique({
      where: { uuid, deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  async findMany(filters: ContactSubmissionFilters) {
    const { status, purpose, search, page = '1', limit = '20' } = filters;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: ContactSubmissionScalarWhereInput = {
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    if (purpose) {
      where.purpose = purpose;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [submissions, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.contactSubmission.count({ where }),
    ]);

    return {
      submissions,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  },

  async update(id: number, data) {
    return prisma.contactSubmission.update({
      where: { id, deletedAt: null },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  async delete(id: number) {
    await prisma.contactSubmission.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
