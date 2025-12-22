export type Plan = {
  id: 'free' | 'pro' | 'enterprise' | 'lifetime';
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  badge?: string;
};

export const PLANS: Plan[] = [
  {
    id: 'lifetime',
    name: 'Lifetime Access',
    price: '$150',
    description: 'One-time payment for lifetime access to all updates and features.',
    features: [
      'Regular git version updates',
      'Access to all variants in future',
      'Bug Fixes and Patches',
      'Technical Support over email',
    ],
    badge: 'Best Value',
  },
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
    badge: 'Best Value',
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
    credits: 1000, // Credits included with pro plan
  },
  enterprise: {
    name: 'Enterprise',
    price: 'custom',
    features: ['custom_deployment', 'dedicated_support', 'sso'],
    credits: 5000, // Credits included with enterprise plan
  },
  creditPack: {
    name: 'Credit Pack',
    price: 'custom',
    features: ['additional_credits'],
    credits: 100, // Credits per credit pack
  },
};
