//UserRouter

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, t } from '../init';
import { prisma } from '@/lib/prisma';
import { propertySchema, investmentBlockSchema, externalInvestorSchema, UserInput, userSchema, PropertyTypeEnumType } from '@/lib/Zod';
import { DeleteImages } from '@/lib/supabase';
import { sendEmail } from '@/server/actions/sendEmail';
import { rateLimit, heavyRateLimit } from '../middlewares/rateLimit';
import { CreateGroupChat } from '@/server/actions/CreateGroupChat';
import { TRPCError } from '@trpc/server';

// type userOrganizationContributor = {
//     name: string;
//     id: string;
//     permission: "admin" | "member"
//     organizationProperties: string[];

// }

export type CleanProperty = {
    id: string;
    img?: string;
    name: string;
    address: string;
    status: string;
    saleStatus: string;
}


export const PropertiesRouter = createTRPCRouter({
    getUserProperties: protectedProcedure
        .input(z.object({
            data: z.record(
                z.union([z.string(), z.array(z.string()), z.undefined()])
            )
        }))
        .query(async ({ ctx, input }) => {

            try {
                let itemList: CleanProperty[] = [];

                const { data } = input;
                const getOrgItems = await prisma.propertie.findMany(
                    {
                        where: {
                            ownerId: ctx.plan.inOrganization?.id || "",
                            ownerType: "ORGANIZATION",
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

                itemList = getOrgItems.map(item => {

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


                if (ctx.plan.inOrganization && ctx.plan.inOrganization.role === "owner") {
                    const getUserItems = await prisma.propertie.findMany({
                        where: {
                            ownerId: ctx.user.id,
                            ownerType: "USER",
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
                    })
                    itemList = itemList.concat(getUserItems.map(item => {

                        const { investBlock } = item
                        return {
                            id: item.id,
                            img: item.images.length === 0 ? undefined : item.images[0].url,
                            name: item.name,
                            address: item.address,
                            status: item.status as string,
                            saleStatus: investBlock?.typeOfSale as string
                        }
                    }))

                }

                console.log(itemList);


                return {
                    data: itemList,
                }

            } catch (error) {
                console.log(error);
                return {
                    data: [],
                }

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
        .use(heavyRateLimit())
        .input(z.object({ property: propertySchema, investmentBlock: investmentBlockSchema }))
        .mutation(async ({ input, ctx }) => {
            let propertyIdGo: string | null = null;
            let supabaseIDList: string[] = [];
            try {
                let ownerShip = {
                    name: ctx.user.name,
                    email: ctx.user.email
                }
                const { images, accessCode } = input.property;
                const { externalInvestors, ...investmentBlock } = input.investmentBlock
                const { id, propertyId, ...cleanInvestmentBlock } = investmentBlock;
                const { id: pId, ...propertyData } = input.property;

                const cleanImages = images.map(item => {
                    const { id, ...rest } = item;
                    return { ...rest, };
                })
                if (propertyData.ownerType === "ORGANIZATION") {
                    const getOrgOwner = await ctx.prisma.member.findFirst({
                        where: {
                            organizationId: propertyData.ownerId,
                        },
                        select: {
                            user: {
                                select: {
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    });

                    if (getOrgOwner) {
                        ownerShip = {
                            name: getOrgOwner.user.name,
                            email: getOrgOwner.user.email
                        }
                    }

                }



                const makeP = await ctx.prisma.propertie.create({
                    data: {
                        ...propertyData,
                        ownerName: ownerShip.name,
                        contactInfo: ownerShip.email,

                        images: {
                            createMany: {
                                data: [...cleanImages]
                            }
                        },


                    },
                    include: {
                        images: true
                    }
                });

                if (!makeP) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to create property",
                    });

                }
                propertyIdGo = makeP.id;
                supabaseIDList = makeP.images.map((item) => {
                    return item.supabaseID
                })


                const makeIB = await ctx.prisma.investmentBlock.create({
                    data: {
                        ...cleanInvestmentBlock,
                        propertieid: makeP.id
                    }
                })

                if (makeIB) {
                    const makeEI = await Promise.all(externalInvestors.map(async (item) => {
                        const { id, ...rest } = item
                        return await ctx.prisma.externalInvestor.create({
                            data: {
                                ...rest,
                                investmentBlockId: makeIB.id

                            },

                        })
                    }))
                    if (makeEI.length > 0) {
                        const getEmail = makeEI.map((item) => {
                            return item.email
                        })
                        const createChatRoom = await CreateGroupChat({ PropertyName: makeP.name, members: getEmail, currentAdminId: ctx.user.id })
                        if (!createChatRoom.success) {
                            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create chat room" })

                        }
                        await Promise.all(
                            makeEI.map(async (item) => {
                                const { id, ...rest } = item;
                                await sendEmail({
                                    templateText: "VerifyExternalInvestor",
                                    to: rest.email,
                                    params: {
                                        name: rest.name,
                                        email: rest.email,
                                        verificationLink: `${process.env.NEXTAUTH_URL}/home/verifyExternalInvestor?investorId=${id}&propertieid=${makeP.id}`,
                                        propertyLink: `${process.env.NEXTAUTH_URL}/propertie/${makeP.id}`,
                                        contributionPercent: rest.contributionPercentage.toNumber(),
                                        DollarValueReturn: rest.dollarValueReturn.toNumber(),
                                        propertyName: makeP.name,
                                        accessCode: accessCode
                                    }


                                })
                            })
                        );
                    }


                }






                return {
                    message: "successfully created property listing",
                    success: true,
                    data: makeP
                }



            } catch (error) {
                if (propertyIdGo) {
                    await ctx.prisma.propertie.delete({
                        where: {
                            id: propertyIdGo
                        }
                    })

                }
                if (supabaseIDList.length > 0) {
                    await ctx.prisma.image.deleteMany({
                        where: {
                            supabaseID: {
                                in: supabaseIDList
                            }
                        }
                    })
                    await DeleteImages(supabaseIDList)
                }
                console.error("Error in postPropertie:", error);
                return {
                    message: "something went wrong while creating property listing ",
                    success: false,
                    data: null
                }

            }

        }),



    updataPropertie: protectedProcedure
        .use(rateLimit())
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
                        ownerId: propertyData.ownerId

                    },
                    data: {
                        ...propertyData,

                        ...(cleanInvestmentBlock && {
                            investBlock: {
                                update: {
                                    ...cleanInvestmentBlock,
                                }
                            }
                        })

                    },
                    include: {
                        images: true,
                        investBlock: {
                            include: {
                                externalInvestors: true
                            }
                        }
                    }
                })
                if (updataData.investBlock) {
                    const { id: BlockId } = updataData.investBlock
                    const newExternalInvestors = externalInvestors.filter(item => !item.id || item.id === "")
                    const oldExternalInvestors = externalInvestors.filter(item => item.id || item.id !== "")

                    if (oldExternalInvestors.length > 0) {
                        await Promise.all(
                            oldExternalInvestors.map(item => {
                                const { id, ...rest } = item;
                                return ctx.prisma.externalInvestor.update({
                                    where: { id },
                                    data: rest
                                });
                            })
                        );
                    }
                    if (newExternalInvestors.length > 0) {
                        const res = await Promise.all(
                            newExternalInvestors.map(item => {
                                const { id, ...rest } = item;

                                return ctx.prisma.externalInvestor.create({
                                    data: {
                                        ...rest,
                                        investmentBlockId: BlockId
                                    }
                                });
                            })

                        )

                        await Promise.all(
                            res.map(async (item) => {
                                const { investmentBlockId, ...rest } = item;
                                await sendEmail({
                                    templateText: "VerifyExternalInvestor",
                                    to: rest.email,
                                    params: {
                                        name: rest.name,
                                        email: rest.email,
                                        verificationLink: `${process.env.NEXTAUTH_URL}/home/verifyExternalInvestor?investorId=${item.id}&propertieid=${pId}`,
                                        propertyLink: `${process.env.NEXTAUTH_URL}/propertie/${pId}`,
                                        contributionPercent: rest.contributionPercentage.toNumber(),
                                        DollarValueReturn: rest.dollarValueReturn.toNumber(),
                                        propertyName: updataData.name,
                                        accessCode: propertyData.accessCode
                                    }


                                })
                            })
                        );

                    }



                }
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
        .use(rateLimit())
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

    getPropertieNameById: protectedProcedure
        .input(z.object({ pID: z.string() }))
        .query(async ({ input, ctx }) => {
            try {
                const { pID } = input;
                const getP = await ctx.prisma.propertie.findUnique({
                    where: {
                        id: pID,

                    },
                    select: {
                        name: true,
                    }
                })

                if (!getP) {
                    return {
                        success: false,
                        message: "property not found",
                        value: null
                    }
                }
                return {
                    success: true,
                    message: "successfully created property listing",
                    value: getP.name
                }
            } catch (error) {
                console.error("Error in viewProperty:", error);
                throw new TRPCError({ code: 'NOT_FOUND', message: "property not found" });
            }

        }),

    acceptInvitePropertie: protectedProcedure
        .input(z.object({
            investorId: z.string(),
            propertieId: z.string(),
            code: z.string().default(""),
            accepted: z.boolean().default(false)
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const user = ctx.session?.user;
                if (!user) {
                    return {
                        success: false,
                        message: "user not found"
                    }
                }
                const { investorId, propertieId, code, accepted } = input;

                if (!accepted && code.length < 12) {
                    return {
                        success: false,
                        message: "Invalid code"
                    }

                }
                if (!accepted && code.length > 12) {
                    return {
                        success: false,
                        message: "Invalid code"
                    }

                }
                const getPropertie = await ctx.prisma.propertie.findUnique({
                    where: {
                        id: propertieId,
                    },
                    select: {
                        accessCode: true,
                        id: true,
                        investBlock: {
                            select: {
                                id: true
                            }
                        }
                    }
                })
                if (!getPropertie) {
                    return {
                        success: false,
                        message: "property not found"
                    }

                }
                if (!getPropertie.investBlock) {
                    return {
                        success: false,
                        message: "property not found"
                    }
                }
                const Investor = await ctx.prisma.externalInvestor.findUnique({
                    where: {
                        investorUserId: user?.id,
                        id: investorId
                    },
                })
                if (Investor && Investor.status === "VERIFIED") {
                    return {
                        success: false,
                        message: "you are already verified"
                    }

                }
                if (accepted) {
                    if (getPropertie.accessCode !== code) {
                        return {
                            success: false,
                            message: "Invalid code"
                        }

                    }
                    console.log({
                        investorUserId: user.id,
                        id: investorId,
                        email: user.email,
                        investmentBlockId: getPropertie.investBlock.id,
                        code, accepted 

                    });

                    const data= await ctx.prisma.externalInvestor.updateMany({
                        where: {
                            id: investorId,
                            email: user.email,
                            investmentBlockId: getPropertie.investBlock.id
                        },
                        data: {
                            status: "VERIFIED",
                            isInternal: true,
                            investorUserId: user.id
                            
                        }

                    })
                    if (data.count === 0) {
                        throw new TRPCError({ code: 'NOT_FOUND', message: 'Investor not found or not owned by user.' });
                    }
                    await ctx.prisma.user.update({
                        where: {
                            id: user?.id
                        },
                        data: {
                            investments: [getPropertie.id]
                        }
                    })

                    return {
                        success: true,
                        message: `successfully verified you as investor`,

                    }

                } else {
                    console.log({
                        investorUserId: user.id,
                        id: investorId,
                        email: user.email,
                        investmentBlockId: getPropertie.investBlock.id,
                        code, accepted 

                    });

                    const { count } = await ctx.prisma.externalInvestor.updateMany({
                        where: {
                            id: investorId,
                            email: user.email,
                            investmentBlockId: getPropertie.investBlock.id
                        },
                        data: {
                            status: "DRAFT",
                            isInternal: false,
                            accessRevoked: true,
                            investorUserId: user.id
                        }

                    })
                    if (count===0) {
                        throw new TRPCError({ code: 'NOT_FOUND', message: 'Investor not found or not owned by user.' });


                    }

                    return {
                        success: true,
                        message: `successfully denied you as investor`,

                    }
                }




            } catch (error) {
                console.error("Error in viewProperty:", error);
                return {
                    success: false,
                    message: "failed to process adding user as investor"
                }

            }
        })
});
// export type definition of API
