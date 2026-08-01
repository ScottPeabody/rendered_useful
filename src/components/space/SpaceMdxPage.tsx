import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import type { SpacePageFrontmatter } from '../../lib/mdx'
import { getAuthor } from '../../data/content'
import { getContentWidthClass, getSpacingClass } from '../../layouts'
import { useArticleLayout } from '../../hooks/useArticleLayout'
import MDXContentProvider from '../MDXContentProvider'

interface SpaceMdxPageProps {
  Content: ComponentType
  frontmatter: SpacePageFrontmatter
  spaceLayout?: string     // the space's default layout preset
}

// Presentational renderer for a custom (MDX-backed) space page.
// The parent SpacePage owns loading + theme/layout context side effects.
export function SpaceMdxPage({ Content, frontmatter, spaceLayout }: SpaceMdxPageProps) {
  const { options } = useArticleLayout({
    layout: frontmatter.layout ?? spaceLayout,
    overrides: {
      contentWidth: frontmatter.contentWidth,
      verticalSpacing: frontmatter.verticalSpacing,
    },
  })

  const byline = frontmatter.author ? getAuthor(frontmatter.author) : undefined

  return (
    <article className={`mx-auto ${getContentWidthClass(options.contentWidth)}`}>
      {byline && (
        <div className="flex items-center gap-2 mb-6 text-sm text-[var(--color-text-muted)]">
          <img
            src={byline.avatar}
            alt={byline.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span>
            by{' '}
            <Link
              to={`/@${byline.slug}`}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition-colors"
            >
              {byline.name}
            </Link>
          </span>
        </div>
      )}
      <div className={`prose max-w-none ${getSpacingClass(options.verticalSpacing)}`}>
        <MDXContentProvider>
          <Content />
        </MDXContentProvider>
      </div>
    </article>
  )
}
