import { Invitation, Member } from 'better-auth/plugins';
import { de } from 'date-fns/locale';
import { z } from 'zod';

import type { IncomingMessage, ServerResponse } from "http";

export type ContextInput =
  | {
      // ✅ Fetch / App Router / Edge / Webhook
      req: Request;
      res?: never;
    }
  | {
      // ✅ Node / WebSocket
      req: IncomingMessage;
      res: ServerResponse;
    }
  | undefined;


/**
 * 2) Common primitives
 */
const uuid = z.string().default("");
const dateTime = z.coerce.date();

// ─── 1. SHARED PRIMITIVES (Building Blocks) ───────────────────────────────────
// Define once, use everywhere.
const textRequired = z.string().min(1, "Required field").trim();
const emailSchema = z.string().email("Invalid email address").toLowerCase();
const passwordSchema = z.string().min(6, "Password must be 6+ chars");
const phoneSchema = z.string().min(7).regex(/^\+?[0-9\s\-]{7,15}$/, "Invalid phone format");

// ─── 2. ENUMS ────────────────────────────────────────────────────────────────
export const InvestmentTypeEnum = z.enum(["INDIVIDUAL", "POOLED", "TIC"]);
export const PropertyTypeEnum = z.enum(["House", "Apartment", "Condo", "Commercial", "Other"]);
export const SaleTypeEnum = z.enum(["SELL", "RENT", "LEASE"]);
export const StatusEnum = z.enum(["active", "pending", "sold"]);
export const PlanTierEnum = z.enum(["Free", "Deluxe", "Premium"]);
export const OwnerTypeEnum = z.enum(["USER", "ORGANIZATION"]);
export const RoomTypeEnum = z.enum(["PRIVATE", "GROUP"]);
export const RoleEnum = z.enum(["member", "admin", "owner"]) 

// ─── 3. AUTH SCHEMAS (Composition) ───────────────────────────────────────────
export const zodLoginSchema = z.object({
  email: emailSchema,
  password: z.string(), // Don't enforce min length on login, just existence
});

// Base Registration (Shared fields)
const baseRegister = z.object({
  name: textRequired,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema,
  phoneNumber: phoneSchema,
  terms: z.literal(true, {
  message: "You must accept the terms"
}),

}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Simple Register
export const zodRegisterSchema = baseRegister.safeExtend({
  country: z.string().min(2, "Country required"),
});

// Full Register (Inherits everything from base, adds address)
export const zodRegisterFullSchema = baseRegister.and(z.object({
  address: z.string().min(5),
  zipCode: z.string().min(4),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),
}));

export const UpdateUser = z.object({
  name: z.string().min(2),
  email: z.email(),
  phoneNumber: z.string(),
  address: z.string().min(5),
  zipCode: z.string().min(4),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().min(2),
});



export const Metadata = z.object({
  id: z.string().optional(),
  status: z.enum(["active", "trialing", "past_due", "canceled", "unpaid"]).or(z.string()),
  PlanTier: PlanTierEnum,
  stripeCustomerId: z.string(),
  stripeSubscriptionId: z.string(),
  userId: z.string(),
  
  // These come from the auth provider subscription object
  trialEnd: dateTime.nullable().optional(),
  periodEnd: dateTime.nullable().optional(),
  
  // This is the custom logic you added in the context
  daysLeft: z.number().min(0),
  
  // 'limits' was passed directly from activeSubscription.limits
  // You can refine 'z.any()' if you know the exact shape of your limits (e.g., maxSeats: z.number())

});

// ─── 5. SUB-SCHEMAS (Investors) ──────────────────────────────────────────────
export const externalInvestorSchema = z.object({
    id: z.string().default(""), 
    status: z.enum(["DRAFT", "FINALIZED", "LOCKED", "VERIFIED"]).default("DRAFT"),
    name: z.string().min(2),
    email: z.email(),
    investorUserId: z.string().nullable().optional(),
    contributionPercentage: z.number().min(0).max(100),
    returnPercentage: z.number().min(0).max(100),
    dollarValueReturn: z.number().nonnegative(),
    isInternal: z.boolean().default(false),
    accessRevoked: z.boolean().default(false),
    funded: z.boolean().default(false),
    fundedAt: dateTime.nullable().optional(),
    investmentBlockId: z.string().default(""),
    createdAt: dateTime.optional(),
    updatedAt: dateTime.optional(),
});
// --- 5.5. File  ---
export const FileXSchema = z.object({
    // base
    id: z.string().default(""), 
    // core fields
    type: z.enum(['image', 'video', 'document', 'audio', 'other']),
    name : z.string(),
    size : z.number().nonnegative({ message: "File size must be a non-negative number" }),
    path : z.string(),
    createdAt : dateTime,
    updatedAt : dateTime,
    tags : z.array(z.string()),
    link: z.string(),
    mime: z.string(),
    // chat fields
    chatRoomID: z.string().default(""),
    messageId : z.string().default(""),
    chatOwnerID : z.string().default(""),
});

// ─── 6. CORE DOMAIN: PROPERTY & INVESTMENT ───────────────────────────────────

export const investmentBlockSchema = z.object({
    id: z.string().default(""),
    typeOfInvestment: InvestmentTypeEnum.default("INDIVIDUAL"),
    initialInvestment: z.number().positive(),
    margin: z.number().min(0),
    typeOfSale: SaleTypeEnum.default("SELL"),
    saleDuration: z.number().int().nonnegative().default(0),
    leaseCycle: z.number().nonnegative().default(0),
    leaseType: z.string().default("Month"),
    discountPercentage: z.number().min(0).max(100).default(0),
    finalResult: z.number().default(0),
    propertyId: z.string().default(""),
    externalInvestors: z.array(externalInvestorSchema),
    depreciationYears: z.number().min(1).default(1),
  })
  .superRefine((data, ctx) => {
    // ... Your existing SuperRefine Logic (Keep this, it's good logic) ...
    // Included purely for context, keeping your logic exactly as is
    if (data.typeOfSale === "LEASE" && data.leaseCycle <= 0) {
      ctx.addIssue({ code: "custom", path: ["leaseCycle"], message: "Invalid lease cycle" });
    }
  });

export const propertySchema = z.object({
    id: z.string().default(""),
    name: z.string().min(2),
    address: z.string().min(5),
    description: z.string().max(1500).default(""),
    numBedrooms: z.number().int().min(0),
    numBathrooms: z.number().int().min(0),
    lotSize: z.number().positive(),
    yearBuilt: z.number().int().min(1800),
    squareFootage: z.number().int().positive(),
    
    // Boolean flags group
    // hasGarage: z.boolean().default(false),
    // hasGarden: z.boolean().default(false),
    // hasPool: z.boolean().default(false),
    
    amenities: z.array(z.string()).min(3),
    propertyType: PropertyTypeEnum.default("House"),
    status: StatusEnum.default("active"),
    
    // Owner Info
    ownerName: z.string().min(1 ,"You must select an owner"),
    contactInfo: z.string().min(5),
    accessCode: z.string().length(12,"Access code must generate "),
    ownerId: z.string().min(1 ,"You must select an owner"),
    ownerType: OwnerTypeEnum,

    images: z.array(FileXSchema),
    videoTourUrl: z.url().optional().nullable(),
});

// ─── 7. SUBSCRIPTION ─────────────────────────────────────────────────────────
export const subscriptionSchema = z.object({
    userId: z.string().uuid(),
    stripeCustomerId: z.string().optional(),
    stripeSubscriptionId: z.string().optional(),
    priceId: z.string().optional(),
    status: z.string().min(1),
    isActive: z.boolean().default(false),
    currentPeriodStart: z.coerce.date().optional(),
    currentPeriodEnd: z.coerce.date().optional(),
    cancelAtPeriodEnd: z.boolean().default(false),
    canceledAt: dateTime.optional(),
    planTier: PlanTierEnum,
});



// ----- ChatRoom Schema and Components -----
export const MessageSchema=
  z.object({
    id: uuid,
    roomId: uuid, // if your ChatRoom.id is uuid()
    authorId: uuid, // change to z.string() if not uuid
    text: z.string().default(""), // Prisma: String? (often returns null)
    createdAt: dateTime.default(new Date()),
    isDeleted: z.boolean().default(false),
    files: z.array(FileXSchema).default([]),
  })




export const ChatRoomMemberSchema =
z.object({
    id: uuid,
    roomId: uuid,
    userId: uuid, // change to z.string() if not uuid
    userName: z.string().min(1).trim(),
    isAdmin: z.boolean(),
    notificationCount: z.number().int().nonnegative(),
    joinedAt: dateTime,
    // room: ChatRoomSchema.optional(),
  })


export const ChatRoomSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: uuid,
    title: z.string().min(1).trim(),
    type: RoomTypeEnum,
    participants: z.array(ChatRoomMemberSchema).optional(),
    chats: z.array(MessageSchema).optional(),
  })
);


//  ----- organization Schema and Components -----
export const onboardingSchema = z.object({
   name: z.string(),
    email: z.string(), 
    organizationId: z.string(), 
    role: RoleEnum,
  
})




// ─── 8. TYPES ────────────────────────────────────────────────────────────────
export type UserInput = z.infer<typeof zodRegisterFullSchema>;
// export type ImageInput = z.infer<typeof imageSchema>;
export type MetadataT = z.infer<typeof Metadata>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type InvestmentBlockInput = z.infer<typeof investmentBlockSchema>;
export type ExternalInvestorInput = z.infer<typeof externalInvestorSchema>;
export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
export type FileXInput = z.infer<typeof FileXSchema>;
export type ChatRoom = z.infer<typeof ChatRoomSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type ChatRoomMember = z.infer<typeof ChatRoomMemberSchema>;
export type updateUser = z.infer<typeof UpdateUser>;
export type Onboarding = z.infer<typeof onboardingSchema>;


export interface CleanProperty {
    id: string;
    img?: string;
    name: string;
    address: string;
    status: string;
    saleStatus: string;
}

export interface MemberX extends Member  {
  email: string;
  name: string;
  
}
export type OrganizationInfoFull = {
  members: MemberX[];
    invitations: Invitation[];
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    logo?: string | null;
    metadata?: any;
}
export type OrgList ={
  name: string;
    slug: string;
    id: string;
    logo: string | null | undefined;
    createdAt: Date;
    currentSeats: number;
}

export interface CleanExternalInvestor {
    id: string;
    status: string;
    name: string;
    email: string;
}

export const defaultUpdateUser: updateUser = {
  name: "",
  email: "",
  phoneNumber:"",
  address: "",
  zipCode: "",
  city: "",
  state: "",
  country: "",

  
}

export const defaultOnboarding: Onboarding = {
  name: "",
  email: "",
  organizationId: "",
  role: "member",
  
}

export const defaultExternalInvestorInput = {
  id: "",
  status: "DRAFT" as const, // defined in schema
  name: "",
  email: "",
  investorUserId: null, // nullable in schema
  contributionPercentage: 0,
  returnPercentage: 0,
  dollarValueReturn: 0,
  isInternal: false, // defined in schema
  accessRevoked: false, // defined in schema
  funded: false, // defined in schema
  fundedAt: null, // nullable in schema
  investmentBlockId: "", // defined in schema
};



// If you really need a default object for React State:
export const defaultPropertyInput: PropertyInput = {
    id: "",
  name: "", 
  address: "",
  description: "",
  numBedrooms: 0,
  numBathrooms: 0,
  lotSize: 1, // Using 1 to avoid 'positive' checks if you have them, or 0 if allowed
  yearBuilt: new Date().getFullYear(),
  squareFootage: 1,
  
  // Boolean flags
  // hasGarage: false,
  // hasGarden: false,
  // hasPool: false,
  
  amenities: [],
  propertyType: "House", // Must match your PropertyTypeEnum default
  status: "active",      // Must match your StatusEnum default
  
  // Owner Info
  ownerName: "",
  contactInfo: "",
  accessCode: "", // Needs to be length 12 based on your schema
  ownerId: "",
  ownerType: "ORGANIZATION", // Must match OwnerTypeEnum
  
  images: [],
  videoTourUrl: null
};

export const defaultInvestmentBlockInput: InvestmentBlockInput = {
  id: "",
  typeOfInvestment: "INDIVIDUAL",
  initialInvestment: 1, // Must be positive
  margin: 0,
  typeOfSale: "SELL",
  saleDuration: 0,
  leaseCycle: 0,
  leaseType: "Month",
  discountPercentage: 0,
  finalResult: 0,
  propertyId: "",
  externalInvestors: [],
  depreciationYears: 1
    
};

export const defaultMessageInput: Message = {
   id: "", 
  roomId: "",
  authorId: "",
  text: "",
  createdAt: new Date(),
  isDeleted: false,
  files: []
};

export const defaultChatRoomMemberInput: ChatRoomMember = {
   id: "",
  roomId: "",
  userId: "",
  userName: "",
  isAdmin: false,
  notificationCount: 0,
  joinedAt: new Date()
};

export const defaultChatRoomInput: ChatRoom = {
    id: "",
  title: "",
  type: "PRIVATE", // Match RoomTypeEnum
  participants: [],
  chats: []
};