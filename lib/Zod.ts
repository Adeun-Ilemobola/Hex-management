
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



export const propertieSchema = z.object({
  name: z.string().min(2, "Name should be at least 2 characters."),
  address: z.string().min(5, "Please provide a valid address with ZIP Code."),
  description: z.string().max(1500, "Description too long."),
  numBedrooms: z.number().int().min(0, "Bedrooms cannot be negative."),
  numBathrooms: z.number().int().min(0, "Bathrooms cannot be negative."),
  lotSize: z.number().positive("Lot size must be positive."),
  yearBuilt: z.number().int().gte(1800, "Year should be realistic.").lte(new Date().getFullYear()),
  squareFootage: z.number().int().positive("Square footage must be positive."),
  hasGarage: z.boolean().default(false),
  hasGarden: z.boolean().default(false),
  hasPool: z.boolean().default(false),
  amenities: z.array(z.string()),
  propertyType: z.enum(["House", "Apartment", "Condo", "Commercial", "Other"]).optional().default("House"),
  status: z.enum(["active", "pending", "sold"]).optional().default("active"),
  ownerName: z.string().min(2, "Owner name required."),
  contactInfo: z.string().min(5, "Contact info required."),
  typeOfSale: z.enum(["sell", "rent", "lease"]).default("sell"),
  initialInvestment: z.number().positive("Investment must be a positive number."),
  saleDuration: z.number().int().min(0, "Duration must be zero or positive.").optional().default(0),
  margin: z.number().min(0, "Margin should not be negative."),
  leaseCycle: z.number().optional().default(0)
    .describe(
      "Every amount of months for LeaseCycle, can be a certain amount of years plus months for LeaseCycle"
    ),
  leaseType: z.string().optional().default("Month")
    .describe(
      "Lease candy every week, every amount of months for LeaseCycle, can be a certain amount of years plus months for LeaseCycle"
    ),

  finalResult: z
    .number()
    .default(0)
    .describe("The result for the investment"),
  leavingstatus: z.enum(["active", "Inactive", "Renovation", "Developing", "Purchase Planning"]).optional().default("active"),
  imageUrls: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      size: z.number(),
      type: z.string(),
      lastModified: z.number(),
      Thumbnail:z.boolean().default(false),
      supabaseID: z.string().default(""),
    })
  ),
   videoTourUrl: z.string().optional().nullable().default(""),


}).superRefine((data, ctx) => {
  // 1. If rent
  if (data.typeOfSale === "rent") {
    if (!(data.initialInvestment > 1000)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["initialInvestment"],
        message: "Initial investment must be greater than 1000 for rent.",
      });
    }
    if (!(data.margin > 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["margin"],
        message: "Margin must be greater than zero for rent.",
      });
    }
  }
  // 2. If lease
  if (data.typeOfSale === "lease") {
    if (!(data.initialInvestment > 1000)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["initialInvestment"],
        message: "Initial investment must be greater than 1000 for lease.",
      });
    }
    if (!(data.margin > 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["margin"],
        message: "Margin must be greater than zero for lease.",
      });
    }
    if (!(data.leaseCycle && data.leaseCycle > 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["leaseCycle"],
        message: "Lease cycle must be provided and greater than zero for lease.",
      });
    }
    if (!(data.leaseType && data.leaseType.length > 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["leaseType"],
        message: "Lease type must be provided for lease.",
      });
    }
  }

});
export type PropertieInput = z.infer<typeof propertieSchema>;

