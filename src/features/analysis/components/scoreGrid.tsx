import { Card } from '@/components/ui/card'
import { ScoreMeter } from '@/components/ui/scoreMeter'
import { StatusBadge } from '@/components/ui/statusBadge'
import type { CategoryScore } from '@/features/analysis/types'
import { BAND_LABELS, BAND_TONES, scoreBand } from '@/lib/scoring'

const LEGEND = [
  { label: '90–100 Good', shape: 'rounded-full', fill: 'bg-good' },
  { label: '50–89 Needs improvement', shape: 'rounded-[1.5px]', fill: 'bg-warn' },
  {
    label: '0–49 Poor',
    shape: 'w-[9px] [clip-path:polygon(50%_0,100%_100%,0_100%)]',
    fill: 'bg-destructive',
  },
]

function ScoreCard({ category }: { category: CategoryScore }) {
  const band = scoreBand(category.score)

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{category.label}</span>
        <StatusBadge tone={BAND_TONES[band]}>{BAND_LABELS[band]}</StatusBadge>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-[44px] leading-none font-medium tracking-[-0.04em] tabular-nums">
          {category.score}
        </span>
        <span className="text-muted-foreground font-mono text-sm">/100</span>
      </div>
      <ScoreMeter score={category.score} />
      <p className="text-muted-foreground text-[13px]">{category.note}</p>
    </Card>
  )
}

export function ScoreGrid({ scores }: { scores: CategoryScore[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {scores.map((category) => (
          <ScoreCard key={category.id} category={category} />
        ))}
      </div>
      <ul className="text-muted-foreground flex flex-wrap gap-x-5 gap-y-1.5 text-xs">
        {LEGEND.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={`size-2 ${item.shape} ${item.fill}`} />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
