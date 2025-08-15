import { auth } from '@clerk/nextjs/server';

import { stripe } from '@/lib/stripe';
import {
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
} from '@/lib/utils/response';
import { getUserByClerkId, setUserStripeCustomerId } from '@/services/repositories/user';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return unauthorizedResponse();
    }

    const user = await getUserByClerkId(clerkUserId);
    if (!user) {
      return notFoundResponse('User does not exist');
    }

    // Ensure Stripe customer exists
    let customerId = user.stripeCustomerId || '';
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: String(user.id), clerkUserId: user.clerkUserId },
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
