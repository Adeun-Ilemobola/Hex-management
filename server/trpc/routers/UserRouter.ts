//UserRouter

import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { prisma } from '@/lib/prisma';
import { propertySchema, investmentBlockSchema, externalInvestorSchema } from '@/lib/Zod';


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
                        images: true,
                        investBlock: true
                    }
                }
            )
            if (!getP) {
                return {
                    data: [],
                }
            }
            const cleanP = getP.map(item => {

                const { investBlock } = item
                return {
                    id: item.id,
                    img: item.images.length === 0 ? undefined : item.images[0].url,
                    name: item.name,
                    address: item.address,
                    status: item.status as string,
                    saleStatus: investBlock?.typeOfSale as string
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
        .input(z.object({ property: propertySchema, investmentBlock: investmentBlockSchema }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { images, ...rest } = input.property;
                const { externalInvestors, ...investmentBlock } = input.investmentBlock
                const { id, propertyId , ...cleanInvestmentBlock} = investmentBlock;

                const makeP = await ctx.prisma.propertie.create({
                    data: {
                        ...rest,
                        userId: ctx.user.id,
                        images: {
                            createMany: {
                                data: [...images]
                            }
                        },
                        ...(cleanInvestmentBlock && {
                            investBlock: {
                                create: {
                                    ...cleanInvestmentBlock,
                                    ...(externalInvestors.length > 0 && {
                                        externalInvestors: {
                                            createMany: {
                                                data: [...externalInvestors.map(item => {
                                                    const { investmentBlockId , id, ...rest } = item
                                                    return {
                                                        ...rest, 
                                                    }
                                                })],
                                            }
                                        }
                                    })

                                }
                            }
                        })

                    }
                });

                if (!makeP) {
                    return {
                        message: "Failed to process property XXXXXX",
                        success: false,
                        data: null
                    }

                }

                return {
                    message: "successfully created property listing",
                    success: true,
                    data: makeP
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


    updataExternalInvestor: protectedProcedure
        .input(z.object({ externalInvestors: externalInvestorSchema }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { externalInvestors } = input;
                const updataData = await ctx.prisma.externalInvestor.update({
                    where: {
                        id: externalInvestors.id,
                        investmentBlockId: externalInvestors.investmentBlockId
                    },
                    data: {
                        ...externalInvestors
                    }
                })
                if (!updataData) {
                    return {
                        message: "Failed to process property externalInvestors",
                        success: false,
                        data: null
                    }
                }
                return {
                    message: "successfully updated external investor",
                    success: true,
                    data: updataData
                }

            } catch (error) {
                console.error("Error in updataExternalInvestor:", error);
                return {
                    message: "Failed to process property externalInvestors",
                    success: false,
                    data: null
                }

            }

        }),


});
// export type definition of API
