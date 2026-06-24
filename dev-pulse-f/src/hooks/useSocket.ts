import { useEffect, useRef } from 'react'
import { connectSocket } from '../api/socket'
import { useBuildStore } from '../store/buildStore'
import { useIncidentStore } from '../store/incidentStore'
import { useAIStore } from '../store/aiStore'
import { getAccessToken } from '../store/authStore'
import type { Build, Incident, AISummary } from '../types'

export function useSocket() {
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    if (!getAccessToken()) return

    const socket = connectSocket()
    if (!socket) return

    const buildHandler = (build: Build) => {
      useBuildStore.getState().addOrUpdateBuild(build)
    }

    const incidentCreatedHandler = (incident: Incident) => {
      useIncidentStore.getState().addOrUpdateIncident(incident)
    }

    const incidentUpdatedHandler = (incident: Incident) => {
      useIncidentStore.getState().addOrUpdateIncident(incident)
    }

    const slaWarningHandler = (incident: Incident) => {
      useIncidentStore.getState().addOrUpdateIncident(incident)
      window.dispatchEvent(new CustomEvent('incident:sla-warning', { detail: incident }))
    }

    const aiSummaryHandler = (summary: AISummary) => {
      useAIStore.getState().addOrUpdateSummary(summary)
    }

    socket.on('build:updated', buildHandler)
    socket.on('incident:created', incidentCreatedHandler)
    socket.on('incident:updated', incidentUpdatedHandler)
    socket.on('incident:sla-warning', slaWarningHandler)
    socket.on('ai:summary-created', aiSummaryHandler)

    return () => {
      socket.off('build:updated', buildHandler)
      socket.off('incident:created', incidentCreatedHandler)
      socket.off('incident:updated', incidentUpdatedHandler)
      socket.off('incident:sla-warning', slaWarningHandler)
      socket.off('ai:summary-created', aiSummaryHandler)
    }
  }, [])
}
