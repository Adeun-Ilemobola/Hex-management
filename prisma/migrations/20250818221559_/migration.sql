/*
  Warnings:

  - You are about to drop the column `ownerId` on the `ChatImage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatImage" DROP CONSTRAINT "ChatImage_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "ChatRoomMember" DROP CONSTRAINT "ChatRoomMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_authorId_fkey";

-- AlterTable
ALTER TABLE "ChatImage" DROP COLUMN "ownerId";

-- AlterTable
ALTER TABLE "ChatRoom" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "title" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ChatRoomMember" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notificationCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
