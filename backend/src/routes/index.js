import { Router } from 'express'

import authRouter from './auth.routes.js'

const router = Router()

router.use('/api/v1/auth', authRouter)
router.use('/api/auth', authRouter)

export default router
