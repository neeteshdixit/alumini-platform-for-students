import { Router } from 'express'

import authRouter from './auth.routes.js'
import callsRouter from './calls.routes.js'
import collegeRouter from './college.routes.js'
import connectionsRouter from './connections.routes.js'
import leaderboardRouter from './leaderboard.routes.js'
import locationsRouter from './locations.routes.js'
import messagesRouter from './messages.routes.js'
import notificationsRouter from './notifications.routes.js'
import opportunitiesRouter from './opportunities.routes.js'
import postsRouter from './posts.routes.js'
import uploadsRouter from './uploads.routes.js'
import usersRouter from './users.routes.js'

const router = Router()

router.use('/api', authRouter)
router.use('/api', callsRouter)
router.use('/api', usersRouter)
router.use('/api', connectionsRouter)
router.use('/api', locationsRouter)
router.use('/api', notificationsRouter)
router.use('/api', leaderboardRouter)
router.use('/api', messagesRouter)
router.use('/api', opportunitiesRouter)
router.use('/api', postsRouter)
router.use('/api', uploadsRouter)
router.use('/api/colleges', collegeRouter)
router.use('/api', collegeRouter)

// Backward-compatible aliases
router.use('/api/v1', authRouter)
router.use('/api/v1', callsRouter)
router.use('/api/v1', usersRouter)
router.use('/api/v1', connectionsRouter)
router.use('/api/v1', locationsRouter)
router.use('/api/v1', notificationsRouter)
router.use('/api/v1', leaderboardRouter)
router.use('/api/v1', messagesRouter)
router.use('/api/v1', opportunitiesRouter)
router.use('/api/v1', postsRouter)
router.use('/api/v1', uploadsRouter)
router.use('/api/v1/colleges', collegeRouter)
router.use('/api/v1', collegeRouter)

export default router
