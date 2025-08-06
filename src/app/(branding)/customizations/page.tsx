'use client';

import { RiExternalLinkLine } from '@remixicon/react';
import { motion } from 'framer-motion';
import React from 'react';

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

type StatusType = 'coming-soon' | 'available' | 'beta';
type DifficultyType = 'Easy' | 'Medium' | 'Hard';

const integrationCategories = [
  {
    title: 'Communication & Collaboration',
    description: 'Connect Peon with your team communication tools for seamless AI assistance',
    integrations: [
      {
        name: 'Slack Bot',
        icon: Slack,
        description: 'Ask questions directly in your Slack workspace with @peon mentions',
        status: 'coming-soon' as StatusType,
        features: [
          'Direct message queries',
          'Channel-wide assistance',
          'Thread-based conversations',
          'File sharing integration',
        ],
        setupTime: '5 minutes',
        difficulty: 'Easy' as DifficultyType,
      },
      {
        name: 'Microsoft Teams',
        icon: Teams,
        description: 'Integrate seamlessly with Microsoft Teams for enterprise workflows',
        status: 'coming-soon' as StatusType,
        features: [
          'Teams app integration',
          'Meeting transcription analysis',
          'SharePoint file access',
          'Office 365 integration',
        ],
        setupTime: '10 minutes',
        difficulty: 'Easy' as DifficultyType,
      },
      {
        name: 'Website Widget',
        icon: Widget,
        description: 'Embed AI chat widget on your website for customer support',
        status: 'coming-soon' as StatusType,
        features: [
          'Customizable chat interface',
          'Knowledge base integration',
          'Lead capture forms',
          'Analytics dashboard',
        ],
        setupTime: '15 minutes',
        difficulty: 'Medium' as DifficultyType,
      },
    ],
  },
  {
    title: 'Cloud Storage & Documents',
    description: 'Sync your documents and files from popular cloud storage platforms',
    integrations: [
      {
        name: 'Google Drive',
        icon: GoogleDrive,
        description: 'Sync files from Google Drive for AI-powered document analysis',
        status: 'coming-soon' as StatusType,
        features: [
          'Real-time file sync',
          'Folder-based organization',
          'Permission-aware access',
          'Version tracking',
        ],
        setupTime: '5 minutes',
        difficulty: 'Easy' as DifficultyType,
      },
      {
        name: 'Amazon S3',
        icon: AmazonWebServices,
        description: 'Connect your S3 buckets for enterprise document management',
        status: 'coming-soon' as StatusType,
        features: [
          'Bucket-level access control',
          'Metadata extraction',
          'Large file support',
          'Cost-effective storage',
        ],
        setupTime: '10 minutes',
        difficulty: 'Medium' as DifficultyType,
      },
      {
        name: 'Dropbox',
        icon: Dropbox,
        description: 'Import files from Dropbox with automatic synchronization',
        status: 'coming-soon' as StatusType,
        features: [
          'Automatic file sync',
          'Shared folder support',
          'Paper document integration',
          'Team collaboration',
        ],
        setupTime: '5 minutes',
        difficulty: 'Easy' as DifficultyType,
      },
      {
        name: 'Microsoft SharePoint',
        icon: SharePoint,
        description: 'Access SharePoint documents and libraries seamlessly',
        status: 'coming-soon' as StatusType,
        features: [
          'Document library access',
          'List and library sync',
          'Workflow integration',
          'Enterprise security',
        ],
        setupTime: '15 minutes',
        difficulty: 'Hard' as DifficultyType,
      },
      {
        name: 'Microsoft OneDrive',
        icon: OneDrive,
        description: 'Sync with Microsoft OneDrive for personal and business files',
        status: 'coming-soon' as StatusType,
        features: [
          'Personal & business accounts',
          'Office document integration',
          'Real-time collaboration',
          'Version history',
        ],
        setupTime: '5 minutes',
        difficulty: 'Easy' as DifficultyType,
      },
    ],
  },
  {
    title: 'Developer Tools & APIs',
    description: 'Build custom integrations with our comprehensive APIs and SDKs',
    integrations: [
      {
        name: 'JavaScript SDK',
        icon: JavaScript,
        description: 'Full-featured JavaScript SDK for web applications',
        status: 'coming-soon' as StatusType,
        features: [
          'TypeScript support',
          'React components',
          'Webhook handling',
          'Real-time updates',
        ],
        setupTime: '30 minutes',
        difficulty: 'Medium' as DifficultyType,
        code: 'npm install @peon/js-sdk',
        docs: '/docs/javascript-sdk',
      },
      {
        name: 'Python SDK',
        icon: Python,
        description: 'Python SDK for backend integrations and automation',
        status: 'coming-soon' as StatusType,
        features: [
          'Async/await support',
          'Django integration',
          'FastAPI compatibility',
          'CLI tools included',
        ],
        setupTime: '20 minutes',
        difficulty: 'Medium' as DifficultyType,
        code: 'pip install peon-python-sdk',
        docs: '/docs/python-sdk',
      },
      {
        name: 'REST API',
        icon: Swagger,
        description: 'Complete REST API with OpenAPI documentation',
        status: 'coming-soon' as StatusType,
        features: [
          'OpenAPI 3.0 spec',
          'Authentication flows',
          'Rate limiting',
          'Webhook endpoints',
        ],
        setupTime: '45 minutes',
        difficulty: 'Hard' as DifficultyType,
        code: 'curl -X POST https://api.peon.ai/v1/chat',
        docs: '/docs/rest-api',
      },
    ],
  },
];

const statusColors: Record<StatusType, { bg: string; text: string; dot: string }> = {
  'coming-soon': {
    bg: 'bg-amber-500/20',
    text: 'text-amber-200',
    dot: 'bg-amber-400',
  },
  available: {
    bg: 'bg-green-500/20',
    text: 'text-green-200',
    dot: 'bg-green-400',
  },
  beta: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-200',
    dot: 'bg-blue-400',
  },
};

const difficultyColors: Record<DifficultyType, string> = {
  Easy: 'text-green-400',
  Medium: 'text-yellow-400',
  Hard: 'text-red-400',
};

interface IntegrationCardProps {
  integration: {
    name: string;
    icon: React.ComponentType<any>;
    description: string;
    status: StatusType;
    features: string[];
    setupTime: string;
    difficulty: DifficultyType;
    code?: string;
    docs?: string;
  };
}

function IntegrationCard({ integration }: IntegrationCardProps) {
  const Icon = integration.icon;
  const statusStyle = statusColors[integration.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/[0.08] hover:to-white/[0.03]"
    >
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm transition-colors duration-300 group-hover:bg-white/15">
            <Icon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{integration.name}</h3>
            <div className="mt-1 flex items-center gap-3 text-sm">
              <span className={`${difficultyColors[integration.difficulty]}`}>
                {integration.difficulty}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{integration.setupTime}</span>
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-2 rounded-full px-3 py-1 ${statusStyle.bg}`}>
          <div className={`h-2 w-2 rounded-full ${statusStyle.dot}`} />
          <span className={`text-xs font-medium ${statusStyle.text}`}>
            {integration.status === 'coming-soon' ? 'Coming Soon' : integration.status}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="mb-6 leading-relaxed text-gray-400">{integration.description}</p>

      {/* Features */}
      <div className="mb-6">
        <h4 className="mb-3 text-sm font-medium text-white">Key Features</h4>
        <ul className="space-y-2">
          {integration.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-sm text-gray-400">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Code snippet for developer tools */}
      {integration.code && (
        <div className="mb-4 rounded-lg border border-white/5 bg-gray-900/50 p-3 font-mono text-xs">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-red-400" />
              <div className="h-2 w-2 rounded-full bg-yellow-400" />
              <div className="h-2 w-2 rounded-full bg-green-400" />
            </div>
            <span className="text-gray-500">terminal</span>
          </div>
          <div className="text-green-400">
            <span className="text-gray-500">$</span> {integration.code}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="w-full rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15 sm:w-auto sm:flex-1">
          Request Access
        </button>
        {integration.docs && (
          <button className="w-full items-center rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 sm:flex sm:w-auto sm:gap-2">
            <RiExternalLinkLine className="hidden h-4 w-4 sm:block" />
            Docs
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function CustomizationsPage() {
  return (
    <>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="bg-gradient-radial absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 from-blue-500/10 via-purple-500/5 to-transparent blur-3xl" />
        <div className="bg-gradient-radial absolute right-0 top-1/3 h-96 w-96 translate-x-1/2 from-purple-500/10 via-pink-500/5 to-transparent blur-3xl" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto overflow-x-hidden px-6 py-16">
        {integrationCategories.map((category, categoryIndex) => (
          <motion.section
            key={category.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            {/* Category Header */}
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-semibold text-white md:text-4xl">
                {category.title}
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-400">{category.description}</p>
            </div>

            {/* Integrations Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {category.integrations.map(integration => (
                <IntegrationCard key={integration.name} integration={integration} />
              ))}
            </div>
          </motion.section>
        ))}

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-12 backdrop-blur-sm">
            <h2 className="mb-6 text-3xl font-semibold text-white">Don't See Your Tool?</h2>
            <p className="mb-8 text-lg text-gray-400">
              We're constantly expanding our integration ecosystem. Request a custom integration or
              contribute to our open-source connectors on GitHub.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <motion.a
                href="mailto:hi@peon.sh"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 font-medium text-white shadow-lg transition-all duration-200 hover:shadow-blue-500/25"
              >
                Ping us at hi@peon.sh
              </motion.a>
            </div>
          </div>
        </motion.section>
      </div>
    </>
  );
}
