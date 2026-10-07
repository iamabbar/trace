import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { buildAnalysisError } from '@/features/analysis/lib/analysisErrors'
import { describeSteps, TOTAL_DURATION_MS } from '@/features/analysis/lib/analysisSteps'
import { hostOf } from '@/features/analysis/lib/urlInput'
import type { AnalysisRequest } from '@/features/analysis/types'
import { analyzeUrl } from '@/lib/api'

export type AnalysisStatus = 'idle' | 'running' | 'complete' | 'error'

// How long the fully-"done" checklist stays on screen before handing off to
// the report, so completion reads as a finish rather than a jump-cut.
const COMPLETION_HOLD_MS = 500

export function useAnalysis() {
  const [request, setRequest] = useState<AnalysisRequest>()
  const [elapsedMs, setElapsedMs] = useState(0)
  const [holdingOnDone, setHoldingOnDone] = useState(false)
  const holdTimerRef = useRef<number | undefined>(undefined)

  const mutation = useMutation({
    mutationFn: analyzeUrl,
    // A mutation lifecycle callback, not a render-phase effect, so it's the
    // right place to kick off the hold the moment a real success lands.
    onSuccess: () => {
      window.clearTimeout(holdTimerRef.current)
      setHoldingOnDone(true)
      holdTimerRef.current = window.setTimeout(() => {
        setHoldingOnDone(false)
      }, COMPLETION_HOLD_MS)
    },
  })

  const status: AnalysisStatus =
    mutation.isPending || holdingOnDone
      ? 'running'
      : mutation.isError
        ? 'error'
        : mutation.isSuccess
          ? 'complete'
          : 'idle'

  // The steps run on their own clock while the request is in flight. Once the
  // audit is real, the server will report which step it is actually on.
  useEffect(() => {
    if (!mutation.isPending) return

    const startedAt = performance.now()
    const timer = window.setInterval(() => {
      // Not capped at TOTAL_DURATION_MS: a real audit can run well past the
      // choreographed timeline, and describeSteps/progress below need to
      // know that so they don't show a false "done" while still waiting.
      setElapsedMs(performance.now() - startedAt)
    }, 100)

    return () => {
      window.clearInterval(timer)
    }
  }, [mutation.isPending])

  const start = useCallback(
    (next: AnalysisRequest) => {
      setRequest(next)
      setElapsedMs(0)
      mutation.mutate(next)
    },
    [mutation],
  )

  const retry = useCallback(() => {
    if (request) start(request)
  }, [request, start])

  // Keeps the request so returning to the form still holds the URL that was run.
  const reset = useCallback(() => {
    window.clearTimeout(holdTimerRef.current)
    setElapsedMs(0)
    setHoldingOnDone(false)
    mutation.reset()
  }, [mutation])

  const steps = useMemo(
    () => describeSteps(elapsedMs, mutation.isPending),
    [elapsedMs, mutation.isPending],
  )

  return {
    status,
    request,
    error:
      mutation.isError && request ? buildAnalysisError(hostOf(request.url)) : undefined,
    report: mutation.data,
    steps,
    // Same reasoning as the step hold: don't let the bar reach 100% while a
    // slow real request is still pending.
    progress: mutation.isPending
      ? Math.min(0.92, elapsedMs / TOTAL_DURATION_MS)
      : Math.min(1, elapsedMs / TOTAL_DURATION_MS),
    start,
    retry,
    reset,
  }
}
