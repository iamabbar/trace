import { Clock, HardDrive, ShieldX, TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { AnalysisError } from '@/features/analysis/lib/analysisErrors'

const ICONS = {
  server: HardDrive,
  clock: Clock,
  shield: ShieldX,
  warning: TriangleAlert,
} as const

const TONE_STYLES = {
  poor: { code: 'text-destructive', tile: 'bg-destructive-foreground text-destructive' },
  warn: { code: 'text-warn', tile: 'bg-warn-foreground text-warn' },
  neutral: {
    code: 'text-muted-foreground',
    tile: 'bg-muted text-muted-foreground border border-border',
  },
} as const

type AnalysisErrorCardProps = {
  error: AnalysisError
  onRetry: () => void
  onEdit: () => void
}

export function AnalysisErrorCard({ error, onRetry, onEdit }: AnalysisErrorCardProps) {
  const Icon = ICONS[error.icon]
  const tone = TONE_STYLES[error.tone]

  return (
    <Card role="alert" className="flex w-full max-w-[560px] flex-col gap-4.5 p-7">
      <div className="flex items-center justify-between gap-4">
        <span className="text-muted-foreground font-mono text-[11px] font-medium tracking-[0.08em] uppercase">
          {error.eyebrow}
        </span>
        <span className={`font-mono text-xs ${tone.code}`}>{error.code}</span>
      </div>

      <div className="flex gap-4">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-sm ${tone.tile}`}
        >
          <Icon className="size-[18px]" strokeWidth={1.5} />
        </span>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-semibold">{error.title}</h2>
          <p className="text-muted-foreground text-pretty">{error.description}</p>
        </div>
      </div>

      <div className="border-border bg-code text-muted-foreground flex flex-col gap-0.5 rounded-sm border px-3 py-2.5 font-mono text-xs">
        {error.detail.map((line) => (
          <span key={line} className="break-all">
            {line}
          </span>
        ))}
      </div>

      <p className="text-muted-foreground text-[13px] text-pretty">{error.hint}</p>

      <div className="flex flex-wrap gap-2">
        {error.actions.map((action, index) => (
          <Button
            key={action.label}
            variant={action.variant}
            // Only the first two actions have somewhere to go before a backend
            // exists; the rest are present for layout and are left inert.
            onClick={index === 0 ? onRetry : index === 1 ? onEdit : undefined}
            disabled={index > 1}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </Card>
  )
}
