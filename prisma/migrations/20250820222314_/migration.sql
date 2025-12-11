-- DropForeignKey
ALTER TABLE "public"."externalInvestor" DROP CONSTRAINT "externalInvestor_investmentBlockId_fkey";

-- DropForeignKey
ALTER TABLE "public"."investmentBlock" DROP CONSTRAINT "investmentBlock_propertieid_fkey";

-- AddForeignKey
ALTER TABLE "public"."externalInvestor" ADD CONSTRAINT "externalInvestor_investmentBlockId_fkey" FOREIGN KEY ("investmentBlockId") REFERENCES "public"."investmentBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."investmentBlock" ADD CONSTRAINT "investmentBlock_propertieid_fkey" FOREIGN KEY ("propertieid") REFERENCES "public"."propertie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
