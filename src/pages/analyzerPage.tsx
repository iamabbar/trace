import { useRef } from 'react'

import { AppShell } from '@/components/layout/appShell'
import { AnalysisErrorView } from '@/features/analysis/components/analysisErrorView'
import { AnalysisProgress } from '@/features/analysis/components/analysisProgress'
import { ReportView } from '@/features/analysis/components/reportView'
import { UrlBar } from '@/features/analysis/components/urlBar'
import { useAnalysis } from '@/features/analysis/useAnalysis'

const CATEGORIES = [
  {
    n: '01',
    title: 'Performance',
    body: 'Core Web Vitals, load timings, heavy resources',
  },
  { n: '02', title: 'Accessibility', body: 'Contrast, labels, keyboard access' },
  { n: '03', title: 'Best Practices', body: 'HTTPS, console errors, deprecated APIs' },
  { n: '04', title: 'SEO', body: 'Meta tags, crawlability, structured data' },
]

export function AnalyzerPage() {
  const { status, request, error, report, steps, progress, start, retry, reset } =
    useAnalysis()
  const inputRef = useRef<HTMLInputElement>(null)

  if (status === 'idle') {
    return (
      <AppShell onHome={reset}>
        <section aria-labelledby="hero-title" className="relative flex-1 overflow-hidden">
          <div aria-hidden="true" className="ledger-grid absolute inset-0" />
          <div
            id="main"
            className="relative mx-auto max-w-[1200px] px-[clamp(16px,4vw,32px)] pt-[clamp(64px,11vw,128px)] pb-18"
          >
            <h1
              id="hero-title"
              className="max-w-[900px] text-[clamp(40px,6.6vw,76px)] leading-[1.02] font-extrabold tracking-[-0.045em] text-balance"
            >
              Understand what’s <span className="text-cyan">slowing</span> your website
              down.
            </h1>
            <p className="text-secondary mt-5.5 max-w-[600px] text-[clamp(16px,1.7vw,18px)] leading-relaxed text-pretty">
              Enter a URL to audit performance, accessibility, best practices and SEO,
              then get a prioritized list of what to fix and how.
            </p>

            <div className="mt-10">
              <UrlBar
                onSubmit={start}
                initialUrl={request?.url ?? ''}
                initialDevice={request?.device}
              />
            </div>

            <ul className="border-low mt-22 grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] border-t">
              {CATEGORIES.map((category) => (
                <li key={category.n} className="flex flex-col gap-1 pt-6 pr-6">
                  <span className="text-tertiary text-xs font-semibold tracking-[0.08em]">
                    {category.n}
                  </span>
                  <span className="text-[15px] font-bold">{category.title}</span>
                  <span className="text-secondary text-[13px] text-pretty">
                    {category.body}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </AppShell>
    )
  }

  const isInProgress = status === 'running'
  const isError = status === 'error'
  const isComplete = status === 'complete'

  return (
    <AppShell onHome={reset}>
      <main
        id="main"
        className="mx-auto w-full max-w-[1200px] flex-1 px-[clamp(16px,4vw,32px)] pt-8 pb-24"
      >
        {/* The loading, error and report views all start their headings at h2,
            so the page needs an h1 to keep the order intact. */}
        <h1 className="sr-only">Analysis for {request?.url}</h1>

        {/* A live region on <main> would re-announce the entire report — every
            score, issue and table row — the moment it renders. Only the outcome
            is announced here; the progress card announces its own steps. */}
        <p role="status" aria-live="polite" className="sr-only">
          {isComplete
            ? 'Analysis complete. Report ready.'
            : isError
              ? 'Analysis failed.'
              : ''}
        </p>
        <UrlBar
          key={request?.url}
          variant="compact"
          onSubmit={start}
          pending={isInProgress}
          initialUrl={request?.url ?? ''}
          initialDevice={request?.device}
          inputRef={inputRef}
        />

        {isInProgress && request ? (
          <AnalysisProgress
            request={request}
            runNumber={15}
            steps={steps}
            progress={progress}
          />
        ) : null}

        {isError && error ? (
          <AnalysisErrorView
            error={error}
            onRetry={retry}
            onEdit={() => {
              inputRef.current?.focus()
            }}
          />
        ) : null}

        {isComplete && report ? (
          <ReportView report={report} onRerun={retry} />
        ) : null}
      </main>
    </AppShell>
  )
}
