import { Router } from 'express'

const router = Router()

router.get('/me', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.put('/me', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.get('/:id', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.post('/avatar', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

export default router
