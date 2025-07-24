'use client';

import { motion } from 'framer-motion';

import { FeatureCard } from '@/components/branding/feature-card';
import { GridBackground } from '@/components/branding/grid-background';
import { HeroPattern } from '@/components/branding/hero-pattern';

const features = [
  {
    title: 'Built-in Performance',
    description: 'Get incredible performance without the hassle of manual optimization.',
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: 'Edge Runtime',
    description: 'Deploy globally with edge functions for minimal latency.',
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
  },
  {
    title: 'Type Safety',
    description: 'Full TypeScript support out of the box for rock-solid applications.',
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Move GridBackground inside hero section */}
      {/* Hero Section */}
      <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center">
        <GridBackground />
        <HeroPattern />
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-[980px] text-center">
            <motion.div
              className="mb-8 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-800 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Announcing our next generation platform.{' '}
                <a href="#" className="font-semibold text-blue-600">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Read more <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </motion.div>

            <div className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              <motion.h1
                className="text-[40px] font-bold leading-tight tracking-tight md:text-[64px] md:leading-[72px] lg:text-[72px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                The React Framework for Production
              </motion.h1>
            </div>

            <motion.p
              className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-700 md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Build and deploy modern web applications with unmatched performance, reliability, and
              scale. Trusted by thousands of developers worldwide.
            </motion.p>

            <motion.div
              className="mt-10 flex items-center justify-center gap-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <a
                href="/app/dashboard"
                className="rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Get Started
              </a>
              <a
                href="#features"
                className="rounded-full px-8 py-3 text-lg font-semibold text-gray-900 ring-1 ring-gray-900/10 transition-all hover:ring-gray-900/20"
              >
                Learn More
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-24 sm:py-32">
        <div className="container mx-auto px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              No server? No problem.
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-700">
              Focus on your business logic, we&apos;ll handle the rest. Deploy anywhere, scale
              effortlessly.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map(feature => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
