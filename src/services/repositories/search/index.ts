import { KnowledgeBase, Prisma, PrismaClient, SearchMode } from '@prisma/client';

const prisma = new PrismaClient();

export interface PersistedSearchResult {
  id: string;
  filename: string;
  score: number;
  attributes?: Record<string, unknown> | null;
  content?: unknown;
  openaiFileId?: string | null;
  fileId?: number | null;
  rank: number;
}

export interface PersistSearchInput {
  userId: number;
  knowledgeBaseId?: number | null;
  query: string;
  mode: SearchMode;
  results: Array<{
    filename: string;
    score: number;
    attributes?: Record<string, unknown> | null;
    content?: unknown;
    openaiFileId?: string | null;
  }>;
}

export async function persistSearch({
  userId,
  knowledgeBaseId,
  query,
  mode,
  results,
}: PersistSearchInput): Promise<{ searchQueryId: number; results: PersistedSearchResult[] }> {
  const created = await prisma.searchQuery.create({
    data: {
      userId,
      knowledgeBaseId: knowledgeBaseId ?? undefined,
      query,
      mode,
      resultsCount: results.length,
      results: {
        create: results.map(
          (r, index): Prisma.SearchResultCreateWithoutSearchQueryInput => ({
            rank: index + 1,
            filename: r.filename,
            score: r.score,
            attributes: (r.attributes as Prisma.InputJsonValue) ?? undefined,
            content: (r.content as Prisma.InputJsonValue) ?? undefined,
            openaiFileId: r.openaiFileId ?? undefined,
            // Best-effort link to File by openaiFileId when available
            file: r.openaiFileId
              ? ({
                  connect: { openaiFileId: r.openaiFileId },
                } as any)
              : undefined,
          })
        ),
      },
    },
    include: { results: true },
  });

  return {
    searchQueryId: created.id,
    results: (created as any).results.map((r: any) => ({
      id: r.id,
      filename: r.filename,
      score: r.score,
      attributes: (r.attributes as any) ?? null,
      content: r.content,
      openaiFileId: r.openaiFileId ?? null,
      fileId: r.fileId ?? null,
      rank: r.rank,
    })),
  };
}

export async function getKnowledgeBaseWithVectorStore(
  knowledgeBaseId: number
): Promise<KnowledgeBase | null> {
  const kb = await prisma.knowledgeBase.findUnique({ where: { id: knowledgeBaseId } });
  return kb;
}
