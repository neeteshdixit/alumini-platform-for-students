import { Router } from 'express'

const router = Router()

router.get('/', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.post('/', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.get('/:chatId/messages', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.post('/:chatId/report', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

export default router
