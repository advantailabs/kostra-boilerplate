'use client';

import { PLANS } from '@/data/config/plans';
import { motion } from 'framer-motion';

export function PricingSection() {
  const getButtonText = (planId: string) => {
    if (planId === 'lifetime') return 'Buy Now';
    return 'Get Started';
  };

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 select-none">
        <div className="from-indigo-600/20 absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-br to-violet-600/20 blur-3xl" />
      </div>
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-400">
            One-time payment for lifetime access to all updates and features.
          </p>
        </motion.div>

        <div className="mx-auto max-w-md">
          {PLANS.map((plan, index) => (
            <div key={plan.id} className="relative">
              {/* Subtle halo behind the card */}
              <div className="from-indigo-600/40 pointer-events-none absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-r to-violet-600/40 opacity-30 blur-2xl dark:opacity-40" />
              {/* Top centered pill */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                  <span className="bg-gray-900/90 ring-white/20 dark:bg-white/10 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ring-1 backdrop-blur">
                    {plan.badge}
                  </span>
                </div>
              )}

              <motion.div
                className="relative flex flex-col overflow-hidden rounded-3xl border border-indigo-400/60 bg-white/90 p-8 shadow-lg ring-1 ring-indigo-500/40 transition-all hover:scale-[1.02] dark:border-indigo-300/20 dark:bg-white/[0.06]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Plan header */}
                <div className="mb-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  <p className="mt-2 text-gray-400">{plan.description}</p>

                  <div className="mt-6 flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    {plan.period && <span className="ml-2 text-gray-400">/{plan.period}</span>}
                    {!plan.period && (
                      <span className="ml-2 text-lg text-gray-400">lifetime updates</span>
                    )}
                  </div>
                </div>

                {/* Features list */}
                <ul className="mb-8 flex-1 space-y-4">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="mr-3 h-5 w-5 flex-shrink-0 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-400/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA buttons pinned at the bottom for consistent layout */}
                <div className="mt-auto flex flex-col gap-3">
                  <button className="w-full rounded-full bg-gradient-to-r from-primary to-primary-hover px-6 py-4 text-lg font-semibold text-white transition-all hover:from-primary-hover hover:to-primary">
                    {getButtonText(plan.id)}
                  </button>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
