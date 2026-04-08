import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'

import { initDatabase } from './db.js'
import authRouter from './routes/auth.routes.js'

dotenv.config()

const app = express()

const port = Number(process.env.PORT || 5000)
const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origins.length === 0 || origins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('Origin not allowed by CORS'))
    },
    credentials: true,
  }),
)

app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/api/auth', authRouter)

app.use((error, _req, res, _next) => {
  console.error('[backend] unhandled error:', error)
  res.status(500).json({ message: 'Internal server error.' })
})

initDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`[backend] server is running on http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error('[backend] database initialization failed:', error)
    process.exit(1)
  })
