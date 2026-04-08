import { z } from 'zod'

export const updateMeSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  skills: z.array(z.string().trim().min(1).max(60)).max(20).optional(),
  interests: z.array(z.string().trim().min(1).max(60)).max(20).optional(),
})
