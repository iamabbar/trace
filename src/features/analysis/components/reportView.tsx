import { StatusBadge } from '@/components/ui/statusBadge'
import { CoreWebVitals } from '@/features/analysis/components/coreWebVitals'
import { PerformanceOverview } from '@/features/analysis/components/performanceOverview'
import { ReportHeader } from '@/features/analysis/components/reportHeader'
import { IssueList } from '@/features/analysis/components/issueList'
import { RecommendationGrid } from '@/features/analysis/components/recommendationGrid'
import { ReportSection } from '@/features/analysis/components/reportSection'
import { ResourceAnalysis } from '@/features/analysis/components/resourceAnalysis'
import { ScoreGrid } from '@/features/analysis/components/scoreGrid'
import type { AnalysisReport } from '@/features/analysis/types'

export function ReportView({
  report,
  onRerun,
}: {
  report: AnalysisReport
  onRerun: () => void
}) {
  const passing = report.vitals.filter((vital) => vital.band === 'good').length

  return (
    <div className="flex flex-col gap-14">
      <div className="flex flex-col gap-6">
        <ReportHeader report={report} onRerun={onRerun} />
        <ScoreGrid scores={report.scores} />
      </div>

      <ReportSection
        index="01"
        title="Core Web Vitals"
        description="How real visitors experience loading, responsiveness and visual stability. Google uses these for search ranking."
        action={
          <StatusBadge
            tone={passing === report.vitals.length ? 'good' : 'warn'}
            className="h-6.5 px-2.5 text-[13px]"
          >
            {passing} of {report.vitals.length} passing
          </StatusBadge>
        }
      >
        <CoreWebVitals vitals={report.vitals} />
      </ReportSection>

      <ReportSection
        index="02"
        title="Performance overview"
        description="Lab timings from this run."
      >
        <PerformanceOverview timings={report.timings} />
      </ReportSection>

      <ReportSection
        id="issues"
        index="03"
        title="Issues"
        description="Sorted by estimated impact. Start at the top."
      >
        <IssueList issues={report.issues} />
      </ReportSection>

      <ReportSection
        index="04"
        title="Recommendations"
        description="Concrete fixes for the highest-impact issues."
      >
        <RecommendationGrid items={report.recommendations} />
      </ReportSection>

      <ResourceAnalysis resources={report.resources} totalWeight={report.totalWeight} />
    </div>
  )
}
