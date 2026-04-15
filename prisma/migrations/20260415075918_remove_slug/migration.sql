/*
  Warnings:

  - You are about to drop the column `slug` on the `quizzes` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "quizzes_slug_key";

-- AlterTable
ALTER TABLE "quizzes" DROP COLUMN "slug";
