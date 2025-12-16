import { getAuthUser } from '@/lib/auth/jwt';
import { internalServerErrorResponse, successResponse, unauthorizedResponse } from '@/lib/utils';
import { stripe } from '@/services/external/stripe/stripe';
import { getUserById, setUserStripeCustomerId } from '@/services/repositories/user';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId } = (await getAuthUser(request)) || {};

    const user = await getUserById(userId);
    if (!user) {
      return unauthorizedResponse();
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
