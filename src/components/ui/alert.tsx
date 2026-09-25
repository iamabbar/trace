import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import type * as React from 'react'

const alertVariants = cva(
  'flex items-start gap-3 rounded-sm border p-3.5 text-[13px] [&_svg]:mt-px [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      tone: {
        info: 'border-border bg-muted [&_svg]:text-primary',
        good: 'text-good bg-good-foreground border-transparent',
        warn: 'text-warn bg-warn-foreground border-transparent',
        poor: 'text-destructive bg-destructive-foreground border-transparent',
      },
    },
    defaultVariants: { tone: 'info' },
  },
)

function Alert({
  className,
  tone,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ tone }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span data-slot="alert-title" className={cn('font-semibold', className)} {...props} />
  )
}

export { Alert, AlertTitle, alertVariants }
