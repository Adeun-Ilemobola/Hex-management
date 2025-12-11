import { z } from 'zod';

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
export const zodRegisterSchema = baseRegister.extend({
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
    id: z.string().default(""), 
    type: z.enum(['image', 'video', 'document', 'audio', 'other']),
    name : z.string(),
    size : z.number().nonnegative({ message: "File size must be a non-negative number" }),
    path : z.string(),
    createdAt : z.coerce.date(),
    updatedAt : z.coerce.date(),
    tags : z.array(z.string()),
    link: z.string(),
    mime: z.string(),
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
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["leaseCycle"], message: "Invalid lease cycle" });
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
    hasGarage: z.boolean().default(false),
    hasGarden: z.boolean().default(false),
    hasPool: z.boolean().default(false),
    
    amenities: z.array(z.string()),
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




// ─── 8. TYPES ────────────────────────────────────────────────────────────────
export type UserInput = z.infer<typeof zodRegisterFullSchema>;
// export type ImageInput = z.infer<typeof imageSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type InvestmentBlockInput = z.infer<typeof investmentBlockSchema>;
export type ExternalInvestorInput = z.infer<typeof externalInvestorSchema>;
export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
export type FileXInput = z.infer<typeof FileXSchema>;



// If you really need a default object for React State:
export const defaultPropertyInput: PropertyInput = {
    ...propertySchema.parse({
        // Only provide required fields that don't have defaults
        name: "", address: "", ownerName: "", contactInfo: "", 
        accessCode: "000000000000", ownerId: "", ownerType: "ORGANIZATION",
        numBedrooms: 0, numBathrooms: 0, lotSize: 1, yearBuilt: 2024, squareFootage: 1,
        amenities: [], images: []
    })
};

export const defaultInvestmentBlockInput: InvestmentBlockInput = {
    ...investmentBlockSchema.parse({
        initialInvestment: 1, margin: 0, externalInvestors: []
    })
};