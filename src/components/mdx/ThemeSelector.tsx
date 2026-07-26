import { useState, useEffect, useCallback } from 'react'
import { getTheme, getThemeNames } from '../../themes'

interface ThemeSelectorProps {
  onChange?: (themeName: string | null) => void
  defaultTheme?: string | null
}

export default function ThemeSelector({ onChange, defaultTheme = null }: ThemeSelectorProps) {
  const [currentTheme, setCurrentTheme] = useState<string | null>(defaultTheme)
  const themeNames = getThemeNames()

  const applyTheme = useCallback((themeName: string | null) => {
    const root = document.documentElement
    const preset = themeName ? getTheme(themeName) : null

    // Remove all theme overrides first
    const allVars = [
      '--color-background', '--color-surface', '--color-surface-elevated',
      '--color-border', '--color-border-subtle',
      '--color-text-primary', '--color-text-secondary', '--color-text-muted',
      '--color-accent-primary', '--color-accent-secondary', '--color-accent-tertiary',
      '--color-accent-success', '--color-accent-warning', '--color-accent-error',
      '--color-gradient-start', '--color-gradient-middle', '--color-gradient-end',
      '--color-glass', '--color-glass-border',
      '--font-display', '--font-body', '--font-mono',
      '--shadow-glow', '--shadow-card'
    ]
    
    // Clear all overrides
    allVars.forEach(v => root.style.removeProperty(v))
    root.classList.remove('dark', 'light')

    if (!preset) {
      // Restore based on system preference or saved preference
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark' || savedTheme === 'light') {
        root.classList.add(savedTheme)
      }
      return
    }

    // Apply forced mode
    if (preset.forcedMode) {
      root.classList.add(preset.forcedMode)
    }

    // Apply all variables
    if (preset.variables) {
      for (const [key, value] of Object.entries(preset.variables)) {
        if (value) {
          root.style.setProperty(key, value, 'important')
        }
      }
    }
  }, [])

  useEffect(() => {
    applyTheme(currentTheme)
    onChange?.(currentTheme)
  }, [currentTheme, onChange, applyTheme])

  // Reset theme when leaving the page
  useEffect(() => {
    return () => {
      applyTheme(null)
    }
  }, [applyTheme])

  return (
    <div className="my-8 p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
      <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">
        🎨 Theme Preview
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCurrentTheme(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            currentTheme === null
              ? 'bg-[var(--color-accent-primary)] text-[var(--color-accent-contrast)]'
              : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          Default
        </button>
        {themeNames.map((name) => {
          const theme = getTheme(name)
          return (
            <button
              key={name}
              onClick={() => setCurrentTheme(name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTheme === name
                  ? 'bg-[var(--color-accent-primary)] text-[var(--color-accent-contrast)]'
                  : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {theme?.name || name}
            </button>
          )
        })}
      </div>
      {currentTheme && (
        <p className="mt-4 text-sm text-[var(--color-text-muted)]">
          {getTheme(currentTheme)?.description}
        </p>
      )}
    </div>
  )
}
