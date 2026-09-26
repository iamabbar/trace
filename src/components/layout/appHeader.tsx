import { GitBranch } from 'lucide-react'

import { BrandMark } from '@/components/layout/brandMark'
import { ThemeToggle } from '@/components/layout/themeToggle'
import { ButtonLink } from '@/components/ui/button'

const REPOSITORY_URL = 'https://github.com/iamabbar/trace'

export function AppHeader({ onHome }: { onHome: () => void }) {
  return (
    <header className="border-low bg-body sticky top-0 z-20 border-b">
      <div className="mx-auto flex h-15 max-w-[1200px] items-center justify-between gap-4 px-[clamp(16px,4vw,32px)]">
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault()
            onHome()
          }}
          aria-label="trace home"
          className="text-primary flex items-center gap-2.5 no-underline"
        >
          <BrandMark />
          <span className="text-base font-bold tracking-[-0.01em]">trace</span>
        </a>

        <nav aria-label="Utility" className="flex items-center gap-2">
          <ButtonLink
            href={REPOSITORY_URL}
            target="_blank"
            rel="noreferrer"
            className="px-3 font-semibold"
          >
            <GitBranch aria-hidden="true" className="size-4" strokeWidth={1.8} />
            GitHub
          </ButtonLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
