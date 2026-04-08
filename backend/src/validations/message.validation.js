import { z } from 'zod'

export const sendMessageSchema = z.object({
  toUserId: z.string().trim().uuid('toUserId must be a valid UUID.'),
  content: z.string().trim().min(1, 'Message cannot be empty.').max(4000),
})
