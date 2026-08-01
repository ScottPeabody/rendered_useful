import type { Post, Feed, FeedInfo } from '../../types'
import { PostCard } from './PostCard'

interface FeedViewProps {
  feed?: Feed | FeedInfo
  posts: Post[]
  showAuthor?: boolean
  emptyMessage?: string
}

export function FeedView({ 
  feed, 
  posts, 
  showAuthor = false,
  emptyMessage = 'No posts yet'
}: FeedViewProps) {
  // Sort posts based on feed ordering
  const sortedPosts = [...posts].sort((a, b) => {
    // Pinned posts always first
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1

    const ordering = feed?.ordering || 'chronological'
    
    switch (ordering) {
      case 'reverse-chronological':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'manual':
        // Manual ordering uses seriesOrder field
        return (a.seriesOrder || 0) - (b.seriesOrder || 0)
      case 'by-series':
        // Group by series, then chronological within series
        if (a.series && b.series && a.series !== b.series) {
          return a.series.localeCompare(b.series)
        }
        if (a.series && !b.series) return -1
        if (!a.series && b.series) return 1
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'chronological':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    }
  })

  if (sortedPosts.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--color-text-muted)]">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {feed && (
        <header className="mb-6 pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            {feed.icon && <span className="text-xl">{feed.icon}</span>}
            <h2 
              className="text-xl font-semibold text-[var(--color-text-primary)]"
              style={{ color: feed.color }}
            >
              {feed.name}
            </h2>
          </div>
          {feed.description && (
            <p className="mt-1 text-[var(--color-text-secondary)]">{feed.description}</p>
          )}
          {'postCount' in feed && (
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {feed.postCount} {feed.postCount === 1 ? 'post' : 'posts'}
            </p>
          )}
        </header>
      )}
      
      <div>
        {sortedPosts.map((post) => (
          <PostCard 
            key={post.slug} 
            post={post} 
            showAuthor={showAuthor}
            compact
          />
        ))}
      </div>
    </div>
  )
}
