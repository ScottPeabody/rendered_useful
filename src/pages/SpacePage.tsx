import { useState, useEffect, type ComponentType, type ReactNode } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import {
  resolveSpaceHandle,
  getSpaceWithContent,
  getFeedsByAuthor,
  getArticlesByAuthor,
  getProjectsByAuthor,
  getPostsByGroup,
  getSpacePagesWithFallback,
} from '../data/content'
import type { Article, Feed, Post, Project } from '../types'
import { loadSpacePage, type SpacePageFrontmatter } from '../lib/mdx'
import { compareDates } from '../lib/time'
import { useArticleTheme } from '../hooks/useArticleTheme'
import { useLayoutContext } from '../hooks/useLayoutContext'
import { SpaceHeader } from '../components/space/SpaceHeader'
import { SpaceNav } from '../components/space/SpaceNav'
import { SpaceFeedDashboard } from '../components/space/SpaceFeedDashboard'
import { SpaceMdxPage } from '../components/space/SpaceMdxPage'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// Page slugs that collide with the /@handle/posts/* and /@handle/feeds/* routes
const RESERVED_PAGE_SLUGS = ['posts', 'feeds']

type LoadedPage = { Content: ComponentType; frontmatter: SpacePageFrontmatter }

// Centered message block used for all in-space error states
function SpaceMessage({ title, message, linkTo = '/', linkLabel = 'Go back home' }: {
  title: string
  message: string
  linkTo?: string
  linkLabel?: string
}) {
  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
        {title}
      </h1>
      <p className="text-[var(--color-text-secondary)] mb-6">
        {message}
      </p>
      <Link to={linkTo} className="text-[var(--color-accent-primary)] hover:underline">
        {linkLabel}
      </Link>
    </div>
  )
}

export function SpacePage() {
  const { username, pageSlug } = useParams<{ username: string; pageSlug?: string }>()

  // Remove @ prefix (URL is /@handle or /@handle/<page>)
  const handle = username?.replace(/^@/, '') || ''
  const isValidSpaceUrl = username?.startsWith('@') ?? false

  // Resolve the handle across the shared @ namespace: author → alias → group
  const resolved = isValidSpaceUrl && handle ? resolveSpaceHandle(handle) : undefined
  const space = resolved?.space
  const spaceSlug = space?.slug ?? handle

  // Page selection ("everything is a page": the root renders defaultPage)
  const pages = getSpacePagesWithFallback(spaceSlug)
  const defaultPage = space?.defaultPage ?? pages[0]?.slug ?? 'feed'
  const activeSlug = pageSlug ?? defaultPage
  const activePage = RESERVED_PAGE_SLUGS.includes(activeSlug)
    ? undefined
    : pages.find((p) => p.slug === activeSlug)
  const isCustomPage = Boolean(resolved && activePage && !activePage.builtin)

  // Load MDX for custom pages. State resets on page change so a stale page's
  // frontmatter (and therefore its theme/layout) never outlives navigation.
  const [loaded, setLoaded] = useState<LoadedPage | 'loading' | 'missing'>('loading')
  useEffect(() => {
    setLoaded('loading') // eslint-disable-line react-hooks/set-state-in-effect
    if (!isCustomPage) return
    let cancelled = false
    loadSpacePage(spaceSlug, activeSlug).then((result) => {
      if (cancelled) return
      setLoaded(result ?? 'missing')
    })
    return () => {
      cancelled = true
    }
  }, [isCustomPage, spaceSlug, activeSlug])

  const frontmatter = isCustomPage && typeof loaded === 'object' ? loaded.frontmatter : undefined

  // Theme: page frontmatter wins over the space default
  useArticleTheme({ theme: frontmatter?.theme ?? space?.theme })

  // Layout: preset via layoutOverride, individual flags via optionOverrides.
  // This is what routes hideNavbar/hideFooter/navbarStyle to Layout/Navbar above us.
  const layoutContext = useLayoutContext()
  const setLayoutOverride = layoutContext?.setLayoutOverride
  const setOptionOverrides = layoutContext?.setOptionOverrides
  const layoutName = frontmatter?.layout ?? space?.layout ?? null
  const hideNavbar = frontmatter?.hideNavbar
  const hideFooter = frontmatter?.hideFooter
  useEffect(() => {
    if (!setLayoutOverride || !setOptionOverrides) return
    setLayoutOverride(layoutName)
    const overrides: { hideNavbar?: boolean; hideFooter?: boolean } = {}
    if (hideNavbar !== undefined) overrides.hideNavbar = hideNavbar
    if (hideFooter !== undefined) overrides.hideFooter = hideFooter
    setOptionOverrides(Object.keys(overrides).length > 0 ? overrides : null)
    return () => {
      setLayoutOverride(null)
      setOptionOverrides(null)
    }
  }, [setLayoutOverride, setOptionOverrides, layoutName, hideNavbar, hideFooter])

  // ---- Error states (after hooks — hooks must run unconditionally) ----

  if (!isValidSpaceUrl) {
    return (
      <div className="pt-16 bg-[var(--color-background)] min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <SpaceMessage
            title="Page Not Found"
            message="The page you're looking for doesn't exist."
          />
        </div>
      </div>
    )
  }

  if (!handle) {
    return <Navigate to="/" replace />
  }

  if (!resolved) {
    return (
      <div className="pt-16 bg-[var(--color-background)] min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <SpaceMessage
            title="Space Not Found"
            message={`We couldn't find anyone with the username @${handle}`}
          />
        </div>
      </div>
    )
  }

  // ---- Compose page content ----

  const displayName =
    resolved.kind === 'group'
      ? resolved.group.name
      : resolved.kind === 'alias'
        ? resolved.space.alias!
        : resolved.author.name

  let pageContent: ReactNode
  if (!activePage) {
    pageContent = (
      <SpaceMessage
        title="Page Not Found"
        message={`@${handle} doesn't have a page called "${activeSlug}"`}
        linkTo={`/@${handle}`}
        linkLabel={`Back to @${handle}`}
      />
    )
  } else if (activePage.builtin === 'feed') {
    let posts: Post[]
    let feeds: Feed[]
    let articles: Article[]
    let projects: Project[]
    let authorSlug: string | undefined
    let alias: string | undefined

    if (resolved.kind === 'group') {
      const members = resolved.group.members
      posts = getPostsByGroup(resolved.group.slug, 20)
      feeds = []
      articles = members
        .flatMap((m) => getArticlesByAuthor(m))
        .sort((a, b) => compareDates(a.date, b.date))
      projects = members
        .flatMap((m) => getProjectsByAuthor(m))
        .sort((a, b) => compareDates(a.date, b.date))
    } else {
      alias = resolved.kind === 'alias' ? resolved.space.alias : undefined
      authorSlug = resolved.author.slug
      const { pinnedPosts, recentPosts } = getSpaceWithContent(authorSlug, alias)
      posts = [...pinnedPosts, ...recentPosts.filter((p) => !pinnedPosts.find((pp) => pp.slug === p.slug))]
      feeds = getFeedsByAuthor(authorSlug, alias)
      articles = alias ? [] : getArticlesByAuthor(authorSlug) // aliases don't have articles
      projects = alias ? [] : getProjectsByAuthor(authorSlug) // aliases don't have projects
    }

    pageContent = (
      <SpaceFeedDashboard
        handle={handle}
        posts={posts}
        feeds={feeds}
        articles={articles}
        projects={projects}
        emptyMessage={`${displayName} hasn't posted anything yet`}
        authorSlug={authorSlug}
        alias={alias}
        showPostAuthor={resolved.kind === 'group'}
      />
    )
  } else if (loaded === 'loading') {
    pageContent = (
      <div className="py-12">
        <LoadingSpinner />
      </div>
    )
  } else if (loaded === 'missing') {
    pageContent = (
      <SpaceMessage
        title="Page Not Found"
        message={`The "${activePage.title}" page hasn't been written yet.`}
        linkTo={`/@${handle}`}
        linkLabel={`Back to @${handle}`}
      />
    )
  } else {
    pageContent = (
      <SpaceMdxPage
        Content={loaded.Content}
        frontmatter={loaded.frontmatter}
        spaceLayout={space?.layout}
      />
    )
  }

  const showSpaceHeader = frontmatter?.showSpaceHeader !== false

  return (
    <div className="pt-16 bg-[var(--color-background)] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {showSpaceHeader && (
          <SpaceHeader handle={handle} resolved={resolved} bio={space?.bio} />
        )}
        <SpaceNav
          handle={handle}
          pages={pages}
          activeSlug={activeSlug}
          defaultPage={defaultPage}
        />
        {pageContent}
      </div>
    </div>
  )
}

export default SpacePage
