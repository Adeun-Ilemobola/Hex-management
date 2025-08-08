import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { auth } from "@/lib/auth";
import { OrganizationMetadata } from "@/server/actions/subscriptionService";
import { sendEmail } from "@/server/actions/sendEmail";
import { XOrganization } from "@/components/(organizationFragments)/organizationDashbord";



export const organizationRouter = createTRPCRouter({

    onboardUserToOrg: protectedProcedure.input(z.object({ name: z.string(), email: z.string(), organizationId: z.string() }))
        .mutation(async ({ input, ctx }) => {
            try {
                const newUserbody = {
                    name: input.name,
                    email: input.email,
                    password: `${input.name}${Math.floor(Math.random() * 1000)}`,
                }
                const { response } = await auth.api.signUpEmail({
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
                const newEmailSend = await sendEmail({
                    templateText: "onboardingFinished",
                    to: input.email,
                    params: {
                        name: input.name,
                        organizationName: input.name,
                        email: input.email,
                        tempPassword: newUserbody.password,
                        fallbackUrl: `${process.env.NEXTAUTH_URL}/login`
                    }
                })
                if (!newEmailSend.success) {
                    console.error("Failed to send onboarding email:", newEmailSend.error);
                    return {
                        message: "Failed to send onboarding email",
                        success: false,
                        value: null
                    }
                }
                return {
                    message: "Successfully onboarded user",
                    success: true,
                    value: res
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

    getAllOrganization: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const data = await auth.api.listOrganizations({ headers: ctx.headers });
                console.log(data);

                const organizations = await Promise.all(
                    data.map(async (org) => {
                        const members = await ctx.prisma.member.count({
                            where: {
                                organizationId: org.id
                            }
                        })
                        return {
                            ...org,
                            memberCount: members,
                            metadata: JSON.parse(org.metadata) as OrganizationMetadata
                        }
                    })
                )

                return {
                    message: "Successfully got user organizations",
                    success: true,
                    value: organizations
                }
            } catch (error) {
                console.error("Error in getUserOrganizations:", error);
                return {
                    message: "Failed to get user organizations",
                    success: false,
                    value: []
                }
            }
        }),


    getOrganization: protectedProcedure
        .input(z.object({ id: z.string(), slug: z.string() }))
        .query(async ({ input, ctx }) => {
           try {
            console.log(input);
            
             const data = await auth.api.getFullOrganization({
                query: {
                    organizationId: input.id,
                    organizationSlug: input.slug,
                },
                headers: ctx.headers
            });

            if (!data) {
                console.error("Failed to get organization"  ,data );
                return {
                    message: "Failed to get organization",
                    success: false,
                    value: null
                }
            }
            const fullData:XOrganization = {
                metadata: JSON.parse(data?.metadata || "{}") as OrganizationMetadata,
                id: data.id,
                name: data.name,
                slug: data.slug,
                logo: data.logo,
                createdAt: data.createdAt,
                invitations: data.invitations,
                members: data.members,
                
            }
            console.log("fullData ====", fullData);
            

            return {
                message: "Successfully got organization",
                success: true,
                value: fullData
            }
            
           } catch (error) {
            console.log("Error in getOrganization:", error);
            return {
                message: "Failed to get organization",
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
                const userSub = ctx.plan
                const slug = `${input.name.replace(/\s+/g, '-').toLowerCase()}-${Math.floor(Math.random() * 1000)}`
                const metadata = {
                    planType: userSub.data.planTier,
                    seatLimit: seatPlan(userSub.data.planTier),
                    isExpired: (ctx.plan.data.daysLeft || 0) <= 0
                }
                console.log({
                    userSub,
                    metadata,
                    slug
                });

                const { status } = await auth.api.checkOrganizationSlug({
                    body: {
                        slug: slug, // required
                    },
                });

                if (!status) {
                    console.log("Organization with slug already exists");

                    return {
                        message: `Organization with slug ${slug} already exists`,
                        success: false,
                        value: null
                    }
                }

                console.log("Organization with slug does not exist" + status);

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
                    console.log("Failed to create organization");

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