
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
