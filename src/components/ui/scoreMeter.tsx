import { cn } from 'cn'

import { BAND_FILLS, SCORE_THRESHOLDS, scoreBand } from '@/lib/scoring'

type ScoreMeterProps = {
  score: number
  className?: string
}

export function ScoreMeter({ score, className }: ScoreMeterProps) {
  const clamped = Math.min(100, Math.max(0, score))

  return (
    <div
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('bg-track relative h-1.5 rounded-sm', className)}
    >
      <div
        className={cn(
          'absolute inset-y-0 left-0 rounded-sm',
          BAND_FILLS[scoreBand(clamped)],
        )}
        style={{ width: `${String(clamped)}%` }}
      />
      {[SCORE_THRESHOLDS.warn, SCORE_THRESHOLDS.good].map((tick) => (
        <div
          key={tick}
          aria-hidden="true"
          className="bg-border-strong absolute -top-[3px] h-3 w-px"
          style={{ left: `${String(tick)}%` }}
        />
      ))}
    </div>
  )
}
