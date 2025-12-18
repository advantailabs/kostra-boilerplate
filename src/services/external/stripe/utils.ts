/* Utils */

// Helper: read period end directly from subscription items
export const getPeriodEndFromSubscriptionItems = (sub: any): Date | null => {
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

export const getLinePriceId = (line: any): string | null => {
  // Standard subscription/checkout price object
  if (line?.price?.id) return line.price.id as string;
  // Price id as string
  if (typeof line?.price === 'string') return line.price as string;
  // Manual invoice line shape
  if (line?.pricing?.price_details?.price) return line.pricing.price_details.price as string;
  return null;
};
