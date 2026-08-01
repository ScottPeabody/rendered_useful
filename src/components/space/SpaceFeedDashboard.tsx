import { Link } from 'react-router-dom'
import type { Article, Feed, Post, Project } from '../../types'
import { getPostsByFeed } from '../../data/content'
import { FeedView } from './FeedView'

// Simple sidebar card component
function SidebarCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-[var(--color-border)] bg-[var(--color-surface)] rounded-lg ${className}`}>
      {children}
    </div>
  )
}

interface SpaceFeedDashboardProps {
  handle: string           // @-handle for links
  posts: Post[]
  feeds: Feed[]
  articles: Article[]
  projects: Project[]
  emptyMessage: string
  authorSlug?: string      // for feed post counts (author/alias spaces only)
  alias?: string | null
  showPostAuthor?: boolean // true for group feeds
}

// The built-in 'feed' space page: the classic feed + sidebar dashboard
export function SpaceFeedDashboard({
  handle,
  posts,
  feeds,
  articles,
  projects,
  emptyMessage,
  authorSlug,
  alias,
  showPostAuthor = false,
}: SpaceFeedDashboardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content: Feeds */}
      <main className="lg:col-span-2">
        {/* Feed Tabs */}
        {feeds.length > 1 && (
          <nav className="flex gap-4 mb-6 pb-4 border-b border-[var(--color-border)]">
            {feeds.map((feed) => (
              <Link
                key={feed.slug}
                to={`/@${handle}/feeds/${feed.slug}`}
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
          posts={posts}
          showAuthor={showPostAuthor}
          emptyMessage={emptyMessage}
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
                {posts.length}
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
            {feeds.length > 0 && (
              <div className="flex justify-between">
                <dt className="text-[var(--color-text-muted)]">Feeds</dt>
                <dd className="font-medium text-[var(--color-text-primary)]">
                  {feeds.length}
                </dd>
              </div>
            )}
          </dl>
        </SidebarCard>

        {/* Feeds List */}
        {feeds.length > 0 && authorSlug && (
          <SidebarCard className="p-4">
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-3">
              Feeds
            </h3>
            <ul className="space-y-2">
              {feeds.map((feed) => {
                const feedPosts = getPostsByFeed(feed.slug, authorSlug, alias)
                return (
                  <li key={feed.slug}>
                    <Link
                      to={`/@${handle}/feeds/${feed.slug}`}
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
            {articles.length > 5 && authorSlug && (
              <Link
                to={`/author/${authorSlug}`}
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
            {projects.length > 5 && authorSlug && (
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
  )
}
