import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  buildAnalysisError,
  shouldFail,
  type AnalysisError,
} from '@/features/analysis/lib/analysisErrors'
import { describeSteps, TOTAL_DURATION_MS } from '@/features/analysis/lib/analysisSteps'
import { hostOf } from '@/features/analysis/lib/urlInput'
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
    // so a throttled background tab cannot drift the step timings.
    const startedAt = performance.now()
    const willFail = shouldFail(request.url)

    const timer = window.setInterval(() => {
      const next = performance.now() - startedAt
      if (next < TOTAL_DURATION_MS) {
        setElapsedMs(next)
        return
      }

      setElapsedMs(TOTAL_DURATION_MS)
      if (willFail) {
        setError(buildAnalysisError(hostOf(request.url)))
        setStatus('error')
      } else {
        setReport(buildMockReport(request))
        setStatus('complete')
      }
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

  // Keeps the request so returning to the form still holds the URL that was run.
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
    progress: Math.min(1, elapsedMs / TOTAL_DURATION_MS),
    start,
    retry,
    reset,
  }
}
