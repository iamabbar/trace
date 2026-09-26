import { useId, useState } from 'react'

import { StatusMark, type StatusTone } from '@/components/ui/statusMark'
import { tabPanelProps, UnderlineTabs } from '@/components/ui/underlineTabs'
import { LedgerSection } from '@/features/analysis/components/ledgerSection'
import type { ResourceRow, ResourceType } from '@/features/analysis/types'

const TYPE_DOTS: Record<ResourceType, string> = {
  JavaScript: 'var(--cyan)',
  CSS: 'var(--accent-lilac)',
  Image: 'var(--accent-salmon)',
  Font: 'var(--accent-violet)',
}

const STATUS_TONES: Record<ResourceRow['status'], StatusTone> = {
  Large: 'poor',
  Review: 'warn',
  OK: 'good',
}

const TABS = [
  { value: 'All', label: 'All' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'CSS', label: 'CSS' },
  { value: 'Image', label: 'Images' },
  { value: 'Font', label: 'Fonts' },
] as const

type Filter = (typeof TABS)[number]['value']

export function ResourceAnalysis({
  resources,
  totalWeight,
}: {
  resources: ResourceRow[]
  totalWeight: string
}) {
  const tabsId = useId()
  const [filter, setFilter] = useState<Filter>('All')
  const visible = resources.filter((row) => filter === 'All' || row.type === filter)

  const countFor = (value: Filter) =>
    value === 'All'
      ? resources.length
      : resources.filter((row) => row.type === value).length

  const typeShares = (Object.keys(TYPE_DOTS) as ResourceType[]).map((type) => ({
    type,
    share: resources
      .filter((row) => row.type === type)
      .reduce((total, row) => total + row.share, 0),
  }))

  return (
    <LedgerSection
      index="05"
      title="Resource analysis"
      subtitle={`${totalWeight} transferred across ${String(resources.length)} resources. Images and JavaScript make up 91%.`}
    >
      <div aria-hidden="true" className="my-1 mb-3 flex h-2 gap-[3px]">
        {typeShares.map((item) => (
          <span
            key={item.type}
            className="rounded-[3px] opacity-60"
            style={{ width: `${String(item.share)}%`, background: TYPE_DOTS[item.type] }}
          />
        ))}
      </div>

      <UnderlineTabs
        id={tabsId}
        label="Filter by type"
        value={filter}
        onChange={setFilter}
        tabs={TABS.map((tab) => ({
          value: tab.value,
          label: tab.label,
          count: countFor(tab.value),
          dotColor: tab.value === 'All' ? undefined : TYPE_DOTS[tab.value],
        }))}
      />

      <div {...tabPanelProps(tabsId, filter)} className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-[13px]">
          <thead>
            <tr className="text-tertiary text-left text-xs">
              <th scope="col" className="py-2.5 font-semibold">
                Resource
              </th>
              <th scope="col" className="px-3 py-2.5 font-semibold">
                Type
              </th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold">
                Size
              </th>
              <th scope="col" className="w-[26%] px-3 py-2.5 font-semibold">
                Share of page weight
              </th>
              <th scope="col" className="px-3 py-2.5 text-right font-semibold">
                Load
              </th>
              <th scope="col" className="py-2.5 pl-3 font-semibold">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id} className="hairline-faint hover:bg-tag border-t">
                <th scope="row" className="py-3 text-left font-normal">
                  <span className="block font-mono text-[13px] font-semibold">
                    {row.name}
                  </span>
                  <span className="text-tertiary block font-mono text-[11px]">
                    {row.path}
                  </span>
                </th>
                <td className="text-secondary px-3 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="size-[7px] rounded-[2px]"
                      style={{ background: TYPE_DOTS[row.type] }}
                    />
                    {row.type}
                  </span>
                </td>
                <td className="px-3 py-3 text-right font-bold whitespace-nowrap tabular-nums">
                  {row.size}
                </td>
                <td className="px-3 py-3">
                  <span className="flex items-center gap-2.5">
                    <span className="bg-tag-hover relative h-[3px] flex-1 rounded-[2px]">
                      <span
                        className="bg-secondary absolute inset-y-0 left-0 rounded-[2px]"
                        style={{ width: `${String(row.share)}%` }}
                      />
                    </span>
                    <span className="text-secondary w-9 text-right text-xs tabular-nums">
                      {row.share}%
                    </span>
                  </span>
                </td>
                <td className="text-secondary px-3 py-3 text-right whitespace-nowrap tabular-nums">
                  {row.load}
                </td>
                <td className="py-3 pl-3">
                  <StatusMark tone={STATUS_TONES[row.status]} size={7}>
                    {row.status}
                  </StatusMark>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="hairline-faint text-tertiary border-t pt-3.5 text-xs">
        Showing {visible.length} of {resources.length} resources · third-party requests
        excluded
      </p>
    </LedgerSection>
  )
}
