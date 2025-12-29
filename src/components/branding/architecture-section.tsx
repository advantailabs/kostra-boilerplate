'use client';

import {
  RiCodeBoxFill,
  RiDatabase2Fill,
  RiFileUploadFill,
  RiFlaskFill,
  RiGitBranchFill,
  RiSettings4Fill,
} from '@remixicon/react';
import { motion } from 'framer-motion';

const architectureFeatures = [
  {
    title: 'Atomic Design Pattern',
    description:
      'Component architecture following Atomic Design principles - Atoms, Molecules, and Organisms. Build reusable UI components that scale from simple buttons to complex feature modules.',
    icon: RiCodeBoxFill,
    benefits: ['Reusability', 'Consistency', 'Maintainability'],
  },
  {
    title: 'Repository & Service Pattern',
    description:
      'Clean separation of concerns with Repository pattern for data access and Service layer for business logic. Database-agnostic code that\'s easy to test and modify.',
    icon: RiDatabase2Fill,
    benefits: ['Testability', 'Flexibility', 'Maintainability'],
  },
  {
    title: 'S3 & Cloudflare R2 Integration',
    description:
      'Flexible file storage with support for both AWS S3 and Cloudflare R2. Pre-signed URLs for secure uploads/downloads, public/private buckets, and purpose-based file organization.',
    icon: RiFileUploadFill,
    benefits: ['Scalability', 'Security', 'Flexibility'],
  },
  {
    title: 'Integration Tests Setup',
    description:
      'Comprehensive test infrastructure with Jest, database setup/teardown, test helpers, and CI/CD integration. Full API integration tests with real database transactions.',
    icon: RiFlaskFill,
    benefits: ['Reliability', 'Quality', 'Confidence'],
  },
  {
    title: 'Easy Extension & Modification',
    description:
      'Modular architecture allows easy addition of new features. Factory patterns for providers, consistent error handling, and well-defined interfaces make extensions seamless.',
    icon: RiGitBranchFill,
    benefits: ['Extensibility', 'Simplicity', 'Speed'],
  },
  {
    title: 'Credit System & Billing',
    description:
      'Complete credit management system with transaction history, Stripe integration for subscriptions and one-time payments, webhook handling, and billing portal.',
    icon: RiSettings4Fill,
    benefits: ['Monetization', 'Tracking', 'Automation'],
  },
];

export function ArchitectureSection() {
  return (
    <section className="relative bg-black py-16 sm:py-20">
      <div className="bg-gray-400/30 absolute inset-x-0 top-0 h-px" />
      <div className="from-indigo-950/5 to-black/0 pointer-events-none absolute inset-0 bg-gradient-to-b" />
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 id="built-for-developers" className="mb-4 text-3xl font-light text-white sm:mb-6 sm:text-4xl md:text-5xl">
            Built for Developers
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-400 sm:text-xl">
            Clean architecture, proven design patterns, and developer-friendly structure. Build faster
            with code that&apos;s maintainable, testable, and easy to extend.
          </p>
        </motion.div>

        {/* Architecture features grid */}
        <div className="mx-auto grid max-w-6xl gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {architectureFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border-gray-500/20 bg-white/5 hover:border-white/20 hover:bg-white/10 group relative overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition-all sm:p-8"
              whileHover={{ y: -5 }}
            >
              <div className="mb-4 flex items-start gap-4">
                <div className="from-primary/20 to-primary/30 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-primary transition-colors duration-300 sm:h-14 sm:w-14">
                  <feature.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-white sm:text-xl">
                    {feature.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-gray-400/80 sm:text-base">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feature.benefits.map((benefit, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto mt-12 max-w-4xl rounded-2xl border border-gray-500/20 bg-white/5 p-6 backdrop-blur-sm sm:mt-16 sm:p-8"
        >
          <h3 className="mb-4 text-xl font-semibold text-white sm:text-2xl">
            Why This Architecture?
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-white">Reusability</h4>
              <p className="text-sm text-gray-400/80">
                Components, services, and utilities are designed for reuse across features. Write
                once, use everywhere.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-white">Simplicity</h4>
              <p className="text-sm text-gray-400/80">
                Clear patterns and consistent structure make the codebase easy to understand and
                navigate, even for new developers.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-white">Maintainability</h4>
              <p className="text-sm text-gray-400/80">
                Separation of concerns and modular design ensure changes are isolated and don&apos;t
                break existing functionality.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-white">Easy Extension</h4>
              <p className="text-sm text-gray-400/80">
                Add new features, providers, or integrations without modifying existing code. Follow
                established patterns and extend naturally.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

