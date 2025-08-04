import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { authClient } from '@/lib/auth-client';
import { auth } from '@/lib/auth';
import { DateTime } from 'luxon';
import { stripe } from '@/lib/stripe';




export const userCongiRouter = createTRPCRouter({
    setPasswordForOAuth: protectedProcedure.input(z.object({ newPassword: z.string(), confirmPassword: z.string(), currentPassword: z.string() }))
        .mutation(async ({ input, ctx }) => {
            try {
                const headers = ctx.req.headers;

                // 2) Check existing accounts
                const accounts = await authClient.listAccounts();
                const hasEmail = accounts.data?.some((a) => a.provider === "credential")

                if (!hasEmail) {
                    await auth.api.setPassword({
                        body: { newPassword: input.newPassword },
                        headers,
                    });

                    return { success: true }
                }

                const { currentPassword, newPassword, confirmPassword } = input;
                await authClient.changePassword({
                    newPassword: newPassword,
                    currentPassword: currentPassword
                }, { headers });
                return { success: true }

            } catch (error) {
                console.error("Error in setPasswordForOAuth:", error);
                return { success: false }
            }
        }),


    getUserPlan: protectedProcedure .query(async ({ ctx }) => {
            try {
                const isActive = await ctx.prisma.subscription.findFirst({
                    where: {
                        userId: ctx.user.id,
                    },

                })
                const daysLeft = isActive?.currentPeriodEnd ? DateTime.fromJSDate(isActive.currentPeriodEnd).diffNow("days").days : null;
                const isExpired = daysLeft !== null && daysLeft <= 0;

                if (isExpired && isActive?.nextStripeSubscriptionId) {
                    const stripeSub = await stripe.subscriptions.retrieve(isActive.nextStripeSubscriptionId);
                    const item = stripeSub.items.data[0];
                    const {
                        id,
                        createdAt,
                        updatedAt,
                        ...archivableData
                    } = isActive;

                    await ctx.prisma.subscriptionArchives.create({
                        data: {
                            userId: ctx.user.id,
                            Subscriptions: {
                                create: {
                                    ...archivableData
                                },
                            }
                        },
                    });
                    await ctx.prisma.subscription.delete({
                        where: {
                            id: isActive.id,
                        },

                    })
                    const subName = item.price.id === "price_1ResTb2c20NQVeDjj0lmeLk1" ? "Deluxe" : "Premium";


                   const paidSub = await ctx.prisma.subscription.create({
                        data: {
                            userId: ctx.user.id,
                            status: stripeSub.status,
                            isActive: stripeSub.status === "active",
                            // update the new period end if it changed
                            currentPeriodEnd: new Date(item.current_period_end * 1000),
                            // if you want to update the start too:
                            currentPeriodStart: new Date(item.current_period_start * 1000),
                            cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
                            canceledAt: stripeSub.canceled_at
                                ? new Date(stripeSub.canceled_at * 1000)
                                : null,

                            stripeSubscriptionId: stripeSub.id,
                            planTier: subName,
                            priceId: item.price.id,
                            stripeCustomerId: stripeSub.customer as string
                        },
                    });

                    return{
                        success: true,
                        data: {
                            planTier: subName,
                            isActive: paidSub.status === "active",
                            daysLeft: daysLeft
                        }
                    }



                }

                else if(isExpired && isActive && !isActive?.nextStripeSubscriptionId){
                    const {
                        id,
                        createdAt,
                        updatedAt,
                        ...archivableData
                    } = isActive;

                    await ctx.prisma.subscriptionArchives.create({
                        data: {
                            userId: ctx.user.id,
                            Subscriptions: {
                                create: {
                                    ...archivableData
                                },
                            }
                        },
                    });
                    await ctx.prisma.subscription.delete({
                        where: {
                            id: isActive.id,
                        },

                    })

                    const freeSub = await ctx.prisma.subscription.create({
                        data: {
                            userId: ctx.user.id,
                            status: "active",
                            isActive: true,
                            currentPeriodEnd: null,
                            currentPeriodStart: null,
                            cancelAtPeriodEnd: false,
                            canceledAt: null,
                            stripeSubscriptionId: null,
                            planTier: "Free",
                            priceId: null,
                            stripeCustomerId: null
                        },
                    });

                    return{
                        success: true,
                        data: {
                            planTier: "Free",
                            isActive: freeSub.isActive,
                            daysLeft: null
                        }
                    }


                    
                }

                return {
                    success: true,
                    data: {
                        planTier: isActive?.planTier || "Free",
                        isActive: isActive?.isActive || false,
                        daysLeft: daysLeft
                    }
                }


            } catch (error) {
                console.error("Error in getUserPlan:", error);
                return {
                    success: false, data: {
                        planTier: "Free",
                        isActive: false,
                        daysLeft: null
                    }
                }
            }
        }),

})