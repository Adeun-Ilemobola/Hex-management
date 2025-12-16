/*
  Warnings:

  - Made the column `text` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "text" SET NOT NULL,
ALTER COLUMN "text" SET DEFAULT '';
