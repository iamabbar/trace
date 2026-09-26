import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  buildAnalysisError,
  mockErrorFor,
  type AnalysisError,
} from '@/features/analysis/lib/analysisErrors'
import { describeSteps, TOTAL_DURATION_MS } from '@/features/analysis/lib/analysisSteps'
import { buildMockReport } from '@/features/analysis/mock/mockReport'
import type { AnalysisReport, AnalysisRequest } from '@/features/analysis/types'

export type AnalysisStatus = 'idle' | 'running' | 'complete' | 'error'

export function useAnalysis() {
  const [status, setStatus] = useState<AnalysisStatus>('idle')
  const [request, setRequest] = useState<AnalysisRequest>()
  const [error, setError] = useState<AnalysisError>()
  const [report, setReport] = useState<AnalysisReport>()
  const [elapsedMs, setElapsedMs] = useState(0)

  useEffect(() => {
    if (status !== 'running' || !request) return

    // Derive elapsed from a single start stamp rather than accumulating ticks,
    // so a throttled background tab cannot drift the timings.
    const startedAt = performance.now()
    const failWith = mockErrorFor(request.url)

    // Failures surface part-way through rather than at the end, which is where
    // a refused connection or a bot challenge would actually show up.
    const failAt = TOTAL_DURATION_MS * 0.55

    const timer = window.setInterval(() => {
      const next = performance.now() - startedAt

      if (failWith && next >= failAt) {
        setElapsedMs(failAt)
        setError(buildAnalysisError(failWith, request.url))
        setStatus('error')
        return
      }

      if (next >= TOTAL_DURATION_MS) {
        setElapsedMs(TOTAL_DURATION_MS)
        setReport(buildMockReport(request))
        setStatus('complete')
        return
      }

      setElapsedMs(next)
    }, 100)

    return () => {
      window.clearInterval(timer)
    }
  }, [status, request])

  const start = useCallback((next: AnalysisRequest) => {
    setRequest(next)
    setError(undefined)
    setReport(undefined)
    setElapsedMs(0)
    setStatus('running')
  }, [])

  const retry = useCallback(() => {
    setError(undefined)
    setReport(undefined)
    setElapsedMs(0)
    setStatus('running')
  }, [])

  // Keeps the request so a cancelled run returns to a form that still holds the
  // URL the user typed.
  const reset = useCallback(() => {
    setStatus('idle')
    setError(undefined)
    setElapsedMs(0)
  }, [])

  const steps = useMemo(() => describeSteps(elapsedMs), [elapsedMs])

  return {
    status,
    request,
    error,
    report,
    steps,
    elapsedMs,
    progress: Math.min(1, elapsedMs / TOTAL_DURATION_MS),
    start,
    retry,
    reset,
  }
}
