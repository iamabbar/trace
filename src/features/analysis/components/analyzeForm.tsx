import { useState, type FormEvent } from 'react'

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
}

export function AnalyzeForm({ onSubmit, pending = false }: AnalyzeFormProps) {
  const [value, setValue] = useState('')
  const [device, setDevice] = useState<DeviceProfile>('mobile')
  const [error, setError] = useState<string>()
  const [suggestion, setSuggestion] = useState<string>()

  function clearError() {
    setError(undefined)
    setSuggestion(undefined)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
          size="xl"
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
          className="h-14"
        >
          {pending ? 'Analyzing…' : 'Analyze website'}
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
    </form>
  )
}
