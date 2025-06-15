//UserRouter

import { date, z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { prisma } from '@/lib/prisma';
import { propertieSchema } from '@/lib/Zod';
import { Prisma } from '@prisma/client';
export const PropertiesRouter = createTRPCRouter({
    getUserProperties: protectedProcedure
        .input(z.object({
            data: z.record(
                z.union([z.string(), z.array(z.string()), z.undefined()])
            )
        }))
        .query(async ({ ctx, input }) => {
            const { data } = input;
            const getP = await prisma.propertie.findMany(
                {
                    where: {
                        userId: ctx.user.id,
                        ...(data.status && { leavingstatus: data.status as string }),
                        ...(data.searchText && {
                            name: {
                                contains: data.searchText as string,
                                mode: "insensitive"
                            }
                        })
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
            if (!input.pID) {
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
    postPropertie: protectedProcedure
        .input(z.object({ data: propertieSchema, pID: z.string().optional(), Type: z.enum(["Update", "Post"]).default("Post"), }))
        .mutation(async ({ input, ctx }) => {
            const { data, Type, pID } = input;
            const { imageUrls, videoTourUrl, ...rest } = data;
            if (Type === "Post") {

                const newProperty = await prisma.propertie.create({
                    data:{
                        ...rest,
                        userId: ctx.user.id,
                        videoTourUrl: videoTourUrl || undefined
                    }
                });

                
            } else if (Type === "Update") {
                if (!pID) {
                    throw new Error("pID is required for update")
                }

            }



            return { msg: "goo" }
        }),







});
// export type definition of API
