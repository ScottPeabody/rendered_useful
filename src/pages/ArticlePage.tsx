import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, type ComponentType } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, AlertTriangle } from 'lucide-react'
import Tag from '../components/ui/Tag'
import Button from '../components/ui/Button'
import { formatDate } from '../lib/time'
import Card from '../components/ui/Card'
import SeriesNavigation from '../components/ui/SeriesNavigation'
import VersionSelector from '../components/ui/VersionSelector'
import MDXContentProvider from '../components/MDXContentProvider'
import { getArticle, getAuthor, getProject, getArticlesByTag, getArticleVersionInfo, getLatestArticleVersion } from '../data/content'
import { loadArticle, hasArticleMDX, type ArticleFrontmatter } from '../lib/mdx'
import { useArticleTheme } from '../hooks/useArticleTheme'
import { getContentWidthClass, getSpacingClass } from '../layouts'
import { useLayoutContext } from '../hooks/useLayoutContext'
import NotFoundPage from './NotFoundPage'

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? getArticle(slug) : undefined
  const author = article ? getAuthor(article.author) : undefined
  const relatedProject = article?.relatedProject ? getProject(article.relatedProject) : undefined
  
  // Version support
  const versionInfo = slug ? getArticleVersionInfo(slug) : []
  const latestVersion = slug ? getLatestArticleVersion(slug) : undefined
  const isLatestVersion = !latestVersion || article?.slug === latestVersion.slug
  const hasVersions = versionInfo.length > 1
  
  // State for MDX content and frontmatter
  const [MDXContent, setMDXContent] = useState<ComponentType | null>(null)
  const [frontmatter, setFrontmatter] = useState<ArticleFrontmatter | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Get layout from global context
  const layoutContext = useLayoutContext()
  const layoutOptions = layoutContext?.layoutOptions
  
  // Check if this article has MDX content
  const hasMDX = slug ? hasArticleMDX(slug) : false
  
  // Apply custom theme from frontmatter
  useArticleTheme({ theme: frontmatter?.theme })
  
  // Reset layout when leaving page or changing articles
  useEffect(() => {
    return () => {
      layoutContext?.setLayoutOverride(null)
    }
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps
  
  // Load MDX content if available
  useEffect(() => {
    if (!slug || !hasMDX) {
      setIsLoading(false) // eslint-disable-line react-hooks/set-state-in-effect
      return
    }
    
    setIsLoading(true)
    loadArticle(slug).then((result) => {
      if (result) {
        setMDXContent(() => result.Content)
        setFrontmatter(result.frontmatter)
      }
      setIsLoading(false)
    })
  }, [slug, hasMDX])

  if (!article) {
    return <NotFoundPage />
  }

  // Get related articles based on tags (only if layout shows them)
  const relatedArticles = layoutOptions?.showRelatedArticles
    ? article.tags
        .flatMap((tag) => getArticlesByTag(tag))
        .filter((a) => a.slug !== article.slug)
        .filter((a, index, self) => self.findIndex((x) => x.slug === a.slug) === index)
        .slice(0, 2)
    : []

  // Content width and spacing classes
  const widthClass = getContentWidthClass(layoutOptions?.contentWidth || 'default')
  const spacingClass = getSpacingClass(layoutOptions?.verticalSpacing || 'default')

  // Header style
  const headerStyle = layoutOptions?.headerStyle || 'default'

  // Render different header structures based on style
  const renderHeader = () => {
    if (!(layoutOptions?.showHeader ?? true)) return null

    // Hero header - full width with gradient background
    if (headerStyle === 'hero') {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-16 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[var(--color-accent-primary)]/10 via-[var(--color-surface)] to-[var(--color-accent-secondary)]/10 border-b border-[var(--color-border)]"
        >
          <div className="max-w-4xl mx-auto text-center">
            {(layoutOptions?.showTags ?? true) && (
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                {article.tags.map((tag) => (
                  <Tag key={tag} name={tag} />
                ))}
              </div>
            )}
            
            <h1 className="text-5xl md:text-7xl font-black text-[var(--color-text-primary)] leading-tight mb-8">
              {article.title}
            </h1>
            
            <p className="text-2xl md:text-3xl text-[var(--color-text-secondary)] max-w-3xl mx-auto mb-12 font-light">
              {article.description}
            </p>
            
            {((layoutOptions?.showAuthor ?? true) || (layoutOptions?.showDate ?? true)) && (
              <div className="flex items-center justify-center gap-8">
                {(layoutOptions?.showAuthor ?? true) && author && (
                  <Link to={`/author/${author.slug}`} className="flex items-center gap-3 group">
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-14 h-14 rounded-full ring-4 ring-white/50 group-hover:ring-[var(--color-accent-primary)] transition-all"
                    />
                    <div className="text-left">
                      <p className="font-semibold text-[var(--color-text-primary)]">{author.name}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">{author.role || 'Contributor'}</p>
                    </div>
                  </Link>
                )}
                {(layoutOptions?.showDate ?? true) && (
                  <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                    <Calendar size={18} />
                    <span>{formatDate(article.date)}</span>
                  </div>
                )}
                {(layoutOptions?.showReadingTime ?? true) && (
                  <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                    <Clock size={18} />
                    <span>{article.readingTime} min read</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )
    }

    // Minimal header - just title and date, very clean
    if (headerStyle === 'minimal') {
      return (
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b border-[var(--color-border)] pb-6"
        >
          <h1 className="text-3xl font-semibold text-[var(--color-text-primary)] mb-3">
            {article.title}
          </h1>
          {(layoutOptions?.showDate ?? true) && (
            <p className="text-sm text-[var(--color-text-muted)]">
              {formatDate(article.date)}
              {(layoutOptions?.showReadingTime ?? true) && ` · ${article.readingTime} min read`}
            </p>
          )}
        </motion.header>
      )
    }

    // Centered header - elegant typography
    if (headerStyle === 'centered') {
      return (
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          {(layoutOptions?.showTags ?? true) && (
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {article.tags.map((tag) => (
                <Tag key={tag} name={tag} />
              ))}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-serif font-normal text-[var(--color-text-primary)] leading-tight mb-6 tracking-tight">
            {article.title}
          </h1>
          
          <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8 italic">
            {article.description}
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-[var(--color-text-muted)]">
            {(layoutOptions?.showAuthor ?? true) && author && (
              <>
                <span>By {author.name}</span>
                <span>·</span>
              </>
            )}
            {(layoutOptions?.showDate ?? true) && (
              <span>{formatDate(article.date)}</span>
            )}
            {(layoutOptions?.showReadingTime ?? true) && (
              <>
                <span>·</span>
                <span>{article.readingTime} min read</span>
              </>
            )}
          </div>
          
          <div className="mt-8 w-24 h-px bg-[var(--color-border)] mx-auto" />
        </motion.header>
      )
    }

    // Default header
    return (
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        {/* Older version banner */}
        {hasVersions && !isLatestVersion && latestVersion && (
          <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300">
            <AlertTriangle size={20} />
            <div className="flex-1">
              <p className="font-medium">You're viewing an older version</p>
              <p className="text-sm opacity-80">
                This is version {article.version || 'unknown'}. 
                <Link 
                  to={`/articles/${latestVersion.slug}`}
                  className="underline hover:no-underline ml-1"
                >
                  View the latest version →
                </Link>
              </p>
            </div>
          </div>
        )}

        {(layoutOptions?.showTags ?? true) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
              <Tag key={tag} name={tag} />
            ))}
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] leading-tight mb-6">
          {article.title}
        </h1>

        <p className="text-xl text-[var(--color-text-secondary)] mb-8">
          {article.description}
        </p>

        {((layoutOptions?.showAuthor ?? true) || (layoutOptions?.showDate ?? true) || (layoutOptions?.showReadingTime ?? true)) && (
          <div className="flex flex-wrap items-center gap-4 pb-8 border-b border-[var(--color-border)] justify-between">
            {(layoutOptions?.showAuthor ?? true) && author && (
              <Link
                to={`/author/${author.slug}`}
                className="flex items-center gap-3 group"
              >
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-12 h-12 rounded-full ring-2 ring-[var(--color-border)] group-hover:ring-[var(--color-accent-primary)] transition-all"
                />
                <div className="text-left">
                  <p className="font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors">
                    {author.name}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {author.role || 'Contributor'}
                  </p>
                </div>
              </Link>
            )}

            <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
              {(layoutOptions?.showDate ?? true) && (
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  {formatDate(article.date)}
                </span>
              )}
              {(layoutOptions?.showReadingTime ?? true) && (
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  {article.readingTime} min read
                </span>
              )}
              {/* Version selector */}
              {hasVersions && (
                <VersionSelector versions={versionInfo} basePath="/articles" />
              )}
            </div>
          </div>
        )}
      </motion.header>
    )
  }

  // Adjust top padding based on header style (hero has its own padding)
  const topPadding = headerStyle === 'hero' ? 'pt-8' : 'pt-24'

  return (
    <div className={`${topPadding} pb-16 ${spacingClass}`}>
      <article className={`${widthClass} mx-auto px-4 sm:px-6 lg:px-8`}>
        {/* Back Link */}
        {(layoutOptions?.showBackLink ?? true) && headerStyle !== 'hero' && (
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] mb-8 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Articles
          </Link>
        )}

        {/* Header - rendered using the function above */}
        {renderHeader()}

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`prose max-w-none ${
            headerStyle === 'centered' ? 'prose-lg mx-auto' : ''
          } ${
            layoutOptions?.contentWidth === 'narrow' ? 'prose-sm md:prose-base' : 
            layoutOptions?.contentWidth === 'wide' ? 'prose-lg' : ''
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-accent-primary)]"></div>
            </div>
          ) : MDXContent ? (
            <MDXContentProvider>
              <MDXContent />
            </MDXContentProvider>
          ) : (
            <div className="p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
              <p className="text-[var(--color-text-muted)]">
                No content file found for this article.
                <br />
                Create <code className="px-1.5 py-0.5 bg-[var(--color-surface-elevated)] rounded text-sm">content/articles/{slug}.mdx</code> to add content.
              </p>
            </div>
          )}
        </motion.div>

        {/* Series Navigation */}
        {article.series && slug && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <SeriesNavigation
              seriesSlug={article.series}
              currentSlug={slug}
            />
          </motion.div>
        )}

        {/* Related Project */}
        {(layoutOptions?.showRelatedArticles ?? true) && relatedProject && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 pt-8 border-t border-[var(--color-border)]"
          >
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
              Related Project
            </h2>
            <Card
              contentType="project"
              {...relatedProject}
              authorSlug={relatedProject.author}
            />
          </motion.section>
        )}

        {/* Share & Bookmark */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-4 mt-12 py-8 border-t border-b border-[var(--color-border)]"
        >
          <Button
            variant="outline"
            icon={<Share2 size={18} />}
            onClick={() => {
              navigator.share?.({
                title: article.title,
                text: article.description,
                url: window.location.href,
              })
            }}
          >
            Share
          </Button>
          <Button variant="outline" icon={<Bookmark size={18} />}>
            Bookmark
          </Button>
        </motion.div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedArticles.map((relatedArticle) => (
                <Card
                  key={relatedArticle.slug}
                  contentType="article"
                  {...relatedArticle}
                  authorSlug={relatedArticle.author}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Author Bio */}
        {(layoutOptions?.showAuthorCard ?? true) && author && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]"
          >
            <div className="flex items-start gap-4">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-[var(--color-text-primary)]">
                  Written by {author.name}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  {author.bio}
                </p>
                <Link
                  to={`/author/${author.slug}`}
                  className="inline-block mt-3 text-sm text-[var(--color-accent-primary)] hover:underline"
                >
                  View all posts →
                </Link>
              </div>
            </div>
          </motion.section>
        )}
      </article>
    </div>
  )
}
