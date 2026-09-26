import { StatusMark, toneColor } from '@/components/ui/statusMark'
import { LedgerSection } from '@/features/analysis/components/ledgerSection'
import type { WebVital } from '@/features/analysis/types'

function ThresholdTrack({ vital }: { vital: WebVital }) {
  const marker = `${String(vital.markerPercent)}%`

  return (
    <div aria-hidden="true" className="relative h-16 self-center">
      <span
        className="absolute top-0 -translate-x-1/2 text-xs font-semibold whitespace-nowrap"
        style={{ left: marker, color: toneColor(vital.tone) }}
      >
        {vital.delta}
      </span>

      <div className="absolute inset-x-0 top-7 flex h-1 gap-[3px]">
        <span
          className="bg-success rounded-[2px] opacity-35"
          style={{ flex: vital.goodFlex }}
        />
        <span
          className="bg-warning rounded-[2px] opacity-35"
          style={{ flex: vital.warnFlex }}
        />
        <span
          className="bg-error rounded-[2px] opacity-35"
          style={{ flex: vital.poorFlex }}
        />
      </div>

      <span
        className="bg-primary absolute top-[22px] -ml-[1.5px] h-4 w-[3px] rounded-[2px]"
        style={{ left: marker }}
      />

      <span
        className="text-tertiary absolute top-11 -translate-x-1/2 text-[11px] tabular-nums"
        style={{ left: `${String(vital.label1Percent)}%` }}
      >
        {vital.label1}
      </span>
      <span
        className="text-tertiary absolute top-11 -translate-x-1/2 text-[11px] tabular-nums"
        style={{ left: `${String(vital.label2Percent)}%` }}
      >
        {vital.label2}
      </span>
    </div>
  )
}

export function CoreWebVitals({ vitals }: { vitals: WebVital[] }) {
  const passing = vitals.filter((vital) => vital.tone === 'good').length

  return (
    <LedgerSection
      index="01"
      title="Core Web Vitals"
      subtitle="How real visitors experience loading, responsiveness and visual stability. Google uses these for search ranking."
      note={
        <p
          className="mt-2.5 text-[13px] font-semibold"
          style={{ color: toneColor(passing === vitals.length ? 'good' : 'warn') }}
        >
          {passing} of {vitals.length} passing
        </p>
      }
    >
      {vitals.map((vital, index) => (
        <div
          key={vital.key}
          className={
            index === 0
              ? 'border-low grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-10 gap-y-4 border-t py-6'
              : 'hairline-faint grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-10 gap-y-4 border-t py-6'
          }
        >
          <div className="flex min-w-0 flex-col gap-2">
            <span>
              <strong className="font-bold">{vital.key}</strong>{' '}
              <span className="text-secondary text-[13px]">{vital.full}</span>
            </span>
            <span className="flex flex-wrap items-baseline gap-3">
              <span className="text-[30px] leading-[1.1] font-extrabold tracking-[-0.03em] tabular-nums">
                {vital.value}
                {vital.unit ? (
                  <span className="text-secondary text-base font-semibold">
                    {vital.unit}
                  </span>
                ) : null}
              </span>
              <StatusMark tone={vital.tone}>{vital.status}</StatusMark>
            </span>
            <p className="text-secondary text-[13px] text-pretty">{vital.description}</p>
          </div>

          <ThresholdTrack vital={vital} />
        </div>
      ))}
    </LedgerSection>
  )
}
