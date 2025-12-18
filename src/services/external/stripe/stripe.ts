import { User, UserPlan } from '@/lib/prisma/generated/client';
import { setUserStripeCustomerId } from '@/services/repositories/user';
import Stripe from 'stripe';

/* Stripe Instance and API functions */
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
