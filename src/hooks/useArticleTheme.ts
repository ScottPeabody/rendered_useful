import { useEffect, useRef } from 'react'
import { getTheme, type ThemePreset } from '../themes'

interface UseArticleThemeOptions {
  theme?: string
  customVariables?: ThemePreset['variables']
}

/**
 * Hook to apply custom theme variables to an article/project page.
 * Automatically restores original values on unmount.
 */
export function useArticleTheme({ theme, customVariables }: UseArticleThemeOptions) {
  const originalValues = useRef<Map<string, string>>(new Map())
  const originalClass = useRef<string>('')
  const hasApplied = useRef(false)

  useEffect(() => {
    const root = document.documentElement
    const preset = theme ? getTheme(theme) : undefined
    const variables = customVariables || preset?.variables

    // Clean up any previously applied values before applying new ones (or if no theme)
    if (hasApplied.current) {
      for (const [key, value] of originalValues.current.entries()) {
        if (value) {
          root.style.setProperty(key, value)
        } else {
          root.style.removeProperty(key)
        }
      }
      originalValues.current.clear()
      
      if (originalClass.current) {
        root.classList.remove('dark', 'light')
        root.classList.add(originalClass.current)
      }
      hasApplied.current = false
    }

    // If no theme to apply, we're done (cleanup already happened above)
    if (!variables && !preset?.forcedMode) {
      return
    }

    // Store original class for mode restoration
    if (!hasApplied.current) {
      originalClass.current = root.classList.contains('dark') ? 'dark' : 'light'
    }

    // Apply forced mode if specified
    if (preset?.forcedMode) {
      root.classList.remove('dark', 'light')
      root.classList.add(preset.forcedMode)
    }

    // Apply CSS variable overrides
    if (variables) {
      const style = getComputedStyle(root)
      
      for (const [key, value] of Object.entries(variables)) {
        if (value) {
          // Store original value (only on first apply)
          if (!hasApplied.current) {
            const original = style.getPropertyValue(key).trim()
            originalValues.current.set(key, original)
          }
          
          // Apply new value with important to override @theme
          root.style.setProperty(key, value, 'important')
          console.log('[useArticleTheme] Applied:', key, '=', value)
        }
      }
    }

    hasApplied.current = true

    // Copy refs for cleanup
    const savedOriginalValues = new Map(originalValues.current)
    const savedOriginalClass = originalClass.current
    const hadForcedMode = !!preset?.forcedMode

    // Cleanup: restore original values
    return () => {
      // Restore CSS variables
      for (const [key, value] of savedOriginalValues.entries()) {
        if (value) {
          root.style.setProperty(key, value)
        } else {
          root.style.removeProperty(key)
        }
      }
      savedOriginalValues.clear()

      // Restore original mode
      if (hadForcedMode && savedOriginalClass) {
        root.classList.remove('dark', 'light')
        root.classList.add(savedOriginalClass)
      }
    }
  }, [theme, customVariables])
}
