import { Check, LoaderCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { StepProgress } from '@/features/analysis/lib/analysisSteps'
import { formatClock, formatSeconds } from '@/features/analysis/lib/format'
import type { AnalysisRequest } from '@/features/analysis/types'

const DEVICE_LABELS = { mobile: 'Mobile', desktop: 'Desktop' } as const

function StepIcon({ state }: { state: StepProgress['state'] }) {
  if (state === 'done') {
    return (
      <span className="bg-good-foreground text-good flex size-5 items-center justify-center rounded-full">
        <Check className="size-3" strokeWidth={2.4} />
      </span>
    )
  }

  if (state === 'running') {
    return (
      <LoaderCircle
        className="text-primary size-[18px] animate-spin motion-reduce:animate-none"
        strokeWidth={1.8}
      />
    )
  }

  return (
    <span className="flex size-5 items-center justify-center">
      <span className="border-border-strong size-3.5 rounded-full border-[1.5px] border-dashed" />
    </span>
  )
}

function StepRow({ step, isLast }: { step: StepProgress; isLast: boolean }) {
  return (
    <li
      className={
        isLast
          ? 'grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-3 py-3'
          : 'border-border grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-3 border-b py-3'
      }
    >
      <StepIcon state={step.state} />

      <span className="flex min-w-0 flex-col">
        <span
          className={
            step.state === 'running'
              ? 'text-sm font-semibold'
              : step.state === 'queued'
                ? 'text-muted-foreground text-sm'
                : 'text-sm'
          }
        >
          {step.label}
        </span>
        {step.state === 'running' && step.detail ? (
          <span className="text-muted-foreground truncate font-mono text-xs">
            {step.detail}
          </span>
        ) : null}
      </span>

      <span
        className={
          step.state === 'running'
            ? 'text-primary font-mono text-xs'
            : 'text-muted-foreground font-mono text-xs'
        }
      >
        {step.state === 'done'
          ? formatSeconds(step.elapsedMs)
          : step.state === 'running'
            ? 'running'
            : 'queued'}
      </span>
    </li>
  )
}

type AnalysisProgressProps = {
  request: AnalysisRequest
  steps: StepProgress[]
  elapsedMs: number
  progress: number
  onCancel: () => void
}

export function AnalysisProgress({
  request,
  steps,
  elapsedMs,
  progress,
  onCancel,
}: AnalysisProgressProps) {
  const activeStep = steps.find((step) => step.state === 'running')

  return (
    <Card
      aria-labelledby="analysis-progress-title"
      className="w-full max-w-[560px] shadow-[0_1px_2px_rgb(20_20_20/0.04),0_16px_40px_-12px_rgb(20_20_20/0.14)]"
    >
      <div className="flex flex-col gap-3.5 p-6 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1">
            <h2
              id="analysis-progress-title"
              className="text-xl font-semibold tracking-[-0.01em]"
            >
              Analyzing your website…
            </h2>
            <p className="text-muted-foreground truncate font-mono text-[13px]">
              {request.url} · {DEVICE_LABELS[request.device]}
            </p>
          </div>
          <span className="text-muted-foreground shrink-0 font-mono text-[13px] tabular-nums">
            {formatClock(elapsedMs)}
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Analysis progress"
          className="bg-track h-1 overflow-hidden rounded-sm"
        >
          <div
            className="bg-primary h-full rounded-sm transition-[width] duration-100 ease-linear"
            style={{ width: `${String(Math.round(progress * 100))}%` }}
          />
        </div>
      </div>

      <ol className="border-border flex flex-col border-t px-6 py-1">
        {steps.map((step, index) => (
          <StepRow key={step.id} step={step} isLast={index === steps.length - 1} />
        ))}
      </ol>

      <div className="border-border bg-muted flex flex-col gap-3 rounded-b-md border-t px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-[13px] text-pretty">
          Usually takes 20–40 seconds. You can leave — we&rsquo;ll keep the report.
        </p>
        <Button type="button" size="sm" onClick={onCancel} className="self-start">
          Cancel
        </Button>
      </div>

      {/* The live region holds only the active step label. Putting it on the card
          would re-announce the whole thing on every timer tick. */}
      {activeStep ? (
        <span role="status" aria-live="polite" className="sr-only">
          {activeStep.label}
        </span>
      ) : null}
    </Card>
  )
}
