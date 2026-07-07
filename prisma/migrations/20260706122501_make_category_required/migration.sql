/*
  Warnings:

  - Made the column `category_id` on table `quiz` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "quiz" DROP CONSTRAINT "quiz_category_id_fkey";

-- AlterTable
ALTER TABLE "quiz" ALTER COLUMN "category_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
