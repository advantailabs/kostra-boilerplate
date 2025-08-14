import { transformOpenAiResults } from '@/lib/utils/search';
import { runSmartQA } from '@/services/external/openai/agent';
import { runResponsesQA } from '@/services/external/openai/responses';
import { searchVectorStore } from '@/services/external/openai/vector-store';

export type SearchEngine = 'agentic' | 'responses' | 'vector';

export interface SearchRunParams {
  vectorStoreId: string;
  query: string;
  limit?: number;
}

export interface SearchRunResultItem {
  filename: string;
  score: number;
  attributes?: Record<string, unknown> | null;
  content?: unknown;
  openaiFileId?: string | null;
}

export interface SearchRunResult {
  answer?: string;
  items: SearchRunResultItem[];
}

export interface SearchStrategy {
  run(params: SearchRunParams): Promise<SearchRunResult>;
}

class AgenticStrategy implements SearchStrategy {
  async run(params: SearchRunParams): Promise<SearchRunResult> {
    const { vectorStoreId, query } = params;
    const qa = await runSmartQA({ vectorStoreId, query });

    const items = Array.isArray(qa.citations)
      ? qa.citations.map(c => ({
          filename: c?.filename || 'Unknown',
          score: typeof c?.score === 'number' ? c.score : 0,
          attributes: c?.attributes ?? null,
          content: c?.content ? [{ type: 'text', text: String(c.content) }] : null,
          openaiFileId: c?.file_id ?? null,
        }))
      : [];

    return { answer: qa.answer ?? undefined, items };
  }
}

class ResponsesStrategy implements SearchStrategy {
  async run(params: SearchRunParams): Promise<SearchRunResult> {
    const { vectorStoreId, query, limit } = params;
    const qa = await runResponsesQA({
      vectorStoreId,
      query,
      maxResults: typeof limit === 'number' ? limit : undefined,
      includeResults: true,
    });

    const items = Array.isArray(qa.citations)
      ? qa.citations.map(c => ({
          filename: c?.filename || 'Unknown',
          score: typeof c?.score === 'number' ? c.score : 0,
          attributes: c?.attributes ?? null,
          content: c?.text ? [{ type: 'text', text: String(c.text) }] : null,
          openaiFileId: c?.file_id ?? null,
        }))
      : [];

    return { answer: qa.answer ?? undefined, items };
  }
}

class VectorStrategy implements SearchStrategy {
  async run(params: SearchRunParams): Promise<SearchRunResult> {
    const { vectorStoreId, query, limit = 10 } = params;
    const search = await searchVectorStore({ vectorStoreId, query, limit });
    if (!search.success || !search.data) {
      return { items: [] };
    }
    const dataArray: any[] = Array.isArray(search.data?.data) ? (search.data.data as any[]) : [];
    const items = transformOpenAiResults(dataArray).slice(0, 10);
    return { items } as any;
  }
}

export function createSearchStrategy(engine: SearchEngine): SearchStrategy {
  switch (engine) {
    case 'agentic':
      return new AgenticStrategy();
    case 'responses':
      return new ResponsesStrategy();
    case 'vector':
    default:
      return new VectorStrategy();
  }
}
