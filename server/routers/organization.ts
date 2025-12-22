import { z } from "zod";
import { createTRPCRouter, protectedProcedure, t } from "../init";
import { auth } from "@/lib/auth";
import { MemberX, MetadataT, OwnerTypeEnum } from "@/lib/ZodObject";
import { sendEmail } from "../sendEmail";

import { TRPCError } from "@trpc/server";
import { getPlanLimits } from "@/lib/PlanConfig";
import { th } from "date-fns/locale";
import { log } from "console";




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

    onboardNewMember: protectedProcedure
        // .use(rateLimit())
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
                const organization = await ctx.prisma.organization.findUnique({
                    where: {
                        id: input.organizationId
                    },
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                });
                if (!organization) {
                   throw new TRPCError({ code: "NOT_FOUND", message: "Organization not found" });
                }

                if (userExists) {
                    console.log("-------------------- user exists, adding to organization --------------------");

                    await auth.api.createInvitation({
                        body: {
                            email: input.email,
                            role: input.role,
                            organizationId: organization.id,
                            resend: true,

                        },
                        headers: ctx.headers,
                    });

                    await sendEmail({
                        templateText: "onboardingFinished",
                        to: input.email,
                        params: {
                            name: userExists.name,
                            organizationName: organization.name,
                            fallbackUrl: `${process.env.NEXTAUTH_URL}`,
                            email: input.email,
                            userExists: true

                        }
                    })
                    
                    return { success: true, message: `Successfully invited user: ${input.email} to organization ${organization.name}` };
                }
                log("user does not exist, sending magic link");
                //  usser does not exist, send magic link to create account
                const data = await auth.api.signInMagicLink({
                    body: {
                        email: input.email, // required
                        name: input.name,
                        callbackURL: `${process.env.NEXTAUTH_URL}/home/finish-onboarding?orgId=${organization.id}&role=${input.role}`,
                        newUserCallbackURL: `${process.env.NEXTAUTH_URL}/home/finish-onboarding?orgId=${organization.id}&role=${input.role}`,
                        errorCallbackURL: `${process.env.NEXTAUTH_URL}/error?error=magic_link_failed`,
                    },
                    headers: ctx.headers,
                });
                if (!data) {
                    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to send magic link" });
                }
               

                return { success: true, message: `Successfully sent invite to user: ${input.email} to join organization ${organization.name}` };


            } catch (error) {
                console.error("Error in onboardUserToOrg:", error);
              throw new  TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to invite user with this  error: " + error  });
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
                        metadata: JSON.parse(org.metadata) as MetadataT
                    }
                })
            )
            const listOfOwners = [
                ...organizations.map((org) => ({
                    id: org.id,
                    name: org.name  ,
                    type: "ORGANIZATION" as z.infer<typeof OwnerTypeEnum>,
                    selected: false
                })),
                {
                    id: ctx.session?.user.id || "",
                    name: ctx.session?.user.name || "",
                    type: "USER" as z.infer<typeof OwnerTypeEnum>,
                    selected: false
                }
            ]



            return {
                message: "Successfully got user organizations",
                success: true,
                value: listOfOwners
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
        // .use(rateLimit())
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
                const orgMeta = JSON.parse(data?.metadata || {}) as MetadataT

                const fullData = {
                    metadata: {
                        ...orgMeta
                    },
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
                    throw new TRPCError({ code: "UNAUTHORIZED" , message: "You must be logged in to create an organization." })
                }
                const userPlan = ctx.subscription
                const getPlan = getPlanLimits(userPlan.PlanTier)
                const orgList = await auth.api.listOrganizations({
                    headers: ctx.headers,
                    query: {
                        role: "owner"
                    }

                });

                if (getPlan.maxOrgs <= orgList.length) {
                   throw new TRPCError({ code: "UNAUTHORIZED" , message: "You have reached your organization limit." })
                }
                let slug = `${input.name.replace(/\s+/g, '-').toLowerCase()}-${Math.floor(Math.random() * 1000)}`

                const  maxCheck = 5
                for (let i = 0; i < maxCheck; i++) {
                    const { status } = await auth.api.checkOrganizationSlug({
                        body: {
                            slug: slug,
                        },
                    });
                    if (status ) {
                        break;
                    }
                    slug = `${input.name.replace(/\s+/g, '-').toLowerCase()}-${Math.floor(Math.random() * 1000)}`
                }
              

                const newOrg = await auth.api.createOrganization({
                    body: {
                        name: input.name,
                        slug: slug,
                        userId: ctx.session.user.id,
                        keepCurrentActiveOrganization: true
                    },
                    headers: ctx.headers
                })

                if (!newOrg) {
                   throw new TRPCError({ code: "UNAUTHORIZED" , message: "Failed to create organization" })
                }
               

                return {
                    message: "Successfully created organization",
                    success: true,
                    value: newOrg
                }

            } catch (error) {
                console.error("Error in createOrganization:", error);
               throw new TRPCError({ code: "UNAUTHORIZED" , message: "Failed to create organization" })

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
        memberEmail: z.string(),
        memberName: z.string(),
        ActionType: z.enum(["admin", "remove", "owner", "member"]),
        organizationName: z.string(),
        memberId: z.string(),
    })).mutation(async ({ input, ctx }) => {
        try {
            console.log("Updating member role:", input);

            if (input.ActionType === "remove") {
                const data = await auth.api.removeMember({
                    body: {
                        memberIdOrEmail: input.memberEmail, 
                        organizationId: input.organizationId,
                    },
                    headers: ctx.headers
                });
                if (!data) {
                   throw new TRPCError({ code: "UNAUTHORIZED" , message: "Failed to remove member" })
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
            else if (input.ActionType === "admin" || input.ActionType === "member") {
                const dataRole = await auth.api.updateMemberRole({
                    body: {
                        role: input.ActionType,
                        memberId: input.memberId,
                        organizationId: input.organizationId,
                    },
                    headers: ctx.headers
                });
               
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
            throw new TRPCError({ code: "UNAUTHORIZED" , message: "Failed to update member role" })

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
                    const orgMembersCount = await ctx.prisma.member.count({
                        where: {
                            organizationId: org.id
                        }
                    })

                    return {
                        name: org.name,
                        slug: org.slug,
                        id: org.id,
                        logo: org.logo,
                        createdAt: org.createdAt,
                        currentSeats: orgMembersCount,
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


    OrganizationInfo: protectedProcedure.input(z.object({
        organizationId: z.string(),
        organizationSlug: z.string(),
    })).query(async ({ input, ctx }) => {
        try {
            const data = await auth.api.getFullOrganization({
                query: {
                    organizationId: input.organizationId,
                    organizationSlug: input.organizationSlug,
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
            


            const updatedMembers:MemberX[] = await Promise.all(data.members.map(async(member) => {
                const updatedMember =  await ctx.prisma.member.findFirst({
                    where: {
                        userId: member.userId
                    },
                    select: {
                        user: {
                            select: {
                                name: true,
                                email: true
                            }
                        }

                    }
                })
               
                return {
                    ...member,
                    name: updatedMember?.user?.name || 'unknown',
                    email: updatedMember?.user?.email || 'unknown'

                };
                
            }))



            return {
                message: "Successfully fetched organization info",
                success: true,
                value: {
                    ...data,
                    members: updatedMembers
                }
            }






        } catch (error) {
            console.error("Error in getFullOrganizationInfo:", error);
           throw new TRPCError({ code: "UNAUTHORIZED", message: "Failed to fetch organization info" })
        }
    }),



});


