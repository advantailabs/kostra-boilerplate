-- CreateEnum
CREATE TYPE "UserPlan" AS ENUM ('FREE', 'PRO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isOverDue" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "plan" "UserPlan" NOT NULL DEFAULT 'FREE';
