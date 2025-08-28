-- AlterTable
ALTER TABLE "User" DROP COLUMN "clerkUserId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN "googleId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
