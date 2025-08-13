-- CreateEnum
CREATE TYPE "SearchMode" AS ENUM ('SMART_SEARCH', 'QA');

-- CreateTable
CREATE TABLE "SearchQuery" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "knowledgeBaseId" INTEGER,
    "query" TEXT NOT NULL,
    "mode" "SearchMode" NOT NULL,
    "resultsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchQuery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchResult" (
    "id" TEXT NOT NULL,
    "searchQueryId" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "openaiFileId" TEXT,
    "fileId" INTEGER,
    "filename" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "attributes" JSONB,
    "content" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SearchQuery_userId_idx" ON "SearchQuery"("userId");

-- CreateIndex
CREATE INDEX "SearchQuery_knowledgeBaseId_idx" ON "SearchQuery"("knowledgeBaseId");

-- CreateIndex
CREATE INDEX "SearchQuery_mode_createdAt_idx" ON "SearchQuery"("mode", "createdAt");

-- CreateIndex
CREATE INDEX "SearchResult_openaiFileId_idx" ON "SearchResult"("openaiFileId");

-- CreateIndex
CREATE INDEX "SearchResult_fileId_idx" ON "SearchResult"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "SearchResult_searchQueryId_rank_key" ON "SearchResult"("searchQueryId", "rank");

-- AddForeignKey
ALTER TABLE "SearchQuery" ADD CONSTRAINT "SearchQuery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchQuery" ADD CONSTRAINT "SearchQuery_knowledgeBaseId_fkey" FOREIGN KEY ("knowledgeBaseId") REFERENCES "KnowledgeBase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchResult" ADD CONSTRAINT "SearchResult_searchQueryId_fkey" FOREIGN KEY ("searchQueryId") REFERENCES "SearchQuery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchResult" ADD CONSTRAINT "SearchResult_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
