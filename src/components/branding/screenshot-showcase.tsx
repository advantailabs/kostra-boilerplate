'use client';

import { DummySearchBox } from '@/components/branding/DummySearchBox';
import { motion } from 'framer-motion';

export function ScreenshotShowcase() {
  return (
    <section
      className="relative overflow-hidden py-32"
      style={{ background: 'linear-gradient(180deg, #0c0c0c 0%, #030712 50%, #000000 100%)' }}
    >
      {/* Seamless background transition - no visible borders */}
      <div className="absolute inset-0">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/10 via-gray-800/5 to-gray-900/10" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-6 text-4xl font-light text-white md:text-5xl">
            Natural Chat Interface
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-400">
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
          className="mt-20 text-center"
        >
          <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-3 text-lg font-medium text-white">Instant Answers</h3>
              <p className="text-sm text-gray-400">
                Get immediate responses to complex questions about your documents and data
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-medium text-white">Source Citations</h3>
              <p className="text-sm text-gray-400">
                Every answer includes references to the exact documents and pages used
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-medium text-white">Natural Language</h3>
              <p className="text-sm text-gray-400">
                Ask questions the way you naturally think - no special syntax required
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
