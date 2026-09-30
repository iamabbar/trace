import { Code, Image, Server, Slash } from 'lucide-react'
import { useId, useState } from 'react'

import { StatusMark, type StatusTone } from '@/components/ui/statusMark'
import { tabPanelProps, UnderlineTabs } from '@/components/ui/underlineTabs'
import { LedgerSection } from '@/features/analysis/components/ledgerSection'
import type { Issue, IssueSeverity } from '@/features/analysis/types'

const ICONS = { image: Image, slash: Slash, code: Code, server: Server } as const

const SEVERITY_TONES: Record<IssueSeverity, StatusTone> = {
  High: 'poor',
  Medium: 'warn',
  Low: 'low',
}

const FILTERS = ['All', 'High', 'Medium', 'Low'] as const
type Filter = (typeof FILTERS)[number]

export function IssueList({ issues }: { issues: Issue[] }) {
  const tabsId = useId()
  const [filter, setFilter] = useState<Filter>('All')
  const visible = issues.filter((issue) => filter === 'All' || issue.severity === filter)

  return (
    <LedgerSection
      id="issues"
      index="03"
      title="Issues"
      subtitle="Sorted by estimated impact. Start at the top."
    >
      <UnderlineTabs
        id={tabsId}
        label="Filter by severity"
        value={filter}
        onChange={setFilter}
        className="mb-2"
        tabs={FILTERS.map((id) => ({
          value: id,
          label: id,
          count:
            id === 'All'
              ? issues.length
              : issues.filter((issue) => issue.severity === id).length,
        }))}
      />

      <ul {...tabPanelProps(tabsId, filter)}>
        {visible.map((issue) => {
          const Icon = ICONS[issue.icon]

          return (
            <li
              key={issue.id}
              className="hairline-faint grid grid-cols-[20px_minmax(0,1fr)_auto] items-start gap-x-4 gap-y-3.5 border-t py-5"
            >
              <span className="text-tertiary mt-0.5">
                <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
              </span>

              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-[15px] font-bold">{issue.title}</span>
                  <StatusMark tone={SEVERITY_TONES[issue.severity]} size={7}>
                    {issue.severity}
                  </StatusMark>
                </span>
                {issue.file ? (
                  <code className="bg-tag rounded-chip max-w-full self-start overflow-hidden px-2 py-0.5 font-mono text-xs text-ellipsis whitespace-nowrap">
                    {issue.file}
                  </code>
                ) : null}
                <p className="text-secondary max-w-[640px] text-pretty">
                  {issue.description}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 text-right">
                <span className="text-tertiary text-[11px]">Est. savings</span>
                <span className="-mt-2 font-bold whitespace-nowrap tabular-nums">
                  {issue.savings}
                </span>
                {issue.recommendationId ? (
                  <a
                    href={`#${issue.recommendationId}`}
                    className="text-xs font-semibold whitespace-nowrap"
                  >
                    View fix
                  </a>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>
    </LedgerSection>
  )
}
