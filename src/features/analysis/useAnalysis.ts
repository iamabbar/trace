import { useMutation } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { buildAnalysisError } from '@/features/analysis/lib/analysisErrors'
import { describeSteps, TOTAL_DURATION_MS } from '@/features/analysis/lib/analysisSteps'
import { hostOf } from '@/features/analysis/lib/urlInput'
import type { AnalysisRequest } from '@/features/analysis/types'
import { analyzeUrl } from '@/lib/api'

export type AnalysisStatus = 'idle' | 'running' | 'complete' | 'error'

export function useAnalysis() {
  const [request, setRequest] = useState<AnalysisRequest>()
  const [elapsedMs, setElapsedMs] = useState(0)
  const mutation = useMutation({ mutationFn: analyzeUrl })

  const status: AnalysisStatus = mutation.isPending
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
      setElapsedMs(Math.min(TOTAL_DURATION_MS, performance.now() - startedAt))
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
    setElapsedMs(0)
    mutation.reset()
  }, [mutation])

  const steps = useMemo(() => describeSteps(elapsedMs), [elapsedMs])

  return {
    status,
    request,
    error:
      mutation.isError && request ? buildAnalysisError(hostOf(request.url)) : undefined,
    report: mutation.data,
    steps,
    progress: Math.min(1, elapsedMs / TOTAL_DURATION_MS),
    start,
    retry,
    reset,
  }
}
