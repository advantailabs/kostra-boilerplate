'use client';

import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for small teams getting started',
    price: 'Free',
    period: '14-day trial',
    features: [
      'Up to 10 users',
      '5GB storage',
      '3 AI personas',
      'Basic knowledge bases',
      'Email support',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'Ideal for growing organizations',
    price: '$49',
    period: 'per user/month',
    features: [
      'Up to 50 users',
      '100GB storage',
      'Unlimited AI personas',
      'Advanced knowledge bases',
      'Priority support',
      'Usage analytics',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with complex needs',
    price: 'Custom',
    period: 'contact sales',
    features: [
      'Unlimited users',
      '1TB+ storage',
      'Custom AI personas',
      'Enterprise integrations',
      'Dedicated support',
      'Advanced security features',
      'Custom deployment options',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="bg-gray-800/30 py-24 sm:py-32">
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
          <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-300">
            Choose the plan that fits your organization's needs. Start free, upgrade when you're
            ready.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative overflow-hidden rounded-3xl border p-8 backdrop-blur-sm transition-all hover:scale-105 ${
                plan.popular
                  ? 'border-blue-500/50 bg-gradient-to-b from-blue-500/10 to-violet-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute right-0 top-0 -mr-1 -mt-1 h-32 w-32 overflow-hidden">
                  <div className="absolute right-6 top-6 h-6 w-24 rotate-45 transform bg-gradient-to-r from-blue-600 to-violet-600 text-center">
                    <span className="text-xs font-semibold text-white">Popular</span>
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <p className="mt-2 text-gray-400">{plan.description}</p>

                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="ml-2 text-gray-400">/{plan.period}</span>}
                </div>
              </div>

              {/* Features list */}
              <ul className="mb-8 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
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
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <button
                className={`w-full rounded-full px-6 py-4 text-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700'
                    : 'border border-white/20 bg-white/5 text-white hover:border-white/30 hover:bg-white/10'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
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
              <p className="text-gray-400">Start your 14-day free trial instantly</p>
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
              <p className="text-gray-400">Get started in under 30 minutes</p>
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
