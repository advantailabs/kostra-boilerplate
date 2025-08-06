'use client';

import { DummySearchBox } from '@/components/branding/DummySearchBox';
import { motion } from 'framer-motion';

export function ScreenshotShowcase() {
  return (
    <section
      className="relative overflow-hidden py-20 sm:py-24 md:py-32"
      style={{ background: 'linear-gradient(180deg, #0c0c0c 0%, #030712 50%, #000000 100%)' }}
    >
      {/* Seamless background transition - no visible borders */}
      <div className="absolute inset-0">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/10 via-gray-800/5 to-gray-900/10" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="mb-4 text-3xl font-light text-white sm:mb-6 sm:text-4xl md:text-5xl">
            Natural Chat Interface
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-400 sm:text-xl">
            Have conversations with your data using natural language. Ask questions and get instant,
            accurate answers backed by your knowledge base.
          </p>
        </motion.div>

        {/* Live Search Interface */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl"
        >
          <DummySearchBox />
        </motion.div>

        {/* Features list */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center sm:mt-20"
        >
          <div className="mx-auto grid max-w-3xl gap-6 sm:gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-2 text-base font-medium text-white sm:mb-3 sm:text-lg">
                Instant Answers
              </h3>
              <p className="text-xs text-gray-400 sm:text-sm">
                Get immediate responses to complex questions about your documents and data
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-medium text-white sm:mb-3 sm:text-lg">
                Source Citations
              </h3>
              <p className="text-xs text-gray-400 sm:text-sm">
                Every answer includes references to the exact documents and pages used
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-medium text-white sm:mb-3 sm:text-lg">
                Natural Language
              </h3>
              <p className="text-xs text-gray-400 sm:text-sm">
                Ask questions the way you naturally think - no special syntax required
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
