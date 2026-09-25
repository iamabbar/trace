import { cn } from 'cn'
import type { ComponentProps } from 'react'

export type StatusTone = 'good' | 'warn' | 'poor' | 'info' | 'neutral'

/* Status is never color alone: each tone carries a distinct shape as well as a
   text label, so the meaning survives greyscale and color-blindness. */
const TONE_STYLES: Record<StatusTone, { badge: string; shape: string }> = {
  good: { badge: 'text-good bg-good-foreground', shape: 'rounded-full' },
  warn: { badge: 'text-warn bg-warn-foreground', shape: 'rounded-[1.5px]' },
  poor: {
    badge: 'text-destructive bg-destructive-foreground',
    shape: 'w-[9px] [clip-path:polygon(50%_0,100%_100%,0_100%)]',
  },
  info: { badge: 'text-primary bg-accent', shape: 'rounded-full' },
  neutral: {
    badge: 'text-muted-foreground bg-muted border border-border',
    shape: 'hidden',
  },
}

type StatusBadgeProps = ComponentProps<'span'> & {
  tone: StatusTone
  children: React.ReactNode
}

export function StatusBadge({ tone, className, children, ...props }: StatusBadgeProps) {
  const { badge, shape } = TONE_STYLES[tone]

  return (
    <span
      className={cn(
        'inline-flex h-[22px] items-center gap-1.5 rounded-xs px-2 text-xs font-medium whitespace-nowrap',
        badge,
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className={cn('size-2 shrink-0 bg-current', shape)} />
      {children}
    </span>
  )
}
