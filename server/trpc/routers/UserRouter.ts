//UserRouter

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../init';
import { prisma } from '@/lib/prisma';
import { propertySchema, investmentBlockSchema, externalInvestorSchema, UserInput, userSchema } from '@/lib/Zod';


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



        getUserProfle: protectedProcedure
        .query(async ({ ctx }) => {
            const user = await ctx.prisma.user.findUnique({
                where: {
                    id: ctx.user.id
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phoneNumber: true,
                    address: true,
                    city: true,
                    state: true,
                    zipCode: true,
                    country: true,
                    image: true ,  
                    emailVerified: true

                }
            })

            if (!user) {
                return null
            }

            const newUser:UserInput = {
                email: user?.email as string,
                name: user?.name as string,
                phoneNumber: user?.phoneNumber as string,
                address: user?.address as string,
                city: user?.city as string,
                state: user?.state as string,
                zipCode: user?.zipCode as string,
                country: user?.country as string,
                image: user?.image as string,
                emailVerified: user?.emailVerified as boolean
                
            }
            return newUser
        }), 


        updateUserProfle: protectedProcedure
        .input(z.object({ user: userSchema }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { user } = input;
                const updataData = await ctx.prisma.user.update({
                    where: {
                        id: ctx.user.id
                    },
                    data: {
                        ...user
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
