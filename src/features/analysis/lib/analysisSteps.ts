export type AnalysisStepId = 'load' | 'audit' | 'resources' | 'recommend'

export type AnalysisStep = {
  id: AnalysisStepId
  label: string
  /** Detail shown only while this step is the active one. */
  detail?: string
  durationMs: number
}

/* Compressed against a real Lighthouse run so the mock stays quick to iterate
   on. Real durations will come back from the backend. */
export const ANALYSIS_STEPS: readonly AnalysisStep[] = [
  { id: 'load', label: 'Loading website', durationMs: 1200 },
  { id: 'audit', label: 'Running performance audit', durationMs: 3400 },
  {
    id: 'resources',
    label: 'Analyzing resources',
    detail: '84 requests captured · checking vendor.js',
    durationMs: 2200,
  },
  { id: 'recommend', label: 'Generating recommendations', durationMs: 1200 },
]

export const TOTAL_DURATION_MS = ANALYSIS_STEPS.reduce(
  (total, step) => total + step.durationMs,
  0,
)

export type StepState = 'done' | 'running' | 'queued'

export type StepProgress = AnalysisStep & {
  state: StepState
  elapsedMs: number
}

export function describeSteps(elapsedMs: number): StepProgress[] {
  let startedAt = 0

  return ANALYSIS_STEPS.map((step) => {
    const endsAt = startedAt + step.durationMs
    const state: StepState =
      elapsedMs >= endsAt ? 'done' : elapsedMs >= startedAt ? 'running' : 'queued'
    const stepElapsed = Math.min(step.durationMs, Math.max(0, elapsedMs - startedAt))

    startedAt = endsAt
    return { ...step, state, elapsedMs: stepElapsed }
  })
}
