import axios from '@/lib/axios';

interface UserCreditsResponse {
  credits: number;
}

export const getUserCredits = async (): Promise<number> => {
  const response = await axios.get<UserCreditsResponse>('/users/credits');
  // Standardized API returns { success: true, data: { credits } }
  return (response.data as any).data.credits as number;
};
