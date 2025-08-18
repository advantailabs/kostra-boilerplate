'use client';

import { useCallback } from 'react';

import { useApiMutation } from '@/hooks/useApiMutation';
import { createBillingPortalSession, createCheckoutSession } from '@/services/api/credits';

export type CreditPlanId = 'pro' | 'creditPack';

export function useStripe() {
  const portalMutation = useApiMutation<string, void>({
    mutationFn: async () => createBillingPortalSession(),
    showSuccessToast: false,
  });

  const checkoutMutation = useApiMutation<string, { plan?: CreditPlanId }>({
    mutationFn: async ({ plan = 'pro' }) => createCheckoutSession(plan),
    showSuccessToast: false,
  });

  const openBillingPortal = useCallback(async () => {
    const url = await portalMutation.mutateAsync();
    if (url) window.location.href = url;
  }, [portalMutation]);

  const checkout = useCallback(
    async (plan: CreditPlanId = 'pro') => {
      const url = await checkoutMutation.mutateAsync({ plan });
      if (url) window.location.href = url;
    },
    [checkoutMutation]
  );

  return {
    // actions
    openBillingPortal,
    checkout,

    // raw mutateAsync if needed
    createBillingPortalSession: portalMutation.mutateAsync,
    createCheckoutSession: checkoutMutation.mutateAsync,

    // loading states
    isCreatingPortal: portalMutation.isPending,
    isCreatingCheckout: checkoutMutation.isPending,
  } as const;
}
