import { Agent, fileSearchTool, run, setDefaultOpenAIKey } from '@openai/agents';

export interface RunSmartQAParams {
  vectorStoreId: string;
  query: string;
  maxNumResults?: number;
}

export interface AgentFileSearchItem {
  file_id?: string;
  filename?: string;
  score?: number;
  attributes?: Record<string, unknown> | null;
  content?: unknown;
}

export interface RunSmartQAResult {
  answer: string | null;
  citations: AgentFileSearchItem[];
}

export async function runSmartQA(params: RunSmartQAParams): Promise<RunSmartQAResult> {
  const { vectorStoreId, query, maxNumResults = 8 } = params;

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  setDefaultOpenAIKey(process.env.OPENAI_API_KEY);

  const agent = new Agent({
    name: 'Knowledge Base Q&A',
    instructions:
      'Answer the user question using only the provided file search results from the knowledge base. ' +
      'Be concise. If relevant, cite filenames inline like [filename]. If unsure, say you do not know.',
    tools: [
      fileSearchTool(vectorStoreId, {
        includeSearchResults: true,
        maxNumResults,
      }),
    ],
  });

  const result = await run(agent as any, query);

  const output = result.finalOutput;

  // Extract citations strictly from modelResponses providerData (file_search_call)
  const citations: AgentFileSearchItem[] = [];
  const modelResponses = result.rawResponses || [];
  for (const resp of modelResponses) {
    const outputs = resp.output;
    for (const out of outputs) {
      const providerData = out?.providerData;
      if (providerData && providerData.type === 'file_search_call') {
        const { results } = providerData;
        for (const r of results) {
          citations.push({
            file_id: r?.file_id,
            filename: r?.filename,
            score: r?.score,
            content: r?.text,
          });
        }
      }
    }
  }

  console.log('citations', citations);

  const answerText = output;

  return { answer: answerText, citations };
}
