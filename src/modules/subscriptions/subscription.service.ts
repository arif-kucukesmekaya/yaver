
import { db } from '../../core/database';
import { userSubscriptions, subscriptionPlans, userCredits } from '../../core/database/schema';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '../../shared/utils/errors';

export class SubscriptionService {
    /**
     * Upgrade user's subscription plan
     */
    static async upgradeSubscription(userId: number, planName: string) {
        // 1. Get Plan
        const plan = await db.query.subscriptionPlans.findFirst({
            where: eq(subscriptionPlans.name, planName),
        });

        if (!plan) {
            throw new NotFoundError(`Plan '${planName}' not found`);
        }

        // 2. Check existing subscription
        const existingSub = await db.query.userSubscriptions.findFirst({
            where: eq(userSubscriptions.userId, userId),
        });

        const now = new Date();

        // User Restriction: Cannot change plan if currently on an active paid plan
        if (existingSub && existingSub.isActive && existingSub.endDate && new Date(existingSub.endDate) > now) {
            const currentPlan = await db.query.subscriptionPlans.findFirst({
                where: eq(subscriptionPlans.id, existingSub.planId)
            });

            // If current plan is paid (price > 0)
            if (currentPlan && currentPlan.price > 0) {
                // Formatting date for friendly message
                const endDateStr = new Date(existingSub.endDate).toLocaleDateString('tr-TR');

                throw new Error(`Mevcut "${currentPlan.name}" aboneliğiniz ${endDateStr} tarihine kadar aktiftir. Bu süre dolmadan plan değişikliği yapamazsınız. İhtiyacınız varsa ek kredi paketi satın alabilirsiniz.`);
            }
        }

        // Determine start and end dates
        // If upgrading, we usually start a new cycle from today.
        const newStartDate = now;
        const newEndDate = new Date(now);
        newEndDate.setMonth(newEndDate.getMonth() + 1);

        // 3. Update or Create Subscription
        if (existingSub) {
            await db.update(userSubscriptions)
                .set({
                    planId: plan.id,
                    isActive: true,
                    startDate: newStartDate,
                    endDate: newEndDate,
                    updatedAt: now,
                })
                .where(eq(userSubscriptions.id, existingSub.id));
        } else {
            await db.insert(userSubscriptions).values({
                userId,
                planId: plan.id,
                startDate: newStartDate,
                endDate: newEndDate,
                isActive: true,
            });
        }

        // 4. Reset/Update Subscription Credits to new Plan limit
        // Assuming upgrade gives immediate access to full plan credits
        const limit = plan.monthlyCreditLimit === -1 ? 999999 : plan.monthlyCreditLimit;

        await db.update(userCredits)
            .set({
                subscriptionCredits: limit,
                // We do NOT reset extra credits, they are persistent
                lastRefillDate: now,
                updatedAt: now,
            })
            .where(eq(userCredits.userId, userId));

        return {
            success: true,
            plan: plan.name,
            credits: limit,
            endDate: newEndDate,
        };
    }
}
