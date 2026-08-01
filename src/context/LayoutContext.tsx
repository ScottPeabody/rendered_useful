import { useState, useCallback, useMemo, type ReactNode } from 'react'
import { getLayoutOptions, type LayoutPreset } from '../layouts'
import { LayoutContext } from './layoutContextDef'

export { LayoutContext, type LayoutContextType } from './layoutContextDef'

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [layoutOverride, setLayoutOverrideState] = useState<string | null>(null)
  const [optionOverrides, setOptionOverridesState] = useState<Partial<LayoutPreset['options']> | null>(null)

  const setLayoutOverride = useCallback((layout: string | null) => {
    setLayoutOverrideState(layout)
  }, [])

  const setOptionOverrides = useCallback((overrides: Partial<LayoutPreset['options']> | null) => {
    setOptionOverridesState(overrides)
  }, [])

  // Merge order: default → preset → option-level overrides
  const layoutOptions = useMemo(() => {
    const baseOptions = getLayoutOptions('default')!
    const presetOptions = layoutOverride ? getLayoutOptions(layoutOverride) : undefined
    return { ...baseOptions, ...(presetOptions || {}), ...(optionOverrides || {}) }
  }, [layoutOverride, optionOverrides])

  const value = useMemo(() => ({
    layoutOptions,
    layoutOverride,
    setLayoutOverride,
    optionOverrides,
    setOptionOverrides,
  }), [layoutOptions, layoutOverride, setLayoutOverride, optionOverrides, setOptionOverrides])

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  )
}
