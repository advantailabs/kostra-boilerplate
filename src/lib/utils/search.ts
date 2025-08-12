import type { SearchMode as FrontendSearchMode } from '@/lib/constants/search';
import type { SearchMode as PrismaSearchMode } from '@prisma/client';

export interface OpenAiVectorSearchItem {
  file_id?: string;
  filename?: string;
  score?: number;
  attributes?: Record<string, unknown> | null;
  content?: unknown;
}

export interface NormalizedSearchItem {
  filename: string;
  score: number;
  attributes?: Record<string, unknown> | null;
  content?: unknown;
  openaiFileId?: string | null;
}

export function transformOpenAiResults(items: any[]): NormalizedSearchItem[] {
  const normalized: NormalizedSearchItem[] = (items || []).map((item: OpenAiVectorSearchItem) => ({
    filename: item?.filename || 'Unknown',
    score: typeof item?.score === 'number' ? item.score : 0,
    attributes: item?.attributes ?? null,
    content: item?.content ?? null,
    openaiFileId: item?.file_id ?? null,
  }));

  // Sort by score desc to ensure most confident first
  normalized.sort((a, b) => (b.score || 0) - (a.score || 0));
  return normalized;
}

export function mapFrontendModeToPrismaMode(mode: FrontendSearchMode): PrismaSearchMode {
  switch (mode) {
    case 'smart-search':
      return 'SMART_SEARCH';
    case 'smart-qa':
      return 'QA';
    default:
      return 'SMART_SEARCH';
  }
}
