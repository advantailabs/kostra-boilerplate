import { axios } from '@/lib/utils';

interface UserCreditsResponse {
  credits: number;
}

export const getUserCredits = async (): Promise<number> => {
  const response = await axios.get<UserCreditsResponse>('/users/credits');
  // Standardized API returns { success: true, data: { credits } }
  return (response.data as any).data.credits as number;
};

export const createBillingPortalSession = async (): Promise<string> => {
  const response = await axios.post<{ url: string } | any>('/billing/portal');
  return ((response.data as any).data?.url || (response.data as any).url) as string;
};

export const createCheckoutSession = async (plan: string = 'pro'): Promise<string> => {
  const response = await axios.post<{ url: string } | any>('/billing/checkout', { plan });
  return ((response.data as any).data?.url || (response.data as any).url) as string;
};

export interface CreditHistoryItem {
  id: number;
  userId: number;
  type: 'CREDIT' | 'DEBIT';
  operation:
    | 'CHAT'
    | 'SMART_SEARCH'
    | 'SMART_QA'
    | 'INITIAL_CREDITS'
    | 'MANUAL_ADJUSTMENT'
    | 'CREDIT_PURCHASE';
  amount: number;
  balanceAfter: number;
  objectId?: string | null;
  description?: string | null;
  createdAt: string;
}

export const getCreditHistory = async (limit = 50): Promise<CreditHistoryItem[]> => {
  const response = await axios.get<{ history: CreditHistoryItem[] }>(
    `/users/credits/history?limit=${limit}`
  );
  return (response.data as any).data.history as CreditHistoryItem[];
};
