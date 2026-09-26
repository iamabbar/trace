import type { ReactNode } from 'react'

type LedgerSectionProps = {
  id?: string
  index: string
  title: string
  subtitle: string
  /** Extra line under the subtitle, e.g. "1 of 3 passing". */
  note?: ReactNode
  children: ReactNode
}

/* The layout unit of the whole report: a numbered left column and a wide right
   column, separated from the section above by a hairline. Wraps to stacked
   below roughly 780px because the right column claims 560px. */
export function LedgerSection({
  id,
  index,
  title,
  subtitle,
  note,
  children,
}: LedgerSectionProps) {
  // Prefixed because an id may not start with a digit and still work in CSS selectors.
  const titleId = `section-${id ?? index}-title`

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="border-low flex flex-wrap gap-x-12 gap-y-5 border-t py-11"
    >
      <div className="min-w-[180px] flex-[0_1_220px]">
        <div className="text-tertiary text-xs font-semibold tracking-[0.08em]">
          {index}
        </div>
        <h3 id={titleId} className="mt-1 text-lg font-bold tracking-[-0.015em]">
          {title}
        </h3>
        <p className="text-secondary mt-1 text-[13px] text-pretty">{subtitle}</p>
        {note}
      </div>
      <div className="min-w-0 flex-[1_1_560px]">{children}</div>
    </section>
  )
}
