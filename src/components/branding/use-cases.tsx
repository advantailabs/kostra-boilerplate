'use client';

import { siteConfig } from '@/app/siteConfig';
import { motion } from 'framer-motion';

const useCases = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: 'HR Teams',
    description: 'Policy questions, onboarding, benefits information',
    features: ['Employee Onboarding', 'Policy Management', 'FAQ Automation'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    title: 'Customer Support',
    description: 'Product knowledge, troubleshooting, FAQs',
    features: ['Knowledge Base', 'Training Materials', 'Escalation Support'],
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    title: 'Sales Teams',
    description: 'Product info, competitive analysis, proposal content',
    features: ['Product Information', 'Sales Enablement', 'Marketing Assets'],
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    title: 'Engineering',
    description: 'Documentation, best practices, technical guides',
    features: ['Documentation Management', 'Code Knowledge', 'Troubleshooting'],
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    title: 'Legal/Compliance',
    description: 'Contract management, regulatory guidance',
    features: ['Contract Management', 'Compliance Tracking', 'Legal Research'],
    color: 'from-indigo-500 to-blue-500',
  },
];

export function UseCases() {
  return (
    <section className="bg-gray-900 py-24 sm:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Perfect For Every Team
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-300">
            Whether you&apos;re in HR, support, sales, engineering, or compliance - Kostra adapts to your
            team&apos;s unique needs
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              className="group relative overflow-hidden rounded-3xl border border-gray-500/20  bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${useCase.color} opacity-5 transition-opacity group-hover:opacity-10`}
              />

              <div className="relative">
                {/* Icon */}
                <div
                  className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${useCase.color} bg-opacity-20 text-white`}
                >
                  {useCase.icon}
                </div>

                {/* Content */}
                <h3 className="mb-4 text-2xl font-bold text-white">{useCase.title}</h3>
                <p className="mb-6 text-gray-300">{useCase.description}</p>

                {/* Features list */}
                <ul className="space-y-2">
                  {useCase.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-400">
                      <svg
                        className="mr-3 h-4 w-4 flex-shrink-0 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Hover arrow */}
                <div className="mt-6 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-sm font-medium text-blue-400">Learn more →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="mb-8 text-lg text-gray-300">
            Ready to transform your team&apos;s knowledge management?
          </p>
          <a
            href={siteConfig.baseLinks.home}
            className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105 hover:from-blue-700 hover:to-violet-700"
          >
            Start Your Free Trial
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
