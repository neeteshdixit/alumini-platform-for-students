import { Router } from 'express'

import { uploadPdfFiles } from '../controllers/uploads.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/upload/pdf', requireAuth, uploadPdfFiles)

export default router
