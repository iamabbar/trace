import { AppShell } from '@/components/layout/appShell'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AnalyzerPage } from '@/pages/analyzerPage'

export default function App() {
  return (
    <TooltipProvider>
      <AppShell>
        <AnalyzerPage />
      </AppShell>
    </TooltipProvider>
  )
}
