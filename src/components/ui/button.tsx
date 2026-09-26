import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import type * as React from 'react'

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap transition-[background,filter] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: 'bg-cyan text-on-cyan font-bold hover:brightness-110',
        outline: 'border-stroke text-primary hover:bg-tag border',
        ghost: 'text-secondary hover:bg-tag hover:text-primary',
      },
      size: {
        sm: 'h-8 px-3 text-[13px]',
        default: 'h-9 px-3.5 text-[13px]',
        lg: 'h-10 px-4.5',
        xl: 'h-13 px-6 text-[15px]',
        icon: 'size-9',
      },
    },
    defaultVariants: { variant: 'outline', size: 'default' },
  },
)

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

function ButtonLink({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<'a'> & VariantProps<typeof buttonVariants>) {
  return (
    <a
      data-slot="button-link"
      className={cn(buttonVariants({ variant, size, className }), 'no-underline')}
      {...props}
    />
  )
}

export { Button, ButtonLink, buttonVariants }
