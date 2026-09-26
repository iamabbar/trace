import { Check } from 'lucide-react'

import { hostOf } from '@/features/analysis/lib/urlInput'
import type { StepProgress } from '@/features/analysis/lib/analysisSteps'
import type { AnalysisRequest } from '@/features/analysis/types'

const STATE_LABELS = { done: 'Done', running: 'Running…', waiting: 'Waiting' } as const

function StepRing({ state }: { state: StepProgress['state'] }) {
  if (state === 'done') {
    return (
      <span className="border-cyan bg-cyan text-on-cyan grid size-5 place-items-center rounded-full border-[1.5px]">
        <Check aria-hidden="true" className="size-[11px]" strokeWidth={3} />
      </span>
    )
  }

  return (
    <span
      className={
        state === 'running'
          ? 'border-cyan grid size-5 place-items-center rounded-full border-[1.5px]'
          : 'border-low grid size-5 place-items-center rounded-full border-[1.5px]'
      }
    />
  )
}

type AnalysisProgressProps = {
  request: AnalysisRequest
  runNumber: number
  steps: StepProgress[]
  progress: number
}

export function AnalysisProgress({
  request,
  runNumber,
  steps,
  progress,
}: AnalysisProgressProps) {
  const currentIndex = steps.findIndex((step) => step.state === 'running')
  const stepNumber = currentIndex === -1 ? steps.length : currentIndex + 1
  const activeStep = steps[currentIndex]

  return (
    <section aria-label="Analysis in progress" aria-busy="true" className="mt-10">
      <div className="text-tertiary font-mono text-xs tracking-[0.08em]">
        RUNNING · RUN #{runNumber}
      </div>
      <h2 className="mt-2 text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em] break-all">
        {hostOf(request.url)}
      </h2>
      <p className="text-secondary mt-1 text-[13px]">
        Step {stepNumber} of {steps.length} · about 30 s
      </p>

      <div
        role="progressbar"
        aria-label="Audit progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="bg-low mt-7 h-0.5"
      >
        <div
          className="bg-cyan h-full transition-[width] duration-700 ease-out"
          style={{ width: `${String(Math.round(progress * 100))}%` }}
        />
      </div>

      <ol>
        {steps.map((step) => (
          <li
            key={step.label}
            className="border-low flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b py-4.5"
          >
            <span
              className={
                step.state === 'waiting'
                  ? 'text-tertiary flex items-center gap-3.5 font-semibold'
                  : 'flex items-center gap-3.5 font-semibold'
              }
            >
              <StepRing state={step.state} />
              {step.label}
            </span>
            <span className="text-tertiary text-xs">{STATE_LABELS[step.state]}</span>
          </li>
        ))}
      </ol>

      {/* One announcement per step transition, rather than the whole list on
          every tick. */}
      {activeStep ? (
        <span role="status" aria-live="polite" className="sr-only">
          {activeStep.label}
        </span>
      ) : null}
    </section>
  )
}
