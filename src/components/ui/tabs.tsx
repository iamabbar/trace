import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { Tabs as TabsPrimitive } from 'radix-ui'
import type * as React from 'react'

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('group/tabs flex flex-col gap-3', className)}
      {...props}
    />
  )
}

const tabsListVariants = cva('inline-flex w-fit items-center', {
  variants: {
    variant: {
      segmented: 'bg-muted border-border gap-0.5 rounded-sm border p-[3px]',
      underline: 'border-border gap-5 border-b',
    },
  },
  defaultVariants: { variant: 'segmented' },
})

function TabsList({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant ?? 'segmented'}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-[13px] font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-45',
        'in-data-[variant=segmented]:h-8 in-data-[variant=segmented]:rounded-xs in-data-[variant=segmented]:px-3',
        'in-data-[variant=segmented]:data-[state=active]:bg-card in-data-[variant=segmented]:data-[state=active]:text-foreground in-data-[variant=segmented]:data-[state=active]:shadow-[0_0_0_1px_var(--border),0_1px_2px_rgb(0_0_0/0.05)]',
        'in-data-[variant=underline]:-mb-px in-data-[variant=underline]:h-9 in-data-[variant=underline]:border-b-2 in-data-[variant=underline]:border-transparent',
        'in-data-[variant=underline]:data-[state=active]:border-foreground in-data-[variant=underline]:data-[state=active]:text-foreground',
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('outline-none', className)}
      {...props}
    />
  )
}

function TabsCount({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'bg-track text-muted-foreground rounded-xs px-1.5 font-mono text-[11px]',
        className,
      )}
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsCount, TabsList, tabsListVariants, TabsTrigger }
