import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export const getStripeWebhookSecret = () => process.env.STRIPE_WEBHOOK_SECRET || '';

export const getStripeConfig = () => {
  const base = process.env.NEXT_PUBLIC_APP_URL;
  return {
    billingPortalReturnUrl: `${base}/app`,
    checkoutSuccessUrl: `${base}/app/credit-history?status=success`,
    checkoutCancelUrl: `${base}/app/credit-history?status=cancel`,
  } as const;
};
