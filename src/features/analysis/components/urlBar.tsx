import { cn } from 'cn'
import { useId, useState, type SubmitEvent } from 'react'

import { Button } from '@/components/ui/button'
import { checkUrl } from '@/features/analysis/lib/urlInput'
import type { AnalysisRequest, DeviceProfile } from '@/features/analysis/types'

const DEVICES = [
  { value: 'desktop', label: 'Desktop' },
  { value: 'mobile', label: 'Mobile' },
] as const satisfies readonly { value: DeviceProfile; label: string }[]

const EMPTY_MESSAGE = 'Enter the address of the page you want to analyze.'

type UrlBarProps = {
  onSubmit: (request: AnalysisRequest) => void
  variant?: 'hero' | 'compact'
  pending?: boolean
  initialUrl?: string
  initialDevice?: DeviceProfile
  inputRef?: React.Ref<HTMLInputElement>
}

export function UrlBar({
  onSubmit,
  variant = 'hero',
  pending = false,
  initialUrl = '',
  initialDevice = 'desktop',
  inputRef,
}: UrlBarProps) {
  const inputId = useId()
  const messageId = `${inputId}-message`
  const [value, setValue] = useState(initialUrl)
  const [device, setDevice] = useState<DeviceProfile>(initialDevice)
  const [error, setError] = useState<string>()
  const [suggestion, setSuggestion] = useState<string>()

  const isHero = variant === 'hero'

  function clearError() {
    setError(undefined)
    setSuggestion(undefined)
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = checkUrl(value)

    if (result.status === 'valid') {
      clearError()
      onSubmit({ url: result.url, device })
      return
    }

    setError(result.status === 'empty' ? EMPTY_MESSAGE : result.message)
    setSuggestion(result.status === 'invalid' ? result.suggestion : undefined)
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      noValidate
      className={cn('flex flex-col', isHero ? 'max-w-[820px] gap-3.5' : 'gap-3')}
    >
      <div
        className={cn(
          'flex flex-wrap gap-2',
          isHero
            ? 'border-stroke rounded-xl border p-2'
            : 'border-low rounded-lg border p-1.5',
          error && 'border-error',
        )}
      >
        <label htmlFor={inputId} className="sr-only">
          Website URL
        </label>
        <div
          className={cn(
            'flex min-w-0 flex-[1_1_320px] items-center gap-2.5 px-3 font-mono',
            isHero ? 'h-13 text-[15px]' : 'h-11 text-sm',
          )}
        >
          <span aria-hidden="true" className="text-cyan font-semibold whitespace-nowrap">
            $ analyze
          </span>
          <input
            id={inputId}
            ref={inputRef}
            type="text"
            inputMode="url"
            autoComplete="url"
            spellCheck={false}
            placeholder="https://example.com"
            value={value}
            disabled={pending}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? messageId : undefined}
            onChange={(event) => {
              setValue(event.target.value)
              if (error) clearError()
            }}
            className="placeholder:text-tertiary h-full min-w-0 flex-1 border-0 bg-transparent font-[inherit] text-[inherit] outline-0"
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size={isHero ? 'xl' : 'lg'}
          disabled={pending}
          className="max-w-full flex-[1_0_auto]"
        >
          Analyze website
        </Button>
      </div>

      {error ? (
        <p id={messageId} className="text-error text-[13px]">
          {error}
          {suggestion ? (
            <>
              {' '}
              Did you mean{' '}
              <button
                type="button"
                className="text-primary font-mono font-semibold underline underline-offset-3"
                onClick={() => {
                  setValue(suggestion)
                  clearError()
                }}
              >
                {suggestion}
              </button>
              ?
            </>
          ) : null}
        </p>
      ) : null}

      {isHero ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-secondary text-[13px]">Test as</span>
            {/* Native radios: a radiogroup owes the user arrow-key navigation,
                and the browser provides it here for free. */}
            <fieldset className="border-low bg-tag flex gap-0.5 rounded-md border p-[3px]">
              <legend className="sr-only">Device</legend>
              {DEVICES.map((option) => {
                const selected = device === option.value

                return (
                  <label key={option.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name={`${inputId}-device`}
                      value={option.value}
                      checked={selected}
                      onChange={() => {
                        setDevice(option.value)
                      }}
                      className="peer sr-only"
                    />
                    <span className="text-secondary peer-checked:bg-body peer-checked:text-primary peer-focus-visible:outline-cyan hover:text-primary flex h-8 items-center rounded-sm px-4 text-[13px] font-semibold transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1">
                      {option.label}
                    </span>
                  </label>
                )
              })}
            </fieldset>
          </div>
          <span className="text-tertiary text-[13px]">
            Takes about 30 seconds · Public URLs only
          </span>
        </div>
      ) : null}
    </form>
  )
}
