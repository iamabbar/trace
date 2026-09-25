import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { useId, type ComponentProps, type ReactNode } from 'react'

import { Input } from '@/components/ui/input'

const fieldVariants = cva(
  'flex items-center gap-2.5 rounded-sm border bg-card px-3 transition-shadow focus-within:border-ring focus-within:shadow-[0_0_0_3px_var(--accent)] has-disabled:bg-muted has-disabled:border-border has-aria-invalid:border-destructive has-aria-invalid:shadow-[0_0_0_3px_var(--destructive-foreground)]',
  {
    variants: {
      size: {
        default: 'h-10 text-sm',
        lg: 'h-12 text-[15px]',
        xl: 'h-14 px-4 text-base',
      },
    },
    defaultVariants: { size: 'default' },
  },
)

type TextFieldProps = Omit<ComponentProps<typeof Input>, 'size'> &
  VariantProps<typeof fieldVariants> & {
    label: string
    labelHidden?: boolean
    prefix?: ReactNode
    error?: string
    hint?: string
  }

export function TextField({
  label,
  labelHidden = false,
  prefix,
  error,
  hint,
  size,
  className,
  id,
  ...props
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`
  const message = error ?? hint

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={inputId}
        className={cn('text-[13px] font-medium', labelHidden && 'sr-only')}
      >
        {label}
      </label>

      <div className={cn(fieldVariants({ size }), className)}>
        {prefix ? (
          <span
            aria-hidden="true"
            className={cn(
              'shrink-0 font-mono text-sm font-semibold',
              error ? 'text-destructive' : 'text-primary',
            )}
          >
            {prefix}
          </span>
        ) : null}
        <Input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className="text-[inherit]"
          {...props}
        />
      </div>

      {message ? (
        <p
          id={messageId}
          className={cn(
            'flex items-center gap-2 text-[13px]',
            error ? 'text-destructive' : 'text-muted-foreground',
          )}
        >
          {error ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="shrink-0"
            >
              <path d="M8 2.5 14 13H2L8 2.5Z" />
              <path d="M8 6.5v3M8 11.5h.01" />
            </svg>
          ) : null}
          {message}
        </p>
      ) : null}
    </div>
  )
}
