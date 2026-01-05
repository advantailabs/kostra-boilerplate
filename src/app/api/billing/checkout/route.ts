import { NextRequest } from 'next/server';

import { PLANS_CONFIG } from '@/data/config/plans';
import { getAuthUser } from '@/lib/auth/jwt';
import {
  errorResponse,
  internalServerErrorResponse,
  successResponse,
  unauthorizedResponse,
} from '@/lib/utils';
import { stripe } from '@/services/external/stripe/stripe';
import { getUserById, setUserStripeCustomerId } from '@/services/repositories/user';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId } = (await getAuthUser(request)) || {};

    const user = await getUserById(userId);

    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json().catch(() => ({}));
    const { plan = 'pro' } = body as { plan?: keyof typeof PLANS_CONFIG };
    const priceId =
       
      plan === 'pro'
        ? process.env.STRIPE_PRO_PRICE_ID
        : plan === 'creditPack'
          ? process.env.STRIPE_CREDIT_PACK_PRICE_ID
          : undefined;
    if (!priceId) {
      return errorResponse('Invalid plan selected');
    }

    // Ensure Stripe customer exists
    let customerId = user.stripeCustomerId || '';
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: String(user.id), googleId: user.googleId },
      });
      customerId = customer.id;
      await setUserStripeCustomerId(user.id, customerId);
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const base = origin.replace(/\/$/, '');
    // Use subscription checkout for pro, one-time payment for creditPack
    const session = await stripe.checkout.sessions.create(
      plan === 'pro'
        ? {
            mode: 'subscription',
            customer: customerId,
            line_items: [
              {
                price: priceId,
                quantity: 1,
              },
            ],
            allow_promotion_codes: true,
            success_url: `${base}/app/credit-history?status=success`,
            cancel_url: `${base}/app/credit-history?status=cancel`,
            metadata: {
              userId: String(user.id),
              plan,
            },
          }
        : {
            mode: 'payment',
            customer: customerId,
            line_items: [
              {
                price: priceId,
                quantity: 1,
              },
            ],
            invoice_creation: { enabled: true },
            allow_promotion_codes: true,
            success_url: `${base}/app/credit-history?status=success`,
            cancel_url: `${base}/app/credit-history?status=cancel`,
            metadata: {
              userId: String(user.id),
              plan,
            },
          }
    );

    return successResponse({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return internalServerErrorResponse();
  }
}
