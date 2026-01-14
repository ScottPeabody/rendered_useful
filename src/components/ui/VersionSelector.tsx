import { Link } from 'react-router-dom'
import { History, ChevronDown, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { VersionInfo } from '../../types'
import { formatDate } from '../../lib/time'

interface VersionSelectorProps {
  versions: VersionInfo[]
  basePath: string // e.g., "/articles" or "/projects"
}

export default function VersionSelector({ versions, basePath }: VersionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Find current version (the one marked isCurrent in the versions array)
  const currentVersion = versions.find((v) => v.isCurrent) || versions[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Don't render if there's only one or no versions
  if (versions.length <= 1) {
    return null
  }

  const latestVersion = versions[0]
  const isViewingLatest = currentVersion.slug === latestVersion.slug

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border transition-colors
          ${isViewingLatest
            ? 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent-primary)]'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
          }
        `}
      >
        <History size={14} />
        <span>{currentVersion.version}</span>
        {!isViewingLatest && (
          <span className="text-xs opacity-75">(older)</span>
        )}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-[var(--color-border)]">
            <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
              Version History
            </span>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {versions.map((version, index) => {
              const isLatest = index === 0
              const isSelected = version.slug === currentVersion.slug
              const versionUrl = isLatest 
                ? `${basePath}/${version.slug}`
                : `${basePath}/${version.slug}?v=${version.version}`

              return (
                <Link
                  key={version.slug}
                  to={versionUrl}
                  onClick={() => setIsOpen(false)}
                  className={`
                    block px-3 py-2 transition-colors
                    ${isSelected
                      ? 'bg-[var(--color-accent-primary)]/10'
                      : 'hover:bg-[var(--color-surface-elevated)]'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <Check size={14} className="text-[var(--color-accent-primary)]" />
                      )}
                      <span className={`font-medium ${isSelected ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-text-primary)]'}`}>
                        {version.version}
                      </span>
                      {isLatest && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400">
                          Latest
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {formatDate(version.date)}
                    </span>
                  </div>
                  {version.note && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-1 ml-5">
                      {version.note}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// Compact inline version indicator (for cards, lists)
export function VersionBadge({ version, isLatest = true }: { version: string; isLatest?: boolean }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full
        ${isLatest
          ? 'bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]'
          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
        }
      `}
    >
      <History size={10} />
      {version}
    </span>
  )
}
