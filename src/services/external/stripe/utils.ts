/* Utils */

import Stripe from 'stripe';

// Type Predicate to distinguish between two types to preserve code
function isSubscriptionItem(
  item: Stripe.InvoiceLineItem | Stripe.SubscriptionItem
): item is Stripe.SubscriptionItem {
  return 'price' in item; // ...
}

// Helper: read period end directly from subscription items
export const getPeriodEndFromSubscriptionItems = (sub: Stripe.Subscription): Date | null => {
  try {
    const items = sub?.items?.data || [];
    if (!Array.isArray(items) || items.length === 0) return null;
    const first = items[0];
    const endSec: number | undefined = first?.current_period_end as number | undefined;
    // period only exists on ScheduledSubscription event
    // || (first?.period?.end as number | undefined);
    return endSec ? new Date(endSec * 1000) : null;
  } catch {
    return null;
  }
};

export const getLinePriceId = (
  line: Stripe.SubscriptionItem | Stripe.InvoiceLineItem
): string | null => {
  // // Standard subscription/checkout price object
  if (isSubscriptionItem(line)) {
    if (line?.price?.id) return line.price.id as string;
    // Price id as string
    if (typeof line?.price === 'string') return line.price as string;
  } else if (line?.pricing?.price_details?.price) {
    /* InvoiceLineItem does not have price property */
    return line.pricing.price_details.price as string;
  }
  return null;
};
