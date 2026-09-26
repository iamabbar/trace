import type { ReactNode } from 'react'

import { AppFooter } from '@/components/layout/appFooter'
import { AppHeader } from '@/components/layout/appHeader'

export function AppShell({
  children,
  onHome,
}: {
  children: ReactNode
  onHome: () => void
}) {
  return (
    <div className="bg-body text-primary flex min-h-dvh flex-col">
      <a
        href="#main"
        className="bg-body text-primary border-stroke sr-only rounded-md border px-4 py-2 text-sm font-semibold focus-visible:not-sr-only focus-visible:absolute focus-visible:top-3 focus-visible:left-3 focus-visible:z-50"
      >
        Skip to content
      </a>
      <AppHeader onHome={onHome} />
      {children}
      <AppFooter />
    </div>
  )
}
