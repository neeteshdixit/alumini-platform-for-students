import { z } from 'zod'

const roleSchema = z.enum(['STUDENT', 'ALUMNI'])

export const signupSchema = z
  .object({
    role: roleSchema,
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters.')
      .max(120, 'Name must be at most 120 characters.'),
    email: z.string().trim().email('A valid email is required for OTP verification.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .max(72, 'Password is too long.'),
    confirmPassword: z.string().min(8).max(72),
    collegeId: z.string().trim().uuid().optional(),
    collegeName: z.string().trim().min(2).max(160).optional(),
    enrollmentNumber: z.string().trim().min(4).max(80).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })
  .refine((data) => Boolean(data.collegeId || data.collegeName), {
    message: 'collegeId or collegeName is required.',
    path: ['collegeName'],
  })
  .refine(
    (data) => {
      if (data.role !== 'ALUMNI') return true
      return Boolean(data.enrollmentNumber)
    },
    {
      message: 'Enrollment number is required for alumni signup.',
      path: ['enrollmentNumber'],
    },
  )

export const verifyOtpSchema = z.object({
  email: z.string().trim().email('Please provide a valid email.'),
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'OTP must be a 6-digit code.'),
})

export const resendOtpSchema = z.object({
  email: z.string().trim().email('Please provide a valid email.'),
})

export const loginSchema = z
  .object({
    email: z.string().trim().email().optional(),
    enrollmentNumber: z.string().trim().min(4).max(80).optional(),
    identifier: z.string().trim().min(3).max(120).optional(),
    password: z
      .string()
      .min(1, 'Password is required.')
      .max(72, 'Password is too long.'),
  })
  .refine(
    (data) => Boolean(data.email || data.enrollmentNumber || data.identifier),
    {
      message: 'Provide email, enrollmentNumber, or identifier to login.',
      path: ['identifier'],
    },
  )

export const refreshSchema = z.object({
  refreshToken: z.string().min(20).optional(),
})
