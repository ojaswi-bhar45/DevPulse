import { io, type Socket } from 'socket.io-client'
import { getAccessToken, useAuthStore } from '../store/authStore'

let socket: Socket | null = null

function getBaseUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
  return apiUrl.replace(/\/api\/?$/, '')
}

export function getSocket(): Socket | null {
  return socket
}

export function connectSocket(): Socket | null {
  const token = getAccessToken()
  if (!token) return null

  if (socket?.connected) {
    return socket
  }

  socket?.disconnect()

  socket = io(getBaseUrl(), {
    auth: { token },
    transports: ['websocket', 'polling'],
  })

  socket.on('connect_error', () => {
    setTimeout(connectSocket, 5000)
  })

  socket.on('disconnect', () => {
    socket = null
  })

  return socket
}

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}
