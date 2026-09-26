import type { ReactNode } from 'react'

import { AppFooter } from '@/components/layout/appFooter'
import { AppHeader } from '@/components/layout/appHeader'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="blueprint-grid flex min-h-dvh flex-col">
      <AppHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <AppFooter />
    </div>
  )
}
