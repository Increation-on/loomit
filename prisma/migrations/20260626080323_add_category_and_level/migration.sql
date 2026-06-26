-- CreateEnum
CREATE TYPE "Level" AS ENUM ('JUNIOR', 'MIDDLE', 'SENIOR');

-- AlterTable
ALTER TABLE "quiz" ADD COLUMN     "category" TEXT,
ADD COLUMN     "level" "Level" DEFAULT 'JUNIOR';
