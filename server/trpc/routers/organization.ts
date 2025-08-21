import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { auth } from "@/lib/auth";
import { OrganizationMetadata } from "@/server/actions/subscriptionService";
import { sendEmail } from "@/server/actions/sendEmail";
import { XOrganization } from "@/components/(organizationFragments)/organizationDashbord";
import { rateLimit } from '../middlewares/rateLimit';
import { seatPlan } from "@/lib/utils";



export const organizationRouter = createTRPCRouter({

    onboardUserToOrg: protectedProcedure
    .use(rateLimit())
    .input(z.object({ name: z.string(), email: z.string(), organizationId: z.string(), role: z.enum(["member", "admin", "owner"]) }))
        .mutation(async ({ input, ctx }) => {
            try {
                let userId = ""
                const newUserbody = {
                    name: input.name,
                    email: input.email,
                    password: `${input.name}${Math.floor(Math.random() * 1000)}`,
                }
                const userExists = await ctx.prisma.user.findUnique({ where: { email: input.email } })
                if (userExists) {
                    userId = userExists.id
                } else {
                    const { response } = await auth.api.signUpEmail({
                        returnHeaders: true,
                        body: newUserbody,
                    })
                    const { user } = response;
                    userId = user.id
                }

                const res = await auth.api.addMember({
                    body: {
                        userId: userId,
                        organizationId: input.organizationId,
                        role: input.role
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
                        fallbackUrl: `${process.env.NEXTAUTH_URL}/login`,
                        userExists: !!userExists
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
     .use(rateLimit())
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
                    console.error("Failed to get organization", data);
                    return {
                        message: "Failed to get organization",
                        success: false,
                        value: null
                    }
                }
                const fullData: XOrganization = {
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
                    planType: userSub.planTier,
                    seatLimit: seatPlan(userSub.planTier),
                    isExpired: userSub.daysLeft ? userSub.daysLeft <= 0 : true
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


    updateMemberRole: protectedProcedure.input(z.object({
        organizationId: z.string(),
        memberId: z.string(),
        memberName: z.string(),
        ActionType: z.enum(["admin", "remove", "owner", "member"]),
        organizationName: z.string(),
        memberEmail: z.string(),
    })).mutation(async ({ input, ctx }) => {
        try {
            console.log("Updating member role:", input);

            if (input.ActionType === "remove") {
                const data = await auth.api.removeMember({
                    body: {
                        memberIdOrEmail: input.memberId, // required
                        organizationId: input.organizationId,
                    },
                    headers: ctx.headers
                });
                if (!data) {
                    console.error("Failed to remove member from organization");
                    return {
                        message: "Failed to remove member from organization",
                        success: false,
                    }
                }
                await sendEmail({
                    templateText: "memberRemovedEmail",
                    to: input.memberEmail,
                    params: {
                        member: input.memberName,
                        organizationName: input.organizationName
                    }
                })
                return {
                    message: "Successfully removed member from organization",
                    success: true,
                }
            }
            else if (input.ActionType === "admin" || input.ActionType === "owner" || input.ActionType === "member") {
               const dataRole = await auth.api.updateMemberRole({
                    body: {
                        role: input.ActionType,
                        memberId: input.memberId,
                        organizationId: input.organizationId,
                    },
                    headers: ctx.headers
                });
                if (!dataRole) {
                    console.error("Failed to update member role");
                    return {
                        message: "Failed to update member role",
                        success: false,
                    }
                }
                await sendEmail({
                    templateText: "memberRoleChangedEmail",
                    to: input.memberEmail,
                    params: {
                        member: input.memberName,
                        organizationName: input.organizationName,
                        memberRole: dataRole.role
                    }
                });
                console.log("Member role updated successfully:", dataRole);
            }
            return {
                message: "Successfully updated member role",
                success: true,
            }

        } catch (error) {
            console.error("Error in updateMemberRole:", error);
            return {
                message: "Failed to update member role",
                success: false,

            }

        }
    })

});


