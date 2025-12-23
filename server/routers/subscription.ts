
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
        .input(
            z.object({
                plan: z.enum(["free", "deluxe", "premium", "Deluxe", "Premium"]).transform((val) => val.toLowerCase()),
                // organizationId: z.string().nullable(),
                annual: z.boolean().default(false),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = ctx.session?.user;
            const userStripeCustomerId = user?.stripeCustomerId; 

            if (!user || !userStripeCustomerId) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be signed in" });
            }
            try {
              

                if (input.plan === "free") {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "To downgrade to free, please cancel your current subscription."
                    });
                }


                const subscription = await ctx.prisma.subscription.findFirst({
                    where: {
                        stripeCustomerId: userStripeCustomerId,
                        referenceId: user.id,
                        status: { in: ["active", "trialing"] },
                    },
                });
                const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";


                const apiBody: any = {
                    plan: input.plan,
                    annual: input.annual,
                    referenceId: user.id, // Binds subscription to User or Org
                    successUrl: `${baseUrl}/home/account?success=true`,
                    cancelUrl: `${baseUrl}/home/account?canceled=true`,
                    disableRedirect: true,
                };

                if (subscription?.stripeSubscriptionId) {
                    apiBody.subscriptionId = subscription.stripeSubscriptionId;
                }

                // Call the better-auth server-side API
                const data = await auth.api.upgradeSubscription({
                    body: apiBody,
                    headers: ctx.headers,
                });

                return {
                    message: "Checkout session created",
                    success: true,
                    value: data,
                };

            } catch (error) {
                console.error("[UpgradeSubscription] Error:", error);

                if (error instanceof TRPCError) throw error;

                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to initiate subscription upgrade.",
                    cause: error,
                });
            }
        }),

})