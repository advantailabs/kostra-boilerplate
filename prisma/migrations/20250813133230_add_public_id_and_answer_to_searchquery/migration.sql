/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `SearchQuery` will be added. If there
 are existing duplicate values, this will fail.

  - The required column `publicId` was added to the `SearchQuery` table with a prisma-level default value. T
his is not possible if the table is not empty. Please add this column as optional, then populate it before m
aking it required.


*/
-- 1) Add columns as nullable
ALTER TABLE "SearchQuery"
  ADD COLUMN "answer" TEXT,
  ADD COLUMN "publicId" TEXT;

-- 2) Ensure pgcrypto is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 3) Backfill existing rows with UUIDs
UPDATE "SearchQuery" SET "publicId" = gen_random_uuid()::text WHERE "publicId" IS NULL;

-- 4) Make column NOT NULL and set default for future rows
ALTER TABLE "SearchQuery"
  ALTER COLUMN "publicId" SET NOT NULL,
  ALTER COLUMN "publicId" SET DEFAULT gen_random_uuid()::text;

-- CreateIndex
CREATE UNIQUE INDEX "SearchQuery_publicId_key" ON "SearchQuery"("publicId");
