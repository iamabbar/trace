import { BrandMark } from '@/components/layout/brandMark'
import { ThemeToggle } from '@/components/layout/themeToggle'
import { Button } from '@/components/ui/button'

const REPOSITORY_URL = 'https://github.com/iamabbar/trace'

export function AppHeader() {
  return (
    <header className="border-border bg-card sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b px-4 sm:h-16 sm:px-6 lg:px-12">
      <a href="/" className="flex items-center gap-2.5 text-inherit no-underline">
        <BrandMark />
        <span className="font-semibold tracking-tight">trace</span>
      </a>

      <div className="flex items-center gap-2">
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <a href={REPOSITORY_URL} target="_blank" rel="noreferrer">
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="5" cy="3.5" r="1.5" />
              <circle cx="5" cy="12.5" r="1.5" />
              <circle cx="11" cy="4.5" r="1.5" />
              <path d="M5 5v6M11 6c0 3-6 2-6 5" />
            </svg>
            GitHub
          </a>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}
