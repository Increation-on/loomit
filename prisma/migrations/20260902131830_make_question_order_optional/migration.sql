-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "attempt" ADD COLUMN     "question_order" JSONB,
ADD COLUMN     "status" "AttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
ALTER COLUMN "score" SET DEFAULT 0;
