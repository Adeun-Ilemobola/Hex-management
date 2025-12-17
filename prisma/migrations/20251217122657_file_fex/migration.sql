/*
  Warnings:

  - Made the column `chatRoomID` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `chatOwnerID` on table `File` required. This step will fail if there are existing NULL values in that column.
  - Made the column `messageId` on table `File` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "File" ALTER COLUMN "chatRoomID" SET NOT NULL,
ALTER COLUMN "chatOwnerID" SET NOT NULL,
ALTER COLUMN "messageId" SET NOT NULL;
