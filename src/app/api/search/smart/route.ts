import {
  errorResponse,
  forbiddenResponse,
  internalServerErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from '@/lib/utils/response';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { CREDIT_COSTS } from '../../../../lib/constants/credits';
import { mapFrontendModeToPrismaMode, transformOpenAiResults } from '../../../../lib/utils/search';
import { searchVectorStore } from '../../../../services/external/openai/vector-store';
import { CreditService } from '../../../../services/internal/credit';
import {
  createSearchStrategy,
  type SearchEngine,
} from '../../../../services/internal/search/factory';
import {
  getKnowledgeBaseWithVectorStore,
  persistSearch,
} from '../../../../services/repositories/search';
import { getUserByClerkId } from '../../../../services/repositories/user';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return unauthorizedResponse();
    }

    const user = await getUserByClerkId(clerkUserId);
    if (!user) {
      return notFoundResponse('User does not exist');
    }

    const body = await request.json();
    const query: string = body?.query;
    const knowledgeBaseIdRaw: string | number | undefined = body?.knowledgeBaseId;
    const modeRaw: string | undefined = body?.mode;
    const engineRaw: string | undefined = body?.engine; // 'agentic' | 'responses' | 'vector'
    const limit: number = 10; // enforce top 10 on server

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return validationErrorResponse('Invalid input data', [
        { field: 'query', message: 'Query is required' },
      ]);
    }

    const knowledgeBaseId = knowledgeBaseIdRaw ? Number(knowledgeBaseIdRaw) : undefined;
    if (!knowledgeBaseId || Number.isNaN(knowledgeBaseId)) {
      return validationErrorResponse('Invalid input data', [
        { field: 'knowledgeBaseId', message: 'knowledgeBaseId is required' },
      ]);
    }

    const kb = await getKnowledgeBaseWithVectorStore(knowledgeBaseId);
    if (!kb || !kb.vectorStoreId) {
      return errorResponse('Selected knowledge base has no vector store configured', 400);
    }
    // Ensure user owns the knowledge base
    if (kb.userId !== user.id) {
      return forbiddenResponse('You do not have access to this knowledge base');
    }

    const isQA = modeRaw === 'smart-qa';

    // Check if user has sufficient credits
    const creditCost = isQA ? CREDIT_COSTS.SMART_QA : CREDIT_COSTS.SMART_SEARCH;
    const hasCredits = await CreditService.hassufficientCredits(user.id, creditCost);
    if (!hasCredits) {
      return NextResponse.json(
        {
          error: 'Insufficient credits',
          message:
            'You do not have enough credits to perform this search. Please purchase more credits.',
        },
        { status: 402 }
      );
    }

    let answer: string | undefined;
    let normalized: any[] = [];
    const resolvedEngine: SearchEngine = ((): SearchEngine => {
      if (engineRaw === 'agentic' || engineRaw === 'responses' || engineRaw === 'vector') {
        return engineRaw;
      }
      return isQA ? 'responses' : 'vector';
    })();

    const strategy = createSearchStrategy(resolvedEngine);
    const result = await strategy.run({
      vectorStoreId: kb.vectorStoreId as string,
      query,
      limit,
    });
    answer = result.answer ?? undefined;
    normalized = Array.isArray(result.items) ? (result.items as any[]) : [];

    // Fallback: perform a direct vector search only if no citations/results were returned
    if (normalized.length === 0) {
      const search = await searchVectorStore({
        vectorStoreId: kb.vectorStoreId,
        query,
        limit,
      });

      if (!search.success || !search.data) {
        return errorResponse(search.error || 'Search failed', 502);
      }

      const dataArray: any[] = Array.isArray(search.data?.data) ? (search.data.data as any[]) : [];
      normalized = transformOpenAiResults(dataArray).slice(0, 10);
    }

    const persisted = await persistSearch({
      userId: user.id,
      knowledgeBaseId,
      query,
      mode: mapFrontendModeToPrismaMode(isQA ? 'smart-qa' : 'smart-search'),
      answer,
      results: normalized,
    });

    // Deduct credits after successful search
    await CreditService.deductCredits({
      userId: user.id,
      amount: creditCost,
      operation: isQA ? 'SMART_QA' : 'SMART_SEARCH',
      objectId: persisted.searchQueryId.toString(),
      description: `${isQA ? 'Smart QA' : 'Smart search'} in knowledge base ${knowledgeBaseId}`,
    });

    return successResponse({
      searchQueryId: persisted.searchQueryId,
      answer: answer ?? null,
      results: persisted.results.map(r => ({
        id: r.id,
        filename: r.filename,
        score: r.score,
        attributes: r.attributes ?? null,
        content: r.content,
        fileId: r.fileId ?? null,
        rank: r.rank,
      })),
    });
  } catch (error) {
    console.error('Error in smart search:', error);
    return internalServerErrorResponse();
  }
}
