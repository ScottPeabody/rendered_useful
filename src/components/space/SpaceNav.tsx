import { Link } from 'react-router-dom'
import type { SpacePageDef } from '../../types'

interface SpaceNavProps {
  handle: string           // @-handle for links
  pages: SpacePageDef[]    // ordered pages of the space
  activeSlug: string       // currently rendered page slug
  defaultPage: string      // page rendered at the space root
}

// Tab bar listing a space's pages. Hidden when there's only one visible page.
export function SpaceNav({ handle, pages, activeSlug, defaultPage }: SpaceNavProps) {
  const visiblePages = pages.filter((p) => p.showInNav !== false)
  if (visiblePages.length <= 1) return null

  return (
    <nav className="flex gap-1 mb-8 border-b border-[var(--color-border)] overflow-x-auto" aria-label="Space pages">
      {visiblePages.map((page) => {
        const isActive = page.slug === activeSlug
        // The default page lives at the space root; other pages at /@handle/<slug>
        const to = page.slug === defaultPage ? `/@${handle}` : `/@${handle}/${page.slug}`
        return (
          <Link
            key={page.slug}
            to={to}
            aria-current={isActive ? 'page' : undefined}
            className={`px-4 py-2.5 -mb-px text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              isActive
                ? 'border-[var(--color-accent-primary)] text-[var(--color-text-primary)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border)]'
            }`}
          >
            {page.title}
          </Link>
        )
      })}
    </nav>
  )
}
