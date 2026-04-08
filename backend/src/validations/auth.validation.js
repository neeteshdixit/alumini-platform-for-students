import { z } from 'zod'

const institutionPlaceholder = 'Select your College'

export const signupSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120),
    email: z.string().trim().email(),
    password: z.string().min(8).max(72),
    confirmPassword: z.string().min(8).max(72),
    institution: z.string().trim().max(160).optional().default(institutionPlaceholder),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(72),
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(20).optional(),
})
