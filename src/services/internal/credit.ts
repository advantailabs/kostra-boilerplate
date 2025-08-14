import { CREDIT_OPERATIONS, CREDIT_TRANSACTION_TYPES } from '@/lib/constants/credits';
import { prisma } from '@/lib/prisma';

export interface CreditTransactionInput {
  userId: number;
  amount: number;
  operation: keyof typeof CREDIT_OPERATIONS;
  objectId?: string;
  description?: string;
}

export class CreditService {
  /**
   * Deduct credits from user account and record transaction
   */
  static async deductCredits({
    userId,
    amount,
    operation,
    objectId,
    description,
  }: CreditTransactionInput): Promise<{ success: boolean; newBalance: number; error?: string }> {
    try {
      const result = await prisma.$transaction(async tx => {
        // Get current user credits
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { credits: true },
        });

        if (!user) {
          throw new Error('User not found');
        }

        if (user.credits < amount) {
          throw new Error('Insufficient credits');
        }

        const newBalance = user.credits - amount;

        // Update user credits
        await tx.user.update({
          where: { id: userId },
          data: { credits: newBalance },
        });

        // Record credit history
        await tx.creditHistory.create({
          data: {
            userId,
            type: CREDIT_TRANSACTION_TYPES.DEBIT,
            operation: CREDIT_OPERATIONS[operation],
            amount: -amount, // Negative for debit
            balanceAfter: newBalance,
            objectId,
            description,
          },
        });

        return { newBalance };
      });

      return { success: true, newBalance: result.newBalance };
    } catch (error) {
      console.error('Error deducting credits:', error);
      return {
        success: false,
        newBalance: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Add credits to user account and record transaction
   */
  static async addCredits({
    userId,
    amount,
    operation,
    objectId,
    description,
  }: CreditTransactionInput): Promise<{ success: boolean; newBalance: number; error?: string }> {
    try {
      const result = await prisma.$transaction(async tx => {
        // Get current user credits
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { credits: true },
        });

        if (!user) {
          throw new Error('User not found');
        }

        const newBalance = user.credits + amount;

        // Update user credits
        await tx.user.update({
          where: { id: userId },
          data: { credits: newBalance },
        });

        // Record credit history
        await tx.creditHistory.create({
          data: {
            userId,
            type: CREDIT_TRANSACTION_TYPES.CREDIT,
            operation: CREDIT_OPERATIONS[operation],
            amount, // Positive for credit
            balanceAfter: newBalance,
            objectId,
            description,
          },
        });

        return { newBalance };
      });

      return { success: true, newBalance: result.newBalance };
    } catch (error) {
      console.error('Error adding credits:', error);
      return {
        success: false,
        newBalance: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get user's current credit balance
   */
  static async getUserCredits(userId: number): Promise<number> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true },
      });

      return user?.credits || 0;
    } catch (error) {
      console.error('Error getting user credits:', error);
      return 0;
    }
  }

  /**
   * Get user's credit history
   */
  static async getCreditHistory(userId: number, limit = 50) {
    try {
      return await prisma.creditHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    } catch (error) {
      console.error('Error getting credit history:', error);
      return [];
    }
  }

  /**
   * Check if user has sufficient credits for an operation
   */
  static async hassufficientCredits(userId: number, amount: number): Promise<boolean> {
    try {
      const credits = await this.getUserCredits(userId);
      return credits >= amount;
    } catch (error) {
      console.error('Error checking credit sufficiency:', error);
      return false;
    }
  }
}
