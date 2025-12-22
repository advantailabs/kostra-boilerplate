'use client';

import { Button } from '@/components/atom/Button';
import { Modal } from '@/components/molecules/common/Modal';
import { PLANS } from '@/data/config/plans';
import { useStripe } from '@/hooks/useStripe';
import { useCreditStore } from '@/store/credits';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export interface CreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// CardContent component moved outside to prevent recreation on every render
function CardContent({ plan }: { plan: (typeof PLANS)[0] }) {
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-text">{plan.name}</h3>
        {plan.badge && (
          <span
            className="rounded-full border px-2 py-0.5 text-[10px] font-medium"
            style={{
              backgroundColor: plan.id === 'pro' ? 'var(--primary)' : 'var(--primary)',
              borderColor: plan.id === 'pro' ? 'var(--primary)' : 'var(--primary)',
              color: plan.id === 'pro' ? 'var(--bg-light)' : 'var(--bg-light)',
            }}
          >
            {plan.badge}
          </span>
        )}
      </div>
      <p className="text-xs text-text-muted">{plan.description}</p>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-xl font-bold text-text">{plan.price}</span>
        {plan.period && <span className="text-xs text-text-muted">/ {plan.period}</span>}
      </div>
      <ul className="mt-3 space-y-2">
        {plan.features.map(feature => (
          <li key={feature} className="flex items-center gap-2 text-sm text-text">
            <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
            {feature}
          </li>
        ))}
      </ul>
    </>
  );
}

export function CreditPurchaseModal({ isOpen, onClose }: CreditPurchaseModalProps) {
  useRouter();
  const { checkout, isCreatingCheckout } = useStripe();
  const credits = useCreditStore(state => state.credits);

  const footer = (
    <div className="flex w-full items-center justify-between gap-2 px-4">
      <div className="flex items-center gap-2">
        <p className="text-sm text-text-muted">
          Contact{' '}
          <a
            href="mailto:hi@kostra.io?subject=Enterprise%20Plan%20Inquiry"
            className="font-medium underline underline-offset-2"
          >
            hi@kostra.io
          </a>{' '}
          for enterprise
        </p>
        {/*
        <Button
          variant="secondary"
          isLoading={isCreatingCheckout}
          loadingText="Opening..."
          onClick={async () => {
            await checkout('creditPack');
            onClose();
          }}
        >
          Topup Credits (one-time)
        </Button>
        */}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          isLoading={isCreatingCheckout}
          loadingText="Redirecting..."
          onClick={async () => {
            await checkout('pro');
            onClose();
          }}
        >
          Subscribe to Pro ({PLANS[2].price})
        </Button>
      </div>
    </div>
  );
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Purchase Credits"
      maxWidth="max-w-4xl"
      contentClassName="overflow-hidden"
      footer={footer}
      removePadding
    >
      <div className="px-4 pb-4 pt-5">
        <div className="mb-4 rounded-md bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-rose-500 p-[1px]">
          <div
            className="flex items-center justify-between rounded-md px-4 py-2 shadow-sm dark:shadow-[0_8px_16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2),0_2px_0_rgba(255,255,255,0.9)]"
            style={{
              backgroundColor: 'var(--bg-light)',
              border: '1px solid var(--border)',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Lets keep your things going, Topup some credits now.
            </p>
            <div
              className="rounded-md px-3 py-1 text-sm font-semibold"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--bg-light)' }}
            >
              Credits: <span style={{ color: 'var(--bg-light)' }}>{credits}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan, idx) => {
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={
                  plan.id === 'pro'
                    ? 'rounded-lg bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-rose-500 p-[1px]'
                    : 'min-w-0 rounded-lg border border-border p-0 shadow-sm transition-colors'
                }
              >
                {plan.id === 'pro' ? (
                  <div
                    className="h-full min-w-0 rounded-lg p-4 shadow-sm dark:shadow-[0_8px_16px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.2),0_2px_0_rgba(255,255,255,0.9)]"
                    style={{
                      backgroundColor: 'var(--bg-light)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <CardContent plan={plan} />
                  </div>
                ) : (
                  <div className={`p-4 ${plan.id === 'free' ? 'opacity-60 grayscale' : ''}`}>
                    <CardContent plan={plan} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
