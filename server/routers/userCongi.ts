import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { authClient } from '@/lib/auth-client';
import { auth } from '@/lib/auth';

import { Metadata } from '@/lib/ZodObject';
import { TRPCError } from '@trpc/server';





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
                console.warn("[getUserPlan] not signed in");
                // you can either throw or return a shaped error
                throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be signed in" });
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

                const plan = Metadata.parse(JSON.parse(memberInOrg.organization.metadata))
                return { success: true, isEployee: false, role: memberInOrg.role, value: plan }
            }

            const plan = Metadata.parse(ctx.subscription)

            return { success: true, isEployee: false, role: "owner", value: plan };
        } catch (error) {
            console.error("Error in getUserPlan:", error);
            return { success: false, isEployee: false, role: "", value: null };
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

        })


})