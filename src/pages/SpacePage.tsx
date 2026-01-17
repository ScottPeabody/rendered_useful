import { useParams, Link, Navigate } from 'react-router-dom'
import { 
  getAuthor, 
  getSpaceWithContent, 
  getFeedsByAuthor,
  getArticlesByAuthor,
  getProjectsByAuthor,
  getPostsByFeed,
  getSpaceByAlias
} from '../data/content'
import { FeedView } from '../components/space/FeedView'
import { useArticleTheme } from '../hooks/useArticleTheme'

// Simple sidebar card component
function SidebarCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-[var(--color-border)] bg-[var(--color-surface)] rounded-lg ${className}`}>
      {children}
    </div>
  )
}

export function SpacePage() {
  const { username } = useParams<{ username: string }>()
  
  // Remove @ prefix if present (URL can be /@username or @username)
  const authorSlug = username?.replace(/^@/, '') || ''
  const isValidSpaceUrl = username?.startsWith('@') ?? false
  
  // First try to find by author slug directly
  let author = isValidSpaceUrl ? getAuthor(authorSlug) : undefined
  let aliasSpace: ReturnType<typeof getSpaceByAlias> = undefined
  let currentAlias: string | undefined = undefined
  
  // If not found, check if this is an alias
  if (isValidSpaceUrl && !author) {
    aliasSpace = getSpaceByAlias(authorSlug)
    if (aliasSpace) {
      author = getAuthor(aliasSpace.author)
      currentAlias = aliasSpace.alias
    }
  }
  
  // Use alias space data if available, otherwise get the author's main space
  const spaceData = author ? getSpaceWithContent(author.slug, currentAlias) : null
  const activeSpace = aliasSpace || spaceData?.space
  
  // Apply the space's theme BEFORE any returns (hooks must be called unconditionally)
  useArticleTheme({ theme: activeSpace?.theme })
  
  // Now handle the error cases
  if (!isValidSpaceUrl) {
    return (
      <div className="pt-16 bg-[var(--color-background)] min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
              Page Not Found
            </h1>
            <p className="text-[var(--color-text-secondary)] mb-6">
              The page you're looking for doesn't exist.
            </p>
            <Link 
              to="/"
              className="text-[var(--color-accent-primary)] hover:underline"
            >
              Go back home
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  if (!authorSlug) {
    return <Navigate to="/" replace />
  }
  
  if (!author || !spaceData) {
    return (
      <div className="pt-16 bg-[var(--color-background)] min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
              Space Not Found
            </h1>
            <p className="text-[var(--color-text-secondary)] mb-6">
              We couldn't find anyone with the username @{authorSlug}
            </p>
            <Link 
              to="/"
              className="text-[var(--color-accent-primary)] hover:underline"
            >
              Go back home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { pinnedPosts, recentPosts } = spaceData
  const authorFeeds = getFeedsByAuthor(author.slug, currentAlias)
  const articles = currentAlias ? [] : getArticlesByAuthor(author.slug) // aliases don't have articles
  const projects = currentAlias ? [] : getProjectsByAuthor(author.slug) // aliases don't have projects
  
  // Use alias-specific display name and bio if this is an alias space
  const displayName = aliasSpace?.alias || author.name
  const displayHandle = aliasSpace?.alias || author.slug
  const displayBio = aliasSpace?.bio || author.bio

  return (
    <div className="pt-16 bg-[var(--color-background)] min-h-screen">
      <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <header className="mb-8 pb-8 border-b border-[var(--color-border)]">
        <div className="flex items-start gap-6">
          {author.avatar && (
            <img 
              src={author.avatar} 
              alt={displayName}
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
              {displayName}
            </h1>
            <p className="text-[var(--color-text-muted)] mb-2">
              @{displayHandle}
            </p>
            {displayBio && (
              <p className="text-[var(--color-text-secondary)] max-w-2xl">
                {displayBio}
              </p>
            )}
            
            {/* Links */}
            <div className="flex gap-4 mt-4">
              {author.github && (
                <a 
                  href={`https://github.com/${author.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] transition-colors"
                >
                  GitHub
                </a>
              )}
              {author.twitter && (
                <a 
                  href={`https://twitter.com/${author.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] transition-colors"
                >
                  Twitter
                </a>
              )}
              {author.website && (
                <a 
                  href={author.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] transition-colors"
                >
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Feeds */}
        <main className="lg:col-span-2">
          {/* Feed Tabs */}
          {authorFeeds.length > 1 && (
            <nav className="flex gap-4 mb-6 pb-4 border-b border-[var(--color-border)]">
              {authorFeeds.map((feed) => (
                <Link
                  key={feed.slug}
                  to={`/@${displayHandle}/feeds/${feed.slug}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                    text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]"
                  style={{ 
                    borderColor: feed.color,
                  }}
                >
                  {feed.icon && <span>{feed.icon}</span>}
                  {feed.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Posts Feed */}
          <FeedView 
            posts={[...pinnedPosts, ...recentPosts.filter(p => !pinnedPosts.find(pp => pp.slug === p.slug))]}
            emptyMessage={`${author.name} hasn't posted anything yet`}
          />
        </main>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Stats */}
          <SidebarCard className="p-4">
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-3">
              Activity
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-muted)]">Posts</dt>
                <dd className="font-medium text-[var(--color-text-primary)]">
                  {recentPosts.length}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-muted)]">Articles</dt>
                <dd className="font-medium text-[var(--color-text-primary)]">
                  {articles.length}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-muted)]">Projects</dt>
                <dd className="font-medium text-[var(--color-text-primary)]">
                  {projects.length}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-muted)]">Feeds</dt>
                <dd className="font-medium text-[var(--color-text-primary)]">
                  {authorFeeds.length}
                </dd>
              </div>
            </dl>
          </SidebarCard>

          {/* Feeds List */}
          {authorFeeds.length > 0 && (
            <SidebarCard className="p-4">
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-3">
                Feeds
              </h3>
              <ul className="space-y-2">
                {authorFeeds.map((feed) => {
                  const feedPosts = getPostsByFeed(feed.slug, author.slug, currentAlias)
                  return (
                    <li key={feed.slug}>
                      <Link
                        to={`/@${displayHandle}/feeds/${feed.slug}`}
                        className="flex items-center justify-between py-1 text-sm hover:bg-[var(--color-surface-elevated)] rounded px-2 -mx-2"
                      >
                        <span className="flex items-center gap-2">
                          {feed.icon && <span>{feed.icon}</span>}
                          <span 
                            className="text-[var(--color-text-secondary)]"
                            style={{ color: feed.color }}
                          >
                            {feed.name}
                          </span>
                        </span>
                        <span className="text-[var(--color-text-muted)]">
                          {feedPosts.length}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </SidebarCard>
          )}

          {/* Recent Articles */}
          {articles.length > 0 && (
            <SidebarCard className="p-4">
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-3">
                Articles
              </h3>
              <ul className="space-y-2">
                {articles.slice(0, 5).map((article) => (
                  <li key={article.slug}>
                    <Link
                      to={`/articles/${article.slug}`}
                      className="block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)]"
                    >
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
              {articles.length > 5 && (
                <Link
                  to={`/authors/${authorSlug}`}
                  className="block mt-3 text-sm text-[var(--color-accent-primary)] hover:underline"
                >
                  View all {articles.length} articles →
                </Link>
              )}
            </SidebarCard>
          )}

          {/* Recent Projects */}
          {projects.length > 0 && (
            <SidebarCard className="p-4">
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-3">
                Projects
              </h3>
              <ul className="space-y-2">
                {projects.slice(0, 5).map((project) => (
                  <li key={project.slug}>
                    <Link
                      to={`/projects/${project.slug}`}
                      className="block text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)]"
                    >
                      {project.title}
                    </Link>
                  </li>
                ))}
              </ul>
              {projects.length > 5 && (
                <Link
                  to={`/projects?author=${authorSlug}`}
                  className="block mt-3 text-sm text-[var(--color-accent-primary)] hover:underline"
                >
                  View all {projects.length} projects →
                </Link>
              )}
            </SidebarCard>
          )}
        </aside>
      </div>
      </div>
    </div>
  )
}

export default SpacePage
