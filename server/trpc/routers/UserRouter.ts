//UserRouter

import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { prisma } from '@/lib/prisma';
import { propertieSchema } from '@/lib/Zod';
export const PropertiesRouter = createTRPCRouter({
    getUserProperties: protectedProcedure
        .query(async ({ ctx }) => {
            const getP = await prisma.propertie.findMany(
                {
                    where: {
                        userId: ctx.user.id
                    },
                }
            )

            if (!getP) {
                return undefined
            }

            const cleanP = getP.map(item => {
                return {
                    id: item.id,
                    img: item.imageUrls.length === 0 ? undefined : item.imageUrls[0],
                    name: item.name,
                    address: item.address,
                    status: item.status as string,
                    saleStatus: item.typeOfSale
                }
            })

            return cleanP


        }),

    getPropertie: protectedProcedure
        .input(z.object({ pID: z.string().optional() }))
        .query(async ({ input, ctx }) => {
            if (!input.pID){
                return null
            }
            const getP = await prisma.propertie.findUnique({
                where: {
                    id: input.pID,
                    userId: ctx.user.id
                }
            })


            if (!getP) {
                return null

            }
            return getP

        }),
    postPropertie :protectedProcedure 
    .input(z.object({data:propertieSchema , pID: z.string().optional() , Type:z.enum(["Update", "Post"]).default("Post"),}))
     .mutation(async ({ input, ctx }) => {
        const {data , Type , pID}= input;
        console.log(input);
        


        return {msg:"goo"}
     }),







});
// export type definition of API
