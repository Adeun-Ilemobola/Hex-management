
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
  initialInvestment: z.number().positive("Investment must be a positive number."),
  margin: z.number().min(0, "Margin should not be negative."),
  typeOfSale: z.enum(["sell", "rent", "lease"]).default("sell"),

  saleDuration: z.number().int().min(0, "Duration must be zero or positive.").optional().default(0),
  description: z.string().max(1500, "Description too long.").optional(),
  yearBuilt: z.number().int().gte(1800, "Year should be realistic.").lte(new Date().getFullYear()).optional(),
  squareFootage: z.number().int().positive("Square footage must be positive.").optional(),
  numBedrooms: z.number().int().min(0, "Bedrooms cannot be negative.").optional(),
  numBathrooms: z.number().int().min(0, "Bathrooms cannot be negative.").optional(),
  Leavingstatus: z.enum(["Active", "Inactive", "Renovation", "Developing", "Purchase Planning"]).optional().default("Active"),
  lotSize: z.number().positive("Lot size must be positive.").optional(),
  propertyType: z.string().optional(),
  status: z.enum(["active", "pending", "sold"]).optional().default("active"),
  ownerName: z.string().min(2, "Owner name required."),
  contactInfo: z.string().min(5, "Contact info required."),


  hasGarage: z.boolean().optional(),
  hasGarden: z.boolean().optional(),
  hasPool: z.boolean().optional(),
  amenities: z.array(z.string()),


  imageUrls: z.array(z.string().url("Must be a valid URL.")),
  videoTourUrl: z.string().url("Must be a valid URL.").optional(),
  
});
export type PropertieInput = z.infer<typeof propertieSchema>;

