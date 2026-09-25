import { AppShell } from '@/components/layout/appShell'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ComponentGalleryPage } from '@/pages/componentGalleryPage'

export default function App() {
  return (
    <TooltipProvider>
      <AppShell>
        <ComponentGalleryPage />
      </AppShell>
    </TooltipProvider>
  )
}
