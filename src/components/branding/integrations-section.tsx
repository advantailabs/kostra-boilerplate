'use client';

import {
  RiAmazonFill,
  RiApps2Fill,
  RiCloudFill,
  RiCodeFill,
  RiDropboxFill,
  RiGoogleFill,
  RiHardDriveFill,
  RiMessage3Fill,
  RiMicrosoftFill,
  RiSlackFill,
  RiWindowFill,
} from '@remixicon/react';
import { motion } from 'framer-motion';

const communicationIntegrations = [
  {
    name: 'Slack Bot',
    icon: RiSlackFill,
    color: 'text-purple-400',
    description: 'Ask questions directly in Slack',
  },
  {
    name: 'Teams Bot',
    icon: RiMessage3Fill,
    color: 'text-blue-400',
    description: 'Integrate with Microsoft Teams',
  },
  {
    name: 'Website Widget',
    icon: RiWindowFill,
    color: 'text-green-400',
    description: 'Embed chat widget on your site',
  },
];

const storageIntegrations = [
  { name: 'Google Drive', icon: RiGoogleFill, color: 'text-green-400' },
  { name: 'Amazon S3', icon: RiAmazonFill, color: 'text-orange-400' },
  { name: 'Dropbox', icon: RiDropboxFill, color: 'text-blue-400' },
  { name: 'SharePoint', icon: RiMicrosoftFill, color: 'text-indigo-400' },
  { name: 'OneDrive', icon: RiCloudFill, color: 'text-cyan-400' },
  { name: 'Box', icon: RiHardDriveFill, color: 'text-blue-400' },
];

const apiSDKs = [
  {
    name: 'JavaScript SDK',
    icon: RiCodeFill,
    color: 'text-yellow-400',
    description: 'npm install @peon/sdk',
  },
  {
    name: 'Python SDK',
    icon: RiCodeFill,
    color: 'text-blue-400',
    description: 'pip install peon-sdk',
  },
  {
    name: 'REST API',
    icon: RiApps2Fill,
    color: 'text-purple-400',
    description: 'Direct HTTP API access',
  },
];

export function IntegrationsSection() {
  return (
    <section className="relative bg-black py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-light text-white md:text-4xl">
            Customizations Coming Soon
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Seamlessly integrate with your existing workflow tools and cloud storage platforms.
          </p>
        </motion.div>
        {/* Communication Tools */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="mb-8 text-2xl font-medium text-white">Communication & Widgets</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {communicationIntegrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${integration.color} bg-opacity-20`}
                  >
                    <integration.icon className={`h-6 w-6 ${integration.color}`} />
                  </div>
                  <div>
                    <h4 className="mb-2 text-lg font-semibold text-white">{integration.name}</h4>
                    <p className="text-sm text-gray-400">{integration.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* API SDKs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="mb-8 text-2xl font-medium text-white">API & SDKs</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {apiSDKs.map((sdk, index) => (
              <motion.div
                key={sdk.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${sdk.color} bg-opacity-20`}
                  >
                    <sdk.icon className={`h-6 w-6 ${sdk.color}`} />
                  </div>
                  <div>
                    <h4 className="mb-2 text-lg font-semibold text-white">{sdk.name}</h4>
                    <p className="text-sm text-gray-400">{sdk.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Storage Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="mb-8 text-2xl font-medium text-white">Cloud Storage</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {storageIntegrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative flex flex-col items-center rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
              >
                <integration.icon
                  className={`mb-2 h-8 w-8 ${integration.color} transition-colors group-hover:text-white`}
                />
                <span className="text-xs text-gray-400 group-hover:text-gray-300">
                  {integration.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
