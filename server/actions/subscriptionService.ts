import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { DateTime } from "luxon";

export interface PlanResult {
    success: boolean;
    data: {
        planTier: string;
        isActive: boolean;
        daysLeft: number | null;
    };
}
export interface PlanResult {
    success: boolean;
    data: {
        planTier: string;
        isActive: boolean;
        daysLeft: number | null;
    };
}


export async function fetchUserPlan(userId: string): Promise<PlanResult> {
    try {
        const isActive = await prisma.subscription.findFirst({
            where: {
                userId: userId,
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

            await prisma.subscriptionArchives.create({
                data: {
                    userId: userId,
                    Subscriptions: {
                        create: {
                            ...archivableData
                        },
                    }
                },
            });
            await prisma.subscription.delete({
                where: {
                    id: isActive.id,
                },

            })
            const subName = item.price.id === "price_1ResTb2c20NQVeDjj0lmeLk1" ? "Deluxe" : "Premium";


            const paidSub = await prisma.subscription.create({
                data: {
                    userId: userId,
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

            return {
                success: true,
                data: {
                    planTier: subName,
                    isActive: paidSub.status === "active",
                    daysLeft: daysLeft
                }
            }



        }

        else if (isExpired && isActive && !isActive?.nextStripeSubscriptionId) {
            const {
                id,
                createdAt,
                updatedAt,
                ...archivableData
            } = isActive;

            await prisma.subscriptionArchives.create({
                data: {
                    userId: userId,
                    Subscriptions: {
                        create: {
                            ...archivableData
                        },
                    }
                },
            });
            await prisma.subscription.delete({
                where: {
                    id: isActive.id,
                },

            })

            const freeSub = await prisma.subscription.create({
                data: {
                    userId: userId,
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

            return {
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

}