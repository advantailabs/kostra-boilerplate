'use client';

import { Modal } from '@/components/molecules/common/Modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent as UICardContent } from '@/components/ui/card';
import { PLANS } from '@/data/config/plans';
import { useStripe } from '@/hooks/useStripe';
import { useCreditStore } from '@/store/credits';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export interface CreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Parse price for ref-style display: $ + number + /period when applicable
function formatPrice(price: string, period?: string) {
  const match = price.match(/^\$(\d+)$/);
  if (match) {
    return {
      split: true as const,
      dollar: '$',
      amount: match[1],
      period: period ? `/${period}` : '',
    };
  }
  return { split: false as const, price };
}

// Plan card body with ref-style layout (title, description, price, features)
function PlanCardBody({ plan }: { plan: (typeof PLANS)[0] }) {
  const formatted = formatPrice(plan.price, plan.period);
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-foreground">{plan.name}</h3>
          {plan.badge && <Badge variant="default">{plan.badge}</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </div>
      <div className="flex gap-0.5 items-baseline">
        {formatted.split ? (
          <>
            <span className="text-sm font-medium text-muted-foreground">{formatted.dollar}</span>
            <span className="text-2xl font-bold text-foreground">{formatted.amount}</span>
            {formatted.period && (
              <span className="text-sm text-muted-foreground self-end">{formatted.period}</span>
            )}
          </>
        ) : (
          <>
            <span className="text-2xl font-bold text-foreground">{formatted.price}</span>
            {plan.period && (
              <span className="text-sm text-muted-foreground self-end">/ {plan.period}</span>
            )}
          </>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <h4 className="mb-1.5 text-sm font-medium text-foreground">Features</h4>
        {plan.features.map(feature => (
          <div key={feature} className="flex items-center gap-2 py-1">
            <div className="bg-primary size-2 rounded-full shrink-0" />
            <p className="text-sm text-foreground">{feature}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export function CreditPurchaseModal({ isOpen, onClose }: CreditPurchaseModalProps) {
  useRouter();
  const { checkout, isCreatingCheckout } = useStripe();
  const credits = useCreditStore(state => state.credits);

  const footer = (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">
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
          variant="default"
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
      maxWidth="max-w-4xl!"
      contentClassName="overflow-hidden"
      footer={footer}
      removePadding
    >
      <div className="px-4 pb-4 pt-5">
        <Card className="mb-4 flex flex-col gap-0 rounded-md border border-primary/20 bg-linear-to-r from-primary/10 to-transparent py-3 shadow-none text-card-foreground">
          <UICardContent className="flex items-center justify-between gap-3">
            <p className="text-sm text-foreground">
              Lets keep your things going, Topup some credits now.
            </p>
            <Badge variant="default">Credits: {credits}</Badge>
          </UICardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLANS.filter(plan => plan.id !== 'lifetime').map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-foreground/10 card group relative h-full overflow-hidden rounded-xl transition-all duration-300 ease-in-out max-lg:last:col-span-full ${plan.id === 'pro' ? 'p-0' : 'p-px'}`}
            >
              <Card
                className={`h-full flex flex-col gap-6 rounded-xl border py-6 shadow-none transition-all duration-300 ease-in-out bg-card text-card-foreground group-hover:bg-card/90 ${plan.id === 'pro' ? 'border-primary border-2' : ''}`}
              >
                <UICardContent className="flex flex-col gap-4 px-6">
                  <PlanCardBody plan={plan} />
                </UICardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
