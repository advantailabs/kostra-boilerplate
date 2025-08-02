'use client';

import { RiSecurePaymentFill, RiServerFill, RiShieldCheckFill } from '@remixicon/react';
import { motion } from 'framer-motion';

const securityFeatures = [
  {
    title: 'Self-Hosted Option',
    description:
      'Deploy Peon on your own infrastructure for complete control and data sovereignty.',
    icon: RiServerFill,
  },
  {
    title: 'HIPAA Compliant',
    description: 'Healthcare-grade security standards for handling sensitive medical information.',
    icon: RiShieldCheckFill,
  },
  {
    title: 'GDPR Ready',
    description: 'Built-in data protection and privacy controls to meet European regulations.',
    icon: RiSecurePaymentFill,
  },
];

export function SecuritySection() {
  return (
    <section className="relative -mt-1 bg-black py-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gray-800/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-950/5 to-black/0" />
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-6 text-4xl font-light text-white md:text-5xl">
            Security & Compliance First
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-400">
            Built with enterprise security in mind. Your data stays secure whether hosted on our
            infrastructure or your own private cloud.
          </p>
        </motion.div>

        {/* Security features grid */}
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 text-emerald-400">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
