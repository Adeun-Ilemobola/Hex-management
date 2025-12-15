import { z } from 'zod';

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

// ─── 4. IMAGE & MEDIA ────────────────────────────────────────────────────────
// export const imageSchema = z.object({
//   id: z.string().default(""),
//   name: z.string().min(1),
//   url: z.string().url(),
//   size: z.number().int().nonnegative(),
//   type: z.string().min(1),
//   lastModified: z.bigint().or(z.number().transform(n => BigInt(n))), // Handle potential number inputs
//   thumbnail: z.boolean().default(false),
//   supabaseID: z.string().default(""),
// });


export const Metadata = z.object({
  id: z.string().optional(),
  status: z.enum(["active", "trialing", "past_due", "canceled", "unpaid"]).or(z.string()),
  PlanTier: PlanTierEnum,
  stripeCustomerId: z.string(),
  userId: z.string(),
  
  // These come from the auth provider subscription object
  trialEnd: z.date().nullable().optional(),
  periodEnd: z.date().nullable().optional(),
  
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
    email: z.string().email(),
    investorUserId: z.string().nullable().optional(),
    contributionPercentage: z.number().min(0).max(100),
    returnPercentage: z.number().min(0).max(100),
    dollarValueReturn: z.number().nonnegative(),
    isInternal: z.boolean().default(false),
    accessRevoked: z.boolean().default(false),
    funded: z.boolean().default(false),
    fundedAt: z.coerce.date().nullable().optional(),
    investmentBlockId: z.string().default(""),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
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
    createdAt : z.coerce.date(),
    updatedAt : z.coerce.date(),
    tags : z.array(z.string()),
    link: z.string(),
    mime: z.string(),
    // chat fields
    chatRoomID: z.string().optional(),
    messageId : z.string().optional(),
    chatOwnerID : z.string().optional(),
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
    ownerName: z.string().min(2),
    contactInfo: z.string().min(5),
    accessCode: z.string().length(12),
    ownerId: z.string(),
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
    canceledAt: z.coerce.date().optional(),
    planTier: PlanTierEnum,
});



// ----- ChatRoom Schema and Components -----
export const MessageSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: uuid,
    roomId: uuid, // if your ChatRoom.id is uuid()
    authorId: uuid, // change to z.string() if not uuid
    text: z.string().nullable().optional(), // Prisma: String? (often returns null)
    createdAt: dateTime,
    isDeleted: z.boolean(),
    files: z.array(FileXSchema),
  })
);

export const ChatRoomMemberSchema: z.ZodType<any> = z.lazy(() =>
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
);

export const ChatRoomSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: uuid,
    title: z.string().min(1).trim(),
    type: RoomTypeEnum,
    participants: z.array(ChatRoomMemberSchema).optional(),
    chats: z.array(MessageSchema).optional(),
  })
);




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


export interface CleanProperty {
    id: string;
    img?: string;
    name: string;
    address: string;
    status: string;
    saleStatus: string;
}



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
  ownerName: "sdfsdfsdfsdfsdfsdfsdfsdf",
  contactInfo: "sdfsdfsdfsdfsdfsdfsdfsdf",
  accessCode: "", // Needs to be length 12 based on your schema
  ownerId: "34534534534534534535345",
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