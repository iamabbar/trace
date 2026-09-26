import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <Button size="icon" onClick={toggleTheme} aria-label={label} title={label}>
      {isDark ? (
        <Sun aria-hidden="true" className="size-4" strokeWidth={1.8} />
      ) : (
        <Moon aria-hidden="true" className="size-4" strokeWidth={1.8} />
      )}
    </Button>
  )
}
