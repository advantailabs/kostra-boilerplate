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
  // Ensure ranking is based on score (highest score = rank 1)
  const resultsSortedByScoreDesc = [...results].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const created = await prisma.searchQuery.create({
    data: {
      userId,
      knowledgeBaseId: knowledgeBaseId ?? undefined,
      query,
      mode,
      resultsCount: resultsSortedByScoreDesc.length,
      results: {
        create: resultsSortedByScoreDesc.map(
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

  // Order results by ascending rank for consistent API/UI consumption
  const orderedByRankAsc = ((created as any).results as any[])
    .slice()
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));

  // Final dedupe on response: unique by DB fileId, keep the highest-ranked (lowest rank number)
  const seenFileIds = new Set<number>();
  const uniqueByFileId = orderedByRankAsc.filter(r => {
    const id: number | null | undefined = r.fileId ?? null;
    if (!id) return true; // If no DB file id, we cannot dedupe by it; include
    if (seenFileIds.has(id)) return false;
    seenFileIds.add(id);
    return true;
  });

  return {
    searchQueryId: created.id,
    results: uniqueByFileId.map((r: any) => ({
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
