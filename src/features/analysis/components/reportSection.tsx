import type { ReactNode } from 'react'

type ReportSectionProps = {
  index: string
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
  id?: string
}

export function ReportSection({
  index,
  title,
  description,
  action,
  children,
  id,
}: ReportSectionProps) {
  return (
    <section id={id} className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-[-0.01em]">
            <span
              aria-hidden="true"
              className="text-primary mr-2.5 align-[2px] font-mono text-[13px] font-medium"
            >
              {index}
            </span>
            {title}
          </h2>
          <p className="text-muted-foreground text-pretty">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
