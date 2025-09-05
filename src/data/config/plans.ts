export type Plan = {
  id: 'free' | 'pro' | 'enterprise';
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  badge?: string;
};

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free Mode',
    price: '$0',
    description:
      'Best to try Peon. Free users can have 1 persona, 1 knowledge base, and up to 50 total files. 50 credits are available to start with.',
    features: ['1 persona', '1 knowledge base', 'Up to 50 total files', 'Basic Chat & Search'],
    badge: 'Limited',
  },
  {
    id: 'pro',
    name: 'Pro Mode',
    price: '$15',
    period: 'month',
    description: 'Monthly subscription. Unlimited creation features and higher limits each month.',
    features: [
      '10,000 credits per month',
      'Unlimited personas & knowledge bases',
      'Up to 10,000 file uploads',
      '5 GB file storage included',
      'Priority support',
    ],
    badge: 'Popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    description: 'Tailored deployment, security and support for your organization.',
    features: [
      'Your cloud and infra',
      'Your LLM infra',
      'Custom file storage limits',
      'SSO',
      '24/7 support & maintenance',
    ],
  },
];

export const CREDIT_THRESHOLDS = {
  searchChatMin: 1, // Minimum credits required to perform search/chat actions
  // Creation actions are controlled by plan-based limits for Free users
  creationMin: 0,
} as const;

export const FREE_LIMITS = {
  personas: 1,
  filesTotal: 50,
} as const;

export const PLANS_CONFIG = {
  pro: {
    name: 'Pro Mode',
    price: '15',
    credits: 10000,
  },
  creditPack: {
    name: 'Credit Pack',
    price: '10',
    credits: 1000,
  },
};
