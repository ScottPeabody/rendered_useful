import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Hash } from 'lucide-react'
import Card from '../components/ui/Card'
import Tag from '../components/ui/Tag'
import { getArticlesByTag, getProjectsByTag, tags } from '../data/content'

export default function TagPage() {
  const { tag } = useParams<{ tag: string }>()
  const articles = tag ? getArticlesByTag(tag) : []
  const projects = tag ? getProjectsByTag(tag) : []
  // tagInfo available if we want to display tag metadata
  const _tagInfo = tags.find((t) => t.name === tag)
  void _tagInfo // suppress unused warning

  const totalCount = articles.length + projects.length

  // Get related tags (tags that appear together with this one)
  const relatedTags = new Set<string>()
  ;[...articles, ...projects].forEach((item) => {
    item.tags.forEach((t) => {
      if (t !== tag) relatedTags.add(t)
    })
  })

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-primary)]/10 flex items-center justify-center">
              <Hash className="text-[var(--color-accent-primary)]" size={24} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]">
                #{tag}
              </h1>
              <p className="text-[var(--color-text-muted)]">
                {totalCount} {totalCount === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          {/* Related Tags */}
          {relatedTags.size > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-6">
              <span className="text-sm text-[var(--color-text-muted)]">Related:</span>
              {Array.from(relatedTags).slice(0, 8).map((relatedTag) => (
                <Tag key={relatedTag} name={relatedTag} size="sm" />
              ))}
            </div>
          )}
        </motion.div>

        {/* Articles */}
        {articles.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
              Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Card
                  key={article.slug}
                  contentType="article"
                  {...article}
                  authorSlug={article.author}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
              Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card
                  key={project.slug}
                  contentType="project"
                  {...project}
                  authorSlug={project.author}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Empty state */}
        {totalCount === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-muted)]">
              No content found with the tag "#{tag}".
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
