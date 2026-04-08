import { z } from 'zod'

export const createPostSchema = z.object({
  type: z.enum(['CERTIFICATE', 'HACKATHON', 'EVENT', 'GENERAL']).default('GENERAL'),
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(3).max(2000),
  attachmentUrl: z.string().trim().url().optional(),
})
