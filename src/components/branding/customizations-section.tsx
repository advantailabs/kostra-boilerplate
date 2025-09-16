'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { siteConfig } from '@/app/siteConfig';
import AmazonWebServices from '@/components/icons/AmazonWebServices';
import Dropbox from '@/components/icons/Dropbox';
import GoogleDrive from '@/components/icons/GoogleDrive';
import JavaScript from '@/components/icons/JavaScript';
import OneDrive from '@/components/icons/Onedrive';
import Python from '@/components/icons/Python';
import SharePoint from '@/components/icons/SharePoint';
import Slack from '@/components/icons/Slack';
import Swagger from '@/components/icons/Swagger';
import Teams from '@/components/icons/Teams';
import Widget from '@/components/icons/Widget';

const featuredIntegrations = [
  { name: 'Slack', icon: Slack },
  { name: 'Teams', icon: Teams },
  { name: 'Google Drive', icon: GoogleDrive },
  { name: 'Amazon S3', icon: AmazonWebServices },
  { name: 'Dropbox', icon: Dropbox },
  { name: 'SharePoint', icon: SharePoint },
  { name: 'OneDrive', icon: OneDrive },
  { name: 'JavaScript', icon: JavaScript },
  { name: 'Python', icon: Python },
  { name: 'REST API', icon: Swagger },
  { name: 'Widget', icon: Widget },
];

function IntegrationIcon({
  integration,
  index,
}: {
  integration: { name: string; icon: React.ComponentType<any> };
  index: number;
}) {
  const Icon = integration.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] sm:h-16 sm:w-16">
        <Icon className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110 sm:h-8 sm:w-8" />
      </div>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-gray-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:-bottom-8">
        {integration.name}
      </div>
    </motion.div>
  );
}

export function CustomizationsSection() {
  return (
    <section className="relative bg-black py-16 sm:py-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="bg-gradient-radial absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 from-blue-500/10 via-purple-500/5 to-transparent blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="mb-4 bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-3xl font-light text-transparent sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
            Powerful Customizations
          </h2>

          <p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-400 sm:text-lg">
            Connect Peon with your favorite tools and platforms. Explore our growing ecosystem of
            integrations.
          </p>
        </motion.div>

        {/* Integration Icons Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-16"
        >
          <div className="flex flex-wrap justify-center gap-4 pb-6 sm:gap-6 sm:pb-8 md:gap-8">
            {featuredIntegrations.map((integration, index) => (
              <IntegrationIcon key={integration.name} integration={integration} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6 backdrop-blur-sm sm:p-8">
            <h3 className="mb-3 text-xl font-semibold text-white sm:mb-4 sm:text-2xl">
              Explore All Integrations
            </h3>
            <p className="mb-4 text-sm text-gray-400 sm:mb-6 sm:text-base">
              Discover detailed integration guides, setup instructions, and developer tools in our
              comprehensive customizations hub.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Link href={siteConfig.baseLinks.customizations}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-blue-500/25 sm:w-auto sm:px-8 sm:text-base"
                >
                  View All Integrations
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
