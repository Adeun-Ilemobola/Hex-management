import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { DateTime } from "luxon";

export interface PlanResult {
    success: boolean;
    data: {
        planTier: string;
        isActive: boolean;
        daysLeft: number | null;
        userId: string;
    };
}
export interface PlanResultFull {
    success: boolean;
    data: {
        planTier: string;
        isActive: boolean;
        daysLeft: number | null;
        organizationList?: userOrgMembershipPayload[];
    };
}

export interface OrganizationMetadata {
    planType: string;
    seatLimit: number;
    isExpired: boolean
}
export interface userOrgMembershipPayload {
    organizationId: string | null;
    role: string;
    isExpired: boolean;
}


async function UpdateOrganization(ownerId: string, isExpired: boolean, planType: string) {
    const ownerOrganizations = await prisma.member.findMany({
        where: {
            userId: ownerId,
            role: "owner"
        },
        select: {
            organizationId: true
        }

    })
    await Promise.all(ownerOrganizations.map(async (org) => {
        const metadata: OrganizationMetadata = {
            planType,
            seatLimit: seatPlan(planType),
            isExpired
        };
        await prisma.organization.update({
            where: {
                id: org.organizationId
            },
            data: {
                metadata: JSON.stringify(metadata)
            }
        })
    }))


}

async function fetchUserPlan(userId: string): Promise<PlanResult> {
    try {
        const isActive = await prisma.subscription.findFirst({
            where: {
                userId: userId,
            },

        })
        const daysLeft = isActive?.currentPeriodEnd ? DateTime.fromJSDate(isActive.currentPeriodEnd).diffNow("days").days : null;
        const isExpired = (daysLeft !== null) ? (daysLeft <= 0) : true;

        if (isExpired && isActive?.nextStripeSubscriptionId) {
            const stripeSub = await stripe.subscriptions.retrieve(isActive.nextStripeSubscriptionId);
            const item = stripeSub.items.data[0];
            const {
                id,
                createdAt,
                updatedAt,
                ...archivableData
            } = isActive;

            await prisma.subscriptionArchives.create({
                data: {
                    userId: userId,
                    Subscriptions: {
                        create: {
                            ...archivableData
                        },
                    }
                },
            });
            await prisma.subscription.delete({
                where: {
                    id: isActive.id,
                },

            })
            const subName = item.price.id === "price_1ResTb2c20NQVeDjj0lmeLk1" ? "Deluxe" : "Premium";


            const paidSub = await prisma.subscription.create({
                data: {
                    userId: userId,
                    status: stripeSub.status,
                    isActive: stripeSub.status === "active",
                    // update the new period end if it changed
                    currentPeriodEnd: new Date(item.current_period_end * 1000),
                    // if you want to update the start too:
                    currentPeriodStart: new Date(item.current_period_start * 1000),
                    cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
                    canceledAt: stripeSub.canceled_at
                        ? new Date(stripeSub.canceled_at * 1000)
                        : null,

                    stripeSubscriptionId: stripeSub.id,
                    planTier: subName,
                    priceId: item.price.id,
                    stripeCustomerId: stripeSub.customer as string
                },
            });


            return {
                success: true,
                data: {
                    planTier: subName,
                    isActive: paidSub.status === "active",
                    daysLeft: daysLeft,
                    userId
                }
            }



        }

        else if (isExpired && isActive && !isActive?.nextStripeSubscriptionId) {
            const {
                id,
                createdAt,
                updatedAt,
                ...archivableData
            } = isActive;

            await prisma.subscriptionArchives.create({
                data: {
                    userId: userId,
                    Subscriptions: {
                        create: {
                            ...archivableData
                        },
                    }
                },
            });
            await prisma.subscription.delete({
                where: {
                    id: isActive.id,
                },

            })

            const freeSub = await prisma.subscription.create({
                data: {
                    userId: userId,
                    status: "active",
                    isActive: true,
                    currentPeriodEnd: null,
                    currentPeriodStart: null,
                    cancelAtPeriodEnd: false,
                    canceledAt: null,
                    stripeSubscriptionId: null,
                    planTier: "Free",
                    priceId: null,
                    stripeCustomerId: null
                },
            });
            await UpdateOrganization(userId, isExpired, freeSub.planTier);


            return {
                success: true,
                data: {
                    planTier: "Free",
                    isActive: freeSub.isActive,
                    daysLeft: null,
                    userId
                }
            }



        }

        await UpdateOrganization(userId, isExpired, isActive?.planTier || "Free");

        return {
            success: true,
            data: {
                planTier: isActive?.planTier || "Free",
                isActive: isActive?.isActive || false,
                daysLeft: daysLeft,
                userId
            }
        }


    } catch (error) {
        console.error("Error in getUserPlan:", error);
        return {
            success: false, data: {
                planTier: "Free",
                isActive: false,
                daysLeft: null,
                userId

            }
        }
    }

}



export async function fetchUserPlanFull(userId: string): Promise<PlanResultFull> {
    try {
        const usePlan = await fetchUserPlan(userId);
        const fetchMemberOfOganization = await prisma.member.findMany({
            where: {
                userId: userId
            }

        })

        const userOrgMembership: userOrgMembershipPayload[] = await Promise.all(
            fetchMemberOfOganization.map(async (member) => {
                const org = await prisma.organization.findFirst({
                    where: {
                        id: member.organizationId
                    }
                })
                if (!org) return {
                    organizationId: null,
                    role: member.role,
                    isExpired: true
                };
                const metadata = JSON.parse(org.metadata || "null") as {
                    planType: string;
                    seatLimit: number;
                    isExpired: boolean
                } | null;
                return {
                    organizationId: org.id,
                    role: member.role,
                    isExpired: metadata?.isExpired || true
                }
            })
        )



        return {
            success: true, data: {
                ...usePlan.data,
                organizationList: userOrgMembership,

            }
        }



    } catch (error) {
        console.log(error);
        return {
            success: false, data: {
                planTier: "Free",
                isActive: false,
                daysLeft: null,
                organizationList: []
            }
        }

    }
}

export type FinalPlanResultFull = {
    planTier: string;
    isActive: boolean;
    daysLeft: number | null;
    inOrganization: {
        name: string;
        id: string;
        role: string;
    } | null;
}


export async function Final(userId: string): Promise<FinalPlanResultFull> {
    try {
        const { data: logedUserPlan } = await fetchUserPlan(userId);
        const userInOrg = await prisma.member.findFirst({
            where: {
                userId: logedUserPlan.userId,
               
            },
            select: {
                organizationId: true,
                userId: true,
                role: true,
                organization: {
                    select: {
                        id: true,
                        name: true,
                        metadata: true
                    }
                }
            }
        })

        if (!userInOrg) {
            return {

                planTier: logedUserPlan.planTier,
                isActive: logedUserPlan.isActive,
                daysLeft: logedUserPlan.daysLeft,
                inOrganization: null

            }
        }

        const metadata = JSON.parse(userInOrg.organization.metadata || "{}") as OrganizationMetadata;

        return {

            planTier: metadata.planType,
            isActive: (metadata.planType !== "Free"),
            daysLeft: logedUserPlan.daysLeft,
            inOrganization: {
                name: userInOrg.organization.name,
                id: userInOrg.organization.id,
                role: userInOrg.role
                
            }

        }
    } catch (error) {
        console.log(error);
        return {

            planTier: "Free",
            isActive: false,
            daysLeft: null,
            inOrganization: null

        }

    }
}

export function seatPlan(planType: string): number {
  switch (planType) {
    case 'Premium': return 50;
    case 'Deluxe': return 15;
    case 'Free':
    default: return 3;
  }
}
