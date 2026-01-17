import { Link } from 'react-router-dom'
import type { Post } from '../../types'
import { getAuthor } from '../../data/content'
import Tag from '../ui/Tag'

// Simple relative time formatter (no date-fns dependency)
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`
  if (diffMonths < 12) return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`
  return date.toLocaleDateString()
}

interface PostCardProps {
  post: Post
  showAuthor?: boolean
  compact?: boolean
}

export function PostCard({ post, showAuthor = false, compact = false }: PostCardProps) {
  const author = getAuthor(post.author)
  const timeAgo = formatRelativeTime(post.date)
  
  // Format content for display
  const displayContent = post.content.length > 300 && compact
    ? post.content.slice(0, 300) + '...'
    : post.content

  return (
    <article className="group border-b border-gray-200 dark:border-gray-700 pb-6 mb-6 last:border-b-0 last:mb-0 last:pb-0">
      {/* Header: Author + Time */}
      <div className="flex items-center gap-3 mb-3">
        {showAuthor && author && (
          <>
            <Link 
              to={`/@${author.slug}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {author.avatar && (
                <img 
                  src={author.avatar} 
                  alt={author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {author.name}
              </span>
            </Link>
            <span className="text-gray-400">·</span>
          </>
        )}
        <time 
          dateTime={post.date}
          className="text-sm text-gray-500 dark:text-gray-400"
          title={new Date(post.date).toLocaleString()}
        >
          {timeAgo}
        </time>
        {post.pinned && (
          <>
            <span className="text-gray-400">·</span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
              📌 Pinned
            </span>
          </>
        )}
      </div>

      {/* Title (if present) */}
      {post.title && (
        <Link 
          to={`/@${post.author}/posts/${post.slug}`}
          className="block mb-2"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h3>
        </Link>
      )}

      {/* Content */}
      <Link 
        to={`/@${post.author}/posts/${post.slug}`}
        className="block"
      >
        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          {/* Simple markdown-like rendering - in real app, use MDX */}
          <div className="whitespace-pre-wrap">
            {displayContent.split('```').map((segment, i) => {
              if (i % 2 === 1) {
                // Code block
                const lines = segment.split('\n')
                const language = lines[0]
                const code = lines.slice(1).join('\n')
                return (
                  <pre 
                    key={i} 
                    className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 my-3 overflow-x-auto text-sm"
                  >
                    <code className={`language-${language}`}>{code}</code>
                  </pre>
                )
              }
              return <span key={i}>{segment}</span>
            })}
          </div>
        </div>
      </Link>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map((tag) => (
            <Tag key={tag} name={tag} />
          ))}
        </div>
      )}

      {/* Series indicator */}
      {post.series && (
        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Part of series: <span className="font-medium">{post.series}</span>
          {post.seriesOrder && ` (#${post.seriesOrder})`}
        </div>
      )}

      {/* Feed indicators */}
      {post.feeds && post.feeds.length > 1 && (
        <div className="flex gap-2 mt-3 text-xs text-gray-400 dark:text-gray-500">
          {post.feeds.map((feed) => (
            <span key={feed} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
              #{feed}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
