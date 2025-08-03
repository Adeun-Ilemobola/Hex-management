//UserRouter

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../init';
import { prisma } from '@/lib/prisma';
import { propertySchema, investmentBlockSchema, externalInvestorSchema, UserInput, userSchema, SaleTypeEnumType, PropertyTypeEnumType } from '@/lib/Zod';
import { Delete } from 'lucide-react';
import { DeleteImages } from '@/lib/supabase';


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
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        status: true,
                        images: { select: { url: true } },
                        investBlock: { select: { typeOfSale: true } }
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
        .input(z.object({ pID: z.string() }))
        .query(async ({ input, ctx }) => {
            try {
                if (!input.pID) {
                    return {
                        message: "Failed to process property  not found",
                        success: false,
                        value: null
                    }
                }
                const getP = await prisma.propertie.findUnique({
                    where: {
                        id: input.pID,
                        userId: ctx.user.id
                    },
                    include: {
                        images: true,
                        investBlock: true
                    }

                })
                if (!getP) {
                    return {
                        message: "Failed to process property ",
                        success: false,
                        value: null
                    }

                }
                const getExternalInvestors = await prisma.externalInvestor.findMany({
                    where: {
                        investmentBlockId: getP.investBlock?.id

                    }
                })
                const { investBlock, images, ...property } = getP
                const cleanData = {
                    property: property,
                    investmentBlock: investBlock,
                    images: images.map((item) => {
                        return {
                            ...item,
                            lastModified: Number(item.lastModified)
                        }
                    }),
                    externalInvestors: getExternalInvestors || []
                }
                console.log(cleanData);

                return {
                    message: "successfully created property listing",
                    success: true,
                    value: cleanData
                }
            } catch (error) {
                console.error("Error in getPropertie:", error, "input", input);
                return {
                    message: "Failed to process property XXXXXX",
                    success: false,
                    value: null
                }

            }

        }),
    postPropertie: protectedProcedure
        .input(z.object({ property: propertySchema, investmentBlock: investmentBlockSchema }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { images } = input.property;
                const { externalInvestors, ...investmentBlock } = input.investmentBlock
                const { id, propertyId, ...cleanInvestmentBlock } = investmentBlock;
                const { id: pId, ...propertyData } = input.property;

                const cleanImages = images.map(item => {
                    const { id, ...rest } = item;
                    return { ...rest, };
                })

                console.log('propertyData:', propertyData);

                const makeP = await ctx.prisma.propertie.create({
                    data: {
                        ...propertyData,
                        userId: ctx.user.id,
                        images: {
                            createMany: {
                                data: [...cleanImages]
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
                                                    const { investmentBlockId, id, ...rest } = item
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

                console.log(makeP);
                

                if (!makeP) {
                    return {
                        message: "failed to create property",
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
                    message: "something went wrong while creating property listing ",
                    success: false,
                    data: null
                }

            }

        }),



    updataPropertie: protectedProcedure
        .input(z.object({ property: propertySchema, investmentBlock: investmentBlockSchema }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { images, id: pId, ...propertyData } = input.property;
                const { externalInvestors, ...investmentBlock } = input.investmentBlock
                const { id, propertyId, ...cleanInvestmentBlock } = investmentBlock;

                const newImages = images.filter(item => !item.id || item.id === "")
                const oldImages = images.filter(item => item.id || item.id !== "")

                await Promise.all(
                    oldImages.map(item => {
                        const { id, ...rest } = item;
                        return ctx.prisma.image.update({
                            where: { id },
                            data: rest
                        });
                    })
                );

                if (newImages.length > 0) {
                    await ctx.prisma.image.createMany({
                        data: newImages.map(item => {
                            const { id, ...rest } = item;
                            return { ...rest, propertyId: pId };
                        })
                    });
                }

                const updataData = await ctx.prisma.propertie.update({
                    where: {
                        id: pId,
                        userId: ctx.user.id
                    },
                    data: {
                        ...propertyData,

                        ...(cleanInvestmentBlock && {
                            investBlock: {
                                update: {
                                    ...cleanInvestmentBlock,
                                    ...(externalInvestors.length > 0 && {
                                        externalInvestors: {
                                            createMany: {
                                                data: [...externalInvestors.map(item => {
                                                    const { investmentBlockId, id, ...rest } = item
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
                })
                if (!updataData) {
                    return {
                        message: "Failed to process property XXXXXX",
                        success: false,
                        data: null
                    }

                }
                return {
                    message: "successfully updated property listing",
                    success: true,
                    data: updataData
                }
            } catch (error) {
                console.error("Error in updataPropertie:", error);
                return {
                    message: "Failed to process property XXXXXX",
                    success: false,
                    data: null
                }

            }

        }),

    deleteImage: protectedProcedure
        .input(z.object({ id: z.string(), supabaseID: z.string() }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { id } = input;
                const updataData = await ctx.prisma.image.deleteMany({
                    where: { id: id, }
                })
                if (!updataData) {
                    return {
                        message: "Failed to process property image",
                        success: false,
                        data: null
                    }
                }
                await DeleteImages([input.supabaseID])
                return {
                    message: "successfully deleted image",
                    success: true,
                    data: updataData
                }
            } catch (error) {
                console.error("Error in deleteImage:", error);
                return {
                    message: "Failed to process property image",
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
                    image: true,
                    emailVerified: true

                }
            })

            if (!user) {
                return null
            }

            const newUser: UserInput = {
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

    viewProperty: protectedProcedure
        .input(z.object({ pID: z.string() }))
        .query(async ({ input, ctx }) => {
            try {
                const { pID } = input;
                const getP = await ctx.prisma.propertie.findUnique({
                    where: {
                        id: pID,

                    },
                    select: {
                        images: {
                            select: {
                                url: true,
                                id: true
                            }
                        },
                        investBlock: {
                            select: {
                                finalResult: true,
                                typeOfSale: true,
                                leaseCycle: true,

                            }
                        },
                        name: true,
                        address: true,
                        id: true,
                        description: true,
                        lotSize: true,
                        hasGarage: true,
                        hasGarden: true,
                        hasPool: true,
                        amenities: true,
                        propertyType: true,
                        status: true,
                        ownerName: true,
                        contactInfo: true,
                        leavingstatus: true,
                        numBathrooms: true,
                        numBedrooms: true,
                        yearBuilt: true,
                      
                    }
                })

                if (!getP) {
                    return {
                        message: "Failed to process property XXXXXX",
                        success: false,
                        value: null
                    }
                }
                const cleanData = {
                    images: getP.images,// { url: the image url, id: the image id }, this is an array
                    price: {
                        finalResult: getP.investBlock?.finalResult as number,
                        typeOfSale: getP.investBlock?.typeOfSale as string || "SELL",
                        leaseCycle: getP.investBlock?.leaseCycle as number
                    }, // { finalResult: the final result, typeOfSale: the type of sale [SELL, RENT, LEASE], leaseCycle: the lease cycle }, this is an object
                    name: getP.name,
                    address: getP.address, 
                    id: getP.id,
                    description: getP.description || "",
                    lotSize: getP.lotSize,// number
                    hasGarage: getP.hasGarage,// boolean
                    hasGarden: getP.hasGarden,// boolean
                    hasPool: getP.hasPool,// boolean
                    amenities: getP.amenities,//  List of amenities (e.g., ["Elevator", "Gym", "Fireplace"])
                    propertyType: getP.propertyType as PropertyTypeEnumType, // List of property types (e.g., ["Apartment", "House", "Condo"])
                    status: getP.status, // active, pending, sold, etc.
                    ownerName: getP.ownerName,
                    contactInfo: getP.contactInfo,// this ia an email 
                    numBathrooms: getP.numBathrooms,// number
                    numBedrooms: getP.numBedrooms,// number
                    yearBuilt: getP.yearBuilt,// number

                }
                console.log("cleanData", cleanData);
                

                return {
                    message: "successfully created property listing",
                    success: true,
                    value: cleanData
                }
            } catch (error) {
                console.error("Error in viewProperty:", error);
                return {
                    message: "Failed to process property XXXXXX",
                    success: false,
                    value: null
                }
            }

        }),


});
// export type definition of API
