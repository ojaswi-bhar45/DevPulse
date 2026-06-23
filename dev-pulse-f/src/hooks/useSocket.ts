import { useEffect, useRef } from 'react'
import { connectSocket, getSocket } from '../api/socket'
import { useBuildStore } from '../store/buildStore'
import { getAccessToken } from '../store/authStore'
import type { Build } from '../types'

export function useSocket() {
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    if (!getAccessToken()) return

    const socket = connectSocket()
    if (!socket) return

    const handler = (build: Build) => {
      useBuildStore.getState().addOrUpdateBuild(build)
    }

    socket.on('build:updated', handler)

    return () => {
      socket.off('build:updated', handler)
    }
  }, [])
}
