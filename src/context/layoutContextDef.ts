import { createContext } from 'react'
import type { LayoutPreset } from '../layouts'

export interface LayoutContextType {
  layoutOptions: LayoutPreset['options']
  layoutOverride: string | null
  setLayoutOverride: (layout: string | null) => void
}

export const LayoutContext = createContext<LayoutContextType | null>(null)
