import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Calendar, Github, Twitter, Globe, Linkedin, BookOpen, Folder, Archive, Sparkles } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { getAuthor, getArticlesByAuthor, getProjectsByAuthor, getSpacesByAuthor } from '../data/content'
import { formatDate } from '../lib/time'
import NotFoundPage from './NotFoundPage'

export default function AuthorPage() {
  const { slug } = useParams<{ slug: string }>()
  const author = slug ? getAuthor(slug) : undefined
  const articles = author ? getArticlesByAuthor(author.slug) : []
  const projects = author ? getProjectsByAuthor(author.slug) : []
  const authorSpaces = author ? getSpacesByAuthor(author.slug) : []

  if (!author) {
    return <NotFoundPage />
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/contributors"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Contributors
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start gap-8 mb-12"
        >
          {/* Avatar */}
          <div className="relative">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-32 h-32 rounded-2xl ring-4 ring-[var(--color-border)]"
            />
            {author.isCoreMaintainer && (
              <div className="absolute -bottom-2 -right-2 px-2 py-1 text-xs font-medium bg-[var(--color-accent-primary)] text-[var(--color-accent-contrast)] rounded-full">
                Core
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]">
                {author.name}
              </h1>
              {author.role && (
                <span className="px-3 py-1 text-sm font-medium bg-[var(--color-surface)] text-[var(--color-text-muted)] rounded-full border border-[var(--color-border)]">
                  {author.role}
                </span>
              )}
            </div>

            <p className="text-lg text-[var(--color-text-secondary)] mb-4 max-w-2xl">
              {author.bio}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-muted)] mb-6">
              {author.location && (
                <span className="flex items-center gap-1">
                  <MapPin size={16} />
                  {author.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                Joined {formatDate(author.joinedDate, { format: 'monthYear' })}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={16} />
                {articles.length} articles
              </span>
              <span className="flex items-center gap-1">
                <Folder size={16} />
                {projects.length} projects
              </span>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-2">
              {author.github && (
                <Button
                  href={`https://github.com/${author.github}`}
                  variant="outline"
                  size="sm"
                  icon={<Github size={16} />}
                >
                  GitHub
                </Button>
              )}
              {author.twitter && (
                <Button
                  href={`https://twitter.com/${author.twitter}`}
                  variant="outline"
                  size="sm"
                  icon={<Twitter size={16} />}
                >
                  Twitter
                </Button>
              )}
              {author.linkedin && (
                <Button
                  href={`https://linkedin.com/in/${author.linkedin}`}
                  variant="outline"
                  size="sm"
                  icon={<Linkedin size={16} />}
                >
                  LinkedIn
                </Button>
              )}
              {author.website && (
                <Button
                  href={author.website}
                  variant="outline"
                  size="sm"
                  icon={<Globe size={16} />}
                >
                  Website
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Spaces */}
        {authorSpaces.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
              <Archive size={24} />
              Spaces
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {authorSpaces.map((space) => {
                const spaceLink = space.alias 
                  ? `/@${space.alias}` 
                  : `/@${author.slug}`
                const spaceName = space.alias || author.name
                const spaceBio = space.bio || author.bio
                const isMainSpace = !space.alias
                
                return (
                  <Link
                    key={space.alias || 'main'}
                    to={spaceLink}
                    className="group relative p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent-primary)]/50 hover:bg-[var(--color-surface-elevated)] transition-all"
                  >
                    {isMainSpace && (
                      <div className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-[var(--color-accent-primary)] text-[var(--color-accent-contrast)] rounded-full">
                        Main
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-primary)]/10 flex items-center justify-center text-[var(--color-accent-primary)]">
                        {space.alias ? <Sparkles size={24} /> : <Archive size={24} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors truncate">
                          {spaceName}
                        </h3>
                        <p className="text-sm text-[var(--color-text-muted)] mt-1 line-clamp-2">
                          {spaceBio}
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-[var(--color-text-muted)]">
                          <span>{space.sections?.length || 0} sections</span>
                          <span>•</span>
                          <span>{space.feeds?.length || 0} feeds</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.section>
        )}

        {/* Articles */}
        {articles.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
              Articles by {author.name}
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
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
              Projects by {author.name}
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
        {articles.length === 0 && projects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-muted)]">
              {author.name} hasn't published any content yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
