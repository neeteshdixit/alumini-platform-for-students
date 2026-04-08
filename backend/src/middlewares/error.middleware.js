import { ZodError } from 'zod'

import { env } from '../config/env.js'
import { AppError } from '../utils/app-error.js'

export const notFoundHandler = (_req, _res, next) => {
  next(new AppError('Route not found.', 404))
}

export const errorHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      details: error.flatten(),
    })
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    })
  }

  if (!env.isProduction) {
    console.error('[backend] unhandled error:', error)
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error.',
  })
}
