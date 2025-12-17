'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '80%', label: 'Reduction in search time' },
  { value: '60%', label: 'Faster support responses' },
  { value: '70%', label: 'Improved onboarding' },
  { value: '50%', label: 'Fewer repetitive questions' },
];

const valueProps = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    title: 'Smart AI Personas',
    description: 'Custom assistants trained on your specific knowledge',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
    title: 'Unified Knowledge Bases',
    description: 'All your files organized and searchable',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    title: 'Natural Conversations',
    description: 'Ask questions, get instant answers with citations',
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
    title: 'Enterprise Security',
    description: 'Bank-level security with full data privacy',
  },
];

export function ValueProposition() {
  return (
    <section className="bg-gray-800/50 py-24 sm:py-32">
      <div className="container mx-auto px-6">
        {/* Stats section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Immediate Impact</h2>
            <p className="mt-4 text-xl text-gray-300">See results from day one</p>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-4xl font-bold text-transparent lg:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-gray-400 lg:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Value props section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Core Value Proposition</h2>
            <p className="mt-4 text-xl text-gray-200">
              Everything you need to transform your knowledge management
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((prop, index) => (
              <motion.div
                key={prop.title}
                className="border-gray-500/20  bg-white/5 hover:border-white/20 hover:bg-white/10 group relative overflow-hidden rounded-2xl border p-8 backdrop-blur-sm transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600/20 to-violet-600/20 text-blue-400">
                  {prop.icon}
                </div>
                <h3 className="mb-4 text-xl font-semibold text-white">{prop.title}</h3>
                <p className="text-gray-200">{prop.description}</p>

                {/* Subtle hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-violet-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
