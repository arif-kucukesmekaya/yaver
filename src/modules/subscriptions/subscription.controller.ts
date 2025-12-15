
import { Context } from 'hono';
import { SubscriptionService } from './subscription.service';

export class SubscriptionController {
    static async upgrade(c: Context) {
        const user = c.get('user'); // populated by auth middleware
        const { planId, planName } = await c.req.json();

        // Use planName or planId. Frontend sends planId as string name usually based on plans array
        const targetPlan = planName || planId;

        if (!targetPlan) {
            return c.json({ success: false, message: 'Plan Name is required' }, 400);
        }

        try {
            const result = await SubscriptionService.upgradeSubscription(user.id, targetPlan);
            return c.json({ success: true, data: result });
        } catch (error) {
            if (error instanceof Error) {
                return c.json({ success: false, message: error.message }, 400);
            }
            return c.json({ success: false, message: 'Upgrade failed' }, 500);
        }
    }
}
