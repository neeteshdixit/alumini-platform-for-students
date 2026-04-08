import { Router } from 'express'

const router = Router()

router.get('/search', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.get('/suggestions', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

export default router
