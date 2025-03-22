/*
  Warnings:

  - You are about to drop the column `themes` on the `QuizQuestion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuizQuestion" DROP COLUMN "themes";

-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestionTheme" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,

    CONSTRAINT "QuizQuestionTheme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuizQuestionTheme_questionId_themeId_key" ON "QuizQuestionTheme"("questionId", "themeId");

-- AddForeignKey
ALTER TABLE "QuizQuestionTheme" ADD CONSTRAINT "QuizQuestionTheme_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestionTheme" ADD CONSTRAINT "QuizQuestionTheme_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
