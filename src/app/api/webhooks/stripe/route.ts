import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { PLANS_CONFIG } from '@/data/config/plans';
import { prisma } from '@/lib/prisma';
import { getStripeWebhookSecret, stripe } from '@/lib/stripe';
import { UserPlan } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const sig = (await headers()).get('stripe-signature') || '';
  const webhookSecret = getStripeWebhookSecret();

  let event;
  // Removed: upcoming invoice fetch. We now rely on subscription items.

  // Helper: read period end directly from subscription items
  const getPeriodEndFromSubscriptionItems = (sub: any): Date | null => {
    try {
      const items = sub?.items?.data || [];
      if (!Array.isArray(items) || items.length === 0) return null;
      const first = items[0];
      const endSec: number | undefined =
        (first?.current_period_end as number | undefined) ||
        (first?.period?.end as number | undefined);
      return endSec ? new Date(endSec * 1000) : null;
    } catch {
      return null;
    }
  };

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed.', err);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        if (!invoice || invoice.status !== 'paid') break;

        const invoiceId: string = invoice.id;
        const customerId: string | null = (invoice.customer as string) || null;
        if (!customerId) break;

        // Fetch full invoice with line items and prices
        const fullInvoice = await stripe.invoices.retrieve(invoiceId, {
          expand: ['lines.data.price'],
        });

        const configuredProPriceId = process.env.STRIPE_PRO_PRICE_ID;
        const configuredCreditPackPriceId = process.env.STRIPE_CREDIT_PACK_PRICE_ID;
        const getLinePriceId = (line: any): string | null => {
          // Standard subscription/checkout price object
          if (line?.price?.id) return line.price.id as string;
          // Price id as string
          if (typeof line?.price === 'string') return line.price as string;
          // Manual invoice line shape
          if (line?.pricing?.price_details?.price)
            return line.pricing.price_details.price as string;
          return null;
        };

        // Map recognized lines (pro subscription renewals and credit pack top-ups)
        const planLines = fullInvoice.lines.data
          .map((line: any) => {
            const priceId = getLinePriceId(line);
            if (priceId === configuredProPriceId) {
              return { plan: 'pro' as const, quantity: line.quantity || 1 };
            }
            if (priceId === configuredCreditPackPriceId) {
              return { plan: 'creditPack' as const, quantity: line.quantity || 1 };
            }
            return null;
          })
          .filter(Boolean) as Array<{ plan: 'pro' | 'creditPack'; quantity: number }>;

        // Only proceed when we have at least one recognized price-id line
        if (planLines.length === 0) break;

        // Compute credits to add across all recognized lines
        let proCreditsToAdd = 0;
        let packCreditsToAdd = 0;
        for (const pl of planLines) {
          if (pl.plan === 'pro') proCreditsToAdd += PLANS_CONFIG.pro.credits * pl.quantity;
          if (pl.plan === 'creditPack')
            packCreditsToAdd += PLANS_CONFIG.creditPack.credits * pl.quantity;
        }

        // Idempotency: ensure we do not credit twice for the same invoice
        await prisma.$transaction(async tx => {
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
              operation: 'CREDIT_PURCHASE',
              amount: proCreditsToAdd + packCreditsToAdd,
              balanceAfter: newBalance,
              objectId: invoiceId,
              description: `Credit purchase via Stripe invoice`,
            },
          });
        });
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as any;
        const customerId = (sub.customer as string) || null;
        if (!customerId) break;
        const status = sub.status as string;

        // Map subscription status to plan/overdue flags
        // active|trialing -> PRO, not overdue; past_due|unpaid|incomplete -> FREE, overdue
        const isActive = status === 'active' || status === 'trialing';
        const isOverdue = status === 'past_due' || status === 'unpaid' || status === 'incomplete';
        const periodEnd = getPeriodEndFromSubscriptionItems(sub);

        if (isActive) {
          await prisma.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: {
              plan: UserPlan.PRO,
              isOverDue: false,
              planExpiringAt: periodEnd,
            },
          });
        } else {
          await prisma.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: {
              plan: UserPlan.FREE,
              isOverDue: isOverdue,
              planExpiringAt: null,
              credits: 0,
            },
          });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as any;
        const customerId = (sub.customer as string) || null;
        if (!customerId) break;
        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { plan: UserPlan.FREE, isOverDue: false, planExpiringAt: null, credits: 0 },
        });
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const customerId = (invoice.customer as string) || null;
        if (!customerId) break;

        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { plan: UserPlan.FREE, isOverDue: true, planExpiringAt: null },
        });
        break;
      }
      case 'customer.created':
      case 'customer.updated':
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        if (session?.mode !== 'subscription') break;
        const customerId = (session.customer as string) || null;
        const subscriptionId = (session.subscription as string) || null;
        if (!customerId || !subscriptionId) break;

        // Retrieve the subscription to access items
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const periodEnd = getPeriodEndFromSubscriptionItems(subscription as any);

        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            plan: UserPlan.PRO,
            isOverDue: false,
            planExpiringAt: periodEnd,
          },
        });
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}
