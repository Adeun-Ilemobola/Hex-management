
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../init';
import { TRPCError } from '@trpc/server';
import { auth } from '@/lib/auth';



export type CleanProperty = {
    id: string;
    img?: string;
    name: string;
    address: string;
    status: string;
    saleStatus: string;
}


export const SubscriptionRouter = createTRPCRouter({
    /**
 * UpgradeSubscription
 * Protected mutation.
 * Input: { plan: "free" | "Deluxe" | "Premium", organizationId?: string, annual?: boolean }.
 * - Resolves current active/trialing subscription for user/org.
 * - If upgrading (non-free) and a Stripe subscription exists → calls auth API to upgrade in place.
 * - If no active subscription exists → creates a new subscription with redirect URLs.
 * Returns { success, message, value: providerResponse } or failure when plan is "free" or errors occur.
 */

    UpgradeSubscription: protectedProcedure
        .input(z.object({ plan: z.enum(["free", "Deluxe", "Premium"]), organizationId: z.string().nullable(), annual: z.boolean().default(false) }))
        .mutation(async ({ ctx, input }) => {
            const user = ctx.session?.user;
            if (!user) {
                console.warn("[makeSubscription] not signed in, tier=", input.plan);
                // you can either throw or return a shaped error
                throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be signed in" });
            }
            try {
                
                const referenceId = input.organizationId ?? user.id;
                console.log("----user amd headers----", user);

                const subscription = await ctx.prisma.subscription.findFirst({
                    where: {
                        stripeCustomerId: user.stripeCustomerId,
                        referenceId,
                        status: { in: ["active", "trialing"] },
                    },
                })
                console.log("----subscription----", subscription || "no current subscription");

                if (input.plan !== "free") {
                    if (subscription?.stripeSubscriptionId) {
                        // upgrade the current subscription
                        const data = await auth.api.upgradeSubscription({
                            body: {
                                plan: input.plan.toLowerCase(), // required
                                annual: input.annual,
                                referenceId,
                                subscriptionId: subscription.stripeSubscriptionId,
                                successUrl: `${process.env.NEXTAUTH_URL}/home/account?success=true`, // required
                                cancelUrl: `${process.env.NEXTAUTH_URL}/home/account?canceled=true`, // required
                                disableRedirect: true, // required
                            },
                            // This endpoint requires session cookies.
                            headers:ctx.headers
                        });
                        console.log("----data----", data);
                        return {
                            message: "Subscription upgraded",
                            success: true,
                            value: data
                        }
                    } else {
                        // make a new subscription
                        const data = await auth.api.upgradeSubscription({
                            body: {
                                plan: input.plan.toLowerCase(), // required
                                annual: input.annual,
                                referenceId,
                                successUrl: `${process.env.NEXTAUTH_URL}/home/account?success=true`, // required
                                cancelUrl: `${process.env.NEXTAUTH_URL}/home/account?canceled=true`, // required
                                disableRedirect: true, // required
                            },
                            // This endpoint requires session cookies.
                             headers:ctx.headers
                        });
                        console.log("----data----", data);
                        return {
                            message: "Subscription upgraded",
                            success: true,
                            value: data
                        }
                    }
                }

                return {
                    message: "Failed to upgrade subscription",
                    success: false,
                    value: null
                }


            } catch (error) {
                console.error("Error in UpgradeSubscription:", error);
                return {
                    message: "Failed to upgrade subscription",
                    success: false,
                    value: null
                }


            }

        })

})