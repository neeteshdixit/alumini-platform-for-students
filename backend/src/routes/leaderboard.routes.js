import { Router } from 'express'

import { getLeaderboard } from '../controllers/leaderboard.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/leaderboard', requireAuth, getLeaderboard)

export default router
