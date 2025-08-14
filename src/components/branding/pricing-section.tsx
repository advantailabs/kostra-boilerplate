'use client';

import { PLANS } from '@/data/config/plans';
import { motion } from 'framer-motion';

export function PricingSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 select-none">
        <div className="absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-600/20 to-violet-600/20 blur-3xl" />
      </div>
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-600 dark:text-gray-300">
            Choose the plan that fits your organization's needs. Start free, upgrade when you're
            ready.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {PLANS.map((plan, index) => (
            <div key={plan.id} className="relative">
              {plan.id === 'pro' && (
                <>
                  {/* Subtle halo behind the card */}
                  <div className="pointer-events-none absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-r from-indigo-600/40 to-violet-600/40 opacity-30 blur-2xl dark:opacity-40" />
                  {/* Top centered pill */}
                  <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-gray-900/90 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur dark:bg-white/10">
                      Recommended
                    </span>
                  </div>
                </>
              )}

              <motion.div
                className={`relative flex flex-col overflow-hidden rounded-3xl border p-8 transition-all hover:scale-[1.02] ${
                  plan.id === 'pro'
                    ? 'border-indigo-400/60 bg-white/90 shadow-lg ring-1 ring-indigo-500/40 dark:border-indigo-300/20 dark:bg-white/[0.06]'
                    : 'border-gray-200 bg-white/80 shadow-sm hover:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20'
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Plan header */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">{plan.description}</p>

                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="ml-2 text-gray-500 dark:text-gray-400">/{plan.period}</span>
                    )}
                  </div>
                </div>

                {/* Features list */}
                <ul className="mb-8 flex-1 space-y-4">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className="mr-3 h-5 w-5 flex-shrink-0 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA buttons pinned at the bottom for consistent layout */}
                <div className="mt-auto flex flex-col gap-3">
                  <button
                    className={`w-full rounded-full px-6 py-4 text-lg font-semibold transition-all ${
                      plan.id === 'pro'
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700'
                        : 'border border-gray-200 bg-white text-gray-900 hover:border-gray-300 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:border-white/20'
                    }`}
                  >
                    {plan.id === 'enterprise'
                      ? 'Contact Sales'
                      : plan.id === 'pro'
                        ? 'Get Pro'
                        : 'Start Free'}
                  </button>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20 text-blue-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h4 className="mb-2 text-lg font-semibold text-white">No Credit Card Required</h4>
              <p className="text-gray-400">Start with 100 free credits instantly</p>
            </div>

            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-600/20 text-green-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4 className="mb-2 text-lg font-semibold text-white">Quick Setup</h4>
              <p className="text-gray-400">Get started in under 2 minutes</p>
            </div>

            <div className="text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-600/20 text-violet-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h4 className="mb-2 text-lg font-semibold text-white">24/7 Support</h4>
              <p className="text-gray-400">Our team helps you succeed</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
