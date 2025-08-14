import axiosInstance from '@/lib/axios';
import type { SearchMode } from '@/lib/constants/search';

export interface SmartSearchRequest {
  query: string;
  knowledgeBaseId: number;
  mode: SearchMode;
  engine?: 'agentic' | 'responses' | 'vector';
}

export interface SmartSearchResultItem {
  id: string;
  filename: string;
  score: number;
  attributes?: Record<string, unknown> | null;
  content?: unknown;
  fileId?: number | null;
  rank: number;
}

export interface SmartSearchResponse {
  searchQueryId: string;
  answer?: string | null;
  results: SmartSearchResultItem[];
}

export async function smartSearch(payload: SmartSearchRequest): Promise<SmartSearchResponse> {
  const response = await axiosInstance.post('/search/smart', payload);
  return (response.data as any).data as SmartSearchResponse;
}
