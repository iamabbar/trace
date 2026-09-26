import { useEffect, useRef, useState } from 'react'

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(undefined)

  useEffect(
    () => () => {
      window.clearTimeout(timer.current)
    },
    [],
  )

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        setCopied(false)
      }, 1500)
    } catch {
      // Clipboard can be blocked by permissions; the snippet is still selectable.
    }
  }

  return (
    <div className="bg-tag relative mt-2 rounded-md">
      <code className="block overflow-x-auto py-3 pr-15 pl-3.5 font-mono text-xs leading-relaxed whitespace-pre [font-variant-ligatures:none]">
        {code}
      </code>
      <button
        type="button"
        onClick={() => void copy()}
        aria-label="Copy snippet"
        className="text-secondary hover:text-primary rounded-chip absolute top-1.5 right-1.5 h-6.5 px-2 text-[11px] font-semibold"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}
