'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon } from 'lucide-react'

/**
 * MCRN (dark) / Earth (light). The two themes are the token contract's own;
 * next-themes keeps the names light/dark and maps them to the .ty-theme-*
 * classes in app/layout.tsx.
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  // resolvedTheme, not theme: the default is "system", and `theme` reports that
  // literal string rather than what is on screen. Toggling off `theme` meant the
  // first click always set dark — so a visitor already on a dark system pressed
  // the button and nothing appeared to happen.
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Rendering nothing until mounted avoids a hydration mismatch: the server has
  // no way to know which theme the inline script will pick.
  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-layer-hover transition-colors duration-fast-02"
      aria-label={isDark ? 'Switch to the Earth theme' : 'Switch to the MCRN theme'}
    >
      {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
    </button>
  )
}
