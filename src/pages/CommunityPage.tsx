import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Users } from 'lucide-react'
import Card from '../components/ui/Card'
import CommunityTag from '../components/ui/CommunityTag'
import { getCommunity, getArticlesByCommunity, getProjectsByCommunity } from '../data/content'

export default function CommunityPage() {
  const { slug } = useParams<{ slug: string }>()
  const community = slug ? getCommunity(slug) : undefined
  const articles = slug ? getArticlesByCommunity(slug) : []
  const projects = slug ? getProjectsByCommunity(slug) : []

  const totalCount = articles.length + projects.length

  // Get related communities (communities that share content with this one)
  const relatedCommunities = new Set<string>()
  ;[...articles, ...projects].forEach((item) => {
    item.communities?.forEach((c) => {
      if (c !== slug) relatedCommunities.add(c)
    })
  })

  if (!community) {
    return (
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
            Community not found
          </h1>
          <Link
            to="/communities"
            className="text-[var(--color-accent-primary)] hover:underline"
          >
            Browse all communities
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/communities"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          All Communities
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${community.color}20` }}
            >
              {community.icon}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]">
                {community.name}
              </h1>
              <p className="text-[var(--color-text-muted)] flex items-center gap-2">
                <Users size={16} />
                {totalCount} {totalCount === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mb-6">
            {community.description}
          </p>

          {/* Related Communities */}
          {relatedCommunities.size > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-[var(--color-text-muted)]">Related:</span>
              {Array.from(relatedCommunities).map((communitySlug) => (
                <CommunityTag key={communitySlug} slug={communitySlug} size="sm" />
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
              <span className="ml-2 text-sm font-normal text-[var(--color-text-muted)]">
                ({articles.length})
              </span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Card
                  key={article.slug}
                  contentType="article"
                  title={article.title}
                  description={article.description}
                  slug={article.slug}
                  tags={article.tags}
                  date={article.date}
                  authorSlug={article.author}
                  readingTime={article.readingTime}
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
            className="mb-12"
          >
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
              Projects
              <span className="ml-2 text-sm font-normal text-[var(--color-text-muted)]">
                ({projects.length})
              </span>
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card
                  key={project.slug}
                  contentType="project"
                  title={project.title}
                  description={project.description}
                  slug={project.slug}
                  tags={project.tags}
                  date={project.date}
                  authorSlug={project.author}
                  techStack={project.techStack}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Empty state */}
        {totalCount === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-muted)]">
              No content in this community yet. Be the first to contribute!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
