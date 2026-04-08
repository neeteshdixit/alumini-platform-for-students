import { z } from 'zod'

export const connectSchema = z.object({
  targetUserId: z.string().trim().uuid('targetUserId must be a valid UUID.'),
})

export const acceptSchema = z.object({
  requestId: z.string().trim().uuid('requestId must be a valid UUID.'),
  action: z.enum(['ACCEPT', 'REJECT']).default('ACCEPT'),
})
