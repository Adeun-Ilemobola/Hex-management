
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, t } from '../init';
import { prisma } from '@/lib/prisma';
import { propertySchema, investmentBlockSchema, externalInvestorSchema, UserInput, userSchema, PropertyTypeEnumType } from '@/lib/Zod';
import { DeleteImages } from '@/lib/supabase';
import { sendEmail } from '@/server/actions/sendEmail';
import { rateLimit } from '../middlewares/rateLimit';
import { CreateGroupChat } from '@/server/actions/CreateGroupChat';
import { TRPCError } from '@trpc/server';
import { auth } from '@/lib/auth';
import { log } from 'console';

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


export const SubscriptionRouter = createTRPCRouter({
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
                const cookie =
                    typeof ctx.headers?.get === "function"
                        ? ctx.headers.get("cookie") ?? ""
                        : (ctx.headers as any)?.cookie ?? "";
                console.log("----input----", input);
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