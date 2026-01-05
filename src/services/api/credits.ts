import { axios } from '@/lib/utils';

interface UserCreditsResponse {
  data: { credits: number };
}

export const getUserCredits = async (): Promise<UserCreditsResponse> => {
  const response = await axios.get<UserCreditsResponse>('/users/credits');
  // Standardized API returns { success: true, data: { credits } }
  if (!response.data) {
    throw new Error('No Data was sent in Response');
  }
  return response.data.data as unknown as UserCreditsResponse;
};

export const createBillingPortalSession = async (): Promise<string> => {
  const response = await axios.post('/billing/portal');
  if (!response.data) {
    throw new Error('No Data was sent in Response');
  }
  return response.data.data.url as string;
};

export const createCheckoutSession = async (plan: string = 'pro'): Promise<string> => {
  const response = await axios.post('/billing/checkout', { plan });
  if (!response.data) {
    throw new Error('No Data was sent in Response');
  }
  return response.data.data.url as string;
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
  const response = await axios.get<{ data: { history: CreditHistoryItem[] } }>(
    `/users/credits/history?limit=${limit}`
  );
  if (!response.data.data.history) {
    throw new Error('No Data was sent in Response');
  }
  return response.data.data.history as CreditHistoryItem[];
};
