import { Button } from '@/components/ui/button'
import type { AnalysisError } from '@/features/analysis/lib/analysisErrors'

type AnalysisErrorViewProps = {
  error: AnalysisError
  onRetry: () => void
  onEdit: () => void
}

export function AnalysisErrorView({ error, onRetry, onEdit }: AnalysisErrorViewProps) {
  return (
    <section role="alert" aria-label="Analysis failed" className="mt-10">
      <div className="text-tertiary font-mono text-xs tracking-[0.08em]">
        FAILED · {error.code}
      </div>
      <h2 className="mt-2 text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em]">
        We couldn’t reach{' '}
        <span className="font-mono font-medium break-all">{error.title}</span>
      </h2>
      <p className="text-secondary mt-1.5 max-w-[620px]">
        The server answered with{' '}
        <strong className="text-primary">{error.emphasis}</strong> {error.detail}
      </p>

      <div className="border-low mt-7 border-t">
        {error.tips.map((tip) => (
          <div
            key={tip.title}
            className="border-low flex flex-wrap gap-x-12 gap-y-1 border-b py-4"
          >
            <span className="flex-[0_1_220px] font-semibold">{tip.title}</span>
            <span className="text-secondary flex-[1_1_360px] text-pretty">
              {tip.body}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <Button variant="primary" size="lg" onClick={onRetry}>
          Try again
        </Button>
        <Button size="lg" onClick={onEdit}>
          Edit URL
        </Button>
      </div>
    </section>
  )
}
