import { env } from '../config/env.js'

export const refreshCookieName = 'refreshToken'

export const getRefreshCookieOptions = (expires) => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: env.isProduction,
  path: '/api/v1/auth',
  expires,
})
