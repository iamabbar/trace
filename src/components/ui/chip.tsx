import { cn } from 'cn'
import type { ComponentProps } from 'react'

type ChipProps = ComponentProps<'button'> & {
  selected?: boolean
  count?: number
}

export function Chip({
  selected = false,
  count,
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'border-border-strong bg-card text-muted-foreground inline-flex h-[30px] items-center gap-1.5 rounded-xs border px-3 text-[13px] font-medium transition-colors',
        selected
          ? 'bg-foreground border-foreground text-background'
          : 'hover:text-foreground',
        className,
      )}
      {...props}
    >
      {children}
      {count === undefined ? null : (
        <span
          className={cn(
            'rounded-xs px-1.5 font-mono text-[11px]',
            selected ? 'text-background' : 'bg-track text-muted-foreground',
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}
