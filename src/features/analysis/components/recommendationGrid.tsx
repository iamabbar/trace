import { Card } from '@/components/ui/card'
import type { Recommendation } from '@/features/analysis/types'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      {children}
    </div>
  )
}

export function RecommendationGrid({ items }: { items: Recommendation[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} className="flex flex-col gap-4.5 p-6">
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground font-mono text-[11px] font-medium tracking-[0.08em] uppercase">
              {item.category}
            </span>
            <span className="text-good font-mono text-xs font-medium">{item.gain}</span>
          </div>

          <Field label="Problem">
            <h3 className="text-[17px] font-semibold">{item.problem}</h3>
          </Field>

          <Field label="Why it matters">
            <p className="text-pretty">{item.why}</p>
          </Field>

          <Field label="Suggested fix">
            <p className="mb-2 text-pretty">{item.fix}</p>
            <pre className="border-border bg-code overflow-x-auto rounded-sm border px-3 py-2.5 font-mono text-xs leading-relaxed">
              {item.snippet}
            </pre>
          </Field>
        </Card>
      ))}
    </div>
  )
}
