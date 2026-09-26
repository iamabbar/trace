import { CodeBlock } from '@/components/ui/codeBlock'
import { LedgerSection } from '@/features/analysis/components/ledgerSection'
import type { Recommendation } from '@/features/analysis/types'

export function RecommendationList({ items }: { items: Recommendation[] }) {
  return (
    <LedgerSection
      index="04"
      title="Recommendations"
      subtitle="Concrete fixes for the highest-impact issues."
    >
      <ol>
        {items.map((item, index) => (
          <li
            key={item.id}
            id={item.id}
            className={
              index === 0
                ? 'border-low flex flex-col gap-4 border-t py-6'
                : 'hairline-faint flex flex-col gap-4 border-t py-6'
            }
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <span className="flex flex-col gap-0.5">
                <span className="text-tertiary font-mono text-[11px] tracking-[0.08em]">
                  {item.category}
                </span>
                <span className="text-base font-bold">{item.title}</span>
              </span>
              <span className="text-success text-[13px] font-bold whitespace-nowrap tabular-nums">
                {item.savings}
              </span>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-x-10 gap-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-tertiary text-xs font-semibold">
                  Why it matters
                </span>
                <p className="text-secondary text-pretty">{item.why}</p>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-tertiary text-xs font-semibold">Suggested fix</span>
                <p className="text-pretty">{item.fix}</p>
                <CodeBlock code={item.code} />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </LedgerSection>
  )
}
