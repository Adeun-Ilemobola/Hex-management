//UserRouter

import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { prisma } from '@/lib/prisma';
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
        .input(z.object({ pID: z.string() }))
        .query(async ({ input, ctx }) => {
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

        })



});
// export type definition of API
