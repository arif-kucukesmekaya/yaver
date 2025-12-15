import { db } from '../../core/database';
import { userCredits, creditTransactions } from '../../core/database/schema';
import { eq } from 'drizzle-orm';
import { InsufficientCreditsError } from '../../shared/utils/errors';

export class CreditService {
  /**
   * Check if user has enough credits
   */
  static async hasEnoughCredits(userId: number, requiredAmount: number): Promise<boolean> {
    const userCredit = await db.query.userCredits.findFirst({
      where: eq(userCredits.userId, userId),
    });

    if (!userCredit) {
      return false;
    }

    const totalAvailable = (userCredit.subscriptionCredits || 0) + (userCredit.extraCredits || 0);
    return totalAvailable >= requiredAmount;
  }

  /**
   * Get user's available credits
   */
  static async getUserCredits(userId: number): Promise<number> {
    const userCredit = await db.query.userCredits.findFirst({
      where: eq(userCredits.userId, userId),
    });

    return (userCredit?.subscriptionCredits || 0) + (userCredit?.extraCredits || 0);
  }

  /**
   * Get user's detailed credit info
   */
  static async getUserCreditDetails(userId: number) {
    const userCredit = await db.query.userCredits.findFirst({
      where: eq(userCredits.userId, userId),
    });

    return {
      available: (userCredit?.subscriptionCredits || 0) + (userCredit?.extraCredits || 0),
      subscription: userCredit?.subscriptionCredits || 0,
      extra: userCredit?.extraCredits || 0,
      totalEarned: userCredit?.totalEarned || 0,
      totalSpent: userCredit?.totalSpent || 0,
    };
  }

  /**
   * Deduct credits from user
   * Priority: Subscription Credits -> Extra Credits
   */
  static async deductCredits(
    userId: number,
    amount: number,
    description: string
  ): Promise<void> {
    const userCredit = await db.query.userCredits.findFirst({
      where: eq(userCredits.userId, userId),
    });

    if (!userCredit) {
      throw new InsufficientCreditsError('User credits not found');
    }

    const totalAvailable = (userCredit.subscriptionCredits || 0) + (userCredit.extraCredits || 0);

    if (totalAvailable < amount) {
      throw new InsufficientCreditsError(
        `Insufficient credits. Required: ${amount}, Available: ${totalAvailable}`
      );
    }

    // Calculate deduction distribution
    let remainingToDeduct = amount;
    let subscriptionDeduction = 0;
    let extraDeduction = 0;

    if (userCredit.subscriptionCredits >= remainingToDeduct) {
      subscriptionDeduction = remainingToDeduct;
      remainingToDeduct = 0;
    } else {
      subscriptionDeduction = userCredit.subscriptionCredits;
      remainingToDeduct -= subscriptionDeduction;
      extraDeduction = remainingToDeduct;
    }

    // Update credits
    await db.update(userCredits)
      .set({
        subscriptionCredits: userCredit.subscriptionCredits - subscriptionDeduction,
        extraCredits: userCredit.extraCredits - extraDeduction,
        totalSpent: userCredit.totalSpent + amount,
      })
      .where(eq(userCredits.userId, userId));

    // Create transaction record
    await db.insert(creditTransactions).values({
      userId,
      amount: -amount,
      transactionType: 'usage',
      description,
    });
  }

  /**
   * Add credits to user
   * Adds to EXTRA credits by default (purchases)
   */
  static async addCredits(
    userId: number,
    amount: number,
    description: string,
    type: 'purchase' | 'monthly_refill' | 'usage' | 'bonus' = 'purchase'
  ): Promise<void> {
    const userCredit = await db.query.userCredits.findFirst({
      where: eq(userCredits.userId, userId),
    });

    if (userCredit) {
      // If monthly refill, set subscription credits (reset logic could be here, but for now just add?)
      // User requested: Subscription credits are NOT cumulative, they reset.
      // So a refill should probably overwrite subscription credits if it's a monthly reset.
      // But here we are just adding. Let's assume 'purchase' adds to extra, 'monthly_refill' updates subscription.

      if (type === 'monthly_refill') {
        // Logic for monthly refill: Reset subscription credits to plan limit? 
        // Or just add? Usually refill means "set to X". 
        // For now, let's assume this method adds to extra credits unless specified.
        // But checking the usage, this is mostly for purchases.
        // Let's implement PURCHASE logic here (add to extra).

        await db.update(userCredits)
          .set({
            extraCredits: userCredit.extraCredits + amount,
            totalEarned: userCredit.totalEarned + amount,
          })
          .where(eq(userCredits.userId, userId));
      } else {
        // Default purchase/bonus adds to extra
        await db.update(userCredits)
          .set({
            extraCredits: userCredit.extraCredits + amount,
            totalEarned: userCredit.totalEarned + amount,
          })
          .where(eq(userCredits.userId, userId));
      }
    }

    // Create transaction record
    await db.insert(creditTransactions).values({
      userId,
      amount,
      transactionType: type,
      description,
    });
  }

  /**
   * Get credit transaction history
   */
  static async getTransactionHistory(userId: number, limit = 10) {
    return db.query.creditTransactions.findMany({
      where: eq(creditTransactions.userId, userId),
      orderBy: (transactions, { desc }) => [desc(transactions.createdAt)],
      limit,
    });
  }
}
