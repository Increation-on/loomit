/*
  Warnings:

  - You are about to drop the column `category` on the `quiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "quiz" DROP COLUMN "category",
ADD COLUMN     "category_id" TEXT;

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
