/*
  Warnings:

  - You are about to drop the column `hasGarage` on the `propertie` table. All the data in the column will be lost.
  - You are about to drop the column `hasGarden` on the `propertie` table. All the data in the column will be lost.
  - You are about to drop the column `hasPool` on the `propertie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "propertie" DROP COLUMN "hasGarage",
DROP COLUMN "hasGarden",
DROP COLUMN "hasPool";
