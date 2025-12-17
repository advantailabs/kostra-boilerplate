'use client';

import { siteConfig } from '@/app/siteConfig';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-900">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="bg-grid-white/[0.02] absolute inset-0 bg-[size:50px_50px]" />
        <div className="from-gray-900/90 absolute inset-0 bg-gradient-to-t to-transparent" />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="bg-indigo-500/5 absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
      </div>

      <div className="container relative mx-auto px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Announcement badge */}
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="border-gray-500/20  bg-white/5 hover:border-white/20 hover:bg-white/10 group relative rounded-full border px-4 py-2 text-sm leading-6 text-gray-200 backdrop-blur-sm transition-all">
              Announcing our next generation platform
              <span className="ml-2 text-blue-400 transition-colors group-hover:text-blue-300">
                →
              </span>
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            className="text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              Intelligent Knowledge
            </span>
            <br />
            <span className="text-white">Management</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mx-auto mt-8 max-w-2xl text-xl leading-8 text-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform scattered information into actionable intelligence with AI-powered knowledge
            assistants.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a
              href={siteConfig.baseLinks.home}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105 hover:from-blue-700 hover:to-violet-700"
            >
              <span className="relative z-10">Start Free Trial</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-violet-700 opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
            <a
              href="#features"
              className="border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10 group rounded-full border px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all"
            >
              Learn More
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p className="mb-6 text-sm text-gray-400">
              Trusted by hundreds of organizations worldwide
            </p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              {/* Placeholder for company logos */}
              <div className="bg-white/10 h-8 w-24 rounded" />
              <div className="bg-white/10 h-8 w-24 rounded" />
              <div className="bg-white/10 h-8 w-24 rounded" />
              <div className="bg-white/10 h-8 w-24 rounded" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
