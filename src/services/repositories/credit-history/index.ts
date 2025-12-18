import { prisma } from '@/lib/prisma';

export const addCreditsAndUpdateCreditHistoryTransaction = async ({
  invoiceId,
  customerId,
  proCreditsToAdd,
  packCreditsToAdd,
}: {
  invoiceId: string;
  customerId: string;
  proCreditsToAdd: number;
  packCreditsToAdd: number;
}) => {
  return prisma.$transaction(async tx => {
    const existing = await tx.creditHistory.findFirst({
      where: { objectId: invoiceId },
      select: { id: true },
    });
    if (existing) return;

    const user = await tx.user.findFirst({
      where: { stripeCustomerId: customerId },
      select: { id: true, credits: true },
    });
    if (!user) return;

    // If this invoice includes a pro subscription renewal, reset credits to 0 for new cycle
    const baseCredits = proCreditsToAdd > 0 ? 0 : user.credits || 0;
    const newBalance = baseCredits + proCreditsToAdd + packCreditsToAdd;

    await tx.user.update({ where: { id: user.id }, data: { credits: newBalance } });
    await tx.creditHistory.create({
      data: {
        userId: user.id,
        type: 'CREDIT',
        operation: 'INITIAL_CREDITS',
        amount: proCreditsToAdd + packCreditsToAdd,
        balanceAfter: newBalance,
        objectId: invoiceId,
        description: `Credit purchase via Stripe invoice`,
      },
    });
  });
};
