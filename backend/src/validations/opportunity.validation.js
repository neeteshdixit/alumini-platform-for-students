import { z } from 'zod'

export const createOpportunitySchema = z.object({
  type: z.enum(['JOB', 'INTERNSHIP', 'EVENT']).default('JOB'),
  title: z.string().trim().min(3).max(160),
  companyName: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(4000),
  location: z.string().trim().max(160).optional(),
  compensation: z.string().trim().max(160).optional(),
  applicationUrl: z.string().trim().url().optional(),
  deadline: z.string().trim().datetime().optional(),
  targetDomain: z.enum(['tech', 'non-tech', 'both']).optional(),
  skillsRequired: z.array(z.string().trim().min(1).max(60)).max(30).optional(),
})

export const applyOpportunitySchema = z.object({
  coverNote: z.string().trim().max(4000).optional(),
})
