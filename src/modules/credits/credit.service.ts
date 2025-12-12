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

    return userCredit.availableCredits >= requiredAmount;
  }

  /**
   * Get user's available credits
   */
  static async getUserCredits(userId: number): Promise<number> {
    const userCredit = await db.query.userCredits.findFirst({
      where: eq(userCredits.userId, userId),
    });

    return userCredit?.availableCredits || 0;
  }

  /**
   * Deduct credits from user
   */
  static async deductCredits(
    userId: number,
    amount: number,
    description: string
  ): Promise<void> {
    const hasCredits = await this.hasEnoughCredits(userId, amount);

    if (!hasCredits) {
      const available = await this.getUserCredits(userId);
      throw new InsufficientCreditsError(
        `Insufficient credits. Required: ${amount}, Available: ${available}`
      );
    }

    // Create transaction record
    await db.insert(creditTransactions).values({
      userId,
      amount: -amount,
      transactionType: 'usage',
      description,
    });

    // Note: The trigger will automatically update user_credits.available_credits
  }

  /**
   * Add credits to user
   */
  static async addCredits(
    userId: number,
    amount: number,
    description: string
  ): Promise<void> {
    // Create transaction record
    await db.insert(creditTransactions).values({
      userId,
      amount,
      transactionType: 'purchase',
      description,
    });

    // Note: The trigger will automatically update user_credits.available_credits
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
