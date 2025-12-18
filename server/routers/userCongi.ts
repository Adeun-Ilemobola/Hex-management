import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { authClient } from '@/lib/auth-client';
import { auth } from '@/lib/auth';

import { Metadata, UpdateUser } from '@/lib/ZodObject';
import { TRPCError } from '@trpc/server';
import { get } from 'http';
import { getPlanLimits } from '@/lib/PlanConfig';





export const userCongiRouter = createTRPCRouter({
    /**
 * setPasswordForOAuth
 * Protected mutation.
 * If the user has no credential (email/password) account, sets a new password.
 * Otherwise, changes password using currentPassword → newPassword.
 * Returns { success: boolean }.
 */

    setPasswordForOAuth: protectedProcedure.input(z.object({ newPassword: z.string(), confirmPassword: z.string(), currentPassword: z.string() }))
        .mutation(async ({ input, ctx }) => {
            try {
                const headers = ctx.headers;

                // 2) Check existing accounts
                // Use 'api' and pass the headers so it knows WHO the user is
                const accounts = await auth.api.listUserAccounts({
                    headers: ctx.headers
                });
              const hasEmail = accounts.some((a) => a.providerId === "credential");

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

    /**
     * getUserPlan
     * Protected query.
     * Resolves the active subscription/plan:
     * - If the user is an org employee (member/admin) and org metadata exists, parses plan from org metadata.
     * - Otherwise, parses plan from the user’s own subscription in ctx.
     * Returns { success, isEployee, role, value: Plan | null }.
     */

    getUserPlan: protectedProcedure.query(async ({ ctx }) => {
        try {
            const user = ctx.session?.user;
            if (!user) {
                return { success: true, isEployee: false, role: "", value: getPlanLimits("Free"), planDetail: ctx.subscription }; // { success: true, isEployee: false, role: "" value: plan }

            }
            const memberInOrg = await ctx.prisma.member.findFirst({
                where: {
                    userId: user.id,
                    role: {
                        in: ["member", "admin"]
                    }
                },
                select: {
                    role: true,
                    organization: {
                        select: {
                            metadata: true
                        }
                    }
                }

            })
            if (memberInOrg && memberInOrg.organization.metadata) {
                console.log(JSON.parse(memberInOrg.organization.metadata));

                const planDetail = Metadata.parse(JSON.parse(memberInOrg.organization.metadata))
                return { success: true, isEployee: false, role: memberInOrg.role, value: getPlanLimits(planDetail.PlanTier), planDetail: planDetail };
            }



            return { success: true, isEployee: false, role: "owner", value: getPlanLimits(ctx.subscription.PlanTier), planDetail: ctx.subscription };
        } catch (error) {
            console.error("Error in getUserPlan:", error);
            return { success: false, isEployee: false, role: "", value: getPlanLimits("Free"), planDetail: ctx.subscription };
        }
    }),
    /**
     * SearchUserByEmail
     * Protected mutation.
     * Input: { email }.
     * Finds publicly visible user profiles matching the email and returns a lightweight card
     * (id, name, email, image, directMessage).
     * Returns { success, value: UserCard[] }.
     */

    SearchUserByEmail: protectedProcedure.input(z.object({ email: z.string() }))
        .mutation(async ({ input, ctx }) => {
            try {
                const users = await ctx.prisma.user.findMany({
                    where: {
                        email: input.email,
                        profilePublic: true

                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        directMessage: true,

                    }
                })
                return { success: true, value: users };
            } catch (error) {
                console.error("Error in SearchUserByEmail:", error);
                return { success: false, value: [] };
            }
        }),

    /**
     * magicLinkVerify
     * Public/base query.
     * Input: { token }.
     * Verifies a magic-link token via auth API using session cookies;
     * on success returns provider response payload.
     * Returns { success, message, value? }.
     */

    magicLinkVerify: baseProcedure.input(z.object({ token: z.string() }))
        .query(async ({ input, ctx }) => {
            try {
                console.log(" ---------------------->  Verifying magic link with token:", input.token);

                if (input.token.trim() === "") {
                    return { success: false, message: "Invalid token" };
                }
                const data = await auth.api.magicLinkVerify({
                    query: {
                        token: input.token,
                        callbackURL: `${process.env.NEXTAUTH_URL}/home`,
                    },
                    // This endpoint requires session cookies.
                    headers: ctx.headers,
                });
                return { success: true, message: "Magic link verified successfully", value: data };

            } catch (error) {
                console.error("Error in magicLinkVerify:", error);
                return { success: false, message: "Magic link verification failed" };

            }

        }),


    updateUserProfle: protectedProcedure
        .input(UpdateUser)
        .mutation(async ({ input, ctx }) => {
            try {
                const user = ctx.session?.user;
                if (!user) {
                    return { success: false, message: "User not found" };
                }
                if (user.email !== input.email.trim()) {
                    await auth.api.changeEmail({
                        body: {
                            newEmail: input.email
                        },
                        headers: ctx.headers
                    })
                }

                const updatedUser = await ctx.prisma.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        city: input.city,
                        country: input.country,
                        name: input.name,
                        phoneNumber: input.phoneNumber,
                        state: input.state,
                        address: input.address,
                        zipCode: input.zipCode
                    },
                });
                return { success: true, message: "User profile updated successfully", value: updatedUser };
            } catch (error) {
                console.error("Error in updateUserProfle:", error);
                return { success: false, message: "User profile update failed" };
            }
        })


})