import { Router } from 'express'

const router = Router()

router.post('/send-otp', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.post('/confirm-otp', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.post('/upload-id', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.get('/status', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

export default router
