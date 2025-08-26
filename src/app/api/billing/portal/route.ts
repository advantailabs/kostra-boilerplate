import { getAuthUser } from '@/lib/auth/jwt';
import { stripe } from '@/lib/stripe';
import {
  internalServerErrorResponse,
  successResponse,
  unauthorizedResponse,
} from '@/lib/utils/response';
import { setUserStripeCustomerId } from '@/services/repositories/user';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return unauthorizedResponse();
    }

    // Ensure Stripe customer exists
    let customerId = authUser.stripeCustomerId || '';
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: authUser.email,
        name: authUser.name,
        metadata: { userId: String(authUser.userId), googleId: authUser.googleId },
      });
      customerId = customer.id;
      await setUserStripeCustomerId(authUser.userId, customerId);
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const base = origin.replace(/\/$/, '');
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${base}/app`,
    });

    return successResponse({ url: session.url });
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    return internalServerErrorResponse();
  }
}
