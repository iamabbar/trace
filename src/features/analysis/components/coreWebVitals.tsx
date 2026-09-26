import { Info } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/ui/statusBadge'
import { ThresholdBar } from '@/components/ui/thresholdBar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { WebVital } from '@/features/analysis/types'
import { BAND_LABELS, BAND_TONES } from '@/lib/scoring'

function VitalCard({ vital }: { vital: WebVital }) {
  return (
    <Card className="flex flex-col gap-4.5 p-6">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-[13px] font-semibold">{vital.code}</span>
          <span className="text-muted-foreground text-[13px]">{vital.name}</span>
        </div>
        <Tooltip>
          <TooltipTrigger
            className="text-faint hover:text-foreground rounded-xs p-0.5 transition-colors"
            aria-label={`About ${vital.code}`}
          >
            <Info aria-hidden="true" className="size-4" strokeWidth={1.4} />
          </TooltipTrigger>
          <TooltipContent>{vital.definition}</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-4xl leading-none font-medium tracking-[-0.03em] tabular-nums">
          {vital.value}
          {vital.unit ? (
            <span className="text-muted-foreground text-xl">{vital.unit}</span>
          ) : null}
        </span>
        <StatusBadge tone={BAND_TONES[vital.band]}>{BAND_LABELS[vital.band]}</StatusBadge>
      </div>

      <ThresholdBar
        position={vital.position}
        goodWidth={vital.goodWidth}
        warnWidth={vital.warnWidth}
        goodLabel={vital.goodLabel}
        warnLabel={vital.warnLabel}
        annotation={{ text: vital.annotation, tone: vital.band }}
        className="mt-2"
      />

      <p className="border-border text-muted-foreground border-t pt-3.5 text-pretty">
        {vital.explanation}
      </p>
    </Card>
  )
}

export function CoreWebVitals({ vitals }: { vitals: WebVital[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {vitals.map((vital) => (
        <VitalCard key={vital.code} vital={vital} />
      ))}
    </div>
  )
}
