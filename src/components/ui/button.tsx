import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { Slot } from 'radix-ui'
import type * as React from 'react'

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-sm border border-transparent text-sm font-medium whitespace-nowrap transition-colors select-none disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Mono on the primary action only — it stands in for the terminal command.
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover font-mono',
        secondary: 'bg-card text-foreground border-border-strong hover:bg-muted',
        ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
        destructive:
          'bg-card text-destructive border-border-strong hover:bg-destructive-foreground',
      },
      size: {
        sm: 'h-[30px] rounded-xs px-2.5 text-[13px]',
        default: 'h-9 px-3.5',
        lg: 'h-12 px-5 text-[15px]',
        icon: 'size-9',
        'icon-sm': 'size-[30px] rounded-xs',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
