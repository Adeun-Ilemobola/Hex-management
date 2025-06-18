//UserRouter

import {  z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { prisma } from '@/lib/prisma';
import { propertieSchema } from '@/lib/Zod';
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
                    include: {
                        imageUrls: true,
                    }
                }
            )
            if (!getP) {
                return {
                    data: [],
                }
            }
            const cleanP = getP.map(item => {
                return {
                    id: item.id,
                    img: item.imageUrls.length === 0 ? undefined : item.imageUrls[0].url,
                    name: item.name,
                    address: item.address,
                    status: item.status as string,
                    saleStatus: item.typeOfSale
                }
            })

            return {
                data: cleanP,
            }


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
        .input(z.object({ data: propertieSchema,}))
        .mutation(async ({ input, ctx }) => {
            try {
                const { data} = input;
                const { imageUrls, videoTourUrl, ...rest } = data;
                console.log("Processing property data:", data );
                
                
              

                    const newProperty = await prisma.propertie.create({
                        data: {
                            ...rest,
                            userId: ctx.user.id,
                            videoTourUrl: undefined,
                           
                        }
                    });
                    if (!newProperty) {
                        return {
                            message: "Failed to create property new property was not created",
                            success: false,
                            data: null
                        }
                    }
                    const addNewImageUrls = await prisma.image.createMany({
                        data: imageUrls.map((img) => ({
                            ...img,
                            propertyId: newProperty.id,
                        })),
                    })
                
                return {
                    message: "Property processed successfully",
                    success: true,
                    data: {
                        ...rest,
                        imageUrls,
                        videoTourUrl
                    }
                }

            } catch (error) {
                console.error("Error in postPropertie:", error);
                return {
                    message: "Failed to process property XXXXXX",
                    success: false,
                    data: null
                }

            }

        }),







});
// export type definition of API
