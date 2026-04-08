import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import { env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js'
import { apiRateLimiter } from './middlewares/rate-limit.middleware.js'
import rootRouter from './routes/index.js'

export const app = express()

const allowedOrigins = env.clientOrigin
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error('Origin not allowed by CORS'))
    },
    credentials: true,
  }),
)

app.use(helmet())
app.use(morgan(env.isProduction ? 'combined' : 'dev'))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(apiRateLimiter)

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    service: 'alumniconnect-backend',
  })
})

app.use(rootRouter)
app.use(notFoundHandler)
app.use(errorHandler)
