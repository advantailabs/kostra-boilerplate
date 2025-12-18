import { PLANS_CONFIG } from '@/data/config/plans';
import { prisma } from '@/lib/prisma';
import { User, UserPlan } from '@/lib/prisma/generated/client';
import { setUserStripeCustomerId } from '@/services/repositories/user';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export const stripe = new Stripe(stripeSecretKey);

export const getStripeWebhookSecret = () => process.env.STRIPE_WEBHOOK_SECRET || '';

export const getStripeConfig = () => {
  const base = process.env.NEXT_PUBLIC_APP_URL;
  return {
    billingPortalReturnUrl: `${base}/app`,
    checkoutSuccessUrl: `${base}/app/settings/billing?status=success`,
    checkoutCancelUrl: `${base}/app/settings/billing?status=cancel`,
  } as const;
};

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

export const createStripeCustomer = async (user: User) => {
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: { userId: String(user.id), googleId: user.googleId },
  });
  await setUserStripeCustomerId(user.id, customer.id);
  return customer;
};

export const createStripeCheckoutSession = async ({
  customerId,
  priceId,
  userId,
  base,
  plan,
}: {
  customerId?: string;
  priceId: string;
  userId: string | number;
  base: string;
  plan: string | UserPlan;
}): Promise<Stripe.Checkout.Session> => {
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    invoice_creation: {
      enabled: true,
    },
    allow_promotion_codes: true,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes from now
    success_url: `${base}/app/post-purchase?status=success`,
    cancel_url: `${base}/app/post-purchase?status=cancel`,
    metadata: {
      userId: String(userId),
      plan,
    },
  };
  const session = await stripe.checkout.sessions.create(sessionParams);

  return session;
};

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
};

export const handleEventSubscriptionDeleted = async (sub: Stripe.Subscription) => {
  const customerId = (sub.customer as string) || null;
  if (!customerId) return;
  await prisma.user.updateMany({
    where: { stripeCustomerId: customerId },
    data: { plan: UserPlan.FREE, isOverDue: false, planExpiringAt: null, credits: 0 },
  });
};

export const handleEventPaymentIntentWithStatus = async (
  paymentIntent: Stripe.PaymentIntent,
  status: PaymentStatus
) => {
  const customerId = (paymentIntent.customer as string) || null;
  if (!customerId) return;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
    select: { id: true, credits: true },
  });
  if (!user) return;

  if (status === PaymentStatus.SUCCESS) {
    await prisma.$transaction(async tx => {
      await tx.payment.create({
        data: { stripePaymentId: paymentIntent.id, userId: user.id, status },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { plan: UserPlan.PRO },
      });
    });
  } else {
    await prisma.payment.create({
      data: { stripePaymentId: paymentIntent.id, userId: user.id, status },
    });
  }
};

export const handleEventInvoicePaymentFailed = async (invoice: Stripe.Invoice) => {
  const customerId = (invoice.customer as string) || null;
  if (!customerId) return;

  await prisma.user.updateMany({
    where: { stripeCustomerId: customerId },
    data: { plan: UserPlan.FREE, isOverDue: true, planExpiringAt: null },
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
  const getLinePriceId = (line: any): string | null => {
    // Standard subscription/checkout price object
    if (line?.price?.id) return line.price.id as string;
    // Price id as string
    if (typeof line?.price === 'string') return line.price as string;
    // Manual invoice line shape
    if (line?.pricing?.price_details?.price) return line.pricing.price_details.price as string;
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
  if (planLines.length === 0) return;

  // Compute credits to add across all recognized lines
  let proCreditsToAdd = 0;
  let packCreditsToAdd = 0;
  for (const pl of planLines) {
    if (pl.plan === 'pro') proCreditsToAdd += PLANS_CONFIG.pro.credits * pl.quantity;
    if (pl.plan === 'creditPack') packCreditsToAdd += PLANS_CONFIG.creditPack.credits * pl.quantity;
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
        operation: 'INITIAL_CREDITS',
        amount: proCreditsToAdd + packCreditsToAdd,
        balanceAfter: newBalance,
        objectId: invoiceId,
        description: `Credit purchase via Stripe invoice`,
      },
    });
  });
};

export const handleEventCheckoutSessionCompleted = async (session: Stripe.Checkout.Session) => {
  if (session?.mode !== 'subscription') return;
  const customerId = (session.customer as string) || null;
  const subscriptionId = (session.subscription as string) || null;
  if (!customerId || !subscriptionId) return;

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
};
