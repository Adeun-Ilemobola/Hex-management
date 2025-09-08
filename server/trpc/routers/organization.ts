import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { auth } from "@/lib/auth";
import { MetadataT, OrganizationX, subMeta } from "@/lib/Zod";
import { sendEmail } from "@/server/actions/sendEmail";
import { rateLimit } from '../middlewares/rateLimit';
import { DateToIOS, seatPlan } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { DateTime } from "luxon";




export const organizationRouter = createTRPCRouter({

    /** 
 * getActiveMember
 * Protected query.
 * Returns the logged-in user's active organization membership if their role is "member" or "admin".
 * Response: { success: true, value: { name, email, role, organizationId, organizationSlug } } or { success: true, value: null } when not found.
 * On error: { success: false, value: null }.
 */

    getActiveMember: protectedProcedure
        .query(async ({ ctx }) => {
            try {
                console.log("-------- getActiveMember called---------");

                const memberOfOrg = await ctx.prisma.member.findFirst({
                    where: {
                        userId: ctx.session?.user.id,
                        role: {
                            in: ["member", "admin"]
                        }
                    },
                    include: {
                        organization: true,
                        user: true
                    }
                });
                if (!memberOfOrg) {
                    console.log("No active member found for user:", ctx.session?.user.id);
                    return { success: true, value: null };
                }
                if (!memberOfOrg.organization) {
                    console.log("Member found but no organization associated:", memberOfOrg);
                    return { success: true, value: null };
                }
                const member = {
                    name: memberOfOrg.user.name,
                    email: memberOfOrg.user.email,
                    role: memberOfOrg.role,
                    organizationId: memberOfOrg.organizationId,
                    organizationSlug: memberOfOrg.organization.slug
                }

                return { success: true, value: member };


            } catch (error) {
                console.error("Error in getActiveMember:", error);
                return { success: false, value: null };
            }
        }),


   /**
 * onboardUserToOrg
 * Protected, rate-limited mutation.
 * Owner/admin invites a user to an organization.
 * - If user exists: creates/resends an org invitation via auth API.
 * - If user does not exist: sends a magic-link sign-in that routes to finish onboarding for the target org/role.
 * Validates organization; returns { success, message }.
 */

    onboardUserToOrg: protectedProcedure
        .use(rateLimit())
        .input(z.object({ name: z.string(), email: z.string(), organizationId: z.string(), role: z.enum(["member", "admin", "owner"]) }))
        .mutation(async ({ input, ctx }) => {
            try {
                const userExists = await ctx.prisma.user.findUnique({
                    where: {
                        email: input.email
                    },
                    select: {
                        id: true,
                        name: true,
                    }
                });
                const org = await ctx.prisma.organization.findUnique({
                    where: {
                        id: input.organizationId
                    },
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                });
                if (!org) {
                    return { success: false, message: "Organization not found" };
                }

                if (userExists) {
                    console.log("-------------------- user exists, adding to organization --------------------");

                    const data = await auth.api.createInvitation({
                        body: {
                            email: input.email,
                            role: input.role,
                            organizationId: org.id,
                            resend: true,

                        },
                        headers: ctx.headers,
                    });

                    if (!data) {
                        return { success: false, message: `Failed to add user: ${input.email} to organization ${org.name}` };
                    }
                    // const mail = await sendEmail({
                    //     templateText: "onboardingFinished",
                    //     to: input.email,
                    //     params: {
                    //         name: userExists.name,
                    //         organizationName: org.name,
                    //         fallbackUrl: `${process.env.NEXTAUTH_URL}`,
                    //         email: input.email,
                    //         userExists: true

                    //     }
                    // })
                    // if (!mail) {
                    //     return { success: false, message: `Failed to send email to user: ${input.email}` };
                    // }
                    return { success: true, message: `Successfully invited user: ${input.email} to organization ${org.name}` };
                }
                console.log(" -------------------- user does not exist, sending invite -------------------- ");
                // user does not exist, send invite make it 
                const data = await auth.api.signInMagicLink({
                    body: {
                        email: input.email, // required
                        name: input.name,
                        callbackURL: `${process.env.NEXTAUTH_URL}/home/finish-onboarding?orgId=${org.id}&role=${input.role}`,
                        newUserCallbackURL: `${process.env.NEXTAUTH_URL}/home/finish-onboarding?orgId=${org.id}&role=${input.role}`,
                        errorCallbackURL: `${process.env.NEXTAUTH_URL}/error?error=magic_link_failed`,
                    },
                    headers: ctx.headers,
                });
                if (!data) {
                    return { success: false, message: `Failed to create magic link for  user: ${input.email} please try again` };
                }
                // const getNewUser = await ctx.prisma.user.findUnique({
                //     where: {
                //         email: input.email
                //     },
                //     select: {
                //         id: true,
                //         name: true,
                //     }
                // });
                // if (!getNewUser) {
                //     return { success: false, message: `Failed to find newly created user: ${input.email} please try again` };
                // }
                // const dataNew = await auth.api.addMember({
                //         body: {
                //             role: input.role,
                //             userId: getNewUser.id,
                //             organizationId: input.organizationId,

                //         },
                //         headers: ctx.headers
                //     })

                //     if (!dataNew) {
                //         return { success: false, message: `Failed to add user: ${input.email} to organization ${org.name}` };
                //     }
                //     const mail = await sendEmail({
                //         templateText: "onboardingFinished",
                //         to: input.email,
                //         params: {
                //             name: getNewUser.name,
                //             organizationName: org.name,
                //             fallbackUrl: `${process.env.NEXTAUTH_URL}`,
                //             email: input.email,
                //             userExists: true

                //         }
                //     })
                //     if (!mail) {
                //         return { success: false, message: `Failed to send email to user: ${input.email}` };
                //     }
                //     return { success: true, message: `Successfully added user: ${input.email} to organization ${org.name}` };

                return { success: true, message: `Successfully sent invite to user: ${input.email} to join organization ${org.name}` };


            } catch (error) {
                console.error("Error in onboardUserToOrg:", error);
                return { success: false, message: "Failed to onboard user to organization" };
            }
        }),


  /**
 * finishOnboarding
 * Protected query.
 * Completes membership for the currently signed-in user.
 * - Validates org and prevents duplicates.
 * - Adds the user to the org with the requested role via auth API.
 * - Sends a confirmation email.
 * Returns { success, message, userExists?: true }.
 */

    finishOnboarding: protectedProcedure
        .input(z.object({ organizationId: z.string(), role: z.enum(["member", "admin", "owner"]) }))
        .query(async ({ input, ctx }) => {
            try {
                if (input.organizationId.trim() === "") {
                    return { success: false, message: "Invalid data" };
                }
                const user = ctx.session?.user;
                if (!user) {
                    throw new TRPCError({ code: "UNAUTHORIZED", message: "You must be signed in" });
                }
                const org = await ctx.prisma.organization.findUnique({
                    where: {
                        id: input.organizationId
                    },
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                });
                if (!org) {
                    return { success: false, message: "Organization not found" };
                }
                const userExists = await ctx.prisma.member.findFirst({
                    where: {
                        userId: user.id,
                        organizationId: input.organizationId

                    }

                })
                if (userExists) {
                    return { success: true, userExists: true, message: `You are already a member of organization ${org.name}` };
                }

                const dataNew = await auth.api.addMember({
                    body: {
                        role: input.role,
                        userId: user.id,
                        organizationId: input.organizationId,

                    },
                    headers: ctx.headers
                })

                if (!dataNew) {
                    return { success: false, message: `Failed to add user: ${user.email} to organization ${org.name}` };
                }
                const mail = await sendEmail({
                    templateText: "onboardingFinished",
                    to: user.email,
                    params: {
                        name: user.name,
                        organizationName: org.name,
                        fallbackUrl: `${process.env.NEXTAUTH_URL}`,
                        email: user.email,
                        userExists: true

                    }
                })
                if (!mail) {
                    return { success: false, message: `Failed to send email to user: ${user.email}` };
                }
                return { success: true, message: `Successfully added user: ${user.email} to organization ${org.name}` };



            } catch (error) {
                console.error("Error in finishOnboarding:", error);
                return { success: false, message: "Failed to finish onboarding" };

            }



        }),

/**
 * getAllOrganization
 * Protected query.
 * Lists organizations where the user is an OWNER (via auth API),
 * then augments each with memberCount and parsed metadata.
 * Returns { success, message, value: OrganizationWithCounts[] }.
 */

    getAllOrganization: protectedProcedure.query(async ({ ctx }) => {
        try {
            const data = await auth.api.listOrganizations({
                query: {
                    role: "owner"
                },
                headers: ctx.headers
            });

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


   /**
 * getOrganization
 * Protected, rate-limited query.
 * Fetches full organization details (by id/slug) via auth API,
 * parses metadata, and computes daysLeft (trial vs. billing period).
 * Returns { success, message, value: OrganizationX } or null on failure.
 */

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
                const me = JSON.parse(data?.metadata || "{}") as MetadataT
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

        /**
 * createOrganization
 * Protected mutation.
 * Requires active session and subscription.
 * Enforces plan limit (max organizations), generates a unique slug,
 * verifies slug availability, then creates the organization with
 * subscription metadata and keeps it as the active org.
 * Returns { success, message, value: CreatedOrg }.
 */

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
                const orgList = await auth.api.listOrganizations({
                    headers: ctx.headers,
                    query: {
                        role: "owner"
                    }

                });
                if (userSub.limits.maxOrg <= orgList.length) {
                    return {
                        message: `You have reached the maximum number of organizations for your plan (${userSub.limits.maxOrg}). Please contact support to upgrade your plan.`,
                        success: false,
                        value: null
                    }
                }



                const slug = `${input.name.replace(/\s+/g, '-').toLowerCase()}-${Math.floor(Math.random() * 1000)}`
                const metadata: MetadataT = {
                    ...userSub,
                }

                const { status } = await auth.api.checkOrganizationSlug({
                    body: {
                        slug: slug,
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

/**
 * updateMemberRole
 * Protected mutation.
 * Updates a member in an organization:
 * - ActionType "remove": removes member and emails them.
 * - ActionType "admin" | "owner" | "member": updates role and emails them.
 * Returns { success, message }.
 */

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

/**
 * getOwnerOrganizations
 * Protected query.
 * Requires sign-in. Lists orgs where the user is OWNER,
 * computes currentSeats from Prisma and maxSeats from metadata.
 * Returns an array of summarized owner org info.
 */

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

    /**
 * getFullOrganizationInfo
 * Protected query.
 * Fetches full organization info (members, invitations, etc.) via auth API
 * and returns it with parsed metadata.
 * Returns { success, message, value: FullOrganization | null }.
 */


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


