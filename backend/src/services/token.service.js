import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import { env } from '../config/env.js'

const durationRegex = /^(\d+)([smhd])$/

const durationToMs = (duration) => {
  const match = String(duration).match(durationRegex)

  if (!match) {
    return 7 * 24 * 60 * 60 * 1000
  }

  const value = Number(match[1])
  const unit = match[2]

  if (unit === 's') return value * 1000
  if (unit === 'm') return value * 60 * 1000
  if (unit === 'h') return value * 60 * 60 * 1000
  if (unit === 'd') return value * 24 * 60 * 60 * 1000

  return 7 * 24 * 60 * 60 * 1000
}

export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export const createAccessToken = (payload) => {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.accessTokenExpiresIn,
  })
}

export const createRefreshToken = (payload) => {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.refreshTokenExpiresIn,
  })
}

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.jwtRefreshSecret)
}

export const getRefreshTokenExpiryDate = () => {
  return new Date(Date.now() + durationToMs(env.refreshTokenExpiresIn))
}
