import { useTheme } from '@/hooks/useTheme'

const SWATCHES = [
  { name: 'accent', className: 'bg-accent' },
  { name: 'good', className: 'bg-good' },
  { name: 'warn', className: 'bg-warn' },
  { name: 'poor', className: 'bg-poor' },
  { name: 'ink', className: 'bg-ink' },
  { name: 'muted', className: 'bg-muted' },
  { name: 'border-strong', className: 'bg-border-strong' },
  { name: 'track', className: 'bg-track' },
] as const

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="blueprint-grid min-h-dvh">
      <header className="border-border bg-surface flex h-16 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2.5">
          <span className="bg-accent text-on-accent flex size-7 items-center justify-center rounded-xs">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M2.5 11.5a5.5 5.5 0 0 1 11 0" />
              <path d="M8 11.5 10.8 7" />
            </svg>
          </span>
          <span className="font-semibold tracking-tight">
            Frontend Performance Analyzer
          </span>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          className="border-border-strong bg-surface text-ink hover:bg-subtle flex size-8 items-center justify-center rounded-xs border transition-colors"
        >
          {theme === 'dark' ? (
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="3" />
              <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
            </svg>
          ) : (
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7Z" />
            </svg>
          )}
        </button>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
        <div className="flex flex-col gap-4">
          <p className="text-muted font-mono text-[11px] font-medium tracking-[0.08em] uppercase">
            Design tokens · {theme}
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.035em] text-balance">
            Understand what&rsquo;s slowing your website down.
          </h1>
          <p className="text-muted max-w-xl text-pretty">
            Enter a URL to audit performance, accessibility, best practices and SEO — then
            get a prioritized list of what to fix and how.
          </p>
        </div>

        <div className="border-border bg-surface flex flex-col gap-4 rounded-md border p-6">
          <p className="text-muted font-mono text-[11px] font-medium tracking-[0.08em] uppercase">
            Palette
          </p>
          <ul className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {SWATCHES.map((swatch) => (
              <li key={swatch.name} className="flex flex-col gap-1.5">
                <span
                  className={`border-border h-10 rounded-xs border ${swatch.className}`}
                />
                <span className="text-muted font-mono text-[11px]">{swatch.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
