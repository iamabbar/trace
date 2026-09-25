import { cn } from 'cn'

type ThresholdBarProps = {
  /** Where the measured value sits, 0–100 across the whole bar. */
  position: number
  /** Width of the good band, as a percentage of the bar. */
  goodWidth: number
  /** Width of the needs-improvement band, as a percentage of the bar. */
  warnWidth: number
  goodLabel: string
  warnLabel: string
  annotation?: { text: string; tone: 'good' | 'warn' | 'poor' }
  className?: string
}

const ANNOTATION_TONES = {
  good: 'text-good',
  warn: 'text-warn',
  poor: 'text-destructive',
} as const

export function ThresholdBar({
  position,
  goodWidth,
  warnWidth,
  goodLabel,
  warnLabel,
  annotation,
  className,
}: ThresholdBarProps) {
  const clamped = Math.min(100, Math.max(0, position))

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div aria-hidden="true" className="relative flex h-1.5 gap-0.5">
        <div
          className="bg-good rounded-l-sm opacity-35"
          style={{ width: `${String(goodWidth)}%` }}
        />
        <div className="bg-warn opacity-35" style={{ width: `${String(warnWidth)}%` }} />
        <div className="bg-destructive grow rounded-r-sm opacity-35" />
        <div
          className="bg-foreground shadow-card absolute -top-[5px] h-4 w-[3px] rounded-sm shadow-[0_0_0_2px_var(--card)]"
          style={{ left: `${String(clamped)}%` }}
        />
        {annotation ? (
          <span
            className={cn(
              'absolute -top-5 font-mono text-[11px] font-medium whitespace-nowrap',
              ANNOTATION_TONES[annotation.tone],
            )}
            style={{ left: `calc(${String(clamped)}% + 8px)` }}
          >
            {annotation.text}
          </span>
        ) : null}
      </div>
      <div
        aria-hidden="true"
        className="text-muted-foreground relative h-4 font-mono text-[11px]"
      >
        <span
          className="absolute -translate-x-1/2"
          style={{ left: `${String(goodWidth)}%` }}
        >
          {goodLabel}
        </span>
        <span
          className="absolute -translate-x-1/2"
          style={{ left: `${String(goodWidth + warnWidth)}%` }}
        >
          {warnLabel}
        </span>
      </div>
    </div>
  )
}
