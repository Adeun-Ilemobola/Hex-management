import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { auth } from "@/lib/auth";
import {  OrganizationX, subMeta } from "@/lib/Zod";
import { sendEmail } from "@/server/actions/sendEmail";
import { rateLimit } from '../middlewares/rateLimit';
import { DateToIOS, seatPlan } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { DateTime } from "luxon";
import { nanoid } from "nanoid";
import { fa } from "zod/v4/locales";



export const organizationRouter = createTRPCRouter({


    getActiveMember: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                const member = await auth.api.getActiveMember({
                    // This endpoint requires session cookies.
                    headers: ctx.headers,
                });
                return { success: true, value: member };
            } catch (error) {
                console.error("Error in getActiveMember:", error);
                return { success: false, value: null };
            }
        }),

    onboardUserToOrg: protectedProcedure
        .use(rateLimit())
        .input(z.object({ name: z.string(), email: z.string(), organizationId: z.string(), role: z.enum(["member", "admin", "owner"]) }))
        .mutation(async ({ input, ctx }) => {
            let newUserId: string | null = null
            try {
                let userExistsId = ""
                const newUserbody = {
                    name: input.name,
                    email: input.email,
                    password: `${input.name}${nanoid(8)}`,
                }

                const userExists = await ctx.prisma.user.findUnique({ where: { email: input.email } })
                if (userExists) {
                    userExistsId = userExists.id
                } else {


                    const { response } = await auth.api.signUpEmail({
                        returnHeaders: true,
                        body: newUserbody,
                    })
                    const { user } = response;
                    newUserId = user.id
                }
                console.log({
                    input,
                    userExistsId,
                    newUserId
                });


                const res = await auth.api.addMember({
                    body: {
                        userId: newUserId ?? userExistsId,
                        organizationId: input.organizationId,
                        role: input.role
                    },
                    headers: ctx.headers
                })

                if (!res) {
                    if (newUserId) {
                        await ctx.prisma.user.delete({ where: { id: newUserId } })
                    }
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
                        userExists: newUserId ? false : true
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
                if (newUserId) {
                    await ctx.prisma.user.delete({ where: { id: newUserId } })
                }
                return {
                    message: "Failed to complete onboarding",
                    success: false,
                    value: null
                }

            }
        }),

    getAllOrganization: protectedProcedure.query(async ({ ctx }) => {
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
                        metadata: JSON.parse(org.metadata) as subMeta
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
                const me = JSON.parse(data?.metadata || "{}") as subMeta
                const trialEnd = DateTime.fromISO(DateToIOS(me.trialEnd) || DateTime.local().toISO()).diffNow("days").as("days")
                const periodEnd = DateTime.fromISO(DateToIOS(me.periodEnd) || DateTime.local().toISO()).diffNow("days").as('days')
                const daysLeft = me.status === "trialing" ? trialEnd : periodEnd
                const fullData: OrganizationX = {
                    metadata: {
                        ...me,
                        daysLeft: Math.max(0, Math.ceil(daysLeft))
                    },
                    id: data.id,
                    name: data.name,
                    slug: data.slug,
                    logo: data.logo,
                    createdAt: data.createdAt,
                    invitations: data.invitations,
                    members: data.members,

                }
                console.log("DateTime ====", {
                    trialEnd,
                    periodEnd,
                    daysLeft
                });

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
                const userSub = ctx.subscription
                if (!userSub) {
                    return {
                        message: " you are not subscribed to any plan",
                        success: false,
                        value: null
                    }
                }
                const slug = `${input.name.replace(/\s+/g, '-').toLowerCase()}-${Math.floor(Math.random() * 1000)}`
                const metadata: subMeta = {
                    ...userSub,
                }


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
    }),


    getOwnerOrganizations: protectedProcedure.query(async ({ ctx }) => {
        try {
            const user = ctx.session?.user;
            if (!user) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be signed in" });
            }
            const useOrg = await auth.api.listOrganizations({
                headers: ctx.headers,
                query: {
                    role: "owner"
                }

            });


            const fullOrgInfo = await Promise.all(
                useOrg.map(async (org) => {
                    const allMembers = await ctx.prisma.member.count({
                        where: {
                            organizationId: org.id
                        }
                    })
                    const Meta = JSON.parse(org.metadata || "{}") as subMeta

                    return {
                        name: org.name,
                        slug: org.slug,
                        id: org.id,
                        logo: org.logo,
                        createdAt: org.createdAt,
                        currentSeats: allMembers,
                        maxSeats: Meta.limits?.orgMembers || 0
                    }
                })
            )

            return fullOrgInfo

        } catch (error) {
            console.error("Error in getOwnerOrganizations:", error);
            return []

        }

    }),

    getFullOrganizationInfo: protectedProcedure.input(z.object({
        organizationId: z.string(),
    })).query(async ({ input, ctx }) => {
        try {
            const data = await auth.api.getFullOrganization({
                query: {
                    organizationId: "org-id",
                    organizationSlug: "org-slug",
                    membersLimit: 100,
                },
                headers: ctx.headers,
            });
            if (!data) {
                console.error("Failed to fetch organization info");
                return {
                    message: "Failed to fetch organization info",
                    success: false,
                    value: null
                }
            }

            return {
                message: "Successfully fetched organization info",
                success: true,
                value: {
                    ...data,
                    metadata: JSON.parse(data.metadata || "{}") as subMeta

                }
            }






        } catch (error) {
            console.error("Error in getFullOrganizationInfo:", error);
            return {
                message: "Failed to fetch organization info",
                success: false,
                value: null
            }
        }
    }),



});


