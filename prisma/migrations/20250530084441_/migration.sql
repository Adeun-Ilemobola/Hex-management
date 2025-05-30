/*
  Warnings:

  - You are about to drop the column `Leavingstatus` on the `propertie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "propertie" DROP COLUMN "Leavingstatus",
ADD COLUMN     "finalResult" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "leaseCycle" DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN     "leaseType" TEXT DEFAULT 'Month',
ADD COLUMN     "leavingstatus" TEXT DEFAULT 'Active';
