
import { z } from 'zod';

export const zodLoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string(),
})



export const zodRegisterFullSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .trim(),

    email: z
      .string()
      .email({ message: "Invalid email address" })
      .toLowerCase(),

    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),

    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password must be at least 6 characters long" }),

    phoneNumber: z
      .string()
      .min(7, { message: "Phone number is too short" })
      .regex(/^\+?[0-9\s\-]{7,15}$/, {
        message: "Invalid phone number format",
      }),

    address: z
      .string()
      .min(5, { message: "Address is required" }),

    zipCode: z
      .string()
      .min(4, { message: "Zip code is required" }),

    city: z
      .string()
      .min(2, { message: "City is required" }),

    state: z
      .string()
      .min(2, { message: "State is required" }),

    country: z
      .string()
      .min(2, { message: "Country is required" }),

    terms: z.literal(true, {
      errorMap: () => ({
        message: "You must accept the terms and conditions",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });





export const zodRegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .trim(),

    email: z
      .string()
      .email({ message: "Invalid email address" }),


    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),

    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password must be at least 6 characters long" }),

    phoneNumber: z
      .string()
      .min(7, { message: "Phone number is too short" })
      .regex(/^\+?[0-9\s\-]{7,15}$/, {
        message: "Invalid phone number format",
      }),

    country: z
      .string()
      .min(2, { message: "Country is required" }),

    terms: z.literal(true, {
      errorMap: () => ({
        message: "You must accept the terms and conditions",
      }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });





//
// ─── ENUMS ──────────────────────────────────────────────────────────────────────
//
export const InvestmentTypeEnum = z.enum(["INDIVIDUAL", "POOLED", "TIC"]);
export const SaleTypeEnum = z.enum(["SELL", "RENT", "LEASE"]);
export const PropertyTypeEnum = z.enum([
  "House",
  "Apartment",
  "Condo",
  "Commercial",
  "Other",
]);
export const StatusEnum = z.enum(["active", "pending", "sold"]);
export const LeavingStatusEnum = z.enum([
  "active",
  "Inactive",
  "Renovation",
  "Developing",
  "Purchase Planning",
]);
export const PlanTierEnum = z.enum(["Free", "Deluxe", "Premium"]);

//
// ─── IMAGE ──────────────────────────────────────────────────────────────────────
//
export const imageSchema = z.object({
  name: z.string().min(1, "Image must have a name."),
  url: z.string().url("Invalid image URL."),
  size: z.number().int().nonnegative("Size must be ≥ 0."),
  type: z.string().min(1),
  lastModified: z.number().int().nonnegative(),
  thumbnail: z.boolean().default(false),
  supabaseID: z.string().default(""),
});

//
// ─── EXTERNAL INVESTOR ───────────────────────────────────────────────────────────
//
export const externalInvestorSchema = z
  .object({
    name: z.string().min(2, "Name is required."),
    email: z.string().email("Valid email required."),
    contributionPercentage: z
      .number()
      .min(0, "Must be ≥ 0%")
      .max(100, "Cannot exceed 100%"),
    returnPercentage: z
      .number()
      .min(0, "Must be ≥ 0%")
      .max(100, "Cannot exceed 100%"),
    isInternal: z
      .boolean()
      .default(false)
      .describe("true = existing user, false = external"),
    accessRevoked: z.boolean().default(false),
    dollarValueReturn: z.number().nonnegative(),
    investmentBlockId: z
      .string()
      .uuid("Must be a valid InvestmentBlock UUID"),
  })
  .strict();

//
// ─── INVESTMENT BLOCK ────────────────────────────────────────────────────────────
//
export const investmentBlockSchema = z
  .object({
    typeOfInvestment: InvestmentTypeEnum.default("INDIVIDUAL"),
    initialInvestment: z
      .number()
      .positive("Must invest a positive amount."),
    margin: z
      .number()
      .min(0, "Margin cannot be negative."),
    typeOfSale: SaleTypeEnum.default("SELL"),
    saleDuration: z
      .number()
      .int()
      .nonnegative()
      .default(0)
      .describe("Months until payback"),
    leaseCycle: z
      .number()
      .nonnegative()
      .default(0)
      .describe(
        "Amount of months (or fractional years) per lease cycle"
      ),
    leaseType: z
      .string()
      .min(1)
      .default("Month")
      .describe("Unit for leaseCycle (e.g. Month, Year)"),
    discountPercentage: z
      .number()
      .min(0, "Cannot be negative.")
      .max(100, "Cannot exceed 100.")
      .default(0),
    finalResult: z
      .number()
      .default(0)
      .describe("Computed ROI or payout"),
    propertyId: z
      .string()
      .uuid("Must be a valid Property UUID").optional(),
  })
  .superRefine((data, ctx) => {
    // rent or lease require higher minimums
    if (data.typeOfSale === "RENT" || data.typeOfSale === "LEASE") {
      if (data.initialInvestment <= 1000) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["initialInvestment"],
          message:
            "For rent/lease, initialInvestment must exceed $1,000.",
        });
      }
      if (data.margin <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["margin"],
          message: "Margin must be > 0 for rent/lease.",
        });
      }
    }
    // lease requires leaseCycle > 0
    if (data.typeOfSale === "LEASE" && data.leaseCycle <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["leaseCycle"],
        message: "Lease cycle must be > 0 for lease.",
      });
    }
  });

//
// ─── PROPERTY ────────────────────────────────────────────────────────────────────
//
export const propertySchema = z
  .object({
    name: z
      .string()
      .min(2, "Name should be at least 2 characters."),
    address: z
      .string()
      .min(5, "Provide a valid address (incl. ZIP)."),
    description: z
      .string()
      .max(1500, "Description too long.")
      .optional(),
    numBedrooms: z
      .number()
      .int()
      .min(0, "Bedrooms cannot be negative."),
    numBathrooms: z
      .number()
      .int()
      .min(0, "Bathrooms cannot be negative."),
    lotSize: z
      .number()
      .positive("Lot size must be positive."),
    yearBuilt: z
      .number()
      .int()
      .gte(1800, "Year unrealistic.")
      .lte(new Date().getFullYear(), "Year cannot be in the future."),
    squareFootage: z
      .number()
      .int()
      .positive("Square footage must be positive."),
    hasGarage: z.boolean().default(false),
    hasGarden: z.boolean().default(false),
    hasPool: z.boolean().default(false),
    amenities: z.array(z.string()),
    propertyType: PropertyTypeEnum.default("House"),
    status: StatusEnum.default("active"),
    ownerName: z.string().min(2, "Owner name required."),
    contactInfo: z.string().min(5, "Contact info required."),
    accessCode: z
      .string()
      .length(12, "Access code must be exactly 12 characters."),
    // Nested relationship inputs:
    investmentBlock: investmentBlockSchema.optional(),
    externalInvestors: z.array(externalInvestorSchema),
    images: z.array(imageSchema),
    videoTourUrl: z.string().url("Invalid URL").optional().nullable(),
  })
  .superRefine((data, ctx) => {

    const invs = data.externalInvestors || [];
    // ensure investmentBlock matches the top-level fields if provided
    if (data.investmentBlock) {
      const { initialInvestment, margin } = data.investmentBlock;
      if (
        data.investmentBlock.initialInvestment !== initialInvestment
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["investmentBlock", "initialInvestment"],
          message:
            "investmentBlock.initialInvestment must match top-level initialInvestment.",
        });
      }
      if (data.investmentBlock.margin !== margin) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["investmentBlock", "margin"],
          message:
            "investmentBlock.margin must match top-level margin.",
        });
      }

      if (data.investmentBlock.typeOfInvestment === "POOLED") {
        // 1) require at least two investors
        if (invs.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["investmentBlock", "externalInvestors"],
            message: "Pooled investments require at least two external investors.",
          });
        }
      }


    }
  });

//
// ─── SUBSCRIPTION ────────────────────────────────────────────────────────────────
//
export const subscriptionSchema = z
  .object({
    userId: z
      .string()
      .uuid("Must be a valid User UUID"),
    stripeCustomerId: z.string().optional(),
    stripeSubscriptionId: z.string().optional(),
    priceId: z.string().optional(),
    status: z.string().min(1, "Status required."),
    isActive: z.boolean().default(false),
    currentPeriodStart: z.date().optional(),
    currentPeriodEnd: z.date().optional(),
    cancelAtPeriodEnd: z.boolean().default(false),
    canceledAt: z.date().optional(),
    planTier: PlanTierEnum,
  })
  .strict();





export type ImageInput = z.infer<typeof imageSchema>;
export type ExternalInvestorInput = z.infer<typeof externalInvestorSchema>;
export type InvestmentBlockInput = z.infer<typeof investmentBlockSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type SubscriptionInput = z.infer<typeof subscriptionSchema>;


// ─── Defaults ──────────────────────────────────────────────────────────────────



export const defaultImageInput: ImageInput = {
  name: "",
  url: "",
  size: 0,
  type: "",
  lastModified: Date.now(),
  thumbnail: false,
  supabaseID: "",
};

export const defaultExternalInvestorInput: ExternalInvestorInput = {
  name: "",
  email: "",
  contributionPercentage: 0,
  returnPercentage: 0,
  isInternal: false,
  accessRevoked: false,
  dollarValueReturn: 0,
  investmentBlockId: "",
};

export const defaultInvestmentBlockInput: InvestmentBlockInput = {
  typeOfInvestment: "INDIVIDUAL",
  initialInvestment: 0,
  margin: 0,
  typeOfSale: "SELL",
  saleDuration: 0,
  leaseCycle: 0,
  leaseType: "Month",
  discountPercentage: 0,
  finalResult: 0,
  propertyId: "",
};

export const defaultPropertyInput: PropertyInput = {
  name: "",
  address: "",
  description: undefined,
  numBedrooms: 0,
  numBathrooms: 0,
  lotSize: 0,
  yearBuilt: new Date().getFullYear(),
  squareFootage: 0,
  hasGarage: false,
  hasGarden: false,
  hasPool: false,
  amenities: [],
  propertyType: "House",
  status: "active",
  ownerName: "",
  contactInfo: "",
  accessCode: "",            // e.g. nanoid(12)
  investmentBlock: undefined,     // or defaultInvestmentBlockInput
  externalInvestors: [],
  images: [],
  videoTourUrl: undefined,
};

export const defaultSubscriptionInput: SubscriptionInput = {
  userId: "",
  stripeCustomerId: undefined,
  stripeSubscriptionId: undefined,
  priceId: undefined,
  status: "",
  isActive: false,
  currentPeriodStart: undefined,
  currentPeriodEnd: undefined,
  cancelAtPeriodEnd: false,
  canceledAt: undefined,
  planTier: "Free",
};

