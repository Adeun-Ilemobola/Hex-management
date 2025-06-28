//UserRouter

import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { prisma } from '@/lib/prisma';
import { propertieSchema } from '@/lib/Zod';
import { stripe } from '@/lib/stripe';
import { TRPCError } from "@trpc/server";

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
            const user = ctx.session?.user;
            if (!user) {
                console.warn("[makeSubscription] not signed in, tier=", input.tier);
                // you can either throw or return a shaped error
                throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be signed in" });
            }

            const userId = user.id;
            const Prices: Record<"Free" | "Deluxe" | "Premium", string> = {
                Free: "",
                Deluxe: "price_1ResmhK8EHOHCxifrI6DH4UB",
                Premium: "price_1ResmJK8EHOHCxifsX0Xqte3‹",
            };

            try {
                // ─── FREE TIER ─────────────────────────────────────────────
                if (input.tier === "Free") {
                    // cancel any active paid subs
                    const paidSub = await ctx.prisma.subscription.findFirst({
                        where: {
                            userId,
                            isActive: true,
                            status: "active",
                            planTier: { in: ["Deluxe", "Premium"] },
                        },
                    });

                    if (paidSub?.stripeSubscriptionId) {
                        await stripe.subscriptions.cancel(paidSub.stripeSubscriptionId);
                        await ctx.prisma.subscription.update({
                            where: { id: paidSub.id },
                            data: {
                                status: "canceled",
                                isActive: false,
                                canceledAt: new Date(),
                            },
                        });
                    }

                    // create local free‐plan record
                    await ctx.prisma.subscription.create({
                        data: {
                            userId,
                            planTier: "Free",
                            status: "active",
                            isActive: true,
                        },
                    });

                    return { url: null, message: "Now on Free tier." };
                }

                // ─── PAID TIERS ─────────────────────────────────────────────
                const priceId = Prices[input.tier];
                if (!priceId) {
                    console.error("[makeSubscription] missing priceId for tier", input.tier);
                    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid plan selected" });
                }

                const session = await stripe.checkout.sessions.create({
                    mode: "subscription",
                    payment_method_types: ["card"],
                    line_items: [{ price: priceId, quantity: 1 }],
                    customer_email: user.email,
                    success_url: `${process.env.NEXTAUTH_URL}/account?success=true`,
                    cancel_url: `${process.env.NEXTAUTH_URL}/account?canceled=true`,
                });

                return { url: session.url!, message: "Redirecting to Stripe checkout…" };
            } catch (err: any) {
                console.error("[makeSubscription] error processing", {
                    userId,
                    tier: input.tier,
                    error: err,
                });
                // surface the message so your client onError can toast it
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: err?.message ?? "Subscription service unavailable",
                });
            }
        })








});
// export type definition of API
