import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'trace-theme'

export function useTheme() {
  // The inline script in index.html already resolved the theme before paint, so
  // read it back off the DOM instead of recomputing and risking a mismatch.
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next)
      } catch {
        // A blocked storage API shouldn't stop the theme from changing.
      }
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
