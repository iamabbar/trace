import { cn } from 'cn'

type SegmentedChoiceProps<T extends string> = {
  legend: string
  name: string
  value: T
  options: readonly { value: T; label: string; count?: number }[]
  onChange: (value: T) => void
  className?: string
}

/* Native radios rather than buttons: arrow-key navigation, grouping and
   screen-reader announcement all come for free. Used for filters too — a filter
   picks one of N options, which is a radio group, not a tablist. */
export function SegmentedChoice<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
  className,
}: SegmentedChoiceProps<T>) {
  return (
    <fieldset
      className={cn(
        'bg-muted border-border flex gap-0.5 rounded-sm border p-[3px]',
        className,
      )}
    >
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => {
        const selected = value === option.value

        return (
          <label key={option.value} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => {
                onChange(option.value)
              }}
              className="peer sr-only"
            />
            <span
              className={cn(
                'text-muted-foreground flex h-8 items-center gap-2 rounded-xs px-3 text-[13px] font-medium whitespace-nowrap transition-colors',
                'peer-checked:bg-card peer-checked:text-foreground peer-checked:shadow-[0_0_0_1px_var(--border),0_1px_2px_rgb(0_0_0/0.05)]',
                'peer-focus-visible:outline-ring peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2',
              )}
            >
              {option.label}
              {option.count === undefined ? null : (
                <span
                  className={cn(
                    'rounded-xs px-1.5 font-mono text-[11px]',
                    selected ? 'bg-track' : 'bg-track/60',
                  )}
                >
                  {option.count}
                </span>
              )}
            </span>
          </label>
        )
      })}
    </fieldset>
  )
}
