import { Router } from 'express'

import {
  applyToOpportunity,
  createOpportunity,
  getOpportunityMatches,
  getOpportunities,
} from '../controllers/opportunities.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import {
  applyOpportunitySchema,
  createOpportunitySchema,
} from '../validations/opportunity.validation.js'

const router = Router()

router.get('/opportunities', requireAuth, getOpportunities)
router.get('/opportunities/matches/me', requireAuth, getOpportunityMatches)
router.post(
  '/opportunities',
  requireAuth,
  validate(createOpportunitySchema),
  createOpportunity,
)
router.post(
  '/opportunities/:opportunityId/apply',
  requireAuth,
  validate(applyOpportunitySchema),
  applyToOpportunity,
)

export default router
