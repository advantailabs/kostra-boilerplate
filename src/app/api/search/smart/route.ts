import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { mapFrontendModeToPrismaMode, transformOpenAiResults } from '../../../../lib/utils/search';
import { searchVectorStore } from '../../../../services/external/openai/vector-store';
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
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await getUserByClerkId(clerkUserId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found', message: 'User does not exist' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const query: string = body?.query;
    const knowledgeBaseIdRaw: string | number | undefined = body?.knowledgeBaseId;
    const modeRaw: string | undefined = body?.mode;
    const engineRaw: string | undefined = body?.engine; // 'agentic' | 'responses' | 'vector'
    const limit: number = 10; // enforce top 10 on server

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Validation failed', message: 'Query is required' },
        { status: 400 }
      );
    }

    const knowledgeBaseId = knowledgeBaseIdRaw ? Number(knowledgeBaseIdRaw) : undefined;
    if (!knowledgeBaseId || Number.isNaN(knowledgeBaseId)) {
      return NextResponse.json(
        { error: 'Validation failed', message: 'knowledgeBaseId is required' },
        { status: 400 }
      );
    }

    const kb = await getKnowledgeBaseWithVectorStore(knowledgeBaseId);
    if (!kb || !kb.vectorStoreId) {
      return NextResponse.json(
        {
          error: 'Knowledge base not configured',
          message: 'Selected knowledge base has no vector store configured',
        },
        { status: 400 }
      );
    }
    // Ensure user owns the knowledge base
    if (kb.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You do not have access to this knowledge base' },
        { status: 403 }
      );
    }

    const isQA = modeRaw === 'smart-qa';

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
        return NextResponse.json(
          { error: 'Search failed', message: search.error || 'Unknown error' },
          { status: 502 }
        );
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

    return NextResponse.json({
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
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
