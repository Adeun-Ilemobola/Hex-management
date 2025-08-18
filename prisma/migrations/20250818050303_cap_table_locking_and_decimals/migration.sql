/*
  Warnings:

  - You are about to alter the column `contributionPercentage` on the `externalInvestor` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,4)`.
  - You are about to alter the column `returnPercentage` on the `externalInvestor` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,4)`.
  - You are about to alter the column `dollarValueReturn` on the `externalInvestor` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,2)`.
  - A unique constraint covering the columns `[investmentBlockId,email]` on the table `externalInvestor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `externalInvestor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvestmentBlockStatus" AS ENUM ('DRAFT', 'FINALIZED', 'LOCKED');

-- DropIndex
DROP INDEX "externalInvestor_email_key";

-- AlterTable
ALTER TABLE "externalInvestor" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "funded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fundedAt" TIMESTAMP(3),
ADD COLUMN     "investorUserId" TEXT,
ADD COLUMN     "status" "InvestmentBlockStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "contributionPercentage" SET DATA TYPE DECIMAL(8,4),
ALTER COLUMN "returnPercentage" SET DATA TYPE DECIMAL(8,4),
ALTER COLUMN "accessRevoked" SET DEFAULT false,
ALTER COLUMN "dollarValueReturn" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "propertie" ALTER COLUMN "ownerType" SET DEFAULT 'ORGANIZATION';

-- CreateIndex
CREATE UNIQUE INDEX "externalInvestor_investmentBlockId_email_key" ON "externalInvestor"("investmentBlockId", "email");
