'use client';

import { SignInButton, useUser } from '@clerk/nextjs';
import {
  RiBarChartFill,
  RiFolder2Fill,
  RiQuestionnaireFill,
  RiSearchEyeFill,
  RiShieldUserFill,
  RiUser3Fill,
} from '@remixicon/react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    title: 'AI Personas & Knowledge Bases',
    description:
      'Create custom AI personas and attach specialized knowledge bases for department-specific expertise.',
    icon: RiUser3Fill,
  },
  {
    title: 'Universal File Management',
    description:
      'Upload and manage files from S3, SharePoint, Google Drive, and other cloud platforms in one place.',
    icon: RiFolder2Fill,
  },
  {
    title: 'Intelligent Search',
    description:
      'Search files efficiently across your entire organization with AI-powered semantic search.',
    icon: RiSearchEyeFill,
  },
  {
    title: 'Access Control',
    description:
      'Manage user permissions and access control for different users and organizational levels.',
    icon: RiShieldUserFill,
  },
  {
    title: 'AI-Powered Q&A',
    description:
      'Ask deep questions to AI personas and get comprehensive answers with source citations.',
    icon: RiQuestionnaireFill,
  },
  {
    title: 'Analytical Reports',
    description:
      'Create detailed analytical reports using Peon Agents for business intelligence and insights.',
    icon: RiBarChartFill,
  },
];

export function MinimalFeatures() {
  const { isSignedIn, isLoaded } = useUser();
  return (
    <section className="relative bg-gray-950 py-32">
      <div className="container mx-auto px-6">
        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <h2 className="mb-6 text-4xl font-light text-white md:text-5xl">
            Beyond Question Answering
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-400">
            Get deep research and analysis done. Ask complex questions like "What invoices are
            overdue next month?" or "What was revenue generated in the last 3 months?"
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors duration-300 group-hover:border-white/20">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-3 text-xl font-medium text-white transition-colors duration-300 group-hover:text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-gray-400">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <div className="mx-auto max-w-3xl">
            <h3 className="mb-6 text-3xl font-light text-white md:text-4xl">
              Ready to get started?
            </h3>
            <p className="mb-10 text-xl text-gray-400">
              Join hundreds of organizations already transforming their knowledge management with
              Peon.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isLoaded && isSignedIn ? (
                <Link href="/app">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-lg bg-white px-8 py-4 font-medium text-black transition-all duration-300 hover:bg-gray-100 sm:w-auto"
                  >
                    Go to App
                  </motion.button>
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-lg bg-white px-8 py-4 font-medium text-black transition-all duration-300 hover:bg-gray-100 sm:w-auto"
                    onClick={() => {
                      // We'll handle the redirect after sign-in manually
                      localStorage.setItem('redirectAfterSignIn', '/app');
                    }}
                  >
                    Sign In Now
                  </motion.button>
                </SignInButton>
              )}
            </div>

            <p className="mt-6 text-sm text-gray-500">
              No credit card required • 100 Free Credits • Setup in minutes
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
