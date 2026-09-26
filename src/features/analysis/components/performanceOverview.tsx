import { StatusMark, toneColor } from '@/components/ui/statusMark'
import { LedgerSection } from '@/features/analysis/components/ledgerSection'
import type { LabMetric } from '@/features/analysis/types'

export function PerformanceOverview({ lab }: { lab: LabMetric[] }) {
  return (
    <LedgerSection
      index="02"
      title="Performance overview"
      subtitle="Lab timings from this run."
    >
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-x-8 gap-y-7">
        {lab.map((metric) => (
          <li key={metric.key} className="flex flex-col gap-1.5">
            <span className="text-secondary text-xs">
              <strong className="text-primary font-bold">{metric.key}</strong> ·{' '}
              {metric.full}
            </span>
            <span className="text-[26px] leading-[1.1] font-extrabold tracking-[-0.03em] tabular-nums">
              {metric.value}
            </span>

            <div
              aria-hidden="true"
              className="bg-tag-hover relative my-1.5 h-[3px] rounded-[2px]"
            >
              <div
                className="absolute inset-y-0 left-0 rounded-[2px]"
                style={{
                  width: `${String(metric.fillPercent)}%`,
                  background: toneColor(metric.tone),
                }}
              />
              <span
                className="bg-secondary absolute -top-1 h-[11px] w-px"
                style={{ left: `${String(metric.tickPercent)}%` }}
              />
            </div>

            <span className="flex justify-between gap-2 text-xs">
              <span className="text-tertiary">target ≤ {metric.target}</span>
              <StatusMark tone={metric.tone} size={7}>
                {metric.status}
              </StatusMark>
            </span>
          </li>
        ))}
      </ul>
    </LedgerSection>
  )
}
