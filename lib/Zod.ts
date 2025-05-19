
import { z } from 'zod';

export const zodLoginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string(),
})


export const zodRegisterFullSchema = z
    .object({
        name: z.string().min(1, { message: 'Name is required' }),
        email: z.string().email({ message: 'Invalid email address' }),

        password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),

        confirmPassword: z.string().min(6, { message: 'Confirm Password must be at least 6 characters long' }),

        terms: z.literal(true, {
            errorMap: () => ({ message: 'You must accept the terms and conditions' }),
        }),
        phoneNumber: z.string().min(1, { message: 'Phone number is required' }),

        address: z.string().min(1, { message: 'Address is required' }),
        zipCode: z.string().min(1, { message: 'Zip code is required' }),

        city: z.string().min(1, { message: 'City is required' }),
        state: z.string().min(1, { message: 'State is required' }),
        country: z.string().min(1, { message: 'Country is required' }),

    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
    })




export const zodRegisterSchema = z
    .object({
        name: z.string().min(1, { message: 'Name is required' }),
        email: z.string().email({ message: 'Invalid email address' }),
        password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
        confirmPassword: z.string().min(6, { message: 'Confirm Password must be at least 6 characters long' }),
        phoneNumber: z.string().min(1, { message: 'Phone number is required' }),
        country: z.string().min(1, { message: 'Country is required' }),
         terms: z.literal(true, {
            errorMap: () => ({ message: 'You must accept the terms and conditions' }),
        })

    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
    })