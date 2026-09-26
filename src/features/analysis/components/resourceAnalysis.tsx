import { useState } from 'react'

import { Card } from '@/components/ui/card'
import { StatusBadge, type StatusTone } from '@/components/ui/statusBadge'
import { SegmentedChoice } from '@/components/ui/segmentedChoice'
import { ReportSection } from '@/features/analysis/components/reportSection'
import type { ResourceRow } from '@/features/analysis/types'

const STATUS_TONES: Record<ResourceRow['status'], StatusTone> = {
  Large: 'poor',
  Review: 'warn',
  OK: 'good',
}

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'js', label: 'JavaScript' },
  { id: 'css', label: 'CSS' },
  { id: 'img', label: 'Images' },
  { id: 'font', label: 'Fonts' },
] as const

type TabId = (typeof TABS)[number]['id']

const COLUMNS = 'minmax(0,2.4fr) 110px 100px minmax(0,1.4fr) 90px 110px'

function ShareBar({ share }: { share: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="bg-track relative h-1 grow rounded-sm">
        <div
          className="bg-muted-foreground absolute inset-y-0 left-0 rounded-sm"
          style={{ width: `${String(share)}%` }}
        />
      </div>
      <span className="text-muted-foreground w-8 text-right font-mono text-[11.5px] tabular-nums">
        {share}%
      </span>
    </div>
  )
}

export function ResourceAnalysis({
  resources,
  totalWeight,
}: {
  resources: ResourceRow[]
  totalWeight: string
}) {
  const [tab, setTab] = useState<TabId>('all')
  const visible = resources.filter((row) => tab === 'all' || row.kind === tab)

  const countFor = (id: TabId) =>
    id === 'all' ? resources.length : resources.filter((row) => row.kind === id).length

  return (
    <ReportSection
      index="05"
      title="Resource analysis"
      description={`${totalWeight} transferred across ${String(resources.length)} resources. Images and JavaScript make up 91%.`}
      action={
        <SegmentedChoice
          legend="Resource type"
          name="resource-type"
          value={tab}
          options={TABS.map((item) => ({
            value: item.id,
            label: item.label,
            count: countFor(item.id),
          }))}
          onChange={setTab}
          className="max-w-full self-start overflow-x-auto"
        />
      }
    >
      <Card className="overflow-hidden">
        {/* Table on wide screens, stacked cards below — a six-column grid at
            390px is unreadable however it is squeezed. */}
        <div className="hidden lg:block">
          <div
            className="bg-muted border-border text-muted-foreground grid gap-4 border-b px-6 py-3 text-xs font-medium"
            style={{ gridTemplateColumns: COLUMNS }}
          >
            <span>Resource</span>
            <span>Type</span>
            <span className="text-right">Size</span>
            <span>Share of page weight</span>
            <span className="text-right">Load</span>
            <span>Status</span>
          </div>
          <ul>
            {visible.map((row) => (
              <li
                key={row.id}
                className="border-border hover:bg-muted grid items-center gap-4 border-b px-6 py-3 text-[13px] transition-colors"
                style={{ gridTemplateColumns: COLUMNS }}
              >
                <div className="flex min-w-0 flex-col">
                  <span className="font-mono font-medium">{row.name}</span>
                  <span className="text-muted-foreground truncate font-mono text-[11.5px]">
                    {row.path}
                  </span>
                </div>
                <span className="text-muted-foreground">{row.type}</span>
                <span className="text-right font-mono font-medium tabular-nums">
                  {row.size}
                </span>
                <ShareBar share={row.share} />
                <span className="text-muted-foreground text-right font-mono tabular-nums">
                  {row.time}
                </span>
                <span>
                  <StatusBadge tone={STATUS_TONES[row.status]}>{row.status}</StatusBadge>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <ul className="lg:hidden">
          {visible.map((row) => (
            <li key={row.id} className="border-border flex flex-col gap-2 border-b p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-mono text-[13px] font-medium">
                  {row.name}
                </span>
                <StatusBadge tone={STATUS_TONES[row.status]}>{row.status}</StatusBadge>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-muted-foreground w-18 shrink-0 text-xs">
                  {row.type}
                </span>
                <ShareBar share={row.share} />
                <span className="w-14 shrink-0 text-right font-mono text-[13px] font-medium tabular-nums">
                  {row.size}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <p className="text-muted-foreground px-4 py-3 text-[13px] sm:px-6">
          Showing {visible.length} of {resources.length} resources · third-party requests
          excluded
        </p>
      </Card>
    </ReportSection>
  )
}
