import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../init';
import { authClient } from '@/lib/auth-client';
import { auth } from '@/lib/auth';

import { Final, OrganizationMetadata } from '@/server/actions/subscriptionService';




export const userCongiRouter = createTRPCRouter({
    setPasswordForOAuth: protectedProcedure.input(z.object({ newPassword: z.string(), confirmPassword: z.string(), currentPassword: z.string() }))
        .mutation(async ({ input, ctx }) => {
            try {
                const headers = ctx.headers;

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


    getUserPlan: protectedProcedure.query(async ({ ctx }) => {
        try {
            const userId = ctx.session?.user?.id;
            const plan = await Final(userId || "") || null;
            return { success: true, value: plan };
        } catch (error) {
            console.error("Error in getUserPlan:", error);
            return { success: false  , value: null };
        }   
    }),

    SearchUserByEmail: protectedProcedure.input(z.object({ email: z.string() }))
        .mutation(async ({ input , ctx }) => {
            try {
                const users = await ctx.prisma.user.findMany({
                    where: {
                        email: {
                            contains: input.email
                        }
                        
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true
                    }
                })
                return { success: true, value: users };
            } catch (error) {
                console.error("Error in SearchUserByEmail:", error);
                return { success: false, value: [] };
            }
        }), 

})