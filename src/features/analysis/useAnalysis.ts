import { useCallback, useEffect, useMemo, useState } from 'react'

import { describeSteps, TOTAL_DURATION_MS } from '@/features/analysis/lib/analysisSteps'
import type { AnalysisRequest } from '@/features/analysis/types'

export type AnalysisStatus = 'idle' | 'running' | 'complete'

export function useAnalysis() {
  const [status, setStatus] = useState<AnalysisStatus>('idle')
  const [request, setRequest] = useState<AnalysisRequest>()
  const [elapsedMs, setElapsedMs] = useState(0)

  useEffect(() => {
    if (status !== 'running') return

    // Derive elapsed from a single start stamp rather than accumulating ticks,
    // so a throttled background tab cannot drift the timings.
    const startedAt = performance.now()
    const timer = window.setInterval(() => {
      const next = performance.now() - startedAt
      if (next >= TOTAL_DURATION_MS) {
        setElapsedMs(TOTAL_DURATION_MS)
        setStatus('complete')
      } else {
        setElapsedMs(next)
      }
    }, 100)

    return () => {
      window.clearInterval(timer)
    }
  }, [status])

  const start = useCallback((next: AnalysisRequest) => {
    setRequest(next)
    setElapsedMs(0)
    setStatus('running')
  }, [])

  // Keeps the request so a cancelled run returns to a form that still holds the
  // URL the user typed.
  const reset = useCallback(() => {
    setStatus('idle')
    setElapsedMs(0)
  }, [])

  const steps = useMemo(() => describeSteps(elapsedMs), [elapsedMs])

  return {
    status,
    request,
    steps,
    elapsedMs,
    progress: Math.min(1, elapsedMs / TOTAL_DURATION_MS),
    start,
    reset,
  }
}
