import { useState, useCallback, useEffect, useRef } from 'react'
import { getLayout, getLayoutNames } from '../../layouts'
import { useLayoutContext } from '../../hooks/useLayoutContext'

interface LayoutSelectorProps {
  defaultLayout?: string
  onChange?: (layoutName: string) => void
}

export default function LayoutSelector({ defaultLayout = 'default', onChange }: LayoutSelectorProps) {
  const [currentLayout, setCurrentLayout] = useState<string>(defaultLayout)
  const layoutNames = getLayoutNames()
  const layoutContext = useLayoutContext()
  const layoutContextRef = useRef(layoutContext)
  
  // Keep ref up to date
  useEffect(() => {
    layoutContextRef.current = layoutContext
  }, [layoutContext])

  // Apply default layout on mount, reset on unmount
  useEffect(() => {
    if (layoutContextRef.current && defaultLayout) {
      layoutContextRef.current.setLayoutOverride(defaultLayout)
    }
    
    // Only reset on actual component unmount, not on context changes
    return () => {
      if (layoutContextRef.current) {
        layoutContextRef.current.setLayoutOverride(null)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = useCallback((name: string) => {
    setCurrentLayout(name)
    onChange?.(name)
    // Update layout via global context
    if (layoutContext) {
      layoutContext.setLayoutOverride(name)
    }
  }, [onChange, layoutContext])

  const current = getLayout(currentLayout)

  return (
    <div className="my-8 p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
      <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">
        📐 Layout Preview
      </h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {layoutNames.map((name) => {
          const layout = getLayout(name)
          return (
            <button
              key={name}
              onClick={() => handleChange(name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentLayout === name
                  ? 'bg-[var(--color-accent-primary)] text-[var(--color-accent-contrast)]'
                  : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {layout?.name || name}
            </button>
          )
        })}
      </div>
      
      {current && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-text-muted)]">
            {current.description}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <OptionBadge label="Width" value={current.options.contentWidth} />
            <OptionBadge label="Header" value={current.options.headerStyle} />
            <OptionBadge label="Spacing" value={current.options.verticalSpacing} />
            <OptionBadge label="Author" value={current.options.showAuthor} />
            <OptionBadge label="TOC" value={current.options.showTableOfContents} />
            <OptionBadge label="Related" value={current.options.showRelatedArticles} />
          </div>
        </div>
      )}
    </div>
  )
}

function OptionBadge({ label, value }: { label: string; value: string | boolean }) {
  const displayValue = typeof value === 'boolean' 
    ? (value ? '✓' : '✗') 
    : value

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-surface-elevated)]">
      <span className="text-[var(--color-text-muted)]">{label}:</span>
      <span className={`font-medium ${
        value === true ? 'text-[var(--color-accent-success)]' : 
        value === false ? 'text-[var(--color-text-muted)]' : 
        'text-[var(--color-text-primary)]'
      }`}>
        {displayValue}
      </span>
    </div>
  )
}
