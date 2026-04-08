import { Router } from 'express'

const router = Router()

router.get('/pending-verifications', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.patch('/verify/:userId', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.get('/reports', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.patch('/ban/:userId', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.get('/risk-alerts', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

export default router
