import { ArrowRight, Clock, Download, GitCompareArrows, RotateCw } from 'lucide-react'

import { Button, ButtonLink } from '@/components/ui/button'
import { CoreWebVitals } from '@/features/analysis/components/coreWebVitals'
import { IssueList } from '@/features/analysis/components/issueList'
import { PerformanceOverview } from '@/features/analysis/components/performanceOverview'
import { RecommendationList } from '@/features/analysis/components/recommendationList'
import { ResourceAnalysis } from '@/features/analysis/components/resourceAnalysis'
import { SummaryScores } from '@/features/analysis/components/summaryScores'
import { hostOf } from '@/features/analysis/lib/urlInput'
import type { AnalysisReport } from '@/features/analysis/types'

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function ReportView({
  report,
  onRerun,
}: {
  report: AnalysisReport
  onRerun: () => void
}) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 pt-10 pb-8">
        <div className="min-w-0">
          <div className="text-tertiary font-mono text-xs tracking-[0.08em]">
            REPORT · RUN #{report.runNumber}
          </div>
          <h2 className="mt-2 text-[clamp(26px,3.4vw,36px)] font-bold tracking-[-0.025em] break-all">
            {hostOf(report.request.url)}
          </h2>
          <div className="text-secondary mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
            <span>{DATE_FORMAT.format(report.createdAt)}</span>
            <span>{report.conditions}</span>
            <span>{report.dataNote}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button disabled>
            <GitCompareArrows
              aria-hidden="true"
              className="size-[15px]"
              strokeWidth={1.8}
            />
            Compare
          </Button>
          <Button disabled>
            <Download aria-hidden="true" className="size-[15px]" strokeWidth={1.8} />
            Export
          </Button>
          <Button onClick={onRerun}>
            <RotateCw aria-hidden="true" className="size-[15px]" strokeWidth={1.8} />
            Re-run
          </Button>
        </div>
      </div>

      <div className="border-low flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t py-6">
        <div className="flex min-w-0 flex-[1_1_520px] items-start gap-3.5">
          <span
            className="text-warning grid size-9 flex-none place-items-center rounded-md"
            style={{ background: 'color-mix(in srgb, var(--warning) 12%, transparent)' }}
          >
            <Clock aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
          </span>
          <p className="text-secondary max-w-[760px] text-[15px] leading-relaxed text-pretty">
            <strong className="text-primary block text-base font-bold">
              {report.verdict.headline}
            </strong>
            {report.verdict.detail}
          </p>
        </div>
        <ButtonLink href="#issues" size="lg" className="text-[13px] whitespace-nowrap">
          See what to fix first
          <ArrowRight aria-hidden="true" className="size-[15px]" strokeWidth={1.8} />
        </ButtonLink>
      </div>

      <SummaryScores scores={report.scores} />
      <CoreWebVitals vitals={report.vitals} />
      <PerformanceOverview lab={report.lab} />
      <IssueList issues={report.issues} />
      <RecommendationList items={report.recommendations} />
      <ResourceAnalysis resources={report.resources} totalWeight={report.totalWeight} />
    </div>
  )
}
