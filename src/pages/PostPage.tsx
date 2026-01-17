import { useParams, Link, Navigate } from 'react-router-dom'
import { getPost, getAuthor, getPostsByAuthor } from '../data/content'
import Tag from '../components/ui/Tag'
import { PostCard } from '../components/space/PostCard'

// Simple date formatter
function formatDate(dateString: string): { date: string; time: string } {
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  }
}

export function PostPage() {
  const { username, slug } = useParams<{ username: string; slug: string }>()
  
  // Remove @ prefix if present (URL is /@username/posts/:slug)
  const authorSlug = username?.replace(/^@/, '')
  
  // If the username doesn't start with @, show 404
  if (!username?.startsWith('@')) {
    return (
      <div className="pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Page Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The page you're looking for doesn't exist.
            </p>
            <Link 
              to="/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Go back home
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  if (!authorSlug || !slug) {
    return <Navigate to="/" replace />
  }

  const post = getPost(slug)
  const author = getAuthor(authorSlug)

  if (!post || post.author !== authorSlug) {
    return (
      <div className="pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Post Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This post doesn't exist or has been removed.
            </p>
            <Link 
              to={`/@${authorSlug}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Go to @{authorSlug}'s space
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Get other posts from the same author for "More posts"
  const otherPosts = getPostsByAuthor(authorSlug)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)

  const { date: formattedDate, time: formattedTime } = formatDate(post.date)

  return (
    <div className="pt-16">
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Link 
            to={`/@${authorSlug}`}
            className="hover:text-gray-700 dark:hover:text-gray-200"
          >
            @{authorSlug}
          </Link>
          <span className="mx-2">/</span>
          <span>posts</span>
        </nav>

        {/* Post Header */}
        <header className="mb-6">
          {/* Author info */}
          <div className="flex items-center gap-3 mb-4">
            {author?.avatar && (
              <Link to={`/@${authorSlug}`}>
                <img 
                  src={author.avatar} 
                  alt={author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </Link>
            )}
            <div>
              <Link 
                to={`/@${authorSlug}`}
                className="font-medium text-gray-900 dark:text-gray-100 hover:underline"
              >
                {author?.name}
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                @{authorSlug}
              </p>
            </div>
          </div>

          {/* Title */}
          {post.title && (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {post.title}
            </h1>
          )}

          {/* Meta */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={post.date} title={new Date(post.date).toLocaleString()}>
              {formattedDate} at {formattedTime}
            </time>
            {post.visibility === 'unlisted' && (
              <>
                <span>·</span>
                <span className="text-amber-600 dark:text-amber-400">Unlisted</span>
              </>
            )}
          </div>
        </header>

        {/* Post Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none mb-8">
          {/* Simple markdown-like rendering */}
          <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
            {post.content.split('```').map((segment, i) => {
              if (i % 2 === 1) {
                // Code block
                const lines = segment.split('\n')
                const language = lines[0]
                const code = lines.slice(1).join('\n')
                return (
                  <pre 
                    key={i} 
                    className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 my-4 overflow-x-auto text-sm"
                  >
                    <code className={`language-${language}`}>{code}</code>
                  </pre>
                )
              }
              return <span key={i}>{segment}</span>
            })}
          </div>
        </article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            {post.tags.map((tag) => (
              <Tag key={tag} name={tag} />
            ))}
          </div>
        )}

        {/* Series info */}
        {post.series && (
          <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This post is part of the series: <strong>{post.series}</strong>
              {post.seriesOrder && ` (Post #${post.seriesOrder})`}
            </p>
          </div>
        )}

        {/* Feeds */}
        {post.feeds && post.feeds.length > 0 && (
          <div className="mb-8">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Posted to:
            </p>
            <div className="flex gap-2">
              {post.feeds.map((feed) => (
                <Link
                  key={feed}
                  to={`/@${authorSlug}/feeds/${feed}`}
                  className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  #{feed}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* More posts from author */}
        {otherPosts.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              More from {author?.name}
            </h2>
            <div className="space-y-0">
              {otherPosts.map((p) => (
                <PostCard key={p.slug} post={p} compact />
              ))}
            </div>
            <Link
              to={`/@${authorSlug}`}
              className="block mt-6 text-center text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all posts →
            </Link>
          </section>
        )}
      </div>
      </div>
    </div>
  )
}

export default PostPage
