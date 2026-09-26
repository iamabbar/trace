import { ArrowRight, Clock, Download, GitCompare, RotateCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { AnalysisReport } from '@/features/analysis/types'

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function displayUrl(url: string) {
  try {
    const parsed = new URL(url)
    return `${parsed.hostname}${parsed.pathname}`
  } catch {
    return url
  }
}

export function ReportHeader({
  report,
  onRerun,
}: {
  report: AnalysisReport
  onRerun: () => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <span className="text-muted-foreground font-mono text-[11px] font-medium tracking-[0.08em] uppercase">
            Report · Run #{report.runNumber}
          </span>
          <h1 className="truncate font-mono text-2xl font-medium tracking-[-0.02em] sm:text-[28px]">
            {displayUrl(report.request.url)}
          </h1>
          <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
            <span>{DATE_FORMAT.format(report.createdAt)}</span>
            <span>{report.conditions}</span>
            <span>{report.dataNote}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button disabled>
            <GitCompare className="size-[15px]" strokeWidth={1.5} />
            Compare
          </Button>
          <Button disabled>
            <Download className="size-[15px]" strokeWidth={1.5} />
            Export
          </Button>
          <Button onClick={onRerun}>
            <RotateCw className="size-[15px]" strokeWidth={1.5} />
            Re-run
          </Button>
        </div>
      </div>

      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5">
        <span className="bg-warn-foreground text-warn flex size-10 shrink-0 items-center justify-center rounded-sm">
          <Clock className="size-[18px]" strokeWidth={1.5} />
        </span>
        <div className="flex grow flex-col gap-0.5">
          <p className="font-semibold">{report.verdict.headline}</p>
          <p className="text-muted-foreground text-pretty">{report.verdict.detail}</p>
        </div>
        <Button asChild className="shrink-0 self-start sm:self-auto">
          <a href="#issues">
            See what to fix first
            <ArrowRight className="size-[14px]" strokeWidth={1.5} />
          </a>
        </Button>
      </Card>
    </div>
  )
}
