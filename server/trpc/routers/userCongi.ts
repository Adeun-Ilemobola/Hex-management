import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../init';
import { authClient } from '@/lib/auth-client';
import { auth } from '@/lib/auth';

import { Metadata } from '@/lib/Zod';
import { TRPCError } from '@trpc/server';





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
            const user = ctx.session?.user;
            if(!user) {
                console.warn("[getUserPlan] not signed in");
                // you can either throw or return a shaped error
                throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be signed in" });
            }
            const  memberInOrg = await ctx.prisma.member.findFirst({
                where: {
                    userId: user.id,
                    role:{
                        in: ["member", "admin"]
                    }
                },
                select: {
                    role: true,
                    organization:{
                        select: {
                            metadata: true
                        }
                    }
                }
                
            })
            if(memberInOrg && memberInOrg.organization.metadata) {
                console.log(JSON.parse(memberInOrg.organization.metadata));
                
                const plan = Metadata.parse(JSON.parse(memberInOrg.organization.metadata))  
                return { 
                    success: true, 
                    isEployee: true, 
                    role: memberInOrg.role , 
                    value: {
                        ...plan,
                        limits:{
                            ...plan.limits,
                        }
                    }
                 };
            }
           
            const plan = Metadata.parse(ctx.subscription) 
            
            return { success: true, isEployee: false, role: "owner", value: plan};
        } catch (error) {
            console.error("Error in getUserPlan:", error);
            return { success: false, isEployee: false , role: ""  , value: null };
        }   
    }),

    SearchUserByEmail: protectedProcedure.input(z.object({ email: z.string() }))
        .mutation(async ({ input , ctx }) => {
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

})