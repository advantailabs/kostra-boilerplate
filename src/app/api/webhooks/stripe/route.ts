import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { PLANS_CONFIG } from '@/data/config/plans';
import { prisma } from '@/lib/prisma';
import { getStripeWebhookSecret, stripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const sig = (await headers()).get('stripe-signature') || '';
  const webhookSecret = getStripeWebhookSecret();

  let event;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed.', err);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = Number(session.metadata?.userId);
        const plan = (session.metadata?.plan || 'pro') as keyof typeof PLANS_CONFIG;
        const planConfig = PLANS_CONFIG[plan];
        if (!userId || !planConfig) break;

        // Ensure payment is successful
        if (session.payment_status === 'paid') {
          // Credit user
          await prisma.$transaction(async tx => {
            // Lock user row to calculate balance correctly
            const user = await tx.user.findUnique({
              where: { id: userId },
              select: { credits: true },
            });
            if (!user) return;
            const newBalance = (user.credits || 0) + planConfig.credits;

            await tx.user.update({ where: { id: userId }, data: { credits: newBalance } });
            await tx.creditHistory.create({
              data: {
                userId,
                type: 'CREDIT',
                operation: 'CREDIT_PURCHASE',
                amount: planConfig.credits,
                balanceAfter: newBalance,
                objectId: session.id,
                description: `${planConfig.name} purchase via Stripe`,
              },
            });
          });
        }
        break;
      }
      case 'customer.created':
      case 'customer.updated':
      case 'invoice.payment_succeeded':
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}
