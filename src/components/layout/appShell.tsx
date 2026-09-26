import type { ReactNode } from 'react'

import { AppFooter } from '@/components/layout/appFooter'
import { AppHeader } from '@/components/layout/appHeader'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="blueprint-grid flex min-h-dvh flex-col">
      <a
        href="#main"
        className="bg-card text-foreground border-border focus-visible:outline-ring sr-only rounded-sm border px-4 py-2 text-sm font-medium focus-visible:not-sr-only focus-visible:absolute focus-visible:top-3 focus-visible:left-3 focus-visible:z-50"
      >
        Skip to content
      </a>
      <AppHeader />
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
      <AppFooter />
    </div>
  )
}
