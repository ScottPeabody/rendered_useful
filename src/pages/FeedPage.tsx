import { useParams, Link, Navigate } from 'react-router-dom'
import { 
  getAuthor, 
  getFeed, 
  getFeedInfo,
  getPostsByFeed,
  getFeedsByAuthor
} from '../data/content'
import { FeedView } from '../components/space/FeedView'

export function FeedPage() {
  const { username, feedSlug } = useParams<{ username: string; feedSlug: string }>()
  
  // Remove @ prefix if present (URL is /@username/feeds/:feedSlug)
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
  
  if (!authorSlug || !feedSlug) {
    return <Navigate to="/" replace />
  }

  const author = getAuthor(authorSlug)
  const feed = getFeed(feedSlug, authorSlug)
  const feedInfo = getFeedInfo(feedSlug, authorSlug)
  const posts = getPostsByFeed(feedSlug, authorSlug)
  const authorFeeds = getFeedsByAuthor(authorSlug)

  if (!author) {
    return (
      <div className="pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Space Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We couldn't find anyone with the username @{authorSlug}
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

  if (!feed) {
    return (
      <div className="pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Feed Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              @{authorSlug} doesn't have a feed called "{feedSlug}"
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

  return (
    <div className="pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Link 
            to={`/@${authorSlug}`}
            className="hover:text-gray-700 dark:hover:text-gray-200"
          >
            @{authorSlug}
          </Link>
          <span className="mx-2">/</span>
          <span>feeds</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-gray-100">{feed.name}</span>
        </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Feed */}
        <main className="lg:col-span-2">
          <FeedView 
            feed={feedInfo || feed}
            posts={posts}
            emptyMessage={`No posts in ${feed.name} yet`}
          />
        </main>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Author Card */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Link 
              to={`/@${authorSlug}`}
              className="flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity"
            >
              {author.avatar && (
                <img 
                  src={author.avatar} 
                  alt={author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {author.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{author.slug}
                </p>
              </div>
            </Link>
            {author.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {author.bio}
              </p>
            )}
          </div>

          {/* Other Feeds */}
          {authorFeeds.length > 1 && (
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Other Feeds
              </h3>
              <ul className="space-y-2">
                {authorFeeds
                  .filter((f) => f.slug !== feedSlug)
                  .map((f) => (
                    <li key={f.slug}>
                      <Link
                        to={`/@${authorSlug}/feeds/${f.slug}`}
                        className="flex items-center gap-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {f.icon && <span>{f.icon}</span>}
                        <span style={{ color: f.color }}>{f.name}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Feed Info */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              About this feed
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Posts</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">
                  {posts.length}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Order</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {feed.ordering.replace('-', ' ')}
                </dd>
              </div>
              {feed.visibility !== 'public' && (
                <div className="flex justify-between">
                  <dt className="text-gray-500 dark:text-gray-400">Visibility</dt>
                  <dd className="font-medium text-amber-600 dark:text-amber-400 capitalize">
                    {feed.visibility}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </div>
      </div>
    </div>
  )
}

export default FeedPage
