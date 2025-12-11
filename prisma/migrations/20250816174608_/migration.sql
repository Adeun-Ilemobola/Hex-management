/*
  Warnings:

  - You are about to drop the column `userId` on the `propertie` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `propertie` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "propertie" DROP CONSTRAINT "propertie_userId_fkey";

-- AlterTable
ALTER TABLE "propertie" DROP COLUMN "userId",
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "ownerType" TEXT NOT NULL DEFAULT 'user';
