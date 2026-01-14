import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, List } from 'lucide-react'
import { getSeriesNavigation } from '../../data/content'

interface SeriesNavigationProps {
  seriesSlug: string
  currentSlug: string
}

export default function SeriesNavigation({ 
  seriesSlug, 
  currentSlug,
}: SeriesNavigationProps) {
  const nav = getSeriesNavigation(seriesSlug, currentSlug)
  
  if (!nav) return null

  const getPath = (slug: string, type: 'article' | 'project') => 
    type === 'article' ? `/articles/${slug}` : `/projects/${slug}`

  return (
    <div className="my-8 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
      {/* Series header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border)]">
        <Link 
          to={`/series/${seriesSlug}`}
          className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors"
        >
          <List size={16} />
          <span>{nav.series.title}</span>
        </Link>
        <span className="text-xs text-[var(--color-text-muted)] px-2 py-1 rounded-full bg-[var(--color-surface-elevated)]">
          {nav.currentPosition} of {nav.totalItems}
        </span>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        {/* Previous */}
        {nav.prev ? (
          <Link
            to={getPath(nav.prev.slug, nav.prev.type)}
            className="flex-1 flex items-center gap-2 p-3 rounded-lg bg-[var(--color-surface-elevated)] hover:bg-[var(--color-accent-primary)]/10 transition-colors group"
          >
            <ChevronLeft 
              size={18} 
              className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-primary)] transition-colors shrink-0" 
            />
            <div className="min-w-0">
              <p className="text-xs text-[var(--color-text-muted)]">Previous</p>
              <p className="text-sm font-medium text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-accent-primary)] transition-colors">
                {nav.prev.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {/* Next */}
        {nav.next ? (
          <Link
            to={getPath(nav.next.slug, nav.next.type)}
            className="flex-1 flex items-center justify-end gap-2 p-3 rounded-lg bg-[var(--color-surface-elevated)] hover:bg-[var(--color-accent-primary)]/10 transition-colors group text-right"
          >
            <div className="min-w-0">
              <p className="text-xs text-[var(--color-text-muted)]">Next</p>
              <p className="text-sm font-medium text-[var(--color-text-primary)] truncate group-hover:text-[var(--color-accent-primary)] transition-colors">
                {nav.next.title}
              </p>
            </div>
            <ChevronRight 
              size={18} 
              className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-primary)] transition-colors shrink-0" 
            />
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  )
}
