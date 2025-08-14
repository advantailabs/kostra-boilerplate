import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface RunResponsesQAParams {
  vectorStoreId: string;
  query: string;
  temperature?: number;
  maxOutputTokens?: number;
  model?: string;
  maxResults?: number;
  includeResults?: boolean;
}

export interface ResponsesCitationItem {
  file_id?: string;
  filename?: string;
  score?: number;
  text?: string;
  attributes?: Record<string, unknown> | null;
}

export interface RunResponsesQAResult {
  answer?: string;
  citations: ResponsesCitationItem[];
}

/**
 * Run Q&A using OpenAI Responses API with File Search tool bound to a vector store
 */
export async function runResponsesQA(params: RunResponsesQAParams): Promise<RunResponsesQAResult> {
  const {
    vectorStoreId,
    query,
    temperature = 0.2,
    maxOutputTokens = 512,
    model = 'gpt-4o-mini',
    maxResults,
    includeResults = true,
  } = params;

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  // Prepare request per official docs: tools with file_search and vector_store_ids
  const requestBody: any = {
    model,
    temperature,
    max_output_tokens: maxOutputTokens,
    input:
      'You are a helpful assistant. Answer strictly using the knowledge base results. ' +
      'If you are not sure, say you do not know. Cite filenames inline like [filename] when helpful.\n\n' +
      `Question: ${query}`,
    tools: [
      {
        type: 'file_search',
        vector_store_ids: [vectorStoreId],
        ...(typeof maxResults === 'number' ? { max_num_results: maxResults } : {}),
      },
    ],
  };

  if (includeResults) {
    requestBody.include = ['file_search_call.results'];
  }

  const response = await openai.responses.create(requestBody);

  const answer = (response as any)?.output_text?.trim() || undefined;

  // Extract citations from file_search_call results and message annotations
  const citations: ResponsesCitationItem[] = [];
  try {
    const outputs = (response as any)?.output || [];
    for (const out of outputs) {
      if ((out as any)?.type === 'file_search_call') {
        const results = (out as any)?.results || (out as any)?.search_results || [];
        for (const r of results) {
          citations.push({
            file_id: r?.file_id,
            filename: r?.filename,
            score: r?.score,
            text: r?.text,
          });
        }
      }

      if ((out as any)?.type === 'message') {
        const contentItems = (out as any)?.content || [];
        for (const content of contentItems) {
          const annotations = content?.annotations || [];
          for (const ann of annotations) {
            if (ann?.type === 'file_citation') {
              citations.push({
                file_id: ann?.file_id,
                filename: ann?.filename,
              });
            }
          }
        }
      }
    }
  } catch {
    // ignore extraction errors; we'll fallback to vector search in the route if needed
  }

  return { answer, citations };
}
