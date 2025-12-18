'use client';

import { RiSecurePaymentFill, RiServerFill, RiShieldCheckFill } from '@remixicon/react';
import { motion } from 'framer-motion';

const securityFeatures = [
  {
    title: 'Self-Hosted Option',
    description:
      'Deploy Next.js boilerplate on your own infrastructure for complete control and data sovereignty.',
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
    <section className="relative -mt-1 bg-black py-16 sm:py-20">
      <div className="bg-gray-800/30 absolute inset-x-0 top-0 h-px" />
      <div className="from-emerald-950/5 to-black/0 pointer-events-none absolute inset-0 bg-gradient-to-b" />
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="mb-4 text-3xl font-light text-white sm:mb-6 sm:text-4xl md:text-5xl">
            Security & Compliance First
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-400 sm:text-xl">
            Built with enterprise security in mind. Your data stays secure whether hosted on our
            infrastructure or your own private cloud.
          </p>
        </motion.div>

        {/* Security features grid */}
        <div className="mx-auto grid max-w-6xl gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border-gray-500/20  bg-white/5 hover:border-white/20 hover:bg-white/10 group relative overflow-hidden rounded-2xl border p-4 backdrop-blur-sm transition-all sm:p-6"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className=" flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl  text-primary sm:h-12 sm:w-12">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="mb-2 text-base font-semibold text-white sm:text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-400 sm:text-sm">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
