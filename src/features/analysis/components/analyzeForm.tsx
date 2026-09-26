import { LoaderCircle } from 'lucide-react'
import { useState, type SubmitEvent } from 'react'

import { Button } from '@/components/ui/button'
import { SegmentedChoice } from '@/components/ui/segmentedChoice'
import { TextField } from '@/components/ui/textField'
import { checkUrl } from '@/features/analysis/lib/urlInput'
import type { AnalysisRequest, DeviceProfile } from '@/features/analysis/types'

const DEVICE_OPTIONS = [
  { value: 'mobile', label: 'Mobile' },
  { value: 'desktop', label: 'Desktop' },
] as const satisfies readonly { value: DeviceProfile; label: string }[]

const EMPTY_MESSAGE = 'Enter the address of the page you want to analyze.'

type AnalyzeFormProps = {
  onSubmit: (request: AnalysisRequest) => void
  pending?: boolean
  /** `hero` is the landing layout; `compact` is the bar above a running or finished report. */
  variant?: 'hero' | 'compact'
  initialUrl?: string
  initialDevice?: DeviceProfile
}

export function AnalyzeForm({
  onSubmit,
  pending = false,
  variant = 'hero',
  initialUrl = '',
  initialDevice = 'mobile',
}: AnalyzeFormProps) {
  const [value, setValue] = useState(initialUrl)
  const [device, setDevice] = useState<DeviceProfile>(initialDevice)
  const [error, setError] = useState<string>()
  const [suggestion, setSuggestion] = useState<string>()
  const isCompact = variant === 'compact'

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

  function applySuggestion(next: string) {
    setValue(next)
    clearError()
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3.5" noValidate>
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start">
        <TextField
          label="Website URL"
          labelHidden
          size={isCompact ? 'lg' : 'xl'}
          type="url"
          inputMode="url"
          autoComplete="url"
          spellCheck={false}
          prefix="$ analyze"
          placeholder="https://example.com"
          className="grow"
          value={value}
          disabled={pending}
          onChange={(event) => {
            setValue(event.target.value)
            if (error) clearError()
          }}
          error={error}
        />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={pending}
          className={isCompact ? undefined : 'h-14'}
        >
          {pending ? (
            <>
              <LoaderCircle
                className="size-4 animate-spin motion-reduce:animate-none"
                strokeWidth={1.8}
              />
              Analyzing…
            </>
          ) : (
            'Analyze website'
          )}
        </Button>
      </div>

      {suggestion ? (
        <p className="text-muted-foreground flex flex-wrap items-center gap-2 text-[13px]">
          Did you mean
          <Button
            type="button"
            size="sm"
            className="font-mono"
            onClick={() => {
              applySuggestion(suggestion)
            }}
          >
            {suggestion}
          </Button>
          ?
        </p>
      ) : null}

      {isCompact ? null : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground flex items-center gap-2.5 text-[13px]">
            <span>Test as</span>
            <SegmentedChoice
              legend="Device to test as"
              name="device"
              value={device}
              options={DEVICE_OPTIONS}
              onChange={setDevice}
            />
          </div>
          <span className="text-muted-foreground text-[13px]">
            Takes about 30 seconds · Public URLs only
          </span>
        </div>
      )}
    </form>
  )
}
