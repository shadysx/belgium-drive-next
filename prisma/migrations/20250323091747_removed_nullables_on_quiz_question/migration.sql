/*
  Warnings:

  - Made the column `imageUrl` on table `QuizQuestion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `explanation` on table `QuizQuestion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `thumbnailUrl` on table `QuizQuestion` required. This step will fail if there are existing NULL values in that column.

*/

UPDATE "QuizQuestion" SET "explanation" = 'TODO' WHERE "explanation" IS NULL;
UPDATE "QuizQuestion" SET "imageUrl" = '' WHERE "imageUrl" IS NULL;
UPDATE "QuizQuestion" SET "thumbnailUrl" = '' WHERE "thumbnailUrl" IS NULL;
-- AlterTable
ALTER TABLE "QuizQuestion" ALTER COLUMN "imageUrl" SET NOT NULL,
ALTER COLUMN "explanation" SET NOT NULL,
ALTER COLUMN "explanation" SET DEFAULT '',
ALTER COLUMN "thumbnailUrl" SET NOT NULL;
