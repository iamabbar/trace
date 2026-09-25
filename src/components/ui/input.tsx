import { cn } from 'cn'
import type * as React from 'react'

function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      className={cn(
        'placeholder:text-faint w-full min-w-0 border-0 bg-transparent font-mono outline-none disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
