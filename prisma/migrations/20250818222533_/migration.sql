/*
  Warnings:

  - Added the required column `userName` to the `ChatRoomMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatRoomMember" ADD COLUMN     "userName" TEXT NOT NULL;
