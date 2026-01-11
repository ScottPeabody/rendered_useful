import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, type ComponentType } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Share2, Bookmark } from 'lucide-react'
import Tag from '../components/ui/Tag'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import MDXContentProvider from '../components/MDXContentProvider'
import { getArticle, getAuthor, getProject, getArticlesByTag } from '../data/content'
import { loadArticle, hasArticleMDX } from '../lib/mdx'
import NotFoundPage from './NotFoundPage'

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? getArticle(slug) : undefined
  const author = article ? getAuthor(article.author) : undefined
  const relatedProject = article?.relatedProject ? getProject(article.relatedProject) : undefined
  
  // State for MDX content
  const [MDXContent, setMDXContent] = useState<ComponentType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Check if this article has MDX content
  const hasMDX = slug ? hasArticleMDX(slug) : false
  
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
      }
      setIsLoading(false)
    })
  }, [slug, hasMDX])

  if (!article) {
    return <NotFoundPage />
  }

  // Get related articles based on tags
  const relatedArticles = article.tags
    .flatMap((tag) => getArticlesByTag(tag))
    .filter((a) => a.slug !== article.slug)
    .filter((a, index, self) => self.findIndex((x) => x.slug === a.slug) === index)
    .slice(0, 2)

  return (
    <div className="pt-24 pb-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Articles
        </Link>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
              <Tag key={tag} name={tag} />
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6 leading-tight">
            {article.title}
          </h1>

          <p className="text-xl text-[var(--color-text-secondary)] mb-8">
            {article.description}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[var(--color-border)]">
            {author && (
              <Link
                to={`/author/${author.slug}`}
                className="flex items-center gap-3 group"
              >
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-12 h-12 rounded-full ring-2 ring-[var(--color-border)] group-hover:ring-[var(--color-accent-primary)] transition-all"
                />
                <div>
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
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} />
                {article.readingTime} min read
              </span>
            </div>
          </div>
        </motion.header>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose max-w-none"
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

        {/* Related Project */}
        {relatedProject && (
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
        {author && (
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
