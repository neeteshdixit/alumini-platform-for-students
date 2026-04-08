import { Router } from 'express'

import authRouter from './auth.routes.js'
import collegeRouter from './college.routes.js'
import connectionsRouter from './connections.routes.js'
import messagesRouter from './messages.routes.js'
import postsRouter from './posts.routes.js'
import usersRouter from './users.routes.js'

const router = Router()

router.use('/api', authRouter)
router.use('/api', usersRouter)
router.use('/api', connectionsRouter)
router.use('/api', messagesRouter)
router.use('/api', postsRouter)
router.use('/api', collegeRouter)

// Backward-compatible aliases
router.use('/api/v1', authRouter)
router.use('/api/v1', usersRouter)
router.use('/api/v1', connectionsRouter)
router.use('/api/v1', messagesRouter)
router.use('/api/v1', postsRouter)
router.use('/api/v1', collegeRouter)

export default router
