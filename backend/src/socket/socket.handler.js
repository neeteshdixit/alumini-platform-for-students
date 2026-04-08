import { Server } from 'socket.io'

import { env } from '../config/env.js'

export const createSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientOrigin.split(',').map((origin) => origin.trim()),
      credentials: true,
    },
  })

  io.on('connection', (socket) => {
    socket.on('joinChat', ({ chatId }) => {
      if (chatId) {
        socket.join(`chat:${chatId}`)
      }
    })

    socket.on('typing', ({ chatId }) => {
      if (chatId) {
        socket.to(`chat:${chatId}`).emit('typing', { chatId, socketId: socket.id })
      }
    })

    socket.on('stopTyping', ({ chatId }) => {
      if (chatId) {
        socket
          .to(`chat:${chatId}`)
          .emit('stopTyping', { chatId, socketId: socket.id })
      }
    })
  })

  return io
}
