import { Alert, AlertTitle } from '@/components/ui/alert'
import { AnalysisErrorCard } from '@/features/analysis/components/analysisErrorCard'
import { AnalysisProgress } from '@/features/analysis/components/analysisProgress'
import { AnalyzeForm } from '@/features/analysis/components/analyzeForm'
import { ReportSkeleton } from '@/features/analysis/components/reportSkeleton'
import { useAnalysis } from '@/features/analysis/useAnalysis'

const CATEGORIES = [
  { name: 'Performance', description: 'Core Web Vitals, load timings, heavy resources' },
  { name: 'Accessibility', description: 'Contrast, labels, keyboard access' },
  { name: 'Best Practices', description: 'HTTPS, console errors, deprecated APIs' },
  { name: 'SEO', description: 'Meta tags, crawlability, structured data' },
]

export function AnalyzerPage() {
  const { status, request, error, steps, elapsedMs, progress, start, retry, reset } =
    useAnalysis()

  if (status !== 'idle' && request) {
    return (
      <div className="flex flex-1 flex-col px-4 py-8 sm:px-6 lg:px-12">
        <div className="mx-auto w-full max-w-[1248px]">
          <AnalyzeForm
            key={request.url}
            variant="compact"
            onSubmit={start}
            pending={status === 'running'}
            initialUrl={request.url}
            initialDevice={request.device}
          />
        </div>

        <div className="relative mt-8 flex-1">
          <div className="mx-auto w-full max-w-[1248px]">
            <ReportSkeleton />
          </div>

          <div
            aria-hidden="true"
            className="from-background/20 to-background/95 absolute inset-0 bg-gradient-to-b from-0% to-40%"
          />

          <div className="absolute inset-x-0 top-6 flex justify-center sm:top-10">
            {status === 'running' ? (
              <AnalysisProgress
                request={request}
                steps={steps}
                elapsedMs={elapsedMs}
                progress={progress}
                onCancel={reset}
              />
            ) : status === 'error' && error ? (
              <AnalysisErrorCard error={error} onRetry={retry} onEdit={reset} />
            ) : (
              <Alert tone="good" className="w-full max-w-[560px]">
                <span>
                  <AlertTitle>Analysis complete.</AlertTitle> The report for{' '}
                  <span className="font-mono">{request.url}</span> arrives in the next
                  step. Edit the URL above to run another.
                </span>
              </Alert>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-[960px] flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-12">
      {/* Auto margins split the leftover height above and below, which centres the
          hero and drops the category strip to the bottom of the viewport. */}
      <div className="mt-auto flex max-w-[760px] flex-col items-center gap-5 text-center">
        <h1 className="text-[34px] leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-5xl lg:text-[56px]">
          Understand what&rsquo;s slowing your website down.
        </h1>
        <p className="text-muted-foreground max-w-[580px] text-base text-pretty sm:text-[17px]">
          Enter a URL to audit performance, accessibility, best practices and SEO — then
          get a prioritized list of what to fix and how.
        </p>
      </div>

      <div className="mt-14 w-full sm:mt-16">
        <AnalyzeForm
          onSubmit={start}
          initialUrl={request?.url ?? ''}
          initialDevice={request?.device}
        />
      </div>

      <ul className="border-border mt-auto grid w-full grid-cols-2 gap-x-5 gap-y-6 border-t pt-5 lg:grid-cols-4 lg:gap-x-0">
        {CATEGORIES.map((category, index) => (
          <li
            key={category.name}
            className={
              index === 0
                ? 'flex flex-col gap-1 lg:pr-5'
                : 'border-border flex flex-col gap-1 lg:border-l lg:px-5 lg:last:pr-0'
            }
          >
            <span className="text-sm font-semibold">{category.name}</span>
            <span className="text-muted-foreground text-[13px] text-pretty">
              {category.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
