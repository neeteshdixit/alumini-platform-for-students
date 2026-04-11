import { z } from 'zod'

export const createPostSchema = z.object({
  type: z.enum(['CERTIFICATE', 'HACKATHON', 'EVENT', 'GENERAL']).default('GENERAL'),
  title: z.string().trim().min(1).max(160).optional(),
  description: z.string().trim().min(1).max(4000),
  attachmentUrl: z.string().trim().url().optional(),
  mediaUrls: z.array(z.string().trim().url()).max(5).optional(),
  files: z
    .array(
      z.object({
        url: z.string().trim().url(),
        fileType: z.string().trim().min(1).max(50),
        fileName: z.string().trim().max(255).optional(),
        fileSize: z.number().int().nonnegative().max(15 * 1024 * 1024).optional(),
        mimeType: z.string().trim().max(120).optional(),
      }),
    )
    .max(10)
    .optional(),
})

export const addCommentSchema = z.object({
  content: z.string().trim().min(1).max(2000),
})
