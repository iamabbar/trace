import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/statusBadge'
import type { TimingMetric } from '@/features/analysis/types'
import { BAND_FILLS, BAND_TONES } from '@/lib/scoring'

const BAND_SHORT_LABELS = { good: 'Good', warn: 'Improve', poor: 'Poor' } as const

export function PerformanceOverview({ timings }: { timings: TimingMetric[] }) {
  return (
    <Card className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {timings.map((timing, index) => (
        <div
          key={timing.code}
          className={
            index === timings.length - 1
              ? 'flex flex-col gap-3 p-6'
              : 'border-border flex flex-col gap-3 border-b p-6 lg:border-r lg:border-b-0 lg:[&:nth-child(2)]:border-r sm:[&:nth-child(odd)]:border-r'
          }
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground text-[13px]">
              <span className="text-foreground font-mono font-semibold">
                {timing.code}
              </span>{' '}
              · {timing.name}
            </span>
            <StatusBadge tone={BAND_TONES[timing.band]} className="px-1.5">
              {BAND_SHORT_LABELS[timing.band]}
            </StatusBadge>
          </div>

          <span className="font-mono text-[28px] leading-none font-medium tracking-[-0.03em] tabular-nums">
            {timing.value}
          </span>

          <div className="flex flex-col gap-1">
            <div className="bg-track relative h-1 rounded-sm">
              <div
                className={`absolute inset-y-0 left-0 rounded-sm ${BAND_FILLS[timing.band]}`}
                style={{ width: `${String(timing.fillPercent)}%` }}
              />
              <div
                aria-hidden="true"
                className="bg-muted-foreground absolute -top-[3px] h-2.5 w-px"
                style={{ left: `${String(timing.targetPercent)}%` }}
              />
            </div>
            <span className="text-muted-foreground font-mono text-[11px]">
              target ≤ {timing.target}
            </span>
          </div>
        </div>
      ))}
    </Card>
  )
}
