import { useState, useCallback, useMemo, type ReactNode } from 'react'
import { getLayoutOptions } from '../layouts'
import { LayoutContext } from './layoutContextDef'

export { LayoutContext, type LayoutContextType } from './layoutContextDef'

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [layoutOverride, setLayoutOverrideState] = useState<string | null>(null)

  const setLayoutOverride = useCallback((layout: string | null) => {
    setLayoutOverrideState(layout)
  }, [])

  const layoutOptions = useMemo(() => {
    const baseOptions = getLayoutOptions('default')!
    if (!layoutOverride) return baseOptions
    const presetOptions = getLayoutOptions(layoutOverride)
    return { ...baseOptions, ...(presetOptions || {}) }
  }, [layoutOverride])

  const value = useMemo(() => ({
    layoutOptions,
    layoutOverride,
    setLayoutOverride,
  }), [layoutOptions, layoutOverride, setLayoutOverride])

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  )
}
