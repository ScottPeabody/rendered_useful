import { createContext } from 'react'
import type { LayoutPreset } from '../layouts'

export interface LayoutContextType {
  layoutOptions: LayoutPreset['options']
  layoutOverride: string | null
  setLayoutOverride: (layout: string | null) => void
  // Option-level overrides layered on top of the preset (e.g. frontmatter hideNavbar)
  optionOverrides: Partial<LayoutPreset['options']> | null
  setOptionOverrides: (overrides: Partial<LayoutPreset['options']> | null) => void
}

export const LayoutContext = createContext<LayoutContextType | null>(null)
