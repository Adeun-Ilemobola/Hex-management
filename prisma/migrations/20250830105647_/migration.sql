/*
  Warnings:

  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubscriptionArchives` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_subscriptionArchivesId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SubscriptionArchives" DROP CONSTRAINT "SubscriptionArchives_userId_fkey";

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "directMessage" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "profilePublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "stripeCustomerId" TEXT;

-- DropTable
DROP TABLE "public"."Subscription";

-- DropTable
DROP TABLE "public"."SubscriptionArchives";

-- CreateTable
CREATE TABLE "public"."subscription" (
    "id" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "status" TEXT,
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN,
    "seats" INTEGER,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);
