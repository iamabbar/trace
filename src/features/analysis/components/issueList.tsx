import { Ban, Code, HardDrive, Image } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { StatusBadge, type StatusTone } from '@/components/ui/statusBadge'
import type { Issue, IssueSeverity } from '@/features/analysis/types'

const ICONS = { image: Image, code: Code, blocking: Ban, server: HardDrive } as const

const SEVERITY_LABELS: Record<IssueSeverity, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

const SEVERITY_TONES: Record<IssueSeverity, StatusTone> = {
  high: 'poor',
  medium: 'warn',
  low: 'neutral',
}

const FILTERS = ['all', 'high', 'medium', 'low'] as const
type Filter = (typeof FILTERS)[number]

function IssueRow({ issue, isLast }: { issue: Issue; isLast: boolean }) {
  const Icon = ICONS[issue.icon]

  return (
    <li
      className={
        isLast
          ? 'grid grid-cols-[40px_minmax(0,1fr)] gap-4 p-5 sm:gap-5 lg:grid-cols-[40px_minmax(0,1fr)_170px_auto]'
          : 'border-border grid grid-cols-[40px_minmax(0,1fr)] gap-4 border-b p-5 sm:gap-5 lg:grid-cols-[40px_minmax(0,1fr)_170px_auto]'
      }
    >
      <span className="border-border bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-sm border">
        <Icon className="size-[18px]" strokeWidth={1.4} />
      </span>

      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="font-semibold">{issue.title}</h3>
          <StatusBadge tone={SEVERITY_TONES[issue.severity]}>
            {SEVERITY_LABELS[issue.severity]}
          </StatusBadge>
        </div>
        <code className="border-border bg-code self-start rounded-xs border px-1.5 font-mono text-[12.5px] break-all">
          {issue.target}
        </code>
        <p className="text-muted-foreground max-w-[640px] text-pretty">
          {issue.description}
        </p>
      </div>

      <div className="col-start-2 flex flex-col gap-0.5 lg:col-start-3">
        <span className="text-muted-foreground text-xs">Est. savings</span>
        <span className="font-mono text-sm font-medium tabular-nums">
          {issue.savings}
        </span>
      </div>

      <div className="col-start-2 lg:col-start-4 lg:justify-self-end">
        <Button size="sm" disabled>
          View details
        </Button>
      </div>
    </li>
  )
}

export function IssueList({ issues }: { issues: Issue[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const visible = issues.filter((issue) => filter === 'all' || issue.severity === filter)

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-label="Filter by severity"
      >
        {FILTERS.map((id) => (
          <Chip
            key={id}
            selected={filter === id}
            count={
              id === 'all'
                ? issues.length
                : issues.filter((issue) => issue.severity === id).length
            }
            onClick={() => {
              setFilter(id)
            }}
          >
            {id === 'all' ? 'All' : SEVERITY_LABELS[id]}
          </Chip>
        ))}
      </div>

      {visible.length === 0 ? (
        <Card className="text-muted-foreground p-6 text-center text-[13px]">
          No {SEVERITY_LABELS[filter as IssueSeverity].toLowerCase()}-severity issues.
          Nothing to fix in this filter — try “All”.
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <ul className="flex flex-col">
            {visible.map((issue, index) => (
              <IssueRow
                key={issue.id}
                issue={issue}
                isLast={index === visible.length - 1}
              />
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
