import { cn } from 'cn'

export type StatusTone = 'good' | 'warn' | 'poor' | 'low'

/* Status is never color alone: circle = good, square = needs improvement,
   triangle = poor, each next to its label. The status colors are mixed down
   toward secondary text so they sit at body-copy weight rather than shouting. */
const TONE = {
  good: {
    color: 'color-mix(in srgb, var(--success) 70%, var(--text-secondary))',
    shape: 'rounded-full',
  },
  warn: {
    color: 'color-mix(in srgb, var(--warning) 75%, var(--text-secondary))',
    shape: 'rounded-[2px]',
  },
  poor: {
    color: 'color-mix(in srgb, var(--error) 75%, var(--text-secondary))',
    shape: '[clip-path:polygon(50%_0,100%_100%,0_100%)]',
  },
  low: { color: 'var(--text-secondary)', shape: 'rounded-full' },
} as const

export function toneColor(tone: StatusTone) {
  return TONE[tone].color
}

export function StatusMark({
  tone,
  children,
  size = 8,
  className,
}: {
  tone: StatusTone
  children: React.ReactNode
  size?: 7 | 8
  className?: string
}) {
  const { color, shape } = TONE[tone]

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 text-xs font-semibold', className)}
      style={{ color }}
    >
      <span
        aria-hidden="true"
        className={cn('shrink-0', shape)}
        style={{ width: size, height: size, background: color }}
      />
      {children}
    </span>
  )
}
