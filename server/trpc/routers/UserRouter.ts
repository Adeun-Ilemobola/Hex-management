//UserRouter

import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { prisma } from '@/lib/prisma';
import { propertieSchema } from '@/lib/Zod';
import { stripe } from '@/lib/stripe';
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
        .input(z.object({ data: propertieSchema, }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { data } = input;
                const { imageUrls, videoTourUrl, ...rest } = data;

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



    makeSubscription: protectedProcedure
        .input(z.object({ tier: z.enum(["Free", "Deluxe", "Premium"]) }))
        .mutation(async ({ ctx, input }) => {
            try {
                if (!ctx.session) {
                    return { url: null, message: "Not signed in" };
                }

                const userId = ctx.session.user.id;
                const Prices = {
                    Free: "price_1ResnWK8EHOHCxifhUdc04tE",
                    Deluxe: "price_1ResmhK8EHOHCxifrI6DH4UB",
                    Premium: "price_1ResmJK8EHOHCxifsX0Xqte3‹"
                }

                if (input.tier === "Free") {
                    // a) See if they have an active paid sub
                    const paidSub = await ctx.prisma.subscription.findFirst({
                        where: { isActive: true, userId, status: "active", planTier: { in: ["Deluxe", "Premium"] } }
                    });


                    // b) Cancel it on Stripe (if one exists)
                    if (paidSub?.stripeSubscriptionId) {
                        await stripe.subscriptions.cancel(paidSub.stripeSubscriptionId);
                        // And mark it cancelled in your DB
                        await ctx.prisma.subscription.update({
                            where: { id: paidSub.id },
                            data: { status: "canceled", isActive: false, canceledAt: new Date() }
                        });
                    }


                    // 3) Create a new Free subscription record
                    await ctx.prisma.subscription.create({
                        data: {
                            userId,
                            planTier: "Free",
                            status: "active",
                            isActive: true,
                            // For a free plan, there's no Stripe IDs or periods
                           
                        },
                    });


                    return { url: null, message: "Subscribed to Free tier" };
                }

                // 2) Handle Paid tiers
                const priceId = Prices[input.tier];
                // Create a Stripe Checkout session
                const session = await stripe.checkout.sessions.create({
                    mode: "subscription",
                    payment_method_types: ["card"],
                    line_items: [{ price: priceId, quantity: 1 }],
                    customer_email: ctx.session.user.email,
                    success_url: `${process.env.NEXTAUTH_URL}/account?success=true`,
                    cancel_url: `${process.env.NEXTAUTH_URL}/account?canceled=true`,
                });

                // Return the Stripe URL to your frontend
                return { url: session.url!, message: "Redirecting to checkout" };


            } catch (error) {

            }

        })








});
// export type definition of API
