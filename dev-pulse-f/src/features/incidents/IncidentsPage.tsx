import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Skeleton } from '../../components/ui/Skeleton'
import { IncidentsList } from './IncidentsList'
import { useIncidentStore } from '../../store/incidentStore'
import type { Incident } from '../../types'

const SEVERITY_OPTIONS: { label: string; value: Incident['severity'] | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'P1', value: 'P1' },
  { label: 'P2', value: 'P2' },
  { label: 'P3', value: 'P3' },
]

const createIncidentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  severity: z.enum(['P1', 'P2', 'P3']),
  assignee: z.string().optional(),
  slaMinutes: z.number().int().min(1, 'SLA must be at least 1 minute'),
})

type CreateIncidentForm = z.infer<typeof createIncidentSchema>

export function IncidentsPage() {
  const {
    loading, error, fetchIncidents,
    severityFilter, setSeverityFilter,
    currentPage, totalPages, setCurrentPage,
    createIncident,
  } = useIncidentStore()
  const ran = useRef(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateIncidentForm>({
    resolver: zodResolver(createIncidentSchema),
    defaultValues: { severity: 'P2', slaMinutes: 60 },
  })

  useEffect(() => {
    if (!ran.current) {
      fetchIncidents()
      ran.current = true
    }
  }, [fetchIncidents])

  useEffect(() => {
    fetchIncidents()
  }, [severityFilter, currentPage, fetchIncidents])

  const onSubmit = useCallback(async (data: CreateIncidentForm) => {
    setSubmitting(true)
    try {
      await createIncident(data)
      setModalOpen(false)
      reset()
      ran.current = false
      fetchIncidents()
    } catch { /* handled by store */ }
    finally { setSubmitting(false) }
  }, [createIncident, reset, fetchIncidents])

  return (
    <PageWrapper title="Incidents">
      <div className="space-y-4">
        <Card>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {SEVERITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSeverityFilter(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    severityFilter === opt.value
                      ? 'bg-[#534AB7] text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
              + New Incident
            </Button>
          </div>
        </Card>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <Skeleton variant="rect" className="h-24" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
              <Button variant="primary" onClick={fetchIncidents}>Retry</Button>
            </div>
          </Card>
        ) : (
          <IncidentsList />
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button variant="secondary" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Previous
            </Button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <Button variant="secondary" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </Button>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Incident">
        {/* eslint-disable-next-line react-hooks/refs */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input {...register('title')}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#534AB7] focus:border-transparent outline-none transition"
              placeholder="Brief description of the incident" />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Severity</label>
            <select {...register('severity')}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#534AB7] focus:border-transparent outline-none transition">
              <option value="P1">P1 - Critical</option>
              <option value="P2">P2 - High</option>
              <option value="P3">P3 - Medium</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assignee</label>
            <input {...register('assignee')}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#534AB7] focus:border-transparent outline-none transition"
              placeholder="Person responsible" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SLA (minutes)</label>
            <input {...register('slaMinutes', { valueAsNumber: true })} type="number" min={1}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#534AB7] focus:border-transparent outline-none transition" />
            {errors.slaMinutes && <p className="text-xs text-red-500 mt-1">{errors.slaMinutes.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" loading={submitting}>Create</Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  )
}
