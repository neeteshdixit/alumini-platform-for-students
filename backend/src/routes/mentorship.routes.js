import { Router } from 'express'

const router = Router()

router.post('/request', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.get('/requests', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.get('/my', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.patch('/:id/accept', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.patch('/:id/decline', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.patch('/:id/complete', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.post('/:id/notes', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.put('/:id/goals', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

router.post('/:id/survey', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented yet.' })
})

export default router
