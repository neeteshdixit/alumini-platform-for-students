import http from 'http'

import { app } from './app.js'
import { env } from './config/env.js'
import { prisma } from './config/prisma.js'
import { createSocketServer } from './socket/socket.handler.js'

const bootstrap = async () => {
  try {
    await prisma.$connect()

    const server = http.createServer(app)
    createSocketServer(server)

    server.listen(env.port, () => {
      console.log(`[backend] running on http://localhost:${env.port}`)
    })

    const shutdown = async () => {
      await prisma.$disconnect()
      server.close(() => {
        process.exit(0)
      })
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
  } catch (error) {
    console.error('[backend] failed to start:', error)
    process.exit(1)
  }
}

bootstrap()
