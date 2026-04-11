import { z } from 'zod'

export const startCallSchema = z.object({
  toUserId: z.string().uuid('Invalid target user.'),
  mode: z.enum(['VOICE', 'VIDEO']).default('VOICE'),
})
