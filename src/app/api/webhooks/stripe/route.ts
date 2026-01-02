import { getStripeWebhookSecret, stripe } from '@/services/external/stripe/stripe';
import {
  handleEventCheckoutSessionCompleted,
  handleEventInvoicePaymentFailed,
  handleEventInvoicePaymentSucceeded,
  handleEventSubscriptionCreated,
  handleEventSubscriptionDeleted,
} from '@/services/external/stripe/webhook-event-handlers';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

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
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        await handleEventInvoicePaymentSucceeded(invoice);
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        await handleEventSubscriptionCreated(sub);
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await handleEventSubscriptionDeleted(sub);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await handleEventInvoicePaymentFailed(invoice);
        break;
      }
      case 'customer.created':
      case 'customer.updated':
      case 'checkout.session.completed': {
        const session = event.data.object as unknown as Stripe.Checkout.Session;
        await handleEventCheckoutSessionCompleted(session);
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
