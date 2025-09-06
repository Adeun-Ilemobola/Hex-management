-- CreateEnum
CREATE TYPE "public"."roomType" AS ENUM ('PRIVATE', 'GROUP');

-- AlterTable
ALTER TABLE "public"."ChatRoom" ADD COLUMN     "type" "public"."roomType" NOT NULL DEFAULT 'PRIVATE';
