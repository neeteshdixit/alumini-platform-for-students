import { z } from 'zod'

const domainSchema = z.enum(['tech', 'non-tech', 'both'])

const mobileNumberSchema = z
  .string()
  .trim()
  .min(7)
  .max(20)
  .regex(/^[0-9+\-\s()]+$/, 'Mobile number can only contain digits and separators.')

const profileUrlSchema = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) => {
      if (!value) return true
      return /^https?:\/\/.+/i.test(value)
    },
    {
      message: 'Enter a valid URL starting with http:// or https://',
    },
  )

const yearSchema = z.coerce.number().int().min(1900).max(2100).optional()
const monthSchema = z.coerce.number().int().min(1).max(12).optional()

export const updateMeSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  mobileNumber: mobileNumberSchema.optional(),
  domain: domainSchema.optional(),
  skills: z.array(z.string().trim().min(1).max(60)).max(30).optional(),
  interests: z.array(z.string().trim().min(1).max(60)).max(30).optional(),
  internships: z.string().trim().max(3000).optional(),
  projects: z.string().trim().max(4000).optional(),
  bio: z.string().trim().max(2000).optional(),
  graduationYear: yearSchema,
  graduationMonth: monthSchema,
  linkedinUrl: profileUrlSchema.optional(),
  githubUrl: profileUrlSchema.optional(),
  profileImage: profileUrlSchema.optional(),
})

export const deleteMeSchema = z.object({
  confirmText: z
    .string()
    .trim()
    .toUpperCase()
    .refine((value) => value === 'DELETE', {
      message: 'Type DELETE to confirm account deletion.',
    }),
  password: z.string().trim().min(1).max(72).optional(),
})

export const uploadProfileImageSchema = z.object({
  fileName: z.string().trim().max(140).optional(),
  fileData: z
    .string()
    .trim()
    .regex(
      /^data:image\/(?:png|jpe?g|webp);base64,[a-zA-Z0-9+/=]+$/,
      'Provide a valid PNG, JPEG, or WEBP image.',
    ),
})
