import { db } from '../index';
import { subscriptionPlans } from '../schema';
import { eq } from 'drizzle-orm';

const plans = [
    {
        name: 'Free',
        price: 0,
        monthlyCreditLimit: 10,
    },
    {
        name: 'Starter',
        price: 399,
        monthlyCreditLimit: 150,
    },
    {
        name: 'Pro',
        price: 999,
        monthlyCreditLimit: 500,
    },
    {
        name: 'Enterprise',
        price: -1, // Özel fiyat
        monthlyCreditLimit: -1, // Sınırsız
    },
];

async function seedPlans() {
    console.log('Seeding subscription plans...');

    for (const plan of plans) {
        const existing = await db.query.subscriptionPlans.findFirst({
            where: eq(subscriptionPlans.name, plan.name),
        });

        if (!existing) {
            await db.insert(subscriptionPlans).values({
                name: plan.name,
                price: plan.price,
                monthlyCreditLimit: plan.monthlyCreditLimit,
            });
            console.log(`Created plan: ${plan.name}`);
        } else {
            // Update existing plan details to match new definition
            await db.update(subscriptionPlans)
                .set({
                    price: plan.price,
                    monthlyCreditLimit: plan.monthlyCreditLimit,
                })
                .where(eq(subscriptionPlans.id, existing.id));
            console.log(`Updated plan: ${plan.name}`);
        }
    }

    console.log('Plans seeded successfully');
}

export { seedPlans };
seedPlans().catch(console.error).then(() => process.exit(0));
