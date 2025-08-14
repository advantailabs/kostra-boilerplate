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
      'Best to try Peon. Limited usage. If credits drop below 50 you automatically move to Free Mode.',
    features: [
      'Auto-switch to Free when credits < 50',
      'No persona creation when credits < 50',
      'No file upload when credits < 50',
      'No knowledge base creation when credits < 50',
      'Basic chat & search',
    ],
    badge: 'Limited',
  },
  {
    id: 'pro',
    name: 'Pro Mode',
    price: '$10',
    period: 'per 1000 credits',
    description: 'Unlock creation features and higher limits with flexible credit packs.',
    features: [
      'Unlimited personas',
      'Unlimited knowledge bases',
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
  creationMin: 50, // Minimum credits required for create/edit persona/KB and uploads
} as const;
