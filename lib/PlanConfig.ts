// config/plans.ts

export type PlanTier = 'Free' | 'Premium' | 'Deluxe';


type PlanConfig = {
    maxMembersPerOrg: number;
    canRemoveBranding: boolean;
    maxInvestors: number;
    maxOrgs: number;
    maxProjects: number;
    maxImagesPerProject: number;
    maxChatRooms: number;
}

export const PLANS: Record<PlanTier, PlanConfig> = {
  Free: {
    maxMembersPerOrg: 3,
    canRemoveBranding: false,
    maxInvestors: 0,
    maxOrgs: 1,
    maxProjects: 5,
    maxImagesPerProject: 5,
    maxChatRooms: 5
   
  },
  Premium: {
    maxMembersPerOrg: 10,
    canRemoveBranding: false,
    maxInvestors: 10,
    maxOrgs: 3,
    maxProjects: 10,
    maxImagesPerProject: 10,
    maxChatRooms: 100
  },
  Deluxe: {
    maxMembersPerOrg: 15,
    canRemoveBranding: true,
    maxInvestors: 15,
    maxOrgs: 5,
    maxProjects: 15,
    maxImagesPerProject: 15,
    maxChatRooms: 15
  },
};

// Inside your schema or types
export type OrgMetadata = {
  // 1. The current Tier (The "State")
  planTier: PlanTier; 
  // 3. The Stripe Customer ID (Who pays for this?)
  stripeCustomerId?: string;
  userId: string;
}
export const getPlanLimits = (tier: PlanTier) => PLANS[tier];