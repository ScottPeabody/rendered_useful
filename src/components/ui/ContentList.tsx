import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Grid, List, ChevronLeft, ChevronRight } from 'lucide-react'
import Card from './Card'

type ContentType = 'article' | 'project' | 'notebook'
type ViewMode = 'grid' | 'list'

interface ContentItem {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  [key: string]: unknown
}

interface ContentListProps {
  /** Items to display */
  items: ContentItem[]
  /** Type of content for Card rendering */
  contentType: ContentType
  /** Number of items per page */
  pageSize?: number
  /** Show pagination controls */
  showPagination?: boolean
  /** Show view mode toggle (grid/list) */
  showViewToggle?: boolean
  /** Initial view mode */
  initialViewMode?: ViewMode
  /** Storage key for persisting view mode */
  viewModeStorageKey?: string
  /** Whether to animate items */
  animate?: boolean
  /** Custom class for the container */
  className?: string
  /** Grid columns config */
  gridCols?: string
}

export default function ContentList({
  items,
  contentType,
  pageSize = 6,
  showPagination = true,
  showViewToggle = true,
  initialViewMode = 'grid',
  viewModeStorageKey,
  animate = true,
  className = '',
  gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
}: ContentListProps) {
  // View mode state with localStorage persistence
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    if (viewModeStorageKey && typeof window !== 'undefined') {
      return (localStorage.getItem(viewModeStorageKey) as ViewMode) || initialViewMode
    }
    return initialViewMode
  })

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode)
    if (viewModeStorageKey) {
      localStorage.setItem(viewModeStorageKey, mode)
    }
  }

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)

  // Sort items by date (newest first)
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })
  }, [items])

  // Calculate pagination
  const totalPages = Math.ceil(sortedItems.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentItems = sortedItems.slice(startIndex, endIndex)

  // Reset to page 1 if items change and current page is out of bounds
  const maxPage = Math.ceil(sortedItems.length / pageSize) || 1
  const safePage = currentPage > maxPage ? 1 : currentPage
  if (safePage !== currentPage) {
    // This will trigger a re-render with the corrected page
    setTimeout(() => setCurrentPage(1), 0)
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('ellipsis')
      }
      
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i)
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis')
      }
      
      if (!pages.includes(totalPages)) pages.push(totalPages)
    }
    
    return pages
  }

  const Wrapper = animate ? motion.div : 'div'
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
      }
    : {}

  return (
    <div className={className}>
      {/* Controls */}
      {showViewToggle && (
        <div className="flex items-center justify-end mb-4">
          <div className="flex items-center rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[var(--color-accent-primary)] text-white'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
              title="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-[var(--color-accent-primary)] text-white'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
              title="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Content Grid/List */}
      <div
        className={
          viewMode === 'grid'
            ? `grid ${gridCols} gap-6`
            : 'flex flex-col gap-4'
        }
      >
        {currentItems.map((item, index) => (
          <Wrapper
            key={item.slug}
            {...wrapperProps}
            {...(animate ? { transition: { delay: index * 0.05 } } : {})}
          >
            <Card
              contentType={contentType}
              variant={viewMode === 'list' ? 'list' : 'card'}
              {...item}
              authorSlug={item.author}
            />
          </Wrapper>
        ))}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Previous page"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, idx) =>
              page === 'ellipsis' ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-[var(--color-text-muted)]"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-[var(--color-accent-primary)] text-white'
                      : 'border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]'
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Item count */}
      {showPagination && totalPages > 1 && (
        <p className="text-center text-sm text-[var(--color-text-muted)] mt-3">
          Showing {startIndex + 1}-{Math.min(endIndex, sortedItems.length)} of {sortedItems.length}
        </p>
      )}
    </div>
  )
}
