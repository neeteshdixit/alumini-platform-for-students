import dotenv from 'dotenv'

dotenv.config()

const requiredKeys = [
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
]

for (const key of requiredKeys) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

const parseNumber = (value, fallback) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: parseNumber(process.env.PORT, 5000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  appOrigin: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)[0] || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  authLoginMaxAttempts: parseNumber(process.env.AUTH_LOGIN_MAX_ATTEMPTS, 5),
  authLockMinutes: parseNumber(process.env.AUTH_LOCK_MINUTES, 15),
  otpExpiryMinutes: parseNumber(process.env.OTP_EXPIRY_MINUTES, 10),
  otpMaxAttempts: parseNumber(process.env.OTP_MAX_ATTEMPTS, 5),
  resendApiKey: process.env.RESEND_API_KEY || '',
  otpFromEmail: process.env.OTP_FROM_EMAIL || '',
  messageEncryptionSecret:
    process.env.MESSAGE_ENCRYPTION_SECRET || process.env.JWT_ACCESS_SECRET,
}
