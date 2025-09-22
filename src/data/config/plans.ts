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
    name: 'Starter',
    price: '$0',
    description:
      'Perfect for getting started. Includes basic features and limited usage to explore the platform.',
    features: [
      'Basic authentication',
      'File uploads (up to 100)',
      'Dashboard access',
      'Community support',
    ],
    badge: 'Free',
  },
  {
    id: 'pro',
    name: 'Professional',
    price: '$29',
    period: 'month',
    description: 'Full access to all features with higher limits and priority support.',
    features: [
      'Unlimited file uploads',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
      'Team collaboration',
    ],
    badge: 'Popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    description: 'Tailored solution for large organizations with custom requirements.',
    features: [
      'Custom deployment',
      'Dedicated support',
      'SSO integration',
      'Custom branding',
      'SLA guarantee',
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
    name: 'Professional',
    price: '29',
    features: ['unlimited_files', 'advanced_analytics', 'priority_support'],
  },
  enterprise: {
    name: 'Enterprise',
    price: 'custom',
    features: ['custom_deployment', 'dedicated_support', 'sso'],
  },
};
