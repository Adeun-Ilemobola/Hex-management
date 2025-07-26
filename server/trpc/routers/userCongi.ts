import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { authClient } from '@/lib/auth-client';
import { auth } from '@/lib/auth';
import { cx } from 'class-variance-authority';




export const userCongiRouter = createTRPCRouter({
    setPasswordForOAuth: protectedProcedure
        .input(z.object({ newPassword: z.string(), confirmPassword: z.string(), currentPassword: z.string() }))
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


        getUserPlan: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const  isActive = await ctx.prisma.subscription.findFirst({
                    where: {
                      userId: ctx.user.id,
                      isActive: true,
                      status: "active",
                      
                    },
                    select: {
                      planTier: true,
                      isActive: true
                    }
                })
                if (!isActive) {
                    return { success: false , data: {
                        planTier: "Free",
                        isActive: false
                    }}
                }

                return { success: true, data: isActive }
               
            } catch (error) {
                console.error("Error in getUserPlan:", error);
                return { success: false , data: {
                    planTier: "Free",
                    isActive: false
                }}
            }
        }),

})