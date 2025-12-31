import { PLANS_CONFIG } from '@/data/config/plans';
import { UserPlan } from '@/lib/prisma/generated/client';
import { addCreditsAndUpdateCreditHistoryTransaction } from '@/services/repositories/credit-history';
import { updateUserByStripeCustomerId } from '@/services/repositories/user';
import Stripe from 'stripe';
import { stripe } from './stripe';
import { getLinePriceId, getPeriodEndFromSubscriptionItems } from './utils';

/* Strip Webhook Event Handlers */
export const handleEventSubscriptionCreated = async (sub: Stripe.Subscription) => {
  const customerId = (sub.customer as string) || null;
  if (!customerId) return;
  const status = sub.status as string;

  // Map subscription status to plan/overdue flags
  // active|trialing -> PRO, not overdue; past_due|unpaid|incomplete -> FREE, overdue
  const isActive = status === 'active' || status === 'trialing';
  const isOverdue = status === 'past_due' || status === 'unpaid' || status === 'incomplete';
  const periodEnd = getPeriodEndFromSubscriptionItems(sub);

  if (isActive) {
    await updateUserByStripeCustomerId(customerId, {
      plan: UserPlan.PRO,
      isOverDue: false,
      planExpiringAt: periodEnd,
    });
  } else {
    await updateUserByStripeCustomerId(customerId, {
      plan: UserPlan.FREE,
      isOverDue: isOverdue,
      planExpiringAt: null,
      credits: 0,
    });
  }
};

export const handleEventSubscriptionDeleted = async (sub: Stripe.Subscription) => {
  const customerId = (sub.customer as string) || null;
  if (!customerId) return;
  await updateUserByStripeCustomerId(customerId, {
    plan: UserPlan.FREE,
    isOverDue: false,
    planExpiringAt: null,
    credits: 0,
  });
};

export const handleEventInvoicePaymentSucceeded = async (invoice: Stripe.Invoice) => {
  if (!invoice || invoice.status !== 'paid') return;

  const invoiceId: string = invoice.id as string;
  const customerId: string | null = (invoice.customer as string) || null;
  if (!customerId) return;

  // Fetch full invoice with line items and prices
  const fullInvoice = await stripe.invoices.retrieve(invoiceId, {
    expand: ['lines.data.price'],
  });

  const configuredProPriceId = process.env.STRIPE_PRO_PRICE_ID;
  const configuredCreditPackPriceId = process.env.STRIPE_CREDIT_PACK_PRICE_ID;

  // Map recognized lines (pro subscription renewals and credit pack top-ups)
  const planLines = fullInvoice.lines.data
    .map((line: Stripe.InvoiceLineItem) => {
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
  if (planLines.length === 0) return;

  // Compute credits to add across all recognized lines
  let proCreditsToAdd = 0;
  let packCreditsToAdd = 0;
  for (const pl of planLines) {
    if (pl.plan === 'pro') proCreditsToAdd += PLANS_CONFIG.pro.credits * pl.quantity;
    if (pl.plan === 'creditPack') packCreditsToAdd += PLANS_CONFIG.creditPack.credits * pl.quantity;
  }

  // Idempotency: ensure we do not credit twice for the same invoice
  await addCreditsAndUpdateCreditHistoryTransaction({
    invoiceId,
    customerId,
    proCreditsToAdd,
    packCreditsToAdd,
  });
};

export const handleEventInvoicePaymentFailed = async (invoice: Stripe.Invoice) => {
  const customerId = (invoice.customer as string) || null;
  if (!customerId) return;

  await updateUserByStripeCustomerId(customerId, {
    plan: UserPlan.FREE,
    isOverDue: true,
    planExpiringAt: null,
  });
};

export const handleEventCheckoutSessionCompleted = async (session: Stripe.Checkout.Session) => {
  if (session?.mode !== 'subscription') return;
  const customerId = (session.customer as string) || null;
  const subscriptionId = (session.subscription as string) || null;
  if (!customerId || !subscriptionId) return;

  // Retrieve the subscription to access items
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const periodEnd = getPeriodEndFromSubscriptionItems(subscription as Stripe.Subscription);

  await updateUserByStripeCustomerId(customerId, {
    plan: UserPlan.PRO,
    isOverDue: false,
    planExpiringAt: periodEnd,
  });
};
