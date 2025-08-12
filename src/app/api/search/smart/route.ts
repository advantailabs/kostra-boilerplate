import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { mapFrontendModeToPrismaMode, transformOpenAiResults } from '@/lib/utils/search';
import { searchVectorStore } from '@/services/external/openai/vector-store';
import { getKnowledgeBaseWithVectorStore, persistSearch } from '@/services/repositories/search';
import { getUserByClerkId } from '@/services/repositories/user';

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

    // Normalize results from OpenAI response
    const dataArray: any[] = Array.isArray(search.data?.data) ? (search.data.data as any[]) : [];
    const normalized = transformOpenAiResults(dataArray).slice(0, 10);

    const persisted = await persistSearch({
      userId: user.id,
      knowledgeBaseId,
      query,
      mode: mapFrontendModeToPrismaMode(modeRaw === 'smart-qa' ? 'smart-qa' : 'smart-search'),
      results: normalized,
    });

    return NextResponse.json({
      searchQueryId: persisted.searchQueryId,
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
