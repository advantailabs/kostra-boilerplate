'use client';

import { siteConfig } from '@/app/siteConfig';
import { Button } from '@/components/atom/Button';
import { Modal } from '@/components/molecules/common/Modal';
import { PLANS } from '@/data/config/plans';
import { useCreditStore } from '@/store/credits';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export interface CreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreditPurchaseModal({ isOpen, onClose }: CreditPurchaseModalProps) {
  const router = useRouter();
  const credits = useCreditStore(state => state.credits);
  const footer = (
    <div className="flex w-full items-center justify-end gap-2">
      <Button asChild variant="secondary">
        <a href="mailto:hi@peon.sh?subject=Enterprise%20Plan%20Inquiry">Contact - hi@peon.sh</a>
      </Button>
      <Button
        variant="primary"
        onClick={() => {
          onClose();
          router.push(siteConfig.baseLinks.settings.billing);
        }}
      >
        Purchase now
      </Button>
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
          <div className="flex items-center justify-between rounded-md bg-gradient-to-b from-white to-gray-50 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ring-1 ring-inset ring-gray-200 dark:bg-gradient-to-b dark:from-gray-950 dark:to-gray-900 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:ring-gray-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Lets keep your chats going, Topup some credits now.
            </p>
            <div className="rounded-md bg-indigo-600/10 px-3 py-1 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
              Credits: <span className="text-indigo-800 dark:text-indigo-200">{credits}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan, idx) => {
            const CardContent = () => (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {plan.name}
                  </h3>
                  {plan.badge && (
                    <span className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{plan.description}</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {plan.price}
                  </span>
                  {plan.period && <span className="text-xs text-gray-500">/ {plan.period}</span>}
                </div>
                <ul className="mt-3 space-y-2">
                  {plan.features.map(feature => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </>
            );

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={
                  plan.id === 'pro'
                    ? 'rounded-lg bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-rose-500 p-[1px]'
                    : 'min-w-0 rounded-lg border border-gray-200 p-0 shadow-sm transition-colors dark:border-gray-800'
                }
              >
                {plan.id === 'pro' ? (
                  <div className="h-full min-w-0 rounded-lg bg-gradient-to-b from-white to-gray-50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ring-1 ring-inset ring-gray-200 dark:from-gray-950 dark:to-gray-900 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:ring-gray-800">
                    <CardContent />
                  </div>
                ) : (
                  <div className={`p-4 ${plan.id === 'free' ? 'opacity-60 grayscale' : ''}`}>
                    <CardContent />
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
