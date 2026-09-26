import { cn } from 'cn'
import { useRef } from 'react'

export type UnderlineTab<T extends string> = {
  value: T
  label: string
  count?: number
  dotColor?: string
}

type UnderlineTabsProps<T extends string> = {
  /** Base for the tab and panel ids; must match the id passed to tabPanelProps. */
  id: string
  label: string
  value: T
  tabs: readonly UnderlineTab<T>[]
  onChange: (value: T) => void
  className?: string
}

/** Props for the single panel whose content the tabs swap. */
export function tabPanelProps(id: string, value: string) {
  return {
    role: 'tabpanel' as const,
    id: `${id}-panel`,
    'aria-labelledby': `${id}-tab-${value}`,
    tabIndex: 0,
  }
}

export function UnderlineTabs<T extends string>({
  id,
  label,
  value,
  tabs,
  onChange,
  className,
}: UnderlineTabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null)

  /* A tablist owns arrow keys: only the selected tab is tabbable, and
     Arrow/Home/End move selection and focus together. */
  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const offsets: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 }
    const current = tabs.findIndex((tab) => tab.value === value)

    let nextIndex: number | undefined
    if (event.key in offsets) {
      const offset = offsets[event.key] ?? 0
      nextIndex = (current + offset + tabs.length) % tabs.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1
    }

    const next = nextIndex === undefined ? undefined : tabs[nextIndex]
    if (!next) return

    event.preventDefault()
    onChange(next.value)
    listRef.current
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [nextIndex ?? 0]?.focus()
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn('flex flex-wrap gap-5', className)}
    >
      {tabs.map((tab) => {
        const selected = tab.value === value

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            id={`${id}-tab-${tab.value}`}
            aria-selected={selected}
            aria-controls={`${id}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => {
              onChange(tab.value)
            }}
            className={cn(
              'flex h-8 items-center gap-1.5 border-b-2 text-[13px] font-semibold transition-colors',
              selected
                ? 'border-primary text-primary'
                : 'text-secondary hover:text-primary border-transparent',
            )}
          >
            {tab.dotColor ? (
              <span
                aria-hidden="true"
                className="size-[7px] rounded-[2px]"
                style={{ background: tab.dotColor }}
              />
            ) : null}
            {tab.label}
            {tab.count === undefined ? null : (
              <span className="text-tertiary font-medium">{tab.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
