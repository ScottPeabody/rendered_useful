import { useContext } from 'react'
import { LayoutContext } from '../context/layoutContextDef'

export function useLayoutContext() {
  return useContext(LayoutContext)
}
