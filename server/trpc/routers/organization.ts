import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { auth } from "@/lib/auth";
import { createServerCaller } from "../caller";


export const organizationRouter = createTRPCRouter({

    onboardUserToOrg: protectedProcedure.input(z.object({ name: z.string(), email: z.string(), organizationId: z.string() }))
        .mutation(async ({ input, ctx }) => {
            try {
                const newUserbody = {
                    name: input.name,
                    email: input.email,
                    password: `${input.name}${Math.floor(Math.random() * 1000)}`,
                }
                const { response, headers } = await auth.api.signUpEmail({
                    returnHeaders: true,
                    body: newUserbody,
                })
                const { user } = response;

                const res = await auth.api.addMember({
                    body: {
                        userId: user.id,
                        organizationId: input.organizationId,
                        role: ["member"]
                    }
                })

                if (!res) {
                    return {
                        message: "Failed to complete onboarding",
                        success: false,
                        value: null
                    }
                }
                return {
                    message: "Successfully onboarded user",
                    success: true,
                    value: user
                }

            } catch (error) {
                console.error("Error in onboardUserToOrg:", error);
                return {
                    message: "Failed to complete onboarding",
                    success: false,
                    value: null
                }

            }
        }),

    getUserOrganizations: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const data = await auth.api.listOrganizations();
                return {
                    message: "Successfully got user organizations",
                    success: true,
                    value: data
                }
            } catch (error) {
                console.error("Error in getUserOrganizations:", error);
                return {
                    message: "Failed to get user organizations",
                    success: false,
                    value: null
                }
            }
        }),



    createOrganization: protectedProcedure.input(z.object({ name: z.string() }))
        .mutation(async ({ input, ctx, }) => {
            try {
                if (!ctx.session) {
                    return {
                        message: "Failed to create organization",
                        success: false,
                        value: null
                    }
                }

                const api = await createServerCaller();
                const userSub = await api.user.getUserPlan()
                const slug = `${input.name.replace(/\s+/g, '-').toLowerCase()}#${Math.floor(Math.random() * 1000)}`
                const metadata = {
                    planType: userSub.data.planTier,
                    seatLimit: seatPlan(userSub.data.planTier),
                }
                const {status} = await auth.api.checkOrganizationSlug({
                    body: {
                        slug: slug, // required
                    },
                });

                if(status){
                    return {
                        message: `Organization with slug ${slug} already exists`,
                        success: false,
                        value: null
                    }
                }



                const res = await auth.api.createOrganization({
                    body: {
                        name: input.name,
                        metadata,
                        slug: slug,
                        userId: ctx.session.user.id,
                        keepCurrentActiveOrganization: true
                    },
                    headers: ctx.headers
                })

                if (!res) {
                    return {
                        message: "Failed to create organization",
                        success: false,
                        value: null
                    }
                }
                return {
                    message: "Successfully created organization",
                    success: true,
                    value: res
                }

            } catch (error) {
                console.error("Error in createOrganization:", error);
                return {
                    message: "Failed to create organization",
                    success: false,
                    value: null
                }

            }
        }),

});


function seatPlan(params: string) {
    switch (params) {
        case "Deluxe":
            return 5;
        case "Premium":
            return 30;
        default:
            return 0;
    }

}