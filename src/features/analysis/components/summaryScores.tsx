import { StatusMark } from '@/components/ui/statusMark'
import { LedgerSection } from '@/features/analysis/components/ledgerSection'
import type { CategoryScore } from '@/features/analysis/types'
import { BAND_LABELS, BAND_TONES, scoreBand } from '@/lib/scoring'

const LEGEND = [
  { tone: 'good', label: '90–100 Good' },
  { tone: 'warn', label: '50–89 Needs improvement' },
  { tone: 'poor', label: '0–49 Poor' },
] as const

export function SummaryScores({ scores }: { scores: CategoryScore[] }) {
  return (
    <LedgerSection index="00" title="Summary" subtitle="Lighthouse categories, 0–100">
      <div className="flex flex-col gap-9">
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-x-6 gap-y-7">
          {scores.map((category) => {
            const band = scoreBand(category.score)

            return (
              <li key={category.id} className="flex flex-col gap-1.5">
                <span className="flex items-baseline gap-1.5">
                  <span className="text-[52px] leading-none font-extrabold tracking-[-0.05em] tabular-nums">
                    {category.score}
                  </span>
                  <span className="text-tertiary text-[13px]">/100</span>
                </span>
                <span className="text-sm font-semibold whitespace-nowrap">
                  {category.label}
                </span>
                <StatusMark tone={BAND_TONES[band]}>{BAND_LABELS[band]}</StatusMark>
                <span className="text-secondary text-xs">{category.note}</span>
              </li>
            )
          })}
        </ul>

        <ul className="text-tertiary flex flex-wrap gap-x-5 gap-y-2 text-xs">
          {LEGEND.map((item) => (
            <li key={item.label}>
              <StatusMark tone={item.tone} size={7} className="text-tertiary font-normal">
                <span className="text-tertiary">{item.label}</span>
              </StatusMark>
            </li>
          ))}
        </ul>
      </div>
    </LedgerSection>
  )
}
