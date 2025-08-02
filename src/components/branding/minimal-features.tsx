'use client';

import {
  RiBarChartFill,
  RiFolder2Fill,
  RiQuestionnaireFill,
  RiSearchEyeFill,
  RiShieldUserFill,
  RiUser3Fill,
} from '@remixicon/react';
import { motion } from 'framer-motion';

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
  return (
    <section className="relative -mt-1 bg-black py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gray-800/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-950/5 to-black/0" />
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
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 transition-colors duration-300 group-hover:from-indigo-500/30 group-hover:to-purple-500/30">
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
      </div>
    </section>
  );
}
