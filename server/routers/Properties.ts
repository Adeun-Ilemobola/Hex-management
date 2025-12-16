//UserRouter

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import  prisma  from "@/lib/prisma";
import {
    externalInvestorSchema,
    investmentBlockSchema,
    propertySchema,
    UserInput,
} from "@/lib/ZodObject";
// import { DeleteImages } from "@/lib/supabase";
import { sendEmail } from "../sendEmail";

import { TRPCError } from "@trpc/server";
import { setThumbnail } from "@/lib/utils";
import path from "path";
import { DeleteImages, FilesToCloud } from "@/lib/supabase";
import { getPlanLimits, PlanTier } from "@/lib/PlanConfig";
import { CreateGroupChat, getOwnerPropertieCount } from "../CreateGroupChat";

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
};

export const PropertiesRouter = createTRPCRouter({
    /**
     * getUserProperties
     * Protected query.
     * Lists properties visible to the current user.
     * - Detects org memberships and role.
     * - If NOT an org employee: returns properties owned by the user or their owner orgs (with search/status filters).
     * - If an org employee: returns properties owned by the active organization (with search/status filters).
     * Returns { data: CleanProperty[] }.
     */

    getUserProperties: protectedProcedure
        .input(z.object({
            data: z.record(
                z.string(), // key type
                z.union([z.string(), z.array(z.string()), z.undefined()]),
            ),
        }))
        .query(async ({ ctx, input }) => {
            try {
                const user = ctx.session?.user;
                if (!user) {
                    console.warn("[getUserProperties] not signed in");
                    // you can either throw or return a shaped error
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "You must be signed in",
                    });
                }
                const memberships = await prisma.member.findMany({
                    where: { userId: user.id },
                    select: { organizationId: true, role: true },
                });
                const employeeMembership = memberships.find((m) =>
                    m.role === "member" || m.role === "admin"
                );

                const userOrgMembership = {
                    // Get all IDs where the user is an owner
                    ownerOrganizationIds: memberships
                        .filter((m) => m.role === "owner")
                        .map((m) => m.organizationId),

                    // Object representing their employee status
                    employeeStatus: {
                        // If an employee membership was found, use THAT specific ID
                        organizationId: employeeMembership
                            ? employeeMembership.organizationId
                            : "",
                        isEmployee: !!employeeMembership, // Converts the object to a boolean (true/false)
                    },
                };
                const allowedIds = [
                    ...userOrgMembership.ownerOrganizationIds,
                    !userOrgMembership.employeeStatus.isEmployee
                        ? user.id
                        : userOrgMembership.employeeStatus.organizationId,
                ];
                console.log({
                    memberships,
                    userOrgMembership,
                    userId: user.id,
                });
                const { data } = input;

                const getProperties = await prisma.propertie.findMany({
                    where: {
                        ownerId: {
                            in: [...allowedIds],
                        },
                        ...(typeof data.status === "string"
                            ? { leavingstatus: data.status }
                            : {}),
                        ...(typeof data.searchText === "string"
                            ? {
                                name: {
                                    contains: data.searchText,
                                    mode: "insensitive",
                                },
                            }
                            : {}),
                    },
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        status: true,
                    },
                });

                const aa = getProperties.map(async (property) => {
                    const getPropertieImage = await prisma.file.findMany({
                        where: {
                            propertyId: property.id,
                            tags: {
                                has: setThumbnail,
                            },
                        },
                        select: {
                            link: true,
                        },
                    });
                    const getInvestmentBlock = await prisma.investmentBlock
                        .findFirst({
                            where: {
                                propertyId: property.id,
                            },
                            select: {
                                typeOfSale: true,
                            },
                        });
                    return {
                        id: property.id,
                        name: property.name,
                        address: property.address,
                        status: property.status as string,
                        img: getPropertieImage[0]?.link || "",
                        saleStatus: getInvestmentBlock?.typeOfSale || "N/A",
                    };
                });
                const Items: CleanProperty[] = await Promise.all(aa);

                return {
                    data: Items,
                };
            } catch (error) {
                console.log(error);
                return {
                    data: [],
                };
            }
        }),

    /**
     * getPropertie
     * Protected query.
     * Input: { pID }.
     * Fetch a single property with images and investment block; also loads external investors linked to the block.
     * Normalizes image lastModified to number.
     * Returns { success, message, value: { property, investmentBlock, images, externalInvestors } }.
     */

    getPropertie: protectedProcedure
        .input(z.object({ pID: z.string().nullable() }))
        .query(async ({ input, ctx }) => {
            try {
                if (!input.pID) {
                    return {
                        message: "Failed to process property  not found",
                        success: false,
                        value: null,
                    };
                }
                const getPropertie = await prisma.propertie.findUnique({
                    where: {
                        id: input.pID,
                    },
                    include: {
                        investBlock: true,
                    },
                });
                if (!getPropertie) {
                    return {
                        message: "Failed to process property ",
                        success: false,
                        value: null,
                    };
                }
                const getExternalInvestors = await prisma.externalInvestor
                    .findMany({
                        where: {
                            investmentBlockId: getPropertie.investBlock?.id,
                        },
                    });
                const getImages = await prisma.file.findMany({
                    where: {
                        propertyId: input.pID,
                    },
                });
                const { investBlock, ...property } = getPropertie;
                const cleanProperty = propertySchema.parse({
                    ...property,
                    images: getImages,
                });
                const cleanData = {
                    property: cleanProperty,
                    investmentBlock: investBlock,
                    externalInvestors: getExternalInvestors || [],
                };

                return {
                    message: "successfully created property listing",
                    success: true,
                    value: cleanData,
                };
            } catch (error) {
                console.error("Error in getPropertie:", error, "input", input);
                return {
                    message: "Failed to process property XXXXXX",
                    success: false,
                    value: null,
                };
            }
        }),

    /**
     * postPropertie
     * Protected, rate-limited ("heavy") mutation.
     * Input: { property, investmentBlock }.
     * Enforces plan limits; resolves owner contact (user or org owner); creates:
     * - property (with images),
     * - investment block,
     * - optional external investors (emails + verification),
     * - a group chat room for invited investors.
     * On failure, rolls back DB records and deletes uploaded images (Supabase IDs).
     * Returns { success, message, data: createdProperty }.
     */

    postPropertie: protectedProcedure
        .input(
            z.object({
                property: propertySchema,
                investmentBlock: investmentBlockSchema,
            }),
        )
        .mutation(async ({ input, ctx }) => {
            let propertyIdGo: string | null = null;
            let supabaseIDList: string[] = [];
            try {
                const plan = ctx.subscription;
                const getUserPlan =  getPlanLimits(plan?.PlanTier as PlanTier)
                const cont = await getOwnerPropertieCount({
                    ownerType: input.property.ownerType,
                    ownerId: input.property.ownerId,
                });
                if (cont && cont >= getUserPlan.maxProjects) {
                    return {
                        message: input.property.ownerType === "USER"
                            ? "You have reached the maximum number of properties for your plan. Please upgrade your plan to add more properties."
                            : "Your organization has reached the maximum number of properties for your plan. Please contact user oganization owner or admin to upgrade the plan.",
                        success: false,
                    };
                }

                let ownerShip = {
                    name: ctx.user.name,
                    email: ctx.user.email,
                };
                const { images } = input.property;
                const UploadImages = await FilesToCloud(images, {
                    userID: ctx.user.id,
                    isChat: false,
                })
                const { externalInvestors, ...investmentBlock } =
                    input.investmentBlock;
                const { id, propertyId, ...cleanInvestmentBlock } =
                    investmentBlock;
                const { id: pId, ...propertyData } = input.property;
                if (propertyData.ownerType === "ORGANIZATION") {
                    const getOrgOwner = await ctx.prisma.member.findFirst({
                        where: {
                            organizationId: propertyData.ownerId,
                        },
                        select: {
                            user: {
                                select: {
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    });

                    if (getOrgOwner) {
                        ownerShip = {
                            name: getOrgOwner.user.name,
                            email: getOrgOwner.user.email,
                        };
                    }
                }

                const CreateProperty = await ctx.prisma.propertie.create({
                    data: {
                        ...propertyData,
                        ownerName: ownerShip.name,
                        contactInfo: ownerShip.email,
                    },
                });
                await ctx.prisma.file.createMany({
                    data: UploadImages,
                });
                const getAllImages = await ctx.prisma.file.findMany({
                    where: {
                        propertyId: CreateProperty.id,
                    },
                });

                if (!CreateProperty) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to create property",
                    });
                }
                propertyIdGo = CreateProperty.id;
                supabaseIDList = getAllImages.map((item) => {
                    return item.path;
                });

                const CreateinvestmentBlock = await ctx.prisma.investmentBlock
                    .create({
                        data: {
                            ...cleanInvestmentBlock,
                            propertyId: CreateProperty.id,
                        },
                    });

                if (CreateinvestmentBlock) {
                    const CreateExternalInvestors = await Promise.all(
                        externalInvestors.map(async (item) => {
                            const { id, ...rest } = item;
                            return await ctx.prisma.externalInvestor.create({
                                data: {
                                    ...rest,
                                    investmentBlockId: CreateinvestmentBlock.id,
                                },
                            });
                        }),
                    );
                    if (CreateExternalInvestors.length > 0) {
                        const getEmail = CreateExternalInvestors.map((item) => {
                            return item.email;
                        });
                        const createChatRoom = await CreateGroupChat({
                            PropertyName: CreateProperty.name,
                            members: getEmail,
                            currentAdminId: ctx.user.id,
                        });
                        if (!createChatRoom.success) {
                            throw new TRPCError({
                                code: "INTERNAL_SERVER_ERROR",
                                message: "Failed to create chat room",
                            });
                        }
                        await Promise.all(
                            CreateExternalInvestors.map(async (item) => {
                                const { id, ...rest } = item;
                                await sendEmail({
                                    templateText: "VerifyExternalInvestor",
                                    to: rest.email,
                                    params: {
                                        name: rest.name,
                                        email: rest.email,
                                        verificationLink:
                                            `${process.env.NEXTAUTH_URL}/home/verifyExternalInvestor?investorId=${id}&propertieid=${CreateProperty.id}`,
                                        propertyLink:
                                            `${process.env.NEXTAUTH_URL}/propertie/${CreateProperty.id}`,
                                        contributionPercent: rest
                                            .contributionPercentage.toNumber(),
                                        DollarValueReturn: rest
                                            .dollarValueReturn.toNumber(),
                                        propertyName: CreateProperty.name,
                                        accessCode: CreateProperty.accessCode,
                                    },
                                });
                            }),
                        );
                    }
                }

                return {
                    message: "successfully created property listing",
                    success: true,
                    data: CreateProperty,
                };
            } catch (error) {
                if (propertyIdGo) {
                    await ctx.prisma.propertie.delete({
                        where: {
                            id: propertyIdGo,
                        },
                    });
                }
                if (supabaseIDList.length > 0) {
                    await ctx.prisma.file.deleteMany({
                        where: {
                            path: {
                                in: supabaseIDList,
                            },
                        },
                    });
                    await DeleteImages(supabaseIDList);
                }
                console.error("Error in postPropertie:", error);
                return {
                    message:
                        "something went wrong while creating property listing ",
                    success: false,
                    data: null,
                };
            }
        }),

    /**
     * updataPropertie
     * Protected, rate-limited mutation.
     * Input: { property, investmentBlock }.
     * Updates property fields; upserts images (updates existing, creates new);
     * updates investment block; upserts external investors and emails any newly added investors for verification.
     * Returns { success, message, data: updatedPropertyWithRelations }.
     */

    updataPropertie: protectedProcedure
        .input(
            z.object({
                property: propertySchema,
                investmentBlock: investmentBlockSchema,
            }),
        )
        .mutation(async ({ input, ctx }) => {
            try {
                const { images, id: pId, ...propertyData } = input.property;
                const { externalInvestors, ...investmentBlock } =
                    input.investmentBlock;
                const { id, propertyId, ...cleanInvestmentBlock } =
                    investmentBlock;

                const newImages = images.filter((item) => !item.path);
                const oldImages = images.filter((item) => item.path);

                await Promise.all(
                    oldImages.map((item) => {
                        const { id, ...rest } = item;
                        return ctx.prisma.file.update({
                            where: { id },
                            data: rest,
                        });
                    }),
                );

                if (newImages.length > 0) {
                    const UploadImages = await FilesToCloud(newImages, {
                        userID: ctx.user.id,
                        isChat: false,
                    })
                    await ctx.prisma.file.createMany({
                        data: UploadImages.map((item) => {
                            const { id, ...rest } = item;
                            return { ...rest, propertyId: pId };
                        }),
                    });
                }

                const updataData = await ctx.prisma.propertie.update({
                    where: {
                        id: pId,
                        ownerId: propertyData.ownerId,
                    },
                    data: {
                        ...propertyData,

                        ...(cleanInvestmentBlock && {
                            investBlock: {
                                update: {
                                    ...cleanInvestmentBlock,
                                },
                            },
                        }),
                    },
                    include: {
                        investBlock: {
                            include: {
                                externalInvestors: true,
                            },
                        },
                    },
                });
                if (updataData.investBlock) {
                    const { id: BlockId } = updataData.investBlock;
                    const newExternalInvestors = externalInvestors.filter(
                        (item) => !item.id || item.id === "",
                    );
                    const oldExternalInvestors = externalInvestors.filter(
                        (item) => item.id || item.id !== "",
                    );

                    if (oldExternalInvestors.length > 0) {
                        await Promise.all(
                            oldExternalInvestors.map((item) => {
                                const { id, ...rest } = item;
                                return ctx.prisma.externalInvestor.update({
                                    where: { id },
                                    data: rest,
                                });
                            }),
                        );
                    }
                    if (newExternalInvestors.length > 0) {
                        const res = await Promise.all(
                            newExternalInvestors.map((item) => {
                                const { id, ...rest } = item;

                                return ctx.prisma.externalInvestor.create({
                                    data: {
                                        ...rest,
                                        investmentBlockId: BlockId,
                                    },
                                });
                            }),
                        );

                        await Promise.all(
                            res.map(async (item) => {
                                const { investmentBlockId, ...rest } = item;
                                await sendEmail({
                                    templateText: "VerifyExternalInvestor",
                                    to: rest.email,
                                    params: {
                                        name: rest.name,
                                        email: rest.email,
                                        verificationLink:
                                            `${process.env.NEXTAUTH_URL}/home/verifyExternalInvestor?investorId=${item.id}&propertieid=${pId}`,
                                        propertyLink:
                                            `${process.env.NEXTAUTH_URL}/propertie/${pId}`,
                                        contributionPercent: rest
                                            .contributionPercentage.toNumber(),
                                        DollarValueReturn: rest
                                            .dollarValueReturn.toNumber(),
                                        propertyName: updataData.name,
                                        accessCode: propertyData.accessCode,
                                    },
                                });
                            }),
                        );
                    }
                }
                if (!updataData) {
                    return {
                        message: "Failed to process property XXXXXX",
                        success: false,
                        data: null,
                    };
                }
                return {
                    message: "successfully updated property listing",
                    success: true,
                    data: updataData,
                };
            } catch (error) {
                console.error("Error in updataPropertie:", error);
                return {
                    message: "Failed to process property XXXXXX",
                    success: false,
                    data: null,
                };
            }
        }),

    /**
     * deleteImage
     * Protected, rate-limited mutation.
     * Input: { id, supabaseID }.
     * Removes image record(s) from DB then deletes the file from storage.
     * Returns { success, message, data: PrismaDeleteResult }.
     */

    deleteImage: protectedProcedure
        .input(z.object({ id: z.string(), path: z.string() }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { id } = input;
                const updataData = await ctx.prisma.file.deleteMany({
                    where: { id: id },
                });
                if (!updataData) {
                    return {
                        message: "Failed to process property image",
                        success: false,
                        data: null,
                    };
                }
                await DeleteImages([input.path]);
                return {
                    message: "successfully deleted image",
                    success: true,
                    data: updataData,
                };
            } catch (error) {
                console.error("Error in deleteImage:", error);
                return {
                    message: "Failed to process property image",
                    success: false,
                    data: null,
                };
            }
        }),

    /**
     * updataExternalInvestor
     * Protected mutation.
     * Input: { externalInvestors } (single investor payload).
     * Updates one external investor by id + investmentBlockId.
     * Returns { success, message, data: updatedInvestor }.
     */

    updataExternalInvestor: protectedProcedure
        .input(z.object({ externalInvestors: externalInvestorSchema }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { externalInvestors } = input;
                const updataData = await ctx.prisma.externalInvestor.update({
                    where: {
                        id: externalInvestors.id,
                        investmentBlockId: externalInvestors.investmentBlockId,
                    },
                    data: {
                        ...externalInvestors,
                    },
                });
                if (!updataData) {
                    return {
                        message: "Failed to process property externalInvestors",
                        success: false,
                        data: null,
                    };
                }
                return {
                    message: "successfully updated external investor",
                    success: true,
                    data: updataData,
                };
            } catch (error) {
                console.error("Error in updataExternalInvestor:", error);
                return {
                    message: "Failed to process property externalInvestors",
                    success: false,
                    data: null,
                };
            }
        }),

    /**
     * getUserProfle
     * Protected query.
     * Returns the authenticated user’s profile (selected fields), shaped into UserInput.
     * Returns null if user not found.
     */

    getUserProfle: protectedProcedure
        .query(async ({ ctx }) => {
            const user = await ctx.prisma.user.findUnique({
                where: {
                    id: ctx.user.id,
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
                    emailVerified: true,
                },
            });

            if (!user) {
                return null;
            }

            const newUser = {
                email: user?.email as string,
                name: user?.name as string,
                phoneNumber: user?.phoneNumber as string,
                address: user?.address as string,
                city: user?.city as string,
                state: user?.state as string,
                zipCode: user?.zipCode as string,
                country: user?.country as string,
                image: user?.image as string,
                emailVerified: user?.emailVerified as boolean,
            };
            return newUser;
        }),

    /**
     * updateUserProfle
     * Protected mutation.
     * Input: { user }.
     * Updates the authenticated user’s profile fields.
     * Returns { success, message, data: updatedUser }.
     */

    // updateUserProfle: protectedProcedure
    //     .input(z.object({ user: userSchema }))
    //     .mutation(async ({ input, ctx }) => {
    //         try {
    //             const { user } = input;
    //             const updataData = await ctx.prisma.user.update({
    //                 where: {
    //                     id: ctx.user.id,
    //                 },
    //                 data: {
    //                     ...user,
    //                 },
    //             });
    //             if (!updataData) {
    //                 return {
    //                     message: "Failed to process property externalInvestors",
    //                     success: false,
    //                     data: null,
    //                 };
    //             }
    //             return {
    //                 message: "successfully updated external investor",
    //                 success: true,
    //                 data: updataData,
    //             };
    //         } catch (error) {
    //             console.error("Error in updataExternalInvestor:", error);
    //             return {
    //                 message: "Failed to process property externalInvestors",
    //                 success: false,
    //                 data: null,
    //             };
    //         }
    //     }),

    /**
     * viewProperty
     * Protected query.
     * Input: { pID }.
     * Public-friendly property view: selected fields + price summary (from investment block) + images (id/url).
     * Returns { success, message, value: CleanViewProperty }.
     */

    viewProperty: protectedProcedure
        .input(z.object({ pID: z.string() }))
        .query(async ({ input, ctx }) => {
            try {
                const { pID } = input;
                const getPropertie = await ctx.prisma.propertie.findUnique({
                    where: {
                        id: pID,
                    },
                    select: {
                        investBlock: {
                            select: {
                                finalResult: true,
                                typeOfSale: true,
                                leaseCycle: true,
                            },
                        },
                        name: true,
                        address: true,
                        id: true,
                        description: true,
                        lotSize: true,
                        amenities: true,
                        propertyType: true,
                        status: true,
                        ownerName: true,
                        contactInfo: true,
                        leavingstatus: true,
                        numBathrooms: true,
                        numBedrooms: true,
                        yearBuilt: true,
                    },
                });

                if (!getPropertie) {
                    return {
                        message: "Failed to process property XXXXXX",
                        success: false,
                        value: null,
                    };
                }
                const getImages = await ctx.prisma.file.findMany({
                    where: {
                        propertyId: pID,
                    },
                    select: {
                        link: true,
                        id: true,
                    },
                });

                const cleanData = {
                    images: getImages, // { url: the image url, id: the image id }, this is an array
                    price: {
                        finalResult: getPropertie.investBlock
                            ?.finalResult as number,
                        typeOfSale:
                            getPropertie.investBlock?.typeOfSale as string ||
                            "SELL",
                        leaseCycle: getPropertie.investBlock
                            ?.leaseCycle as number,
                    }, // { finalResult: the final result, typeOfSale: the type of sale [SELL, RENT, LEASE], leaseCycle: the lease cycle }, this is an object
                    name: getPropertie.name,
                    address: getPropertie.address,
                    id: getPropertie.id,
                    description: getPropertie.description || "",
                    lotSize: getPropertie.lotSize, // number
                    amenities: getPropertie.amenities, //  List of amenities (e.g., ["Elevator", "Gym", "Fireplace"])
                    propertyType: getPropertie.propertyType, // List of property types (e.g., ["Apartment", "House", "Condo"])
                    status: getPropertie.status, // active, pending, sold, etc.
                    ownerName: getPropertie.ownerName,
                    contactInfo: getPropertie.contactInfo, // this ia an email
                    numBathrooms: getPropertie.numBathrooms, // number
                    numBedrooms: getPropertie.numBedrooms, // number
                    yearBuilt: getPropertie.yearBuilt, // number
                };
                console.log("cleanData", cleanData);

                return {
                    message: "successfully created property listing",
                    success: true,
                    value: cleanData,
                };
            } catch (error) {
                console.error("Error in viewProperty:", error);
                return {
                    message: "Failed to process property XXXXXX",
                    success: false,
                    value: null,
                };
            }
        }),

    /**
     * getPropertieNameById
     * Protected query.
     * Input: { pID }.
     * Returns the property name by id, or not-found result.
     * Returns { success, message, value: string | null }.
     */

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
                    },
                });

                if (!getP) {
                    return {
                        success: false,
                        message: "property not found",
                        value: null,
                    };
                }
                return {
                    success: true,
                    message: "successfully created property listing",
                    value: getP.name,
                };
            } catch (error) {
                console.error("Error in viewProperty:", error);
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "property not found",
                });
            }
        }),

    /**
     * acceptInvitePropertie
     * Protected mutation.
     * Input: { investorId, propertieId, code, accepted }.
     * Verifies or denies an external investor invite for the signed-in user:
     * - If accepted: validates access code, marks investor VERIFIED, links user to investment, updates user’s investments.
     * - If denied: marks as DRAFT + accessRevoked.
     * Returns { success, message }.
     */

    acceptInvitePropertie: protectedProcedure
        .input(z.object({
            investorId: z.string(),
            propertieId: z.string(),
            code: z.string().default(""),
            accepted: z.boolean().default(false),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const user = ctx.session?.user;
                if (!user) {
                    return {
                        success: false,
                        message: "user not found",
                    };
                }
                const { investorId, propertieId, code, accepted } = input;

                if (!accepted && code.length < 12) {
                    return {
                        success: false,
                        message: "Invalid code",
                    };
                }
                if (!accepted && code.length > 12) {
                    return {
                        success: false,
                        message: "Invalid code",
                    };
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
                                id: true,
                            },
                        },
                    },
                });
                if (!getPropertie) {
                    return {
                        success: false,
                        message: "property not found",
                    };
                }
                if (!getPropertie.investBlock) {
                    return {
                        success: false,
                        message: "property not found",
                    };
                }
                const Investor = await ctx.prisma.externalInvestor.findUnique({
                    where: {
                        investorUserId: user?.id,
                        id: investorId,
                    },
                });
                if (Investor && Investor.status === "VERIFIED") {
                    return {
                        success: false,
                        message: "you are already verified",
                    };
                }
                if (accepted) {
                    if (getPropertie.accessCode !== code) {
                        return {
                            success: false,
                            message: "Invalid code",
                        };
                    }
                    console.log({
                        investorUserId: user.id,
                        id: investorId,
                        email: user.email,
                        investmentBlockId: getPropertie.investBlock.id,
                        code,
                        accepted,
                    });

                    const data = await ctx.prisma.externalInvestor.updateMany({
                        where: {
                            id: investorId,
                            email: user.email,
                            investmentBlockId: getPropertie.investBlock.id,
                        },
                        data: {
                            status: "VERIFIED",
                            isInternal: true,
                            investorUserId: user.id,
                        },
                    });
                    if (data.count === 0) {
                        throw new TRPCError({
                            code: "NOT_FOUND",
                            message: "Investor not found or not owned by user.",
                        });
                    }
                    await ctx.prisma.user.update({
                        where: {
                            id: user?.id,
                        },
                        data: {
                            investments: [getPropertie.id],
                        },
                    });

                    return {
                        success: true,
                        message: `successfully verified you as investor`,
                    };
                } else {
                    console.log({
                        investorUserId: user.id,
                        id: investorId,
                        email: user.email,
                        investmentBlockId: getPropertie.investBlock.id,
                        code,
                        accepted,
                    });

                    const { count } = await ctx.prisma.externalInvestor
                        .updateMany({
                            where: {
                                id: investorId,
                                email: user.email,
                                investmentBlockId: getPropertie.investBlock.id,
                            },
                            data: {
                                status: "DRAFT",
                                isInternal: false,
                                accessRevoked: true,
                                investorUserId: user.id,
                            },
                        });
                    if (count === 0) {
                        throw new TRPCError({
                            code: "NOT_FOUND",
                            message: "Investor not found or not owned by user.",
                        });
                    }

                    return {
                        success: true,
                        message: `successfully denied you as investor`,
                    };
                }
            } catch (error) {
                console.error("Error in viewProperty:", error);
                return {
                    success: false,
                    message: "failed to process adding user as investor",
                };
            }
        }),
});
// export type definition of API
