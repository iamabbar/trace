export const ANALYSIS_STEPS = [
  'Loading the page',
  'Running Lighthouse audits',
  'Measuring Core Web Vitals',
  'Analyzing resources',
] as const

/* Compressed against a real Lighthouse run so the mock stays quick to iterate
   on. The design advances a step roughly every 0.9s. */
export const STEP_DURATION_MS = 900
export const TOTAL_DURATION_MS = ANALYSIS_STEPS.length * STEP_DURATION_MS

export type StepState = 'done' | 'running' | 'waiting'

export type StepProgress = {
  label: string
  state: StepState
}

export function describeSteps(elapsedMs: number): StepProgress[] {
  const current = Math.floor(elapsedMs / STEP_DURATION_MS)

  return ANALYSIS_STEPS.map((label, index) => ({
    label,
    state: index < current ? 'done' : index === current ? 'running' : 'waiting',
  }))
}
