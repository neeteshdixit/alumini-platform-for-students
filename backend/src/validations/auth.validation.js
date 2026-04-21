import { z } from 'zod'

const roleSchema = z.enum(['STUDENT', 'ALUMNI'])

const yearSchema = z.coerce.number().int().min(1900).max(2100)
const monthSchema = z.coerce.number().int().min(1).max(12)

const mobileNumberSchema = z
  .string()
  .trim()
  .min(7, 'Mobile number is required.')
  .max(20, 'Mobile number is too long.')
  .regex(/^[0-9+\-\s()]+$/, 'Mobile number can only contain digits and separators.')

export const signupSchema = z
  .object({
    role: roleSchema,
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters.')
      .max(120, 'Name must be at most 120 characters.'),
    email: z.string().trim().email('A valid email is required for OTP verification.'),
    mobileNumber: mobileNumberSchema,
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .max(72, 'Password is too long.'),
    confirmPassword: z.string().min(8).max(72),
    collegeId: z.string().trim().uuid().optional(),
    collegeName: z.string().trim().min(2).max(160).optional(),
    stateId: z.string().trim().uuid().optional(),
    districtId: z.string().trim().uuid().optional(),
    graduationMonth: monthSchema,
    graduationYear: yearSchema,
    enrollmentNumber: z.string().trim().min(4).max(80).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })
  .refine((data) => {
    if (data.collegeId) {
      return true
    }

    return Boolean(data.collegeName && data.stateId && data.districtId)
  }, {
    message: 'Select a college or provide collegeName, stateId, and districtId.',
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
    mobileNumber: mobileNumberSchema.optional(),
    identifier: z.string().trim().min(3).max(120).optional(),
    password: z
      .string()
      .min(1, 'Password is required.')
      .max(72, 'Password is too long.'),
  })
  .refine(
    (data) =>
      Boolean(data.email || data.enrollmentNumber || data.mobileNumber || data.identifier),
    {
      message: 'Provide email, enrollmentNumber, mobileNumber, or identifier to login.',
      path: ['identifier'],
    },
  )

export const refreshSchema = z.object({
  refreshToken: z.string().min(20).optional(),
})

export const googleAuthSchema = z.object({
  googleId: z.string().trim().min(5).max(200),
  email: z.string().trim().email(),
  name: z.string().trim().min(2).max(120),
  collegeId: z.string().trim().uuid().optional(),
  collegeName: z.string().trim().min(2).max(160).optional(),
  stateId: z.string().trim().uuid().optional(),
  districtId: z.string().trim().uuid().optional(),
  graduationMonth: monthSchema.optional(),
  graduationYear: yearSchema.optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email(),
})

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(20),
    email: z.string().trim().email().optional(),
    newPassword: z.string().min(8).max(72),
    confirmPassword: z.string().min(8).max(72),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })
