import { cn } from 'cn'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-xs',
        className,
      )}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M2.5 11.5a5.5 5.5 0 0 1 11 0" />
        <path d="M8 11.5 10.8 7" />
      </svg>
    </span>
  )
}
