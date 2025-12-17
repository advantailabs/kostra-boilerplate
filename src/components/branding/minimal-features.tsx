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
    title: 'Modern Authentication',
    description:
      'Built-in authentication system with Google OAuth, email/password, and secure session management.',
    icon: RiUser3Fill,
  },
  {
    title: 'File Management',
    description:
      'Complete file upload system with S3 integration, drag-and-drop interface, and file organization.',
    icon: RiFolder2Fill,
  },
  {
    title: 'Advanced Search',
    description:
      'Powerful search functionality with filtering, sorting, and real-time search capabilities.',
    icon: RiSearchEyeFill,
  },
  {
    title: 'User Management',
    description:
      'Comprehensive user management system with roles, permissions, and admin controls.',
    icon: RiShieldUserFill,
  },
  {
    title: 'Dashboard & Analytics',
    description:
      'Beautiful dashboard with analytics, charts, and insights to track your application usage.',
    icon: RiQuestionnaireFill,
  },
  {
    title: 'Responsive Design',
    description:
      'Fully responsive design that works perfectly on desktop, tablet, and mobile devices.',
    icon: RiBarChartFill,
  },
];

export function MinimalFeatures() {
  return (
    <section className="relative bg-black py-20 sm:py-24 md:py-32">
      {/* Remove the top border line that creates a seam */}
      <div className="from-indigo-950/5 to-black/0 pointer-events-none absolute inset-0 bg-gradient-to-b" />
      <div className="container mx-auto px-4 sm:px-6">
        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center sm:mb-20"
        >
          <h2 className="mb-4 text-3xl font-light text-white sm:mb-6 sm:text-4xl md:text-5xl">
            Everything You Need
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400 sm:text-xl">
            A complete Next.js boilerplate with all the essential features to get your application
            up and running quickly. Focus on your business logic, not the infrastructure.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-8 sm:gap-10 md:grid-cols-2 md:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="from-primary/20 to-primary/30 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-primary transition-colors duration-300 sm:h-12 sm:w-12">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-medium text-white transition-colors duration-300 group-hover:text-gray-300 sm:mb-3 sm:text-xl">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400 sm:text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
