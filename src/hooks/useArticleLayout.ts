import { useMemo } from 'react'
import { getLayout, getLayoutOptions, type LayoutPreset } from '../layouts'

interface UseArticleLayoutOptions {
  layout?: string
  // Allow individual overrides
  overrides?: Partial<LayoutPreset['options']>
}

/**
 * Hook to get layout options for an article/project page.
 * Merges preset options with any individual overrides.
 */
export function useArticleLayout({ layout, overrides }: UseArticleLayoutOptions) {
  return useMemo(() => {
    // Start with default layout
    const baseOptions = getLayoutOptions('default')!
    
    // Apply preset if specified
    const presetOptions = layout ? getLayoutOptions(layout) : undefined
    
    // Filter out undefined overrides so they don't overwrite preset values
    const cleanOverrides = overrides
      ? Object.fromEntries(
          Object.entries(overrides).filter(([, v]) => v !== undefined)
        )
      : {}
    
    // Merge: default -> preset -> overrides
    const options: LayoutPreset['options'] = {
      ...baseOptions,
      ...(presetOptions || {}),
      ...cleanOverrides,
    }

    const preset = layout ? getLayout(layout) : getLayout('default')

    return {
      options,
      preset,
      layoutName: layout || 'default',
    }
  }, [layout, overrides])
}
