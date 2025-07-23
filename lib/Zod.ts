
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

export const PropertyTypeEnum = z.enum([
  "House",
  "Apartment",
  "Condo",
  "Commercial",
  "Other",
]);
export const SaleTypeEnum = z.enum(["SELL", "RENT", "LEASE"]);
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
    id: z.string().default(""),
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
      .default(""),
  })
  .strict();

//
// ─── INVESTMENT BLOCK ────────────────────────────────────────────────────────────
//
export const investmentBlockSchema = z
  .object({
    id: z.string().default(""),
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
      .default(""),
    externalInvestors: z.array(externalInvestorSchema),

  })
  .superRefine((data, ctx) => {
    // rent or lease require higher minimums
     const { initialInvestment, margin } = data;
      if (
        data.initialInvestment !== initialInvestment
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["investmentBlock", "initialInvestment"],
          message:
            "investmentBlock.initialInvestment must match top-level initialInvestment.",
        });
      }
      if (data.margin !== margin) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["investmentBlock", "margin"],
          message:
            "investmentBlock.margin must match top-level margin.",
        });
      }

      if (data.typeOfInvestment === "POOLED") {
        // 1) require at least two investors
        if (data.externalInvestors.length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["investmentBlock", "externalInvestors"],
            message: "Pooled investments require at least two external investors.",
          });
        }
      }
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
  
    images: z.array(imageSchema),
    videoTourUrl: z.string().url("Invalid URL").optional().nullable(),
  })
 

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




  export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  emailVerified: z.boolean(),
  image: z.string().url("Image must be a valid URL").optional(),
  phoneNumber: z.string(),
  address: z.string(),
  zipCode: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
});





export type UserInput = z.infer<typeof userSchema>;
export type ImageInput = z.infer<typeof imageSchema>;
export type ExternalInvestorInput = z.infer<typeof externalInvestorSchema>;
export type InvestmentBlockInput = z.infer<typeof investmentBlockSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type SubscriptionInput = z.infer<typeof subscriptionSchema>;


// ─── Defaults ──────────────────────────────────────────────────────────────────


export const defaultUserInput: UserInput = {
  name: "",
  email: "",
  emailVerified: false,
  image: "",
  phoneNumber: "",
  address: "",
  zipCode: "",
  city: "",
  state: "",
  country: "",
};

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
  accessRevoked: true,
  dollarValueReturn: 0,
  investmentBlockId: "",
  id: "",
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
  externalInvestors: [],
  propertyId: "",
  id: "",

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






import type { PropertyCardProp } from '@/components/(propertyFragments)/propertyCard';

// mock data array
export const sampleProperties: PropertyCardProp["data"][] = [
  {
    id: "prop-001",
    img: "https://via.placeholder.com/300x200?text=House+1",
    name: "Maple Grove Estate",
    address: "123 Maple St, Vancouver, BC",
    status: "active",
    saleStatus: "SELL",
  },
  {
    id: "prop-002",
    img: "https://via.placeholder.com/300x200?text=Condo+2",
    name: "Downtown Skyloft",
    address: "456 Granville Ave, Vancouver, BC",
    status: "pending",
    saleStatus: "RENT",
  },
  {
    id: "prop-003",
    img: "https://via.placeholder.com/300x200?text=Townhouse+3",
    name: "Riverside Townhomes",
    address: "789 River Rd, Richmond, BC",
    status: "sold",
    saleStatus: "SELL",
  },
  {
    id: "prop-004",
    name: "Forest Heights Cabin",
    address: "12 Pine Needle Dr, Squamish, BC",
    status: "active",
    saleStatus: "LEASE",
  },
  {
    id: "prop-005",
    img: "https://via.placeholder.com/300x200?text=Luxury+Villa",
    name: "Seaside Luxury Villa",
    address: "34 Oceanview Blvd, West Vancouver, BC",
    status: "pending",
    saleStatus: "SELL",
  },
  {
    id: "prop-006",
    img: "https://via.placeholder.com/300x200?text=Loft+6",
    name: "Granite Loft Suites",
    address: "56 Coal Harbour, Vancouver, BC",
    status: "active",
    saleStatus: "RENT",
  },
  {
    id: "prop-007",
    name: "Countryside Bungalow",
    address: "78 Meadow Ln, Langley, BC",
    status: "sold",
    saleStatus: "SELL",
  },
  {
    id: "prop-008",
    img: "https://via.placeholder.com/300x200?text=Modern+Flat",
    name: "Highland Modern Flat",
    address: "90 Mountain Rd, Whistler, BC",
    status: "active",
    saleStatus: "LEASE",
  },
  {
    id: "prop-009",
    img: "https://via.placeholder.com/300x200?text=Studio+9",
    name: "Harbourfront Studio",
    address: "101 Water St, Victoria, BC",
    status: "pending",
    saleStatus: "RENT",
  },
  {
    id: "prop-010",
    name: "Lakeview Cottage",
    address: "202 Lakeshore Dr, Kelowna, BC",
    status: "sold",
    saleStatus: "LEASE",
  },
  {
    id: "prop-011",
    img: "https://via.placeholder.com/300x200?text=Penthouse+11",
    name: "Summit Penthouse",
    address: "303 Skyline Blvd, North Vancouver, BC",
    status: "active",
    saleStatus: "SELL",
  },
];
