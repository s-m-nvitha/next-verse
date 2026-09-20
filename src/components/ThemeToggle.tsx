import { useEffect } from 'react'
import { useUIStore } from '@/store/ui'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useUIStore()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label="Toggle light and dark theme"
        className="nb-btn px-2.5 py-1 text-xs font-mono font-bold flex items-center gap-1.5 bg-white dark:bg-[#1A1A17] text-ink dark:text-[#F7F5EE]"
      >
        {isDark ? (
          <>
            <Moon className="w-3.5 h-3.5 text-lime-accent" />
            <span>DARK</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>LIGHT</span>
          </>
        )}
      </button>
    )
  }

  return (
    <div
      role="group"
      aria-label="Theme selection"
      className="inline-flex items-center nb-border bg-white dark:bg-[#1A1A17] p-0.5 shadow-brutal-sm"
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-label="Switch to Light theme"
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold uppercase transition-colors ${
          !isDark
            ? 'bg-lime-accent text-ink border border-ink shadow-[1px_1px_0px_#11110F]'
            : 'text-ink/60 dark:text-[#F7F5EE]/60 hover:text-ink dark:hover:text-[#F7F5EE]'
        }`}
      >
        <Sun className="w-3.5 h-3.5 text-ink" />
        <span>LIGHT</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-label="Switch to Dark theme"
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold uppercase transition-colors ${
          isDark
            ? 'bg-lime-accent text-ink border border-ink shadow-[1px_1px_0px_#11110F]'
            : 'text-ink/60 dark:text-[#F7F5EE]/60 hover:text-ink dark:hover:text-[#F7F5EE]'
        }`}
      >
        <Moon className="w-3.5 h-3.5 text-ink" />
        <span>DARK</span>
      </button>
    </div>
  )
}
