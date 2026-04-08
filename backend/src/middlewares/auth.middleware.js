import jwt from 'jsonwebtoken'

import { env } from '../config/env.js'
import { AppError } from '../utils/app-error.js'

export const requireAuth = (req, _res, next) => {
  const authHeader = req.headers.authorization || ''

  if (!authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized.', 401))
  }

  const token = authHeader.slice('Bearer '.length).trim()

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret)
    req.user = payload
    return next()
  } catch (_error) {
    return next(new AppError('Invalid or expired access token.', 401))
  }
}
